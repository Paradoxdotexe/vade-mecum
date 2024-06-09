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

    const querySessionEncounters = new QueryCommand({
      TableName: 'vade-mecum-sessions',
      KeyConditionExpression: 'sessionId=:sessionId and begins_with(itemId, :itemIdPrefix)',
      ExpressionAttributeValues: {
        ':sessionId': sessionId,
        ':itemIdPrefix': 'encounter#'
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#hidden': 'hidden'
      },
      ProjectionExpression: 'itemId, #name, combatants, turn, #hidden'
    });
    const encounters = (await docClient.send(querySessionEncounters)).Items ?? [];

    return {
      statusCode: 200,
      body: JSON.stringify(
        encounters.map(encounter => ({
          id: encounter.itemId.split('#')[1],
          name: encounter.name,
          combatants: JSON.parse(encounter.combatants),
          turn: encounter.turn,
          hidden: encounter.hidden
        }))
      )
    };
  });

exports.handler = handler;
