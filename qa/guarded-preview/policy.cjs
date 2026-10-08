'use strict';

// No product-source access, credentials, user data, or Production host.
const crypto = require('node:crypto');

const TARGET = 'https://niko2-atelier-combined-preview.25mochiko25.workers.dev/';

function validateTarget(input) {
  const url = new URL(input);
  if (url.href !== TARGET) throw new Error('Only the exact Combined Preview root is permitted');
  return url;
}

function hashBytes(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function attribute(tag, name) {
  const re = new RegExp('\\b' + name + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\'|([^\\s>]+))', 'i');
  const match = re.exec(tag);
  return match && (match[1] ?? match[2] ?? match[3]) || '';
}

function discoverAssets(html, base, maxAssets = 16) {
  const origin = new URL(base).origin;
  const found = new Set();
  for (const match of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
    const tag = match[0];
    const kind = match[1].toLowerCase();
    if (kind === 'link' && !/\bstylesheet\b/i.test(attribute(tag, 'rel'))) continue;
    const value = attribute(tag, kind === 'script' ? 'src' : 'href');
    if (!value || value.startsWith('data:')) continue;
    let asset;
    try { asset = new URL(value, base); } catch { continue; }
    if (asset.protocol !== 'https:' || asset.origin !== origin) continue;
    asset.hash = '';
    found.add(asset.href);
  }
  const sorted = [...found].sort();
  return { assets: sorted.slice(0, maxAssets), truncated: sorted.length > maxAssets, total: sorted.length };
}

function contentDigest(entries) {
  const hash = crypto.createHash('sha256');
  for (const [url, sum] of [...entries].sort((a, b) => a[0].localeCompare(b[0]))) {
    hash.update(url + '\n' + sum + '\n');
  }
  return hash.digest('hex');
}

function shouldRun(mode, digest, previousDigest) {
  if (!['check', 'smoke', 'full'].includes(mode)) throw new Error('Unsupported QA mode');
  if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error('Invalid digest');
  if (mode !== 'check') return true;
  return !previousDigest || previousDigest !== digest;
}

function aggregate(cases) {
  if (!cases.length) return 'UNKNOWN';
  const statuses = cases.map(x => x.status);
  if (statuses.some(s => s === 'FAIL')) return 'FAIL';
  if (statuses.some(s => s !== 'PASS')) return 'UNKNOWN';
  return 'PASS';
}

module.exports = { TARGET, validateTarget, hashBytes, attribute, discoverAssets, contentDigest, shouldRun, aggregate };
