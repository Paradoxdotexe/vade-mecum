import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApi,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const handler: APIGatewayProxyHandler = async event => {
  const body = event.body && JSON.parse(event.body);

  if (!body || !body.sessionId || !body.userId || !body.roll) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Missing message contents.' })
    };
  }

  // store roll in database
  const putCommand = new PutCommand({
    TableName: 'vade-mecum-sessions',
    Item: {
      sessionId: body.sessionId,
      itemId: `roll#${body.roll.id}`,
      ...body.roll
    }
  });
  await docClient.send(putCommand);

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

  // send NEW_ROLL message
  const webSocketClient = new ApiGatewayManagementApi({
    endpoint: `https://${event.requestContext.domainName}`
  });
  const message = JSON.stringify({
    event: 'NEW_ROLL',
    data: { roll: body.roll }
  });
  for (const connection of connections) {
    if (connection.userId !== body.userId) {
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connection.itemId.split('#')[1],
        Data: message
      });
      await webSocketClient.send(postToConnectionCommand);
    }
  }

  return {
    statusCode: 200,
    body: ''
  };
};

exports.handler = handler;
