import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const characterId = event.pathParameters!['characterId'];

    const queryCharacter = new GetCommand({
      TableName: 'vade-mecum-users',
      Key: {
        userId: userId,
        itemId: `character#${characterId}`
      },
      ExpressionAttributeNames: {
        '#definition': 'definition'
      },
      ProjectionExpression: 'userId, #definition'
    });
    const character = (await docClient.send(queryCharacter)).Item;

    if (!character) {
      return {
        statusCode: 404,
        body: JSON.stringify({ detail: 'Character not found.' })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: characterId,
        userId: character.userId,
        ...JSON.parse(character.definition)
      })
    };
  });

exports.handler = handler;
