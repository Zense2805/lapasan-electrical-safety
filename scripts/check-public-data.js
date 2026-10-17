// Run before publishing: node scripts/check-public-data.js
// Lightweight PUBLIC release guardrail, not a replacement for manual privacy review.
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
let failures = 0;
function fail(message) { console.error('FAIL:', message); failures += 1; }
function pass(message) { console.log('OK:', message); }
let doc;
try { doc = JSON.parse(fs.readFileSync(path.join(root, 'data/public-map.json'), 'utf8')); }
catch (e) { fail('Map manifest unreadable/invalid JSON: ' + e.message); process.exit(1); }
const forbiddenKeys = /(^|_)(name|email|telephone|phone|mobile|address|household_id|respondent|latitude|longitude|gps|coordinate|consent_log|dob|birthdate|photo|record_id)($|_)/i;
function inspect(value, place) {
  if (!value || typeof value !== 'object') return;
  for (const [key, field] of Object.entries(value)) {
    if (forbiddenKeys.test(key)) fail('Suspicious sensitive field in ' + place + ': ' + key);
    if (field && typeof field === 'object') inspect(field, place + '/' + key);
  }
}
inspect(doc, 'public-map.json');
if (!['pending', 'published'].includes(doc.status)) fail('status must be pending or published.');
if (typeof doc.reviewed !== 'boolean') fail('reviewed must be boolean.');
if (!Array.isArray(doc.zones)) fail('zones must be an array.');
if (!Number.isInteger(doc.minimumZoneResponses) || doc.minimumZoneResponses < 10) fail('minimumZoneResponses must be integer >=10 (partner privacy review still required).');
if (doc.status === 'pending') {
  if (doc.reviewed || doc.zones.length > 0 || doc.mapImageUrl) fail('Pending status should not contain public findings or a reviewed map.');
  else pass('Pending view contains no results.');
} else {
  if (doc.reviewed !== true) fail('A published dataset must be reviewed.');
  if (!/^assets\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp|svg)$/i.test(doc.mapImageUrl) || doc.mapImageUrl.includes('..')) fail('Map image path invalid.');
  else if (!fs.existsSync(path.join(root, doc.mapImageUrl))) fail('Map image does not exist.');
  if (doc.zones.some(z => !z || typeof z.zone !== 'string' || z.zone.length > 80 || !Number.isInteger(z.responses) || z.responses < doc.minimumZoneResponses || !['High','Moderate','Lower','Unclassified'].includes(z.priority))) fail('Invalid zone or insufficient aggregate count.');
  if (!failures) pass('Map manifest passes basic schema/count checks. You MUST still inspect the map image and data manually.');
}
const forbiddenFileExtensions = new Set(['.xlsx','.xls','.sqlite','.db','.kdbx','.pem','.key']);
function walk(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes:true })) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) walk(full);
    else if (forbiddenFileExtensions.has(path.extname(item.name).toLowerCase())) fail('Unexpected private/binary file in public package: ' + path.relative(root,full));
  }
}
walk(root);
if (failures) { console.error('FAILED with '+failures+' item(s).'); process.exit(1); }
console.log('Public data quick-check passed. Manual privacy and partner review remain mandatory.');
