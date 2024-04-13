exports.handler = async event => {
  return {
    statusCode: 404,
    body: 'No sessions found.'
  };
};
