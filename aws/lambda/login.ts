import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

type LoginTokenData = {
  email: string;
  expiration: string;
};

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const body = event.body && JSON.parse(event.body);
    if (!body || !body.token) {
      return { statusCode: 400, body: JSON.stringify({ detail: 'Invalid body.' }) };
    }

    const loginTokenData: LoginTokenData = JSON.parse(await layer.decryptLoginToken(body.token));

    const now = new Date();
    const expiration = new Date(loginTokenData.expiration);

    if (now.getTime() > expiration.getTime()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'Token expired.' })
      };
    }

    // try to find existing user by email
    let queryUser = new QueryCommand({
      TableName: 'vade-mecum-users',
      IndexName: 'email-itemId-index',
      KeyConditionExpression: 'email=:email and itemId=:itemId',
      ExpressionAttributeValues: {
        ':email': loginTokenData.email,
        ':itemId': 'meta'
      },
      ProjectionExpression: 'userId'
    });
    const user = (await docClient.send(queryUser)).Items?.[0];

    let userId = user?.userId;

    // store user if they don't already exist
    if (!user) {
      userId = crypto.randomUUID();

      const putUser = new PutCommand({
        TableName: 'vade-mecum-users',
        Item: {
          userId: userId,
          itemId: 'meta',
          email: loginTokenData.email
        }
      });
      await docClient.send(putUser);
    }

    const authToken = crypto.randomBytes(32).toString('hex');
    const hashedAuthToken = await layer.hashAuthToken(authToken);

    const authTokenExpiration = new Date(now.getTime() + 90 * 24 * 60 * 60_000); // 90 days

    // store new authToken
    const putCommand = new PutCommand({
      TableName: 'vade-mecum-users',
      Item: {
        userId: userId,
        itemId: `authToken#${hashedAuthToken}`,
        expiration: Math.floor(authTokenExpiration.getTime() / 1000)
      }
    });
    await docClient.send(putCommand);

    // provide authToken via cookie
    const cookie = `vade-mecum-auth-token=${authToken}; Expires=${authTokenExpiration.toUTCString()}; SameSite=None; HttpOnly; Path=/; Secure`;

    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': cookie
      },
      body: JSON.stringify({
        id: userId,
        email: loginTokenData.email
      })
    };
  });

exports.handler = handler;
