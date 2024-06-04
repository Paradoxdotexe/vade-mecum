import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event => {
  const connectionId = event.requestContext.connectionId; // identifies the WebSocket connection

  let queryConnection = new QueryCommand({
    TableName: 'vade-mecum-sessions',
    IndexName: 'itemId-index',
    KeyConditionExpression: 'itemId=:itemId',
    ExpressionAttributeValues: {
      ':itemId': `connection#${connectionId}`
    },
    ProjectionExpression: 'sessionId'
  });
  const connection = (await docClient.send(queryConnection)).Items?.[0];

  if (!connection) {
    return { statusCode: 400, body: JSON.stringify({ detail: 'Connection not found.' }) };
  }

  const deleteConnection = new DeleteCommand({
    TableName: 'vade-mecum-sessions',
    Key: {
      sessionId: connection.sessionId,
      itemId: `connection#${connectionId}`
    }
  });
  await docClient.send(deleteConnection);

  return {
    statusCode: 200,
    body: JSON.stringify({})
  };
};

exports.handler = handler;
