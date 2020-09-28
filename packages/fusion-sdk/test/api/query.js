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

test('Run get internal for externalId', async t => {
  const qry = new Query();
  try {
    const responseJson = await qry.run('d6f5c363-5cfa-4000-bfe8-3c3130c4a03e', '_dt desc', 'default', 'id');
    //console.log(responseJson);
    let internalId = JSON.parse(responseJson);
    console.log('internalId: ' + internalId.response.docs[0]._lw_parser_id_s);
    t.truthy(responseJson); 
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