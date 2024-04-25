import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import zlib from 'zlib';
const layer = require('/opt/nodejs/layer');

const sesClient = new SESClient();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const handler: APIGatewayProxyHandler = async event =>
  layer.handlerResolver(event, async (event: APIGatewayProxyEvent) => {
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

    const now = new Date();
    const expiration = new Date(now.getTime() + 20 * 60_000).toISOString(); // 20 minutes

    const data = {
      email: body.email,
      expiration
    };

    const loginToken = await layer.encryptLoginToken(JSON.stringify(data));

    const sendEmailCommand = new SendEmailCommand({
      Source: '"Vade Mecum" <noreply@mail.vademecum.thenjk.com>',
      Destination: {
        ToAddresses: [body.email]
      },
      Message: {
        Subject: {
          Data: 'Log in to your Vade Mecum account'
        },
        Body: {
          Html: {
            Data: `
            <div style="padding: 24px; display: flex; align-items: center; justify-content: center;">
              <a 
                href="https://vademecum.thenjk.com/vtt/login?token=${encodeURIComponent(loginToken)}" 
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
      body: JSON.stringify({})
    };
  });

exports.handler = handler;
