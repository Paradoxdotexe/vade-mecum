import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET'
};

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

const formatSession = (item: Record<string, any>) => {
  // rename "sessionId" to "id"
  item.id = item.sessionId;
  delete item.sessionId;

  return item;
};

const handler: APIGatewayProxyHandler = async event => {
  if (event.headers.origin && !ALLOWED_ORIGINS.includes(event.headers.origin)) {
    return {
      statusCode: 403,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ detail: 'Unauthorized request origin.' })
    };
  } else {
    RESPONSE_HEADERS['Access-Control-Allow-Origin'] = event.headers.origin;
  }

  // scan for all "session" items
  const scanCommand = new ScanCommand({
    TableName: 'vade-mecum-sessions',
    FilterExpression: 'itemId = :itemId',
    ExpressionAttributeValues: {
      ':itemId': 'session'
    },
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ProjectionExpression: 'sessionId, #name, createdAt'
  });

  const response = await docClient.send(scanCommand);

  const gameSessions = response.Items?.map(formatSession) ?? [];

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(gameSessions)
  };
};

exports.handler = handler;
