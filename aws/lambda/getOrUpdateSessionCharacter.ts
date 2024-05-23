import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand
} from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const sessionId = event.pathParameters!['sessionId']!;
    const characterId = event.pathParameters!['characterId']!;

    // GET
    if (event.httpMethod === 'GET') {
      const getSessionCharacter = new GetCommand({
        TableName: 'vade-mecum-sessions',
        Key: {
          sessionId: sessionId,
          itemId: `character#${characterId}`
        },
        ProjectionExpression: 'userId'
      });
      const sessionCharacter = (await docClient.send(getSessionCharacter)).Item;

      if (!sessionCharacter) {
        return {
          statusCode: 404,
          body: JSON.stringify({ detail: 'Session character not found.' })
        };
      }

      const getCharacter = new GetCommand({
        TableName: 'vade-mecum-users',
        Key: {
          userId: sessionCharacter.userId,
          itemId: `character#${characterId}`
        },
        ExpressionAttributeNames: {
          '#definition': 'definition'
        },
        ProjectionExpression: '#definition'
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
          id: characterId,
          userId: userId,
          ...layer.parseCharacterDefinition(character.definition)
        })
      };
    }
    // POST
    else if (event.httpMethod === 'POST') {
      const putSessionCharacter = new PutCommand({
        TableName: 'vade-mecum-sessions',
        Item: {
          sessionId: sessionId,
          itemId: `character#${characterId}`,
          userId: userId
        }
      });
      await docClient.send(putSessionCharacter);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
    // DELETE
    else if (event.httpMethod === 'DELETE') {
      const getSession = new GetCommand({
        TableName: 'vade-mecum-sessions',
        Key: {
          sessionId: sessionId,
          itemId: 'meta'
        },
        ProjectionExpression: 'userId'
      });
      const session = (await docClient.send(getSession)).Item;

      if (!session) {
        return {
          statusCode: 404,
          body: JSON.stringify({ detail: 'Session not found.' })
        };
      }

      const deleteSessionCharacter = new DeleteCommand({
        TableName: 'vade-mecum-sessions',
        Key: {
          sessionId: sessionId,
          itemId: `character#${characterId}`
        },
        ...(userId !== session.userId
          ? {
              // check that user owns session character (if they don't own the session)
              ConditionExpression: 'userId=:userId',
              ExpressionAttributeValues: {
                ':userId': userId
              }
            }
          : {})
      });
      await docClient.send(deleteSessionCharacter);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
  });

exports.handler = handler;
