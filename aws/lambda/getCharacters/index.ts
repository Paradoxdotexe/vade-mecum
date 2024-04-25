import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const queryCharacters = new QueryCommand({
      TableName: 'vade-mecum-users',
      KeyConditionExpression: 'userId=:userId and begins_with(itemId, :itemIdPrefix)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':itemIdPrefix': 'character#'
      },
      ExpressionAttributeNames: {
        '#definition': 'definition'
      },
      ProjectionExpression: 'itemId, #definition'
    });
    const characters = (await docClient.send(queryCharacters)).Items ?? [];

    return {
      statusCode: 200,
      body: JSON.stringify(
        characters.map(character => ({
          id: character.itemId.split('#')[1],
          userId: userId,
          ...JSON.parse(character.definition)
        }))
      )
    };
  });

exports.handler = handler;
