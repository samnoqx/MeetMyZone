const assert = require('node:assert/strict');
const { createSitemap, indexableRoutes } = require('../scripts/static-sitemap.cjs');
const page = (canonical, robots = '') => `<title>Useful time tool</title><meta name="description" content="Convert local times"><link rel="canonical" href="${canonical}"><meta name="robots" content="${robots}"><h1>Local times</h1>`;
const routes = {
  '/': { html: page('https://meetmyzone.com') },
  '/time-in/london': { html: page('https://meetmyzone.com/time-in/london') },
  '/convert/london-to-new-york': { html: page('https://meetmyzone.com/convert/london-to-new-york') },
  '/timezone/london-to-new-york': { html: page('https://meetmyzone.com/convert/london-to-new-york', 'noindex, follow') },
  '/live-clock': { html: 'Private build template' },
};
assert.deepEqual(indexableRoutes(routes, entry => entry.html), ['/', '/convert/london-to-new-york', '/time-in/london']);
const xml = createSitemap(routes, entry => entry.html);
assert.equal((xml.match(/<loc>/g) || []).length, 3);
assert.doesNotMatch(xml, /timezone\/|live-clock/);
assert.throws(() => createSitemap({ '/broken': { html: page('https://meetmyzone.com/wrong') } }, entry => entry.html), /canonical/);
assert.throws(() => createSitemap({ '/empty': { html: '<link rel="canonical" href="https://meetmyzone.com/empty">' } }, entry => entry.html), /title, description or unique heading/);
console.log('Sitemap covers canonical public pages, consolidates noindex aliases, and rejects incomplete or incorrect pages.');
