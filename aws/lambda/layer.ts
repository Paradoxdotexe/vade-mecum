import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

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

  const authToken = getCookie(event, 'vade-mecum-auth-token');

  // validate authentication if applicable
  if (authToken) {
    // query for matching auth token
    let queryAuthToken = new QueryCommand({
      TableName: 'vade-mecum-users',
      IndexName: 'itemId-index',
      KeyConditionExpression: 'itemId=:itemId',
      ExpressionAttributeValues: {
        ':itemId': `authToken#${authToken}`
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
    event.requestContext.accountId = authTokenItem.userId;
  }

  return handler(event).then(response => ({
    ...response,
    headers: {
      ...headers,
      ...response.headers
    }
  }));
};
