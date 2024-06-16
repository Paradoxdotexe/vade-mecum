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
      ProjectionExpression: 'itemId, #name, participants, turn, #hidden'
    });
    const encounters = (await docClient.send(querySessionEncounters)).Items ?? [];

    return {
      statusCode: 200,
      body: JSON.stringify(
        encounters
          .filter(encounter => session.userId === userId || !encounter.hidden)
          .map(encounter => ({
            id: encounter.itemId.split('#')[1],
            name: encounter.name,
            participants: JSON.parse(encounter.participants),
            turn: encounter.turn,
            hidden: encounter.hidden
          }))
      )
    };
  });

exports.handler = handler;
