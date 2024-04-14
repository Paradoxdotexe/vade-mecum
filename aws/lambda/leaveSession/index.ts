import { APIGatewayProxyEvent, APIGatewayProxyWebsocketEventV2 } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import {
  ApiGatewayManagementApi,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const handler = async (event: APIGatewayProxyWebsocketEventV2 & APIGatewayProxyEvent) => {
  const terminatedConnectionId = event.requestContext.connectionId;

  // scan for connection items
  const scanCommand = new ScanCommand({
    TableName: 'vade-mecum-sessions',
    FilterExpression: 'begins_with(itemId, :itemIdPrefix)',
    ExpressionAttributeValues: {
      ':itemIdPrefix': `connection`
    },
    ProjectionExpression: 'sessionId, itemId, userId'
  });
  const response = await docClient.send(scanCommand);

  const connections = response.Items ?? [];
  const terminatedConnection = connections.find(
    connection => connection.itemId === `connection#${terminatedConnectionId}`
  );

  if (!terminatedConnection) {
    return {
      statusCode: 404,
      body: JSON.stringify({ detail: 'Connection not found.' })
    };
  }

  // delete connection item
  const deleteCommand = new DeleteCommand({
    TableName: 'vade-mecum-sessions',
    Key: {
      sessionId: terminatedConnection.sessionId,
      itemId: `connection#${terminatedConnectionId}`
    }
  });
  await docClient.send(deleteCommand);

  // clear connectionId from user, this will indicate they are offline
  const updateCommand = new UpdateCommand({
    TableName: 'vade-mecum-sessions',
    Key: {
      sessionId: terminatedConnection.sessionId,
      itemId: `user#${terminatedConnection.userId}`
    },
    UpdateExpression: 'REMOVE connectionId'
  });
  await docClient.send(updateCommand);

  // send USER_OFFLINE message
  const webSocketClient = new ApiGatewayManagementApi({
    endpoint: `https://${event.requestContext.domainName}`
  });
  const message = JSON.stringify({
    event: 'USER_OFFLINE',
    data: { userId: terminatedConnectionId }
  });
  for (const connection of connections) {
    if (connection.userId !== terminatedConnection.userId) {
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
