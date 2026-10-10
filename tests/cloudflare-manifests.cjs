const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { isDeepStrictEqual } = require('node:util');
const { parse, Lang } = require('@ast-grep/napi');

// Execute the loader from the actual generated Worker, rather than checking
// source strings: required-server-files can mention a file without inlining it.
const output = path.join(__dirname, '..', '.open-next/server-functions/default');
const root = parse(Lang.JavaScript, fs.readFileSync(path.join(output, 'handler.mjs'), 'utf8')).root();
const loader = root.find({
  rule: { kind: 'function_declaration', has: { field: 'name', regex: '^loadManifest$' } },
});
assert.ok(loader, 'Generated Worker manifest loader is missing');
const loadManifest = vm.runInNewContext(`(${loader.text()})`, {
  process: { env: { NEXT_BUILD_ID: 'manifest-regression-check' } },
  sharedCache: new Map(),
});

for (const file of ['server/preview-props.json', 'prerender-manifest.json', 'routes-manifest.json']) {
  const expected = JSON.parse(fs.readFileSync(path.join(output, '.next', file), 'utf8'));
  const actual = loadManifest(`/.next/${file}`);
  assert.ok(isDeepStrictEqual(JSON.parse(JSON.stringify(actual)), expected), `Worker must inline ${file}`);
}
assert.equal(loadManifest('/.next/BUILD_ID'), 'manifest-regression-check');
assert.throws(() => loadManifest('/.next/server/unexpected.json'), /Unexpected loadManifest/);
console.log('Generated Worker loads preview props and required routing manifests without filesystem access.');
