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

const handler: APIGatewayProxyHandler = async event => {
  if (event.headers.origin && !ALLOWED_ORIGINS.includes(event.headers.origin)) {
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
      body: JSON.stringify({ detail: 'Missing token.' })
    };
  }

  // inflate shortened token from base64
  var inflatedToken = zlib.inflateSync(Buffer.from(body.token, 'base64')).toString();

  const data = JSON.parse(decrypt(inflatedToken));

  const now = new Date();
  const expiration = new Date(data.expiration);

  if (now.getTime() > expiration.getTime()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Token expired.' })
    };
  }

  const authToken = crypto.randomBytes(20).toString('hex');
  const authTokenExpiration = new Date(now.getTime() + 90 * 24 * 60 * 60_000); // 90 days

  // store new authToken in database
  const putCommand = new PutCommand({
    TableName: 'vade-mecum-users',
    Item: {
      userId: data.userId,
      itemId: `authToken#${authToken}`,
      expiration: Math.floor(authTokenExpiration.getTime() / 1000)
    }
  });
  await docClient.send(putCommand);

  return {
    statusCode: 200,
    headers: {
      ...RESPONSE_HEADERS,
      'Set-Cookie': `vade-mecum-auth-token=${authToken}; Expires=${authTokenExpiration.toUTCString()}; SameSite=None; Secure; HttpOnly`
    },
    body: data.email
  };
};

exports.handler = handler;
