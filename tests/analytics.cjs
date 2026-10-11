const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const compiled = ts.transpileModule(fs.readFileSync(require.resolve('../components/AnalyticsConsent.tsx'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
function render(choice, env = {}) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    process: { env },
    require(name) {
      if (name === 'react') return { ...React, useState: () => [choice, () => {}], useEffect: () => {} };
      if (name === 'next/script') return ({ strategy, ...props }) => React.createElement('script', props);
      if (name === '@/utils/storage') return { readSession: () => null, writeSession: () => {} };
      return require(name);
    },
  });
  return renderToStaticMarkup(exports.default());
}
const allowed = render('yes');
assert.match(allowed, /gtag\/js\?id=G-W62TK5ME01/);
assert.match(allowed, /gtag\('config',"G-W62TK5ME01"/);
assert.equal((allowed.match(/googletagmanager\.com/g) || []).length, 1);
assert.equal(render('no'), '');
assert.equal(render('loading'), '');
assert.match(render(null), /Allow analytics/);
assert.doesNotMatch(render(null), /googletagmanager|gtag\('config'/);
assert.equal(render('yes', { NEXT_PUBLIC_GA_ID: '' }), '');
assert.equal(render('yes', { NEXT_PUBLIC_GA_ID: 'invalid' }), '');
assert.match(render('yes', { NEXT_PUBLIC_GA_ID: 'G-OTHER123' }), /id=G-OTHER123/);
assert.doesNotMatch(render('yes', { NEXT_PUBLIC_GA_ID: 'G-OTHER123' }), /G-W62TK5ME01/);
console.log('Analytics preserves the original property without build variables, respects consent, and supports explicit overrides.');
