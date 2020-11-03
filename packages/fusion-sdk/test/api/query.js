const test = require('ava');
const query = require('../../src/api/query');

/* eslint-disable-next-line ava/no-import-test-files */
const mockQueryResponse = require('../resources/mockQueryResponse');

test('Run Query asc json', async t => {
  try {
    const result = await query.runQuery('rabbit', '_dt asc', 'json');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Run Query desc text', async t => {
  try {
    const result = await query.runQuery('mole', '_dt desc', 'text');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Run Query asc default', async t => {
  try {
    const result = await query.runQuery('rabbit', '_dt asc', 'default');
    t.truthy(result);
  } catch (err) {
    console.log(err);
    t.true(false);
  }
});

test('Build facet params null', t => {
  let facets;
  let facetQueries;
  const expected = '';
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params single facet no query', t => {
  const facets = ['size_s'];
  let facetQueries;
  const expected = '&facet=true&facet.field=size_s';
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params multiple facet no query', t => {
  const facets = ['size_s', 'color_s', 'designer_s'];
  let facetQueries;
  /* eslint-disable-next-line max-len */
  const expected = '&facet=true&facet.field=size_s&facet.field=color_s&facet.field=designer_s';
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params single facet single query', t => {
  let facets;
  const facetQueries = {color_s: 'blue'};
  const expected = '&facet=true&fq=color_s:blue';
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('Build facet params multiple facet multiple query', t => {
  const facets = ['size_s', 'color_s', 'designer_s'];
  const facetQueries = {size_s: '34', color_s: 'blue', designer_s: 'pinko'};
  /* eslint-disable-next-line max-len */
  const expected = '&facet=true&facet.field=size_s&facet.field=color_s&facet.field=designer_s&fq=size_s:34&fq=color_s:blue&fq=designer_s:pinko';
  const buildFacetParams = query.buildFacetParams(facets, facetQueries);
  t.is(buildFacetParams, expected);
});

test('parseSunriseCsv one doc with facets', t => {
  console.log(mockQueryResponse);
  const response = query.parseSunriseCsv(mockQueryResponse);
  t.is(response.facets.length, 3);
  t.is(response.results.length, 10);
});

test('throws', async t => {
  const error = await t.throws(() =>
    t.context.queryInstance.run('mole', 'bad value')
  );
  t.truthy(error);
});
