/* eslint-disable no-console */
const Index = require('fusion-sdk');

exports.handler = async (event, context, callback) => {
  const message = JSON.parse(event.body, null, 2);
  // const value = JSON.parse(Buffer.from(message.message.data, 'base64').toString());
  console.log(`Message : \n${JSON.stringify(message, null, 2)}`);

  try {
    const api = new Index();
    const res = await api.create(message);
    console.log(`Baseline Complete \n${JSON.stringify(res, null, 2)}`);
  } catch (error) {
    console.log(`Baseline Complete \n${JSON.stringify(res, null, 2)}`);
    // console.error('Could not complete import baseline', error);
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: message,
    }),
  });
};
