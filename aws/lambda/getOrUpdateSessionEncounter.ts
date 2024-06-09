import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
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

    const sessionId = event.pathParameters!['sessionId']!;
    const encounterId = event.pathParameters!['encounterId']!;

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

    const getSessionEncounter = new GetCommand({
      TableName: 'vade-mecum-sessions',
      Key: {
        sessionId: sessionId,
        itemId: `encounter#${encounterId}`
      },
      ExpressionAttributeNames: {
        '#name': 'name',
        '#hidden': 'hidden'
      },
      ProjectionExpression: '#name, combatants, turn, #hidden'
    });
    const encounter = (await docClient.send(getSessionEncounter)).Item;

    if (!encounter || (session.userId !== userId && encounter.hidden)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ detail: 'Encounter not found.' })
      };
    }

    // GET
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          id: encounterId,
          name: encounter.name,
          combatants: JSON.parse(encounter.combatants),
          turn: encounter.turn,
          hidden: encounter.hidden
        })
      };
    }
    // POST
    else if (event.httpMethod === 'POST') {
      const body = event.body && JSON.parse(event.body);
      if (!body || !body.encounter) {
        return { statusCode: 400, body: JSON.stringify({ detail: 'Invalid body.' }) };
      }

      const updateSessionEncounter = new UpdateCommand({
        TableName: 'vade-mecum-sessions',
        Key: {
          sessionId,
          itemId: `encounter#${encounterId}`
        },
        UpdateExpression: 'SET #name=:name, combatants=:combatants, turn=:turn, #hidden=:hidden',
        ExpressionAttributeValues: {
          ':name': body.encounter.name,
          ':combatants': JSON.stringify(body.encounter.combatants),
          ':turn': body.encounter.turn,
          ':hidden': body.encounter.hidden
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#hidden': 'hidden'
        }
      });
      await docClient.send(updateSessionEncounter);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
    // DELETE
    else if (event.httpMethod === 'DELETE') {
      const deleteSessionEncounter = new DeleteCommand({
        TableName: 'vade-mecum-sessions',
        Key: {
          sessionId: sessionId,
          itemId: `encounter#${encounterId}`
        }
      });
      await docClient.send(deleteSessionEncounter);

      return {
        statusCode: 200,
        body: JSON.stringify({})
      };
    }
  });

exports.handler = handler;
