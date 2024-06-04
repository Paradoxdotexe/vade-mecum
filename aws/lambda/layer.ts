import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { KMSClient, GenerateMacCommand, EncryptCommand, DecryptCommand } from '@aws-sdk/client-kms';
import {
  ApiGatewayManagementApi,
  PostToConnectionCommand
} from '@aws-sdk/client-apigatewaymanagementapi';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const kmsClient = new KMSClient();

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

export const encryptLoginToken = async (data: string) => {
  const encryptLoginToken = new EncryptCommand({
    KeyId: '5a1ca0cf-d4cc-47d4-8e29-0ce794a7e9a2',
    Plaintext: Buffer.from(data)
  });
  const response = await kmsClient.send(encryptLoginToken);

  if (!response.CiphertextBlob) {
    throw new Error('An error occurred with KMS.');
  }

  return Buffer.from(response.CiphertextBlob).toString('base64');
};

export const decryptLoginToken = async (loginToken: string) => {
  const decryptLoginToken = new DecryptCommand({
    KeyId: '5a1ca0cf-d4cc-47d4-8e29-0ce794a7e9a2',
    CiphertextBlob: new Uint8Array(Buffer.from(loginToken, 'base64'))
  });
  const response = await kmsClient.send(decryptLoginToken);

  if (!response.Plaintext) {
    throw new Error('An error occurred with KMS.');
  }

  return Buffer.from(response.Plaintext).toString();
};

export const hashAuthToken = async (authToken: string) => {
  const hashAuthToken = new GenerateMacCommand({
    KeyId: '215fbde0-3dd4-4aba-b7b4-c1929dc8cbdd',
    MacAlgorithm: 'HMAC_SHA_256',
    Message: Buffer.from(authToken)
  });
  const response = await kmsClient.send(hashAuthToken);

  if (!response.Mac) {
    throw new Error('An error occurred with KMS.');
  }

  return Buffer.from(response.Mac).toString('hex');
};

export const getCookie = (event: APIGatewayProxyEvent, name: string) => {
  if (event.headers.Cookie) {
    return new RegExp(`(?: |^)${name}=(.*?)(?:;|$)`).exec(event.headers.Cookie)?.[1];
  }
  return undefined;
};

export const makeCookie = (value = '', date = new Date(0)) => {
  // we specify Domain so cookie can be shared across api and ws
  return `vade-mecum-auth-token=${value}; Expires=${date.toUTCString()}; SameSite=None; HttpOnly; Path=/; Secure; Domain=vademecum.thenjk.com`;
};

export const sendSessionMessage = async (
  event: APIGatewayProxyEvent,
  sessionId: string,
  message: { event: string; data: object }
) => {
  const queryConnections = new QueryCommand({
    TableName: 'vade-mecum-sessions',
    KeyConditionExpression: 'sessionId=:sessionId and begins_with(itemId, :itemIdPrefix)',
    ExpressionAttributeValues: {
      ':sessionId': sessionId,
      ':itemIdPrefix': 'connection'
    },
    ProjectionExpression: 'itemId, userId'
  });
  const connections = (await docClient.send(queryConnections)).Items ?? [];

  const webSocketClient = new ApiGatewayManagementApi({
    endpoint: 'https://ws.vademecum.thenjk.com'
  });

  const originatingUserId = event.requestContext.identity.user;

  for (const connection of connections) {
    // exclude originating user
    const excluded = connection.userId === originatingUserId;

    if (!excluded) {
      const connectionId = connection.itemId.split('#')[1];
      console.log(connectionId);
      const postToConnectionCommand = new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: JSON.stringify(message)
      });

      await webSocketClient.send(postToConnectionCommand);
    }
  }
};

export const handlerResolver = async (
  event: APIGatewayProxyEvent,
  handler: (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>
) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Credentials': 'true'
  };

  // https sends origin, wss sends Origin
  const origin = event.headers.origin ?? event.headers.Origin;

  // validate Origin header
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    return {
      statusCode: 403,
      headers,
      body: JSON.stringify({ detail: 'Unauthorized request origin.' })
    };
  } else {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  // authenticate user
  const authToken = getCookie(event, 'vade-mecum-auth-token');
  if (authToken) {
    const hashedAuthToken = await hashAuthToken(authToken);

    // query for matching auth token
    let queryAuthToken = new QueryCommand({
      TableName: 'vade-mecum-users',
      IndexName: 'itemId-index',
      KeyConditionExpression: 'itemId=:itemId',
      ExpressionAttributeValues: {
        ':itemId': `authToken#${hashedAuthToken}`
      },
      ProjectionExpression: 'userId'
    });
    const authTokenItem = (await docClient.send(queryAuthToken)).Items?.[0];

    if (!authTokenItem) {
      // remove auth token cookie
      const cookie = makeCookie();
      return {
        statusCode: 403,
        headers: {
          ...headers,
          'Set-Cookie': cookie
        },
        body: JSON.stringify({ detail: 'Invalid auth token.' })
      };
    }

    // attach userId to requestContext for handler to use
    event.requestContext.identity.user = authTokenItem.userId;
  }

  return handler(event).then(response => ({
    ...response,
    headers: {
      ...headers,
      ...response.headers
    }
  }));
};

const CHARACTER_MIGRATIONS: ((character: any) => void)[] = [
  character => {
    delete character.description;
    character.partyGoal = '';
    character.personalGoal = '';
  }
];

export const CURRENT_CHARACTER_VERSION = CHARACTER_MIGRATIONS.length + 1;

export const parseCharacterDefinition = (definition: string, version: number) => {
  const character = JSON.parse(definition);
  for (const migration of CHARACTER_MIGRATIONS.slice(version - 1)) {
    migration(character);
  }
  return character;
};

export const DEFAULT_CHARACTER_DEFINITION = {
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
        athletics: { label: 'Athletics', value: 0 }
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
  perkKeys: [],
  classAbilityKeys: [],
  itemQuantities: [{ key: 'currency', quantity: 0 }],
  satiation: 0,
  exhaustion: 0
};
