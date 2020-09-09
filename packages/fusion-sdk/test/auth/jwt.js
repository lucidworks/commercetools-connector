const test = require('ava');

const JWT = require('../../src/auth/jwt');

test.beforeEach(t => {
  const jwt = new JWT();
  Object.assign(t.context, {jwt});
});

test('returns itself', t => {
  t.true(t.context.jwt instanceof JWT);
});

test('sign a payload', t => {
  const key = '123456789';
  const payload = {
    iss: 'Test',
    iat: Math.floor(Date.now() / 1000) + 257,
    sub: 'test',
    username: 'test'
  };
  const token = JWT.sign(payload, key);
  // console.log(token);
  t.truthy(token);
});
