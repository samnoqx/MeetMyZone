const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const moduleCache = new Map();
let calls = [];
let networkFails = false;
function loadModule(filename) {
  filename = path.resolve(filename);
  if (moduleCache.has(filename)) return moduleCache.get(filename);
  const exports = {};
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  }).outputText;
  moduleCache.set(filename, exports);
  vm.runInNewContext(compiled, {
    exports, console, Intl, Date, URL, AbortController, setTimeout, clearTimeout,
    fetch: async url => {
      assert.match(url, /^\/city-search\/v20261011\/[\w.-]+\.json$/);
      calls.push(url);
      if (networkFails) throw new Error('Offline');
      return { ok: true, json: async () => JSON.parse(fs.readFileSync(path.join(root, 'public', url))) };
    },
    require(name) {
      if (name.startsWith('.')) return loadModule(path.resolve(path.dirname(filename), name + '.ts'));
      if (name.startsWith('@/')) return loadModule(path.join(root, name.slice(2) + '.ts'));
      return require(name);
    },
  }, { filename });
  return exports;
}
async function main() {
  const { searchCities, citySearchBucket } = loadModule(path.join(root, 'utils/citySearch.ts'));
  const catalog = JSON.parse(fs.readFileSync(path.join(root, 'public/city-search/v20261011/metadata.json')));
  assert(catalog.cityCount > 170000);
  assert.match(catalog.license, /creativecommons.org\/licenses\/by\/4.0/);
  for (const zone of catalog.zones) assert.doesNotThrow(() => new Intl.DateTimeFormat('en', { timeZone: zone }));
  for (const [query, name, timezone] of [
    ['London', 'London', 'Europe/London'], ['Mumbai', 'Mumbai', 'Asia/Kolkata'],
    ['Bombay', 'Mumbai', 'Asia/Kolkata'], ['Kathmandu', 'Kathmandu', 'Asia/Kathmandu'],
    ['São Paulo', 'São Paulo', 'America/Sao_Paulo'], ['Tokyo', 'Tokyo', 'Asia/Tokyo'],
    ['東京', 'Tokyo', 'Asia/Tokyo'], ['Paris', 'Paris', 'Europe/Paris'],
    ['Honolulu', 'Honolulu', 'Pacific/Honolulu'], ['Bhopal', 'Bhopal', 'Asia/Kolkata'],
  ]) {
    const results = await searchCities(query);
    assert(results.some(item => item.name === name && item.timezone === timezone), `${query}: ${JSON.stringify(results)}`);
  }
  assert.equal((await searchCities('definitely-not-a-real-city-zzzzzz')).length, 0, 'Unknown locations must never silently become UTC');
  assert.equal((await searchCities('UTC+05:30'))[0].timezone, 'UTC+05:30');
  assert((await searchCities('London, Canada')).some(item => item.timezone === 'America/Toronto'));
  assert((await searchCities('UTC')).some(item => item.timezone === 'UTC'));
  assert((await searchCities('America/New_York')).some(item => item.timezone === 'America/New_York'));
  const before = calls.length;
  await searchCities('Londo');
  await searchCities('London');
  assert.equal(calls.length, before, 'Queries sharing a search shard reuse its cached data');
  const controller = new AbortController(); controller.abort();
  assert.equal((await searchCities('London', 6, controller.signal)).length, 0);
  // The stored keys and their Unicode hash must agree for all generated search assets.
  for (const shard of catalog.shards) {
    const rows = JSON.parse(fs.readFileSync(path.join(root, 'public/city-search/v20261011', shard + '.json')));
    for (const [, admin, country, zone, names] of rows) {
      assert(catalog.admins[admin] !== undefined && catalog.countries[country] && catalog.zones[zone]);
      for (const key of names) assert.equal(citySearchBucket(key), shard, key);
    }
  }
  networkFails = true;
  assert((await searchCities('Kolkata')).some(item => item.timezone === 'Asia/Kolkata'), 'Built-in city/zone fallback survives network failures');
  console.log('Global city aliases, exact timezone accuracy, unknown names, Unicode sharding, caching and cancellation passed.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
