// Render on the build machine, then serve the same HTML and client bundles as
// assets. Requests must not boot Next's server inside a 10 ms free Worker.
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');
const { spawn } = require('node:child_process');
const esbuild = require('esbuild');
const root = process.cwd();
const assets = path.join(root, '.open-next/assets');
const app = path.join(root, '.next/server/app');
const manifest = { routes: {}, redirects: {}, aliases: {}, fallback: {}, notFound: '/__mmz_pages/not-found.html' };
const queue = new Set(['/meeting-planner']);
for (const match of fs.readFileSync('lib/meetingGuides.ts', 'utf8').matchAll(/slug: '([^']+)'/g)) queue.add(`/meeting-planner/${match[1]}`);
for (const match of fs.readFileSync('app/timezone/[cities]/page.tsx', 'utf8').matchAll(/cities: '([^']+)'/g)) queue.add(`/timezone/${match[1]}`);
const hidden = /^\/live-(converter|clock|planner)$/;

function save(route, html, flight, discover = true) {
  const stem = route === '/' ? 'index' : route.slice(1);
  const entry = { html: `/__mmz_pages/html/${stem}.html` };
  if (flight) entry.flight = `/__mmz_pages/flight/${stem}.rsc`;
  for (const [file, content] of [[entry.html, html], [entry.flight, flight]]) {
    if (!file) continue;
    const target = path.join(assets, file);
    fs.mkdirSync(path.dirname(target), { recursive: true }); fs.writeFileSync(target, content);
  }
  if (hidden.test(route)) manifest.fallback[route.slice(6)] = entry;
  else manifest.routes[route] = entry;
  for (const match of discover ? html.toString().matchAll(/href="([^"#]+)"/g) : []) {
    const href = match[1].replace(/&amp;/g, '&');
    if (!href.startsWith('/') && !href.startsWith('https://meetmyzone.com/')) continue;
    const target = new URL(href, 'https://meetmyzone.com').pathname.replace(/\/$/, '') || '/';
    if (/^\/(convert|timezone|time-in|meeting-planner)(\/|$)/.test(target)) queue.add(target);
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name.endsWith('.html')) {
      const name = path.relative(app, file).replace(/\.html$/, '').replaceAll(path.sep, '/');
      if (name.startsWith('_')) continue;
      const flight = file.replace(/\.html$/, '.rsc');
      save(name === 'index' ? '/' : `/${name}`, fs.readFileSync(file), fs.existsSync(flight) ? fs.readFileSync(flight) : null);
    }
  }
}

async function main() {
  fs.rmSync(path.join(assets, '__mmz_pages'), { recursive: true, force: true });
  walk(app);
  fs.copyFileSync(path.join(app, '_not-found.html'), path.join(assets, manifest.notFound));
  for (const name of ['robots.txt', 'sitemap.xml', 'favicon.ico', 'icon.png']) {
    const body = path.join(app, `${name}.body`);
    if (fs.existsSync(body)) fs.copyFileSync(body, path.join(assets, name));
  }
  for (const redirect of JSON.parse(fs.readFileSync('.next/routes-manifest.json')).redirects) {
    if (!redirect.has?.length && !redirect.source.includes(':')) manifest.redirects[redirect.source] = redirect.destination;
  }
  const port = await new Promise(resolve => {
    const socket = net.createServer(); socket.listen(0, '127.0.0.1', () => { const port = socket.address().port; socket.close(() => resolve(port)); });
  });
  const log = fs.openSync('/tmp/mmz-static-render.log', 'w');
  const server = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {
    cwd: root, env: { ...process.env, MMZ_DISABLE_DIRECTORY_LOCK: '1' }, stdio: ['ignore', log, log],
  });
  const cancel = () => { server.kill('SIGTERM'); process.exit(130); };
  process.once('SIGINT', cancel); process.once('SIGTERM', cancel);
  try {
    const origin = `http://127.0.0.1:${port}`;
    let ready = false;
    for (let attempt = 0; attempt < 100; attempt++) {
      if (server.exitCode !== null) throw new Error('Build render server exited; see /tmp/mmz-static-render.log');
      try { const response = await fetch(origin, { signal: AbortSignal.timeout(1500) }); if (response.ok) { ready = true; break; } } catch {}
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    if (!ready) throw new Error('Build render server did not start');
    for (const route of queue) {
      if (manifest.routes[route] || manifest.redirects[route]) continue;
      if (Object.keys(manifest.routes).length > 4500) throw new Error('Page asset safety limit exceeded');
      const response = await fetch(origin + route, { redirect: 'manual', signal: AbortSignal.timeout(30000) });
      if (!response.ok) throw new Error(`Internal route failed during build: ${route} (${response.status})`);
      const html = await response.text();
      const flight = await fetch(origin + route, { headers: { RSC: '1' }, signal: AbortSignal.timeout(30000) });
      if (!flight.ok || !flight.headers.get('content-type')?.includes('text/x-component')) throw new Error(`Missing navigation payload: ${route}`);
      // Build the curated pages and their direct links once. Unbounded pairwise
      // expansion would waste build time and exceed the free asset allowance.
      save(route, html, await flight.text(), false);
    }
  } finally {
    process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel);
    server.kill('SIGTERM');
    await new Promise(resolve => { if (server.exitCode !== null) resolve(); else { server.once('exit', resolve); setTimeout(() => { server.kill('SIGKILL'); resolve(); }, 3000).unref(); } });
    fs.closeSync(log);
  }
  // Resolve route aliases at build time, never load Luxon/Intl into the Worker.
  const modules = await esbuild.build({ entryPoints: ['utils/seoResolver.ts'], bundle: true, platform: 'node', format: 'cjs', write: false });
  const resolver = new (require('node:module'))(path.join(root, 'utils/seoResolver.cjs')); resolver.paths = module.paths; resolver._compile(modules.outputFiles[0].text, path.join(root, 'utils/seoResolver.cjs'));
  const zoneBuild = await esbuild.build({ entryPoints: ['utils/timezone.ts'], bundle: true, platform: 'node', format: 'cjs', write: false });
  const zones = new (require('node:module'))(path.join(root, 'utils/timezone.cjs')); zones.paths = module.paths; zones._compile(zoneBuild.outputFiles[0].text, path.join(root, 'utils/timezone.cjs'));
  const candidates = new Set(Object.keys(resolver.exports.TIMEZONE_ABBR_MAP));
  for (const city of Object.keys(zones.exports.CITY_TO_ZONE)) candidates.add(city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-'));
  for (const zone of zones.exports.ALL_IANA_ZONES) {
    candidates.add(zone.toLowerCase().replaceAll('/', '-').replaceAll('_', '-'));
    candidates.add(zone.split('/').pop().toLowerCase().replaceAll('_', '-'));
  }
  for (const sign of ['plus', 'minus']) for (let hour = 0; hour <= 14; hour++) for (const minute of ['', '-30', '-45']) candidates.add(`utc-${sign}-${hour}${minute}`);
  for (const slug of candidates) if (resolver.exports.resolveSlug(slug)) manifest.aliases[slug] = true;
  for (const kind of ['converter', 'clock', 'planner']) if (!manifest.fallback[kind]) throw new Error(`Missing runtime template ${kind}`);
  fs.writeFileSync('.open-next/static-pages.json', JSON.stringify(manifest));
  await esbuild.build({ entryPoints: ['cloudflare/static-worker.mjs'], outfile: '.open-next/worker.js', bundle: true, platform: 'browser', target: 'es2022', format: 'esm', minify: true });
  console.log(`Asset renderer: ${Object.keys(manifest.routes).length} pages; ${Object.keys(manifest.aliases).length} timezone aliases. Build server stopped.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
