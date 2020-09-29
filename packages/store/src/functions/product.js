/* eslint-disable no-console */
const { Index } = require('fusion-sdk');

exports.handler = async (event, context, callback) => {
  const message = JSON.parse(event.body, null, 2);
  const value = JSON.parse(Buffer.from(message.message.data, 'base64').toString());
  console.log(`value : \n${JSON.stringify(value, null, 2)}`);

  try {
    const res = await Index.create([value]);
    console.log(`res : \n${JSON.stringify(res, null, 2)}`);
  } catch (error) {
    console.error('Could not create', error);
  }

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: value,
    }),
  });
};
