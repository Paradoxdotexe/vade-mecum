import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand
} from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const characterId = event.pathParameters!['characterId']!;

    // GET
    if (event.httpMethod === 'GET') {
      const getCharacter = new GetCommand({
        TableName: 'vade-mecum-users',
        Key: {
          userId: userId,
          itemId: `character#${characterId}`
        },
        ExpressionAttributeNames: {
          '#definition': 'definition'
        },
        ProjectionExpression: '#definition, version'
      });
      const character = (await docClient.send(getCharacter)).Item;

      if (!character) {
        return {
          statusCode: 404,
          body: JSON.stringify({ detail: 'Character not found.' })
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({
          ...layer.parseCharacterDefinition(character.definition, character.version),
          id: characterId,
          userId: userId
        })
      };
    }
    // POST
    else if (event.httpMethod === 'POST') {
      const body = event.body && JSON.parse(event.body);
      if (!body || !body.character) {
        return { statusCode: 400, body: JSON.stringify({ detail: 'Invalid body.' }) };
      }

      const putCharacter = new PutCommand({
        TableName: 'vade-mecum-users',
        Item: {
          userId: userId,
          itemId: `character#${characterId}`,
          definition: JSON.stringify(body.character),
          version: layer.CURRENT_CHARACTER_VERSION
        }
      });
      await docClient.send(putCharacter);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
    // DELETE
    else if (event.httpMethod === 'DELETE') {
      const deleteCharacter = new DeleteCommand({
        TableName: 'vade-mecum-users',
        Key: {
          userId: userId,
          itemId: `character#${characterId}`
        }
      });
      await docClient.send(deleteCharacter);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
  });

exports.handler = handler;
