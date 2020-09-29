const test = require('ava');
const Config = require('../../src/config');
const Query = require('../../src/api/query');

test.beforeEach(t => {
  const query = new Query();
  Object.assign(t.context, {query});
});

test('returns itself', t => {
  t.true(t.context.query instanceof Query);
});

test('Run Query asc json', async t => {
  const query = new Query();
  try {
    const result = await query.run('rabbit', '_dt asc', 'json');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Run Query desc text', async t => {
  const query = new Query();
  try {
    const result = await query.run('mole', '_dt desc', 'text');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Run Query asc default', async t => {
  const query = new Query();
  try {
    const result = await query.run('rabbit', '_dt asc', 'default');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('throws', async t => {
  const query = new Query();
  const error = await t.throwsAsync(() => query.run('mole', 'bad value'));
    t.truthy(error)
  });