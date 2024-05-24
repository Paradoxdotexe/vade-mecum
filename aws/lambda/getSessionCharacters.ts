import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const sessionId = event.pathParameters!['sessionId']!;

    const querySessionCharacters = new QueryCommand({
      TableName: 'vade-mecum-sessions',
      KeyConditionExpression: 'sessionId=:sessionId and begins_with(itemId, :itemIdPrefix)',
      ExpressionAttributeValues: {
        ':sessionId': sessionId,
        ':itemIdPrefix': 'character#'
      },
      ProjectionExpression: 'itemId, userId'
    });
    const sessionCharacters = (await docClient.send(querySessionCharacters)).Items ?? [];

    const charactersByItemId = {};

    for (const sessionCharacter of sessionCharacters) {
      const getCharacter = new GetCommand({
        TableName: 'vade-mecum-users',
        Key: {
          userId: sessionCharacter.userId,
          itemId: sessionCharacter.itemId
        },
        ExpressionAttributeNames: {
          '#definition': 'definition'
        },
        ProjectionExpression: '#definition, version'
      });
      const character = (await docClient.send(getCharacter)).Item;

      if (character) {
        charactersByItemId[sessionCharacter.itemId] = character;
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(
        sessionCharacters.map(sessionCharacter => {
          const character = charactersByItemId[sessionCharacter.itemId];
          return {
            ...layer.parseCharacterDefinition(character.definition, character.version),
            id: sessionCharacter.itemId.split('#')[1],
            userId: sessionCharacter.userId
          };
        })
      )
    };
  });

exports.handler = handler;
