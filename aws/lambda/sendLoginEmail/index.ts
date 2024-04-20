import { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import crypto from 'crypto';
import zlib from 'zlib';

const docClient = DynamoDBDocumentClient.from(new DynamoDBClient());
const sesClient = new SESClient();

const RESPONSE_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Methods': 'POST'
};

const ALLOWED_ORIGINS = ['http://localhost:3000', 'https://vademecum.thenjk.com'];

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY as string;

const encrypt = (data: string) => {
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return { encryptedData: encrypted.toString('hex'), iv: iv.toString('hex') };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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

  if (!body || !body.email) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Missing email.' })
    };
  }

  if (!EMAIL_REGEX.test(body.email)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Invalid email.' })
    };
  }

  // try to find existing user by email
  let queryUser = new QueryCommand({
    TableName: 'vade-mecum-users',
    IndexName: 'email-itemId-index',
    KeyConditionExpression: 'email=:email and itemId=:itemId',
    ExpressionAttributeValues: {
      ':email': body.email,
      ':itemId': 'meta'
    },
    ProjectionExpression: 'userId'
  });
  const user = (await docClient.send(queryUser)).Items?.[0];

  const now = new Date();
  const expiration = new Date(now.getTime() + 20 * 60_000).toISOString();

  const data = {
    userId: user?.userId,
    email: body.email,
    expiration
  };

  const { encryptedData, iv } = encrypt(JSON.stringify(data));

  const loginToken = `${encryptedData}.${iv}`;

  // deflate to base64 to shorten token
  const deflatedLoginToken = zlib.deflateSync(loginToken).toString('base64');

  const sendEmailCommand = new SendEmailCommand({
    Source: '"Vade Mecum" <noreply@mail.vademecum.thenjk.com>',
    Destination: {
      ToAddresses: [body.email]
    },
    Message: {
      Subject: {
        Data: 'Login to your Vade Mecum account'
      },
      Body: {
        Html: {
          Data: `
            <div style="padding: 24px; display: flex; align-items: center; justify-content: center;">
              <a 
                href="https://vademecum.thenjk.com/engine/login?token=${deflatedLoginToken}" 
                style="background: #34a9fe; color: #fff; text-decoration: none; padding: 6px 12px; font-size: 16px; border-radius: 3px; font-family: sans-serif; font-weight: bold;"
              >
                CLICK HERE TO LOGIN
              </a>
            </div>
          `
        }
      }
    }
  });

  await sesClient.send(sendEmailCommand);

  return {
    statusCode: 200,
    headers: RESPONSE_HEADERS,
    body: ''
  };
};

exports.handler = handler;
