import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    // scan for all "meta" and "character" items
    const scanSessionItems = new ScanCommand({
      TableName: 'vade-mecum-sessions',
      FilterExpression: 'itemId = :metaItemId or begins_with(itemId, :characterItemIdPrefix)',
      ExpressionAttributeValues: {
        ':metaItemId': 'meta',
        ':characterItemIdPrefix': 'character#'
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ProjectionExpression: 'sessionId, itemId, #name, userId'
    });
    const sessionItems = (await docClient.send(scanSessionItems)).Items ?? [];

    const metaItems = sessionItems.filter(item => item.itemId === 'meta');
    const characterItems = sessionItems.filter(item => item.itemId.startsWith('character#'));

    const charactersBySessionId = {};
    for (const item of characterItems) {
      if (!charactersBySessionId[item.sessionId]) {
        charactersBySessionId[item.sessionId] = [];
      }
      charactersBySessionId[item.sessionId].push(item);
    }

    const sessions: object[] = [];
    for (const item of metaItems) {
      sessions.push({
        id: item.sessionId,
        userId: item.userId,
        name: item.name,
        characterIds: charactersBySessionId[item.sessionId].map(
          character => character.itemId.split('#')[1]
        )
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify(sessions)
    };
  });

exports.handler = handler;
