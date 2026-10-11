import pages from '../.open-next/static-pages.json' with { type: 'json' };

const security = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

const worker = {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.meetmyzone.com' || (url.hostname === 'meetmyzone.com' && url.protocol === 'http:')) {
      url.hostname = 'meetmyzone.com'; url.protocol = 'https:';
      return Response.redirect(url.toString(), 308);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method Not Allowed', { status: 405, headers: { ...security, Allow: 'GET, HEAD' } });
    if (url.pathname === '/api/og') { url.pathname = '/og-default.png'; return Response.redirect(url.toString(), 307); }
    let path;
    try { path = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/'; } catch { return new Response('Bad Request', { status: 400, headers: security }); }
    if (path.startsWith('/__mmz_pages/') || /^\/live-(converter|clock|planner)$/.test(path)) return new Response('Not Found', { status: 404, headers: security });
    const redirect = Object.hasOwn(pages.redirects, path) ? pages.redirects[path] : undefined;
    if (redirect) { url.pathname = redirect; return Response.redirect(url.toString(), 308); }
    let page = Object.hasOwn(pages.routes, path) ? pages.routes[path] : undefined;
    let runtime = false;
    if (!page && path.length < 2048) {
      const match = /^\/(convert|time-in|timezone)\/([^/]+)$/.exec(path);
      if (match) {
        const slugs = match[1] === 'time-in' ? [match[2]] : match[1] === 'timezone' ? match[2].split(/-(?:to|vs|and)-/) : match[2].split('-to-');
        const validSlug = slug => {
          if (slug.length > 120) return false;
          const clean = slug.toLowerCase().replace(/-+/g, '-').replace(/-(time|timezone)$/, '');
          return Object.hasOwn(pages.aliases, clean);
        };
        if (slugs.length <= 16 && (match[1] !== 'convert' || slugs.length === 2) && slugs.every(validSlug)) {
          page = pages.fallback[match[1] === 'convert' ? 'converter' : match[1] === 'time-in' ? 'clock' : 'planner']; runtime = true;
        }
      }
    }
    const flight = request.headers.get('RSC') === '1';
    if (page) url.pathname = flight && !runtime && page.flight ? page.flight : page.html;
    else if (!path.startsWith('/_next/') && !/\.[a-z0-9]+$/i.test(path)) url.pathname = pages.notFound;
    url.search = '';
    const asset = await env.ASSETS.fetch(new Request(url, { method: request.method }));
    const response = new Response(request.method === 'HEAD' ? null : asset.body, asset);
    for (const [name, value] of Object.entries(security)) response.headers.set(name, value);
    if (page) {
      response.headers.set('Content-Type', flight && !runtime && page.flight ? 'text/x-component' : 'text/html; charset=utf-8');
      response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate');
      response.headers.set('Vary', 'RSC, Next-Router-Prefetch, Next-Router-State-Tree');
    }
    if (url.hostname !== 'meetmyzone.com' || runtime) response.headers.set('X-Robots-Tag', runtime ? 'noindex, follow' : 'noindex, nofollow');
    if (!page && url.pathname === pages.notFound) return new Response(response.body, { status: 404, headers: response.headers });
    return response;
  },
};
export default worker;
