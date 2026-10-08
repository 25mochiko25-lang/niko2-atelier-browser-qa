'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {
  TARGET, validateTarget, hashBytes, attribute, discoverAssets,
  contentDigest, shouldRun, aggregate
} = require('./policy.cjs');

test('fingerprint target cannot be redirected to Production, another host, or another path', () => {
  assert.equal(validateTarget(TARGET).href, TARGET);
  for (const input of ['https://niko2atelier.com/', 'http://niko2-atelier-combined-preview.25mochiko25.workers.dev/',
    TARGET + 'api/', 'https://example.com/', TARGET + '?debug=true']) {
    assert.throws(() => validateTarget(input));
  }
});
test('resource discovery includes same-origin JS/CSS only', () => {
  const html = '<script src="/app.js"></script><link rel="stylesheet" href="/site.css">' +
    '<script src="https://evil.example/tracker.js"></script><link rel="icon" href="/icon.png">' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=x">';
  const found = discoverAssets(html, TARGET);
  assert.deepEqual(found.assets, [
    new URL('/app.js', TARGET).href,
    new URL('/site.css', TARGET).href
  ]);
  assert.equal(found.truncated, false);
});
test('resource count beyond cap is explicitly incomplete', () => {
  const html = Array.from({ length: 20 }, (_, i) => '<script src="/s' + i + '.js"></script>').join('');
  const found = discoverAssets(html, TARGET, 4);
  assert.equal(found.truncated, true);
  assert.equal(found.assets.length, 4);
  assert.equal(found.total, 20);
});
test('asset hash changes change the site fingerprint even when root HTML is identical', () => {
  const root = hashBytes(Buffer.from('unchanged html'));
  const before = contentDigest([[TARGET, root], [TARGET + 'app.js', hashBytes(Buffer.from('old'))]]);
  const after = contentDigest([[TARGET, root], [TARGET + 'app.js', hashBytes(Buffer.from('new'))]]);
  assert.notEqual(before, after);
});
test('fingerprint ordering is stable', () => {
  const a = contentDigest([['a', '1'], ['b', '2']]);
  assert.equal(a, contentDigest([['b', '2'], ['a', '1']]));
});
test('unchanged previews skip the expensive browser job only in automatic check mode', () => {
  const digest = hashBytes(Buffer.from('v1'));
  assert.equal(shouldRun('check', digest, digest), false);
  assert.equal(shouldRun('check', digest, null), true);
  assert.equal(shouldRun('smoke', digest, digest), true);
  assert.equal(shouldRun('full', digest, digest), true);
  assert.throws(() => shouldRun('check', 'invalid', digest));
});
test('no evidence or any unknown is never reported as PASS', () => {
  assert.equal(aggregate([]), 'UNKNOWN');
  assert.equal(aggregate([{ status: 'PASS' }, { status: 'UNKNOWN' }]), 'UNKNOWN');
  assert.equal(aggregate([{ status: 'PASS' }, { status: 'FAIL' }]), 'FAIL');
  assert.equal(aggregate([{ status: 'PASS' }, { status: 'PASS' }]), 'PASS');
});
test('HTML attribute parser tolerates single and double quotes', () => {
  assert.equal(attribute('<script src="/one.js">', 'src'), '/one.js');
  assert.equal(attribute("<script src='/two.js'>", 'src'), '/two.js');
  assert.equal(attribute('<link REL="stylesheet" href=/three.css>', 'href'), '/three.css');
});
