exports.handler = (event, context, callback) => {
  // eslint-disable-next-line no-console
  // console.log(`event : \n${JSON.stringify(event, null, 2)}`);
  const message = JSON.parse(event.body, null, 2);
  // eslint-disable-next-line no-console
  console.log(`message : \n${JSON.stringify(message, null, 2)}`);
  // const value = Buffer.from(message.data, 'base64').toString();
  // eslint-disable-next-line no-console
  // console.log(`value : \n${JSON.stringify(value, null, 2)}`);
  // eslint-disable-next-line no-console
  console.log(`body : \n${JSON.stringify(event.body, null, 2)}`);


  // eslint-disable-next-line no-console
  // console.log(JSON.stringify(context));
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: 'other',
    }),
  });
};
