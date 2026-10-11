const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const pluginPath = require.resolve('@next/eslint-plugin-next');
const { getRootDirs } = require(path.join(path.dirname(pluginPath), 'utils/get-root-dirs.js'));
const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'mmz-lint-glob-'));
try {
  for (const name of ['one', 'two', 'three']) fs.mkdirSync(path.join(temporary, name));
  fs.writeFileSync(path.join(temporary, 'not-a-directory'), '');
  const context = rootDir => ({ cwd: temporary, settings: { next: { rootDir } } });
  assert.deepEqual(getRootDirs(context(undefined)), [temporary]);
  const selected = getRootDirs(context(`${temporary}/{one,two}`)).map(value => path.basename(value)).sort();
  assert.deepEqual(selected, ['one', 'two']);
  assert.equal(getRootDirs(context(`${temporary}/*`)).length, 3, 'Only directory roots are returned');
  assert.equal(getRootDirs(context([`${temporary}/one`, `${temporary}/two`])).length, 2);
  console.log('Actual Next lint plugin preserves directory-glob matching with the security override.');
} finally { fs.rmSync(temporary, { recursive: true, force: true }); }
