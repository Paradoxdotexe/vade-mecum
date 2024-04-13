import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const handler: APIGatewayProxyHandler = async (event, context) => {
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

  if (!response.Items || !response.Items) {
    return {
      statusCode: 404,
      body: 'No sessions found.'
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      response.Items.map(item => {
        // rename "sessionId" to "id"
        item.id = item.sessionId;
        delete item.sessionId;

        return item;
      })
    )
  };
};

exports.handler = handler;
