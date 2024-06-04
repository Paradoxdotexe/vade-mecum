import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const body = event.body && JSON.parse(event.body);
    if (!body || !body.roll) {
      return { statusCode: 400, body: JSON.stringify({ detail: 'Invalid body.' }) };
    }

    const sessionId = event.pathParameters!['sessionId']!;

    const putSessionRoll = new PutCommand({
      TableName: 'vade-mecum-sessions',
      Item: {
        sessionId: sessionId,
        itemId: `roll#${body.roll.id}`,
        definition: JSON.stringify(body.roll)
      }
    });
    await docClient.send(putSessionRoll);

    await layer.sendSessionMessage(event, sessionId, {
      event: 'ROLL_CREATED',
      data: body.roll
    });

    return {
      statusCode: 201,
      body: JSON.stringify({})
    };
  });

exports.handler = handler;
