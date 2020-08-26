const test = require('ava');

const Index = require('../../src/api/index');

test.beforeEach((t) => {
  const index = new Index();
  Object.assign(t.context, { index });
});

test('returns itself', (t) => {
  t.true(t.context.index instanceof Index);
});

test('Create Index', async (t) => {
  const index = new Index();
  try {
    const create = await index.create('./data.json');
    t.truthy(create);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});
