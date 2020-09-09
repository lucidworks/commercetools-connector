const test = require('ava');
const {User} = require('../src');

test('Exports User', t => {
  t.truthy(new User());
});
