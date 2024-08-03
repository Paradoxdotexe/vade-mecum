import { APIGatewayProxyHandler } from 'aws-lambda';
import {
  ApiGatewayManagementApi,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

const handler: APIGatewayProxyHandler = async event => {
  const connectionId = event.requestContext.connectionId; // identifies the WebSocket connection

  const webSocketClient = new ApiGatewayManagementApi({
    endpoint: 'https://ws.vademecum.thenjk.com'
  });

  const postToConnectionCommand = new PostToConnectionCommand({
    ConnectionId: connectionId,
    Data: JSON.stringify({ event: 'PONG' })
  });

  await webSocketClient.send(postToConnectionCommand);

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
};

exports.handler = handler;
