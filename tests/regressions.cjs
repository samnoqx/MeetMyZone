const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022}}).outputText, file);
const { parsePlannerList, safeZone, normalizeParams, validDate, validSnapshot } = require('../utils/planner.ts');
const { generateTimezoneMatrix, resolveTimeZone } = require('../utils/timezone.ts');
const { parseCitiesSlug } = require('../utils/seoResolver.ts');
const { escapeCalendarText, foldCalendarLine } = require('../utils/calendar.ts');
const { readSession, writeSession, removeSession } = require('../utils/storage.ts');
assert.deepEqual(parsePlannerList('["Paris, France","New York, United States"]'), ['Paris, France', 'New York, United States']);
assert.deepEqual(parsePlannerList('London,New York'), ['London', 'New York']);
assert.deepEqual(parsePlannerList(['London', 'Tokyo']), []);
assert.deepEqual(parsePlannerList(JSON.stringify(Array(17).fill('London'))), []);
assert.equal(normalizeParams({cities:['London','Paris']}).cities, undefined);
assert.equal(safeZone('unknown', 'constructor'), 'UTC');
assert.equal(typeof resolveTimeZone('constructor'), 'string');
assert.deepEqual(parseCitiesSlug('constructor-to-__proto__'), []);
assert.equal(validDate('2026-02-30'), false);
assert.equal(validDate('2026-10-10T10:00:00Z'), false);
assert.equal(validSnapshot({cities:['London'], timestamp:Date.now()}), false);
const west = generateTimezoneMatrix(['New York','London'], 'New York', 9,17,'2026-10-10', {'New York':'America/New_York', London:'Europe/London'});
assert.equal(west[0].cities['New York'].localTime24, '00:00');
const dst = generateTimezoneMatrix(['New York'], 'New York', 9,17,'2026-11-01', {'New York':'America/New_York'});
assert.notEqual(dst[0].cities['New York'].offset, dst[4].cities['New York'].offset);
assert.notEqual(dst[0].cities['New York'].offsetName, dst[4].cities['New York'].offsetName);
assert.equal(escapeCalendarText('Hello\r\nBEGIN:VEVENT,a;b\\c'), 'Hello\\nBEGIN:VEVENT\\,a\\;b\\\\c');
const long = 'SUMMARY:' + '😀'.repeat(60);
const folded = foldCalendarLine(long);
assert.equal(folded.replace(/\r\n /g,''), long);
for(const line of folded.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
global.window = {get sessionStorage(){throw new Error('Storage blocked');}};
assert.equal(readSession('x'), null);
assert.doesNotThrow(() => writeSession('x','y'));
assert.doesNotThrow(() => removeSession('x'));
console.log('Planner parsing, invalid routes, local date, ICS injection/folding and blocked storage regressions passed.');

const { generateMeetingSummary } = require('../utils/meetingSummary.ts');
const labels = ['Custom Office', 'New York'];
const mappings = {'Custom Office':'Asia/Tokyo','New York':'America/New_York'};
const meetingMatrix = generateTimezoneMatrix(labels, 'New York', 0, 23, '2027-03-20', mappings);
const summary = generateMeetingSummary(labels, meetingMatrix, '2027-03-20', 'New York', 'https://meetmyzone.com/meeting-planner');
assert.ok(summary.includes('March 20, 2027'));
assert.ok(summary.includes('Mar 20, 1:00 PM GMT+9'), summary);
assert.ok(summary.includes('Mar 20, 12:00 AM EDT'), summary);
const noOverlap = generateTimezoneMatrix(['London','Tokyo'], 'London', 9, 10, '2027-03-20');
assert.ok(generateMeetingSummary(['London','Tokyo'],noOverlap,'2027-03-20','London','https://meetmyzone.com').includes('no overlapping working hours'));
console.log('Meeting summaries preserve future dates, chosen reference cities and custom time zones.');

// Planner headings and useful links must be present before JavaScript effects run.
delete global.window;
const path = require('node:path');
const Module = require('node:module');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.join(__dirname, '..', name.slice(2)) : name, ...args);
};
require.extensions['.tsx'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: {module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true},
}).outputText, file);
try {
  const React = require('react');
  const { renderToString } = require('react-dom/server');
  const Planner = require('../app/HomeClient.tsx').default;
  const html = renderToString(React.createElement(Planner, {meetingOnly: true, initialDate: '2027-03-20'}));
  assert.match(html, /<h1[\s>]/);
  assert.ok(html.includes('meeting-guide-heading'));
  assert.ok(html.includes('Overlap Status'));
  assert.equal((html.match(/href="\/convert\//g) || []).length, 16);
  assert.ok(!html.includes('Loading meeting planner...'));
  assert.ok(!html.includes('id="world-clock"'));
  assert.match(html, /5:00 AM/);
  console.log('Server-rendered planner exposes its heading, guide, date-aware overlap and sixteen converter links without browser JavaScript.');
} finally {
  Module._resolveFilename = originalResolve;
}
