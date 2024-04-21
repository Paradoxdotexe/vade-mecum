import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import crypto from 'crypto';
import zlib from 'zlib';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST'
};

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

const decrypt = (token: string) => {
  const [encryptedData, iv] = token.split('.');

  let decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(ENCRYPTION_KEY, 'hex'),
    Buffer.from(iv, 'hex')
  );
  let decrypted = decipher.update(encryptedData, 'hex');
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

type LoginTokenData = {
  userId?: string;
  email: string;
  expiration: string;
};

const handler: APIGatewayProxyHandler = async event => {
  if (!event.headers.origin || !ALLOWED_ORIGINS.includes(event.headers.origin)) {
    return {
      statusCode: 403,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ detail: 'Unauthorized request origin.' })
    };
  } else {
    RESPONSE_HEADERS['Access-Control-Allow-Origin'] = event.headers.origin;
  }

  const body = event.body && JSON.parse(event.body);

  if (!body || !body.token) {
    return {
      statusCode: 400,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ detail: 'Missing token.' })
    };
  }

  let tokenData: LoginTokenData | undefined = undefined;

  try {
    // inflate shortened token from base64
    const loginToken = zlib.inflateSync(Buffer.from(body.token, 'base64')).toString();

    tokenData = JSON.parse(decrypt(loginToken)) as LoginTokenData;
  } catch {
    return {
      statusCode: 400,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ detail: 'Invalid token.' })
    };
  }

  const now = new Date();
  const expiration = new Date(tokenData.expiration);

  if (now.getTime() > expiration.getTime()) {
    return {
      statusCode: 400,
      headers: RESPONSE_HEADERS,
      body: JSON.stringify({ detail: 'Token expired.' })
    };
  }

  // store user if they don't already exist
  if (!tokenData.userId) {
    tokenData.userId = crypto.randomUUID();

    const putUser = new PutCommand({
      TableName: 'vade-mecum-users',
      Item: {
        userId: tokenData.userId,
        itemId: 'meta',
        email: tokenData.email
      }
    });
    await docClient.send(putUser);
  }

  const authToken = crypto.randomBytes(20).toString('hex');
  const authTokenExpiration = new Date(now.getTime() + 90 * 24 * 60 * 60_000); // 90 days

  // store new authToken
  const putCommand = new PutCommand({
    TableName: 'vade-mecum-users',
    Item: {
      userId: tokenData.userId,
      itemId: `authToken#${authToken}`,
      expiration: Math.floor(authTokenExpiration.getTime() / 1000)
    }
  });
  await docClient.send(putCommand);

  return {
    statusCode: 200,
    headers: {
      ...RESPONSE_HEADERS,
      // provide authToken via cookie
      'Set-Cookie': `vade-mecum-auth-token=${authToken}; Expires=${authTokenExpiration.toUTCString()}; SameSite=None; Secure; HttpOnly`
    },
    body: JSON.stringify({
      id: tokenData.userId,
      email: tokenData.email
    })
  };
};

exports.handler = handler;
