import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  PutCommand,
  BatchWriteCommand
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

    // GET
    if (event.httpMethod === 'GET') {
      const getSession = new GetCommand({
        TableName: 'vade-mecum-sessions',
        Key: {
          sessionId: sessionId,
          itemId: 'meta'
        },
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ProjectionExpression: 'itemId, #name, userId'
      });
      const session = (await docClient.send(getSession)).Item;

      if (!session) {
        return {
          statusCode: 404,
          body: JSON.stringify({ detail: 'Session not found.' })
        };
      }

      const querySessionCharacters = new QueryCommand({
        TableName: 'vade-mecum-sessions',
        KeyConditionExpression:
          'sessionId=:sessionId and begins_with(itemId, :characterItemIdPrefix)',
        ExpressionAttributeValues: {
          ':sessionId': sessionId,
          ':characterItemIdPrefix': 'character#'
        },
        ProjectionExpression: 'itemId, userId'
      });
      const sessionCharacters = (await docClient.send(querySessionCharacters)).Items ?? [];

      return {
        statusCode: 200,
        body: JSON.stringify({
          id: sessionId,
          userId: session.userId,
          name: session.name,
          characterIds: sessionCharacters.map(character => character.itemId.split('#')[1])
        })
      };
    }
    // POST
    else if (event.httpMethod === 'POST') {
      const body = event.body && JSON.parse(event.body);
      if (!body) {
        return { statusCode: 400, body: JSON.stringify({ detail: 'Invalid body.' }) };
      }

      const putSession = new PutCommand({
        TableName: 'vade-mecum-sessions',
        Item: {
          sessionId: sessionId,
          itemId: 'meta',
          name: body.name
        }
      });
      await docClient.send(putSession);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
    // DELETE
    else if (event.httpMethod === 'DELETE') {
      const querySessionItems = new QueryCommand({
        TableName: 'vade-mecum-sessions',
        KeyConditionExpression: 'sessionId=:sessionId',
        ExpressionAttributeValues: {
          ':sessionId': sessionId
        },
        ProjectionExpression: 'itemId, userId'
      });
      const sessionItems = (await docClient.send(querySessionItems)).Items ?? [];

      const metaItem = sessionItems.find(item => item.itemId === 'meta');

      // check that user owns session
      if (metaItem?.userId !== userId) {
        return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
      }

      const deleteSessionItems = new BatchWriteCommand({
        RequestItems: {
          'vade-mecum-sessions': sessionItems.map(({ itemId }) => ({
            DeleteRequest: {
              Key: {
                sessionId,
                itemId
              }
            }
          }))
        }
      });
      await docClient.send(deleteSessionItems);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
  });

exports.handler = handler;
