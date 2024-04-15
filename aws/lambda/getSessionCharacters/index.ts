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

const formatCharacter = (item: Record<string, any>) => {
  return JSON.parse(item.definition);
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

  // get all "character" items for a specific session
  const queryCommand = new QueryCommand({
    TableName: 'vade-mecum-sessions',
    KeyConditionExpression: 'sessionId = :sessionId and begins_with(itemId, :itemIdPrefix)',
    ExpressionAttributeValues: {
      ':sessionId': sessionId,
      ':itemIdPrefix': 'character'
    },
    ExpressionAttributeNames: {
      '#definition': 'definition'
    },
    ProjectionExpression: '#definition'
  });

  const response = await docClient.send(queryCommand);

  const characters = response.Items?.map(formatCharacter) ?? [];

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: JSON.stringify(characters)
  };
};

exports.handler = handler;
