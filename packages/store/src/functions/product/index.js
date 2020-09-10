exports.handler = (event, context, callback) => {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(event));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(context));
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      data: 'other',
    }),
  });
};
