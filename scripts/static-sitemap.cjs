const BASE = 'https://meetmyzone.com';

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(["'])(.*?)\2/g)].map(match => [match[1].toLowerCase(), match[3]]));
}

function indexableRoutes(routes, readHtml) {
  const result = [];
  for (const [route, page] of Object.entries(routes)) {
    if (/^\/(?:live-|__mmz_pages|_next|api\/)/.test(route)) continue;
    const html = readHtml(page);
    const metas = [...html.matchAll(/<meta\b[^>]*>/gi)].map(match => attributes(match[0]));
    if (metas.some(meta => ['robots', 'googlebot'].includes(meta.name?.toLowerCase()) && /\bnoindex\b/i.test(meta.content || ''))) continue;
    const canonical = [...html.matchAll(/<link\b[^>]*>/gi)].map(match => attributes(match[0])).find(link => link.rel === 'canonical')?.href;
    const expected = BASE + (route === '/' ? '' : route);
    if (canonical !== expected) throw new Error(`Indexable page has an incorrect canonical: ${route}`);
    if (!/<title>[^<]+<\/title>/i.test(html) || !metas.some(meta => meta.name === 'description' && meta.content?.trim()) || (html.match(/<h1\b/gi) || []).length !== 1) {
      throw new Error(`Indexable page is missing its title, description or unique heading: ${route}`);
    }
    result.push(route);
  }
  return result.sort();
}

function createSitemap(routes, readHtml) {
  const eligible = indexableRoutes(routes, readHtml);
  const escape = value => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    eligible.map(route => `  <url><loc>${escape(BASE + (route === '/' ? '' : route))}</loc></url>`).join('\n') + '\n</urlset>\n';
}

module.exports = { indexableRoutes, createSitemap };
