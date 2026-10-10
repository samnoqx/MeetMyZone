const fs = require('node:fs');
const path = require('node:path');

// OpenNext 1.20.10 omits Next 16.4's preview-props.json from its manifest
// inlining glob. Workers cannot read this file at runtime, so include its real
// build contents using the adapter's existing manifest inlining implementation.
const adapterRoot = path.resolve(path.dirname(require.resolve('@opennextjs/cloudflare')), '../..');
const plugin = path.join(adapterRoot, 'dist/cli/build/patches/plugins/load-manifest.js');
const original = '**/{*-manifest,required-server-files,prefetch-hints}.json';
const corrected = '**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json';
const contents = fs.readFileSync(plugin, 'utf8');

if (contents.includes(corrected)) {
  console.log('OpenNext preview manifest compatibility fix already applied.');
} else {
  if (contents.split(original).length !== 2) {
    throw new Error('OpenNext manifest implementation changed; review the preview manifest fix before building.');
  }
  fs.writeFileSync(plugin, contents.replace(original, corrected));
  console.log('OpenNext will inline Next.js preview props in the Cloudflare Worker.');
}
