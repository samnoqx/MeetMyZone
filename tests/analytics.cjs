const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

const compiled = ts.transpileModule(fs.readFileSync(require.resolve('../components/Analytics.tsx'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;
function render(env = {}) {
  const exports = {};
  vm.runInNewContext(compiled, {
    exports,
    process: { env },
    require(name) {
      if (name === 'next/script') return props => {
        const attributes = { ...props };
        delete attributes.strategy;
        return React.createElement('script', attributes);
      };
      return require(name);
    },
  });
  return renderToStaticMarkup(exports.default());
}
const allowed = render();
assert.match(allowed, /gtag\/js\?id=G-W62TK5ME01/);
assert.match(allowed, /gtag\('config',"G-W62TK5ME01"/);
assert.equal((allowed.match(/googletagmanager\.com/g) || []).length, 1);
assert.doesNotMatch(allowed, /Allow analytics|Decline|Analytics preferences/);
assert.equal(render({ NEXT_PUBLIC_GA_ID: '' }), '');
assert.equal(render({ NEXT_PUBLIC_GA_ID: 'invalid' }), '');
assert.match(render({ NEXT_PUBLIC_GA_ID: 'G-OTHER123' }), /id=G-OTHER123/);
assert.doesNotMatch(render({ NEXT_PUBLIC_GA_ID: 'G-OTHER123' }), /G-W62TK5ME01/);
console.log('Automatic analytics uses the original property, needs no choice or storage, and supports explicit overrides.');
