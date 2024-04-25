import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { KMSClient, GenerateMacCommand } from '@aws-sdk/client-kms';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const kmsClient = new KMSClient();

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

export const hashAuthToken = async (authToken: string) => {
  const hashAuthToken = new GenerateMacCommand({
    KeyId: '215fbde0-3dd4-4aba-b7b4-c1929dc8cbdd',
    MacAlgorithm: 'HMAC_SHA_256',
    Message: Buffer.from(authToken)
  });
  const mac = await kmsClient.send(hashAuthToken);

  if (!mac.Mac) {
    return undefined;
  }

  const hashedAuthToken = [...mac.Mac].map(int => int.toString(16).padStart(2, '0')).join('');

  return hashedAuthToken;
};

const getCookie = (event: APIGatewayProxyEvent, name: string) => {
  if (event.headers.Cookie) {
    return new RegExp(`(?: |^)${name}=(.*?)(?:;|$)`).exec(event.headers.Cookie)?.[1];
  }
  return undefined;
};

export const handlerResolver = async (
  event: APIGatewayProxyEvent,
  handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true'
  };

  // validate Origin header
  if (!event.headers.origin || !ALLOWED_ORIGINS.includes(event.headers.origin)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ detail: 'Unauthorized request origin.' })
    };
  } else {
    headers['Access-Control-Allow-Origin'] = event.headers.origin;
  }

  // identify user
  const authToken = getCookie(event, 'vade-mecum-auth-token');
  if (authToken) {
    const hashedAuthToken = await hashAuthToken(authToken);

    if (!hashedAuthToken) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ detail: 'An error occurred with KMS.' })
      };
    }

    // query for matching auth token
    let queryAuthToken = new QueryCommand({
      TableName: 'vade-mecum-users',
      IndexName: 'itemId-index',
      KeyConditionExpression: 'itemId=:itemId',
      ExpressionAttributeValues: {
        ':itemId': `authToken#${hashedAuthToken}`
      },
      ProjectionExpression: 'userId'
    });
    const authTokenItem = (await docClient.send(queryAuthToken)).Items?.[0];

    if (!authTokenItem) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ detail: 'Invalid auth token.' })
      };
    }

    // attach userId to requestContext for handler to use
    event.requestContext.identity.user = authTokenItem.userId;
  }

  return handler(event).then(response => ({
    ...response,
    headers: {
      ...headers,
      ...response.headers
    }
  }));
};
