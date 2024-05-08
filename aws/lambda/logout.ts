import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const authToken = layer.getCookie(event, 'vade-mecum-auth-token');
    const hashedAuthToken = await layer.hashAuthToken(authToken);

    // delete current auth token
    let deleteAuthToken = new DeleteCommand({
      TableName: 'vade-mecum-users',
      Key: {
        userId,
        itemId: `authToken#${hashedAuthToken}`
      }
    });
    await docClient.send(deleteAuthToken);

    // remove auth token cookie
    const cookie = `vade-mecum-auth-token=; Expires=${new Date(0).toUTCString()}; SameSite=None; HttpOnly; Path=/; Secure`;

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': cookie
      },
      body: JSON.stringify({})
    };
  });

exports.handler = handler;
