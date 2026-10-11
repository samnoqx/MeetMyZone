const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/googleConsent.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, { exports: exportsObject });
const window = { dataLayer: [] };
vm.runInNewContext(exportsObject.GOOGLE_CONSENT_BOOTSTRAP, { window });
assert.equal(window.dataLayer.length, 1);
const [command, action, defaults] = window.dataLayer[0];
assert.equal(command, 'consent'); assert.equal(action, 'default');
for (const purpose of ['ad_storage', 'analytics_storage', 'ad_user_data', 'ad_personalization']) assert.equal(defaults[purpose], 'denied');
assert.equal(defaults.region.length, 32);
for (const region of ['GB', 'CH', 'DE', 'FR', 'IS', 'NO', 'LI']) assert(defaults.region.includes(region));
for (const region of ['IN', 'US', 'CA', 'AU']) assert(!defaults.region.includes(region), 'Automatic collection outside the specified region must remain unaffected');
assert.equal(defaults.wait_for_update, 500);
const existing = { dataLayer: ['existing'] };
vm.runInNewContext(exportsObject.GOOGLE_CONSENT_BOOTSTRAP, { window: existing });
assert.equal(existing.dataLayer[0], 'existing');
existing.gtag('config', 'G-W62TK5ME01');
assert.equal(existing.dataLayer[2][1], 'G-W62TK5ME01');
console.log('Consent defaults cover all 32 EEA/UK/Swiss countries, precede configuration, and preserve the existing queue/property.');
// Exercise the real production layout: React can hoist async scripts ahead of
// inline consent defaults even when the source JSX has the expected order.
const layoutExports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('app/layout.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText, {
  exports: layoutExports, URL, process: { env: { NODE_ENV: 'production' } },
  require(name) {
    if (name === './globals.css') return {};
    if (name === '@/utils/googleConsent') return exportsObject;
    if (name === '@/components/Footer' || name === '@/components/Analytics') return { default: () => null };
    return require(name);
  },
});
const html = require('react-dom/server').renderToStaticMarkup(layoutExports.default({ children: 'Test page' }));
const defaultsIndex = html.indexOf('id="google-consent-defaults"');
const adsIndex = html.indexOf('src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
assert(defaultsIndex >= 0 && adsIndex === -1, 'The synchronous defaults must render before the deferred AdSense loader can execute');
const layout = layoutExports.default({ children: 'Test page' });
const head = require('react').Children.toArray(layout.props.children).find(e => e.type === 'head');
const adsLoader = require('react').Children.toArray(head.props.children).find(e => e.props.id === 'google-adsense');
assert.equal(adsLoader.type, require('next/script').default);
assert.equal(adsLoader.props.strategy, 'afterInteractive');
assert.equal(adsLoader.props.src, 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9430236853794521');
assert.equal(adsLoader.props.crossOrigin, 'anonymous');
assert(html.includes('name="google-adsense-account" content="ca-pub-9430236853794521"'), 'Server-rendered AdSense ownership verification retained');
console.log('Actual production layout renders synchronous consent defaults and retains ownership verification; Next loads AdSense once after hydration.');
// Exercise Google's asynchronous consent API and the actual React control.
let available = false;
const effects = [];
const consentWindow = {};
const componentExports = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/PrivacyChoices.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX },
}).outputText, {
  exports: componentExports, window: consentWindow,
  require(name) {
    if (name === 'react') return { useState: () => [available, next => { available = next; }], useEffect: effect => effects.push(effect) };
    return require(name);
  },
});
assert.equal(componentExports.default(), null, 'Do not add an irrelevant global privacy prompt');
const cleanup = effects[0]();
let listener, revoked = 0, removed = 0;
consentWindow.__tcfapi = (command, version, callback, id) => {
  assert.equal(version, 2);
  if (command === 'addEventListener') listener = callback;
  else { assert.equal(command, 'removeEventListener'); assert.equal(id, 42); removed++; }
};
consentWindow.googlefc.showRevocationMessage = () => revoked++;
consentWindow.googlefc.callbackQueue[0].CONSENT_API_READY();
listener({ gdprApplies: false, listenerId: 42 }, true);
assert.equal(componentExports.default(), null);
listener({ gdprApplies: true, listenerId: 42 }, true);
const button = componentExports.default();
assert.equal(button.props.type, 'button');
button.props.onClick();
assert.equal(revoked, 0, 'Invoke the Google API through its readiness queue');
consentWindow.googlefc.callbackQueue.at(-1).CONSENT_API_READY();
assert.equal(revoked, 1);
cleanup(); assert.equal(removed, 1);
listener({ gdprApplies: false, listenerId: 42 }, true);
assert.equal(available, true, 'Late callbacks must not update an unmounted control');
console.log('Regional privacy control respects Google consent status, revokes through its readiness API, and cleans up its listener.');
