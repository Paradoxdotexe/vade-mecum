import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import zlib from 'zlib';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

const decrypt = (token: string) => {
  const [encryptedData, iv] = token.split('.');

  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(encryptedData, 'hex');
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

type LoginTokenData = {
  email: string;
  expiration: string;
};

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const body = event.body && JSON.parse(event.body);

    if (!body || !body.token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'Missing token.' })
      };
    }

    let tokenData: LoginTokenData | undefined = undefined;

    try {
      // inflate shortened token from base64
      const loginToken = zlib.inflateSync(Buffer.from(body.token, 'base64')).toString();

      tokenData = JSON.parse(decrypt(loginToken)) as LoginTokenData;
    } catch {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'Invalid token.' })
      };
    }

    const now = new Date();
    const expiration = new Date(tokenData.expiration);

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
        ':email': tokenData.email,
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
          email: tokenData.email
        }
      });
      await docClient.send(putUser);
    }

    const authToken = crypto.randomBytes(32).toString('hex');
    const hashedAuthToken = await layer.hashAuthToken(authToken);

    if (!hashedAuthToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'An error occurred with KMS.' })
      };
    }

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
        email: tokenData.email
      })
    };
  });

exports.handler = handler;
