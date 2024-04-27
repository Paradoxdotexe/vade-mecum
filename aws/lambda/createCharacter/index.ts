import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
const crypto = require('crypto');
const layer = require('/opt/nodejs/layer');

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
    const userId = event.requestContext.identity.user;
    if (!userId) {
      return { statusCode: 403, body: JSON.stringify({ detail: 'Unauthorized.' }) };
    }

    const characterId = crypto.randomUUID();

    const putCharacter = new PutCommand({
      TableName: 'vade-mecum-users',
      Item: {
        userId: userId,
        itemId: `character#${characterId}`,
        definition: JSON.stringify(DEFAULT_CHARACTER_DEFINITION),
        version: VERSION
      }
    });
    await docClient.send(putCharacter);

    return {
      statusCode: 200,
      body: JSON.stringify({ characterId })
    };
  });

exports.handler = handler;

const VERSION = 1;

const DEFAULT_CHARACTER_DEFINITION = {
  name: '',
  raceKey: 'human',
  classKey: 'knight',
  partyGoal: '',
  personalGoal: '',
  level: 1,
  levelPoints: 0,
  healthPoints: 0,
  classPoints: 0,
  attributes: {
    strength: {
      label: 'Strength',
      value: 1,
      skills: {
        power: { label: 'Power', value: 0 },
        fortitude: { label: 'Fortitude', value: 0 },
        athletics: { label: 'Athletics', value: 0 },
        honor: { label: 'Honor', value: 0 }
      }
    },
    dexterity: {
      label: 'Dexterity',
      value: 1,
      skills: {
        precision: { label: 'Precision', value: 0 },
        stealth: { label: 'Stealth', value: 0 },
        agility: { label: 'Agility', value: 0 }
      }
    },

    intelligence: {
      label: 'Intelligence',
      value: 1,
      skills: {
        intellect: { label: 'Intellect', value: 0 },
        medicine: { label: 'Medicine', value: 0 },
        innovation: { label: 'Innovation', value: 0 }
      }
    },
    charisma: {
      label: 'Charisma',
      value: 1,
      skills: {
        intuition: { label: 'Intuition', value: 0 },
        influence: { label: 'Influence', value: 0 },
        luck: { label: 'Luck', value: 0 }
      }
    },
    perception: {
      label: 'Perception',
      value: 1,
      skills: {
        insight: { label: 'Insight', value: 0 },
        detection: { label: 'Detection', value: 0 },
        investigation: { label: 'Investigation', value: 0 }
      }
    }
  },
  satiation: 0,
  exhaustion: 0,
  perkKeys: [],
  classAbilityKeys: [],
  itemQuantities: [{ key: 'currency', quantity: 0 }]
};
