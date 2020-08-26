const test = require('ava');

const Query = require('../../src/api/query');

test.beforeEach((t) => {
  const query = new Query();
  Object.assign(t.context, { query });
});

test('returns itself', (t) => {
  t.true(t.context.query instanceof Query);
});

test('Run Query', async (t) => {
  const query = new Query();
  try {
    const result = await query.run('rabbit');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});