import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const crypto = require('crypto');
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const sessionId = crypto.randomUUID();

    const putSession = new PutCommand({
      TableName: 'vade-mecum-sessions',
      Item: {
        sessionId: sessionId,
        itemId: 'meta',
        name: '',
        userId: userId
      }
    });
    await docClient.send(putSession);

    return {
      statusCode: 200,
      body: JSON.stringify({ sessionId })
    };
  });

exports.handler = handler;
