import { APIGatewayProxyHandler } from 'aws-lambda';

const handler: APIGatewayProxyHandler = async (event, context) => {
  return {
    statusCode: 404,
    body: 'No sessions found.'
  };
};

exports.handler = handler;
