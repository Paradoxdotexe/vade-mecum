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

    const characterId = crypto.randomUUID();

    const putCharacter = new PutCommand({
      TableName: 'vade-mecum-users',
      Item: {
        userId: userId,
        itemId: `character#${characterId}`,
        definition: JSON.stringify(layer.DEFAULT_CHARACTER_DEFINITION),
        version: layer.CURRENT_CHARACTER_VERSION
      }
    });
    await docClient.send(putCharacter);

    return {
      statusCode: 200,
      body: JSON.stringify({ characterId })
    };
  });

exports.handler = handler;
