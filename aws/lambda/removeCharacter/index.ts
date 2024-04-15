import { APIGatewayProxyHandler } from 'aws-lambda';
import { BatchWriteItemCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApi,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const handler: APIGatewayProxyHandler = async event => {
  const body = event.body && JSON.parse(event.body);

  if (!body || !body.sessionId || !body.userId || !body.characterId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Missing message contents.' })
    };
  }

  // get all "roll" items for character
  const queryCommand = new QueryCommand({
    TableName: 'vade-mecum-sessions',
    KeyConditionExpression: 'sessionId = :sessionId and begins_with(itemId, :itemIdPrefix)',
    FilterExpression: 'characterId = :characterId',
    ExpressionAttributeValues: {
      ':sessionId': body.sessionId,
      ':itemIdPrefix': 'roll',
      ':characterId': body.characterId
    },
    ProjectionExpression: 'itemId'
  });
  const queryResponse = await docClient.send(queryCommand);

  const rolls = queryResponse.Items ?? [];

  // remove character and character's rolls from database
  const batchWriteItemCommand = new BatchWriteItemCommand({
    RequestItems: {
      'vade-mecum-sessions': [
        {
          DeleteRequest: {
            Key: {
              sessionId: {
                S: body.sessionId
              },
              itemId: {
                S: `character#${body.characterId}`
              }
            }
          }
        },
        ...rolls.map(item => ({
          DeleteRequest: {
            Key: {
              sessionId: {
                S: body.sessionId
              },
              itemId: {
                S: item.itemId
              }
            }
          }
        }))
      ]
    }
  });
  await docClient.send(batchWriteItemCommand);

  // scan for connection items
  const scanCommand = new ScanCommand({
    TableName: 'vade-mecum-sessions',
    FilterExpression: 'sessionId = :sessionId and begins_with(itemId, :itemIdPrefix)',
    ExpressionAttributeValues: {
      ':sessionId': body.sessionId,
      ':itemIdPrefix': `connection`
    },
    ProjectionExpression: 'itemId, userId'
  });
  const response = await docClient.send(scanCommand);

  const connections = response.Items ?? [];

  // send CHARACTER_REMOVE and ROLL_REMOVE messages
  const webSocketClient = new ApiGatewayManagementApi({
    endpoint: `https://${event.requestContext.domainName}`
  });
  const characterMessage = JSON.stringify({
    event: 'CHARACTER_REMOVE',
    data: {
      characterId: body.characterId
    }
  });
  const rollMessages = rolls.map(roll =>
    JSON.stringify({
      event: 'ROLL_REMOVE',
      data: {
        rollId: roll.itemId.split('#')[1]
      }
    })
  );
  for (const connection of connections) {
    if (connection.userId !== body.userId) {
      for (const message of [characterMessage, ...rollMessages]) {
        const postToConnectionCommand = new PostToConnectionCommand({
          ConnectionId: connection.itemId.split('#')[1],
          Data: message
        });
        await webSocketClient.send(postToConnectionCommand);
      }
    }
  }

  return {
    statusCode: 200,
    body: ''
  };
};

exports.handler = handler;
