const test = require('ava');

const User = require('../../src/api/user');

test.beforeEach(t => {
  const user = new User();
  Object.assign(t.context, { user });
});

test('returns itself', t => {
  t.true(t.context.user instanceof User);
});

test('List Users', async t => {
  const user = new User();
  try {
    const list = await user.list();
    // console.log(JSON.stringify(list, null, 2));
    t.truthy(list);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});
