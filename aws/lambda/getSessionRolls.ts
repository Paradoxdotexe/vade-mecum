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
          ...roll.definition,
          id: roll.itemId.split('#')[1],
          userId: userId
        }))
      )
    };
  });

exports.handler = handler;
