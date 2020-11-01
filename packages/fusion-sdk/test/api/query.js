const test = require('ava');
const Config = require('../../src/config');
const query = require('../../src/api/query');

test.beforeEach(t => {
  const queryInstance = new query.Query();
  Object.assign(t.context, {queryInstance});
});

test('returns itself', t => {
  t.true(t.context.queryInstance instanceof query.Query);
});

test('Run Query asc json', async t => {
  try {
    const result = await t.context.queryInstance.run('rabbit', '_dt asc', 'json');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Run Query desc text', async t => {
  try {
    const result = await t.context.queryInstance.run('mole', '_dt desc', 'text');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Run Query asc default', async t => {
  try {
    const result = await t.context.queryInstance.run('rabbit', '_dt asc', 'default');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Build facet params null', async t => {
  let facets;
  let facetQueries;
  const expected = ''
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params single facet no query', async t => {
  const facets = ['size_s']
  let facetQueries;
  const expected = '&facet=true&facet.field=size_s'
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params multiple facet no query', async t => {
  const facets = ['size_s', 'color_s', 'designer_s'];
  let facetQueries;
  const expected = '&facet=true&facet.field=size_s&facet.field=color_s&facet.field=designer_s'
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params single facet single query', async t => {
  let facets;
  const facetQueries = {color_s:'blue'};
  const expected = '&facet=true&fq=color_s:blue'
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params multiple facet multiple query', async t => {
  const facets = ['size_s', 'color_s', 'designer_s'];
  const facetQueries = {size_s:'34', color_s:'blue', designer_s:'pinko'};
  const expected = '&facet=true&facet.field=size_s&facet.field=color_s&facet.field=designer_s&fq=size_s:34&fq=color_s:blue&fq=designer_s:pinko'
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('throws', async t => {
  const error = await t.throwsAsync(() => t.context.queryInstance.run('mole', 'bad value'));
  t.truthy(error)
});