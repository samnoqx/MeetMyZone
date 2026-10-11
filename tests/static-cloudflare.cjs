const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function main() {
  const source = fs.readFileSync('.open-next/worker.js', 'utf8');
  assert(!source.includes('server-functions/default'), 'Requests must not import the Next server');
  assert(source.length < 1000000, 'Worker must remain small for free CPU limits');
  const moduleFile = path.join(require('node:os').tmpdir(), `mmz-static-worker-${process.pid}.mjs`);
  fs.writeFileSync(moduleFile, source);
  const worker = (await import(pathToFileURL(moduleFile))).default;
  fs.unlinkSync(moduleFile);
  const manifest = JSON.parse(fs.readFileSync('.open-next/static-pages.json'));
  const assets = path.resolve('.open-next/assets');
  const env = { ASSETS: { async fetch(request) {
    const target = path.resolve(assets, '.' + decodeURIComponent(new URL(request.url).pathname));
    assert(target.startsWith(assets + path.sep));
    if (!fs.existsSync(target) || !fs.statSync(target).isFile()) return new Response('Missing asset', { status: 404 });
    return new Response(request.method === 'HEAD' ? null : fs.readFileSync(target), { headers: { 'Content-Type': 'application/octet-stream' } });
  } } };
  const request = (route, init, host = 'meetmyzone.com') => worker.fetch(new Request(`https://${host}${route}`, init), env);
  for (const route of ['/', '/meeting-planner', '/current-time', '/convert/est-to-ist', '/time-in/london', '/blog', '/contact-us']) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    assert.match(response.headers.get('Content-Type'), /text\/html/);
    assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff');
    assert.equal(response.headers.get('Strict-Transport-Security'), 'max-age=86400');
    assert.match(response.headers.get('Content-Security-Policy'), /object-src 'none'/);
    assert.match(response.headers.get('Content-Security-Policy'), /base-uri 'self'/);
    assert.equal(response.headers.get('X-Robots-Tag'), null, route);
    assert((await response.text()).includes('<h1'), route);
  }
  const home = await (await request('/')).text();
  assert(home.includes('ca-pub-9430236853794521'), 'AdSense ownership integration retained');
  assert(home.indexOf('id="google-consent-defaults"') > 0);
  assert(home.indexOf('id="google-consent-defaults"') < home.indexOf('src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'), 'Regional consent defaults execute before the asynchronous advertising tag');
  assert.equal((await request('/city-search/v20261011/metadata.json')).headers.get('Cache-Control'), 'public, max-age=31536000, immutable');
  assert.equal((await request('/', { method: 'HEAD' })).status, 200);
  assert.equal(await (await request('/', { method: 'HEAD' })).text(), '');
  assert.equal((await request('/', { method: 'POST' })).status, 405);
  assert.equal((await request('/not-a-valid-page')).status, 404);
  assert.equal((await request('/convert/imaginary-to-london')).status, 404);
  assert.equal((await request('/time-in/utc-plus-14-30')).status, 404);
  assert.equal((await request('/__mmz_pages/html/index.html')).status, 404);
  assert.equal((await request('/%5F%5Fmmz_pages/html/index.html')).status, 404);
  assert.equal((await request('/live-converter')).status, 404);
  assert.equal((await request('/api/og')).headers.get('Location'), 'https://meetmyzone.com/og-default.png');
  assert.equal((await request('/meeting-planner?date=2026-12-12', undefined, 'www.meetmyzone.com')).headers.get('Location'), 'https://meetmyzone.com/meeting-planner?date=2026-12-12');
  assert.equal((await request('/', undefined, 'cpu-check.workers.dev')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.equal((await request('/missing', undefined, 'cpu-check.workers.dev')).headers.get('X-Robots-Tag'), 'noindex, nofollow');
  assert.match((await request('/convert/est-to-ist', { headers: { RSC: '1' } })).headers.get('Content-Type'), /text\/x-component/);
  for (const route of ['/convert/accra-to-helsinki', '/time-in/pacific-honolulu', '/timezone/accra-to-helsinki-to-tokyo']) {
    const response = await request(route);
    assert.equal(response.status, 200, route);
    if (!manifest.routes[route]) {
      assert.equal(response.headers.get('X-Robots-Tag'), 'noindex, follow');
      assert.match((await request(route, { headers: { RSC: '1' } })).headers.get('Content-Type'), /text\/html/);
    }
  }
  for (const [route, entry] of Object.entries(manifest.routes)) {
    assert(fs.existsSync(path.join(assets, entry.html)), route);
    if (entry.flight) assert(fs.existsSync(path.join(assets, entry.flight)), route);
  }
  const { createSitemap } = require('../scripts/static-sitemap.cjs');
  const expectedSitemap = createSitemap(manifest.routes, page => fs.readFileSync(path.join(assets, page.html), 'utf8'));
  assert.equal(await (await request('/sitemap.xml')).text(), expectedSitemap, 'Every canonical indexable rendered page must be in the production sitemap');
  console.log(`Static Worker checks passed (${Object.keys(manifest.routes).length} pages, ${(source.length / 1024).toFixed(1)} KiB Worker).`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
