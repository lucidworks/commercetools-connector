const test = require('ava');

const Index = require('../../src/api');

test.beforeEach(t => {
  const index = new Index();
  Object.assign(t.context, {index});
});

test('returns itself', t => {
  t.true(t.context.index instanceof Index);
});

test('Create Index', async t => {
  const index = new Index();
  try {
    const create = await index.createFromFile('./data.json');
    t.truthy(create);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});
