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
  delete item.itemId;

  // rename "sessionId" to "id"
  item.id = item.sessionId;
  delete item.sessionId;

  item.users = item.users.map(user => ({
    id: user.itemId.split('#')[1],
    online: !!user.connectionId
  }));

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

  // scan for all "session" and "user" items
  const scanCommand = new ScanCommand({
    TableName: 'vade-mecum-sessions',
    FilterExpression: 'itemId = :sessionItemId or begins_with(itemId, :userItemIdPrefix)',
    ExpressionAttributeValues: {
      ':sessionItemId': 'session',
      ':userItemIdPrefix': 'user'
    },
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ProjectionExpression: 'itemId, sessionId, #name, createdAt, connectionId'
  });

  const response = await docClient.send(scanCommand);

  const sessions =
    response.Items?.filter(item => item.itemId === 'session')
      .map(item => ({
        ...item,
        users: response.Items?.filter(item => item.itemId.startsWith('user'))
      }))
      .map(formatSession) ?? [];

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(sessions)
  };
};

exports.handler = handler;
