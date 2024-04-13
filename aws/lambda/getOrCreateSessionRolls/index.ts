import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'GET'
};

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

const formatRoll = (item: Record<string, any>) => {
  item.id = item.itemId.split('#')[1];
  delete item.itemId;

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

  const sessionId = event.pathParameters!['sessionId'];

  // get all "roll" items for a specific session
  const queryCommand = new QueryCommand({
    TableName: 'vade-mecum-sessions',
    KeyConditionExpression: 'sessionId = :sessionId and begins_with(itemId, :itemIdPrefix)',
    ExpressionAttributeValues: {
      ':sessionId': sessionId,
      ':itemIdPrefix': 'roll'
    },
    ExpressionAttributeNames: {
      '#timestamp': 'timestamp'
    },
    ProjectionExpression: 'itemId, #timestamp, evaluation, dice, label, characterId'
  });

  const response = await docClient.send(queryCommand);

  const rolls = response.Items?.map(formatRoll) ?? [];

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(rolls)
  };
};

exports.handler = handler;
