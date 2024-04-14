import { APIGatewayProxyEvent, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand
} from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApi,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const handler = async (event: APIGatewayProxyWebsocketEventV2 & APIGatewayProxyEvent) => {
  const sessionId = event.queryStringParameters?.sessionId;
  const userId = event.queryStringParameters?.userId;

  if (!sessionId || !userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Missing sessionId or userId query parameters.' })
    };
  }

  // get user item
  let getCommand = new GetCommand({
    TableName: 'vade-mecum-sessions',
    Key: {
      sessionId: sessionId,
      itemId: `user#${userId}`
    },
    ProjectionExpression: 'connectionId'
  });
  const userResponse = await docClient.send(getCommand);

  // check if user already has an open connection
  if (userResponse.Item?.connectionId) {
    // delete current connection item
    const deleteCommand = new DeleteCommand({
      TableName: 'vade-mecum-sessions',
      Key: {
        sessionId: sessionId,
        itemId: `connection#${userResponse.Item.connectionId}`
      }
    });
    await docClient.send(deleteCommand);
  }

  // store user in database with new connectionId, this will indicate they are online
  let putCommand = new PutCommand({
    TableName: 'vade-mecum-sessions',
    Item: {
      sessionId: sessionId,
      itemId: `user#${userId}`,
      connectionId: event.requestContext.connectionId
    }
  });
  await docClient.send(putCommand);

  // store new connection in database, this will allow us to terminate the connection
  putCommand = new PutCommand({
    TableName: 'vade-mecum-sessions',
    Item: {
      sessionId: sessionId,
      itemId: `connection#${event.requestContext.connectionId}`,
      userId: userId
    }
  });
  await docClient.send(putCommand);

  // scan for connection items
  const scanCommand = new ScanCommand({
    TableName: 'vade-mecum-sessions',
    FilterExpression: 'sessionId = :sessionId and begins_with(itemId, :itemIdPrefix)',
    ExpressionAttributeValues: {
      ':sessionId': sessionId,
      ':itemIdPrefix': `connection`
    },
    ProjectionExpression: 'itemId'
  });
  const response = await docClient.send(scanCommand);

  const connections = response.Items ?? [];

  // send USER_ONLINE message
  const webSocketClient = new ApiGatewayManagementApi({
    endpoint: `https://${event.requestContext.domainName}`
  });
  const message = JSON.stringify({
    event: 'USER_ONLINE',
    data: { userId: userId }
  });
  for (const connection of connections) {
    const otherConnection = connection.itemId !== `connection#${event.requestContext.connectionId}`;
    if (otherConnection) {
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connection.itemId.split('#')[1],
        Data: message
      });
      await webSocketClient.send(postToConnectionCommand);
    }
  }

  return {
    statusCode: 200
  };
};

exports.handler = handler;
