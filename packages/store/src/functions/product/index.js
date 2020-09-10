exports.handler = (event, context, callback) => {
  // eslint-disable-next-line no-console
  // console.log(`event : \n${JSON.stringify(event, null, 2)}`);
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
