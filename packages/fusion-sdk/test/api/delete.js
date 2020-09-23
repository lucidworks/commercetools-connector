const test = require('ava');

const Delete = require('../../src/api/delete');

test.beforeEach(t => {
  const del = new Delete();
  Object.assign(t.context, {del});
});

test('returns itself', t => {
  t.true(t.context.del instanceof Delete);
});

test('Run Delete', async t => {
  const del = new Delete();
  try {
    const result = await del.delete('someid');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});
