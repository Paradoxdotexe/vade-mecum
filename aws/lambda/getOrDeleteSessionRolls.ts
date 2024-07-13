import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const BATCH_SIZE = 25;

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const sessionId = event.pathParameters!['sessionId']!;

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

    // GET
    if (event.httpMethod === 'GET') {
      const querySessionRolls = new QueryCommand({
        TableName: 'vade-mecum-sessions',
        KeyConditionExpression: 'sessionId=:sessionId and begins_with(itemId, :itemIdPrefix)',
        ExpressionAttributeValues: {
          ':sessionId': sessionId,
          ':itemIdPrefix': 'roll#'
        },
        ExpressionAttributeNames: {
          '#definition': 'definition'
        },
        ProjectionExpression: 'itemId, #definition'
      });
      const rolls = (await docClient.send(querySessionRolls)).Items ?? [];

      return {
        statusCode: 200,
        body: JSON.stringify(
          rolls.map(roll => ({
            ...JSON.parse(roll.definition),
            id: roll.itemId.split('#')[1]
          }))
        )
      };
    }
    // DELETE
    else if (event.httpMethod === 'DELETE') {
      if (session.userId !== userId) {
        return { statusCode: 401, body: JSON.stringify({ detail: 'Unauthorized.' }) };
      }

      const querySessionRolls = new QueryCommand({
        TableName: 'vade-mecum-sessions',
        KeyConditionExpression: 'sessionId=:sessionId and begins_with(itemId, :itemIdPrefix)',
        ExpressionAttributeValues: {
          ':sessionId': sessionId,
          ':itemIdPrefix': 'roll#'
        },
        ProjectionExpression: 'itemId'
      });
      const sessionRolls = (await docClient.send(querySessionRolls)).Items ?? [];

      for (let i = 0; i < sessionRolls.length; i += BATCH_SIZE) {
        const batchedSessionRolls = sessionRolls.slice(i, i + BATCH_SIZE);

        const deleteSessionRolls = new BatchWriteCommand({
          RequestItems: {
            'vade-mecum-sessions': batchedSessionRolls.map(({ itemId }) => ({
              DeleteRequest: {
                Key: {
                  sessionId,
                  itemId
                }
              }
            }))
          }
        });
        await docClient.send(deleteSessionRolls);
      }

      await layer.sendSessionMessage(event, sessionId, {
        event: 'ROLLS_DELETED'
      });

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
  });

exports.handler = handler;
