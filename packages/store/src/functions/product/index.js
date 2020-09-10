const { Index } = require('fusion-sdk');

exports.handler = async (event, context, callback) => {
  const message = JSON.parse(event.body, null, 2);
  const value = JSON.parse(Buffer.from(message.message.data, 'base64').toString());
  // eslint-disable-next-line no-console
  console.log(`value : \n${JSON.stringify(value, null, 2)}`);

  // fusionSdk.create({  : '' ,})
  const index = new Index();
  const res = await index.create([value]);

  // eslint-disable-next-line no-console
  console.log(`res : \n${JSON.stringify(res, null, 2)}`);

  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: 'other',
    }),
  });
};
