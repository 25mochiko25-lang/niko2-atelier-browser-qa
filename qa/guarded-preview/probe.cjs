'use strict';

// Public, read-only Combined Preview fingerprint. Never inspect a private repo
// or make a request to Production or to a write endpoint.
const fs = require('node:fs');
const path = require('node:path');
const { TARGET, validateTarget, hashBytes, discoverAssets, contentDigest, shouldRun } = require('./policy.cjs');

const MAX_HTML = 8 * 1024 * 1024;
const MAX_ASSET = 5 * 1024 * 1024;
const MAX_TOTAL = 24 * 1024 * 1024;
const OUT = 'qa-output/probe.json';
const CACHE = '.qa-state/last.json';

async function getBytes(uri, ceiling) {
  const target = validateTarget(TARGET);
  const u = new URL(uri);
  if (u.origin !== target.origin || u.protocol !== 'https:') throw new Error('Cross-origin fingerprint fetch refused');
  const res = await fetch(u.href, {
    method: 'GET',
    redirect: 'manual',
    signal: AbortSignal.timeout(15000),
    headers: { 'Cache-Control': 'no-cache', 'Accept': '*/*' }
  });
  if (!res.ok || res.status >= 300) throw new Error('Preview resource returned HTTP ' + res.status + ': ' + u.pathname);
  const size = Number(res.headers.get('content-length') || 0);
  if (size > ceiling) throw new Error('Fingerprint resource exceeds limit: ' + u.pathname);
  const chunks = [];
  let total = 0;
  if (!res.body) throw new Error('Empty network body for ' + u.pathname);
  for await (const chunk of res.body) {
    total += chunk.length;
    if (total > ceiling) {
      await res.body.cancel().catch(() => {});
      throw new Error('Resource streaming limit exceeded: ' + u.pathname);
    }
    chunks.push(Buffer.from(chunk));
  }
  if (!total) throw new Error('Empty resource: ' + u.pathname);
  return Buffer.concat(chunks, total);
}

async function main() {
  const target = validateTarget(process.env.TARGET || TARGET);
  const mode = process.env.MODE || 'check';
  if (!['check', 'smoke', 'full'].includes(mode)) throw new Error('Unsupported mode');
  const htmlBuffer = await getBytes(target.href, MAX_HTML);
  const discovered = discoverAssets(htmlBuffer.toString('utf8'), target.href);
  if (discovered.truncated) throw new Error('More than 16 same-origin JS/CSS assets: fingerprint is incomplete');
  const entries = [[target.href, hashBytes(htmlBuffer)]];
  let bytes = htmlBuffer.length;
  for (const uri of discovered.assets) {
    const buffer = await getBytes(uri, MAX_ASSET);
    bytes += buffer.length;
    if (bytes > MAX_TOTAL) throw new Error('Fingerprint download budget exceeded');
    entries.push([uri, hashBytes(buffer)]);
  }
  const digest = contentDigest(entries);
  let previous = null;
  try { previous = JSON.parse(fs.readFileSync(CACHE, 'utf8')); } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
  const changed = !previous || previous.digest !== digest;
  const runBrowser = shouldRun(mode, digest, previous && previous.digest);
  const current = {
    target: target.href,
    digest,
    changed,
    previousDigest: previous && previous.digest || null,
    mode,
    runBrowser,
    observedAt: new Date().toISOString(),
    count: entries.length,
    bytes,
    coverage: 'HTML and up to 16 same-origin linked JS/CSS assets only'
  };
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify(current, null, 2) + '\n');
  // The next run may restore this tiny record from GitHub's short-lived cache.
  fs.writeFileSync(CACHE, JSON.stringify({ target: target.href, digest, observedAt: current.observedAt }) + '\n');
  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, 'changed=' + String(changed) + '\n' + 'run_browser=' + String(runBrowser) + '\n' + 'digest=' + digest + '\n');
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, '### Combined Preview fingerprint\n' +
      '- Digest: ' + digest + '\n- Changed since cached run: ' + changed +
      '\n- Run browser smoke: ' + runBrowser + '\n- Downloaded: ' + bytes +
      ' bytes across ' + entries.length + ' resources\n- Not a source SHA, release attestation, or full visual/rights audit.\n\n');
  }
  console.log(JSON.stringify({ status: runBrowser ? 'SMOKE_REQUESTED' : 'UNCHANGED_SKIP', changed, digest, resources: entries.length, bytes, mode }));
}

main().catch(err => {
  fs.mkdirSync('qa-output', { recursive: true });
  fs.writeFileSync('qa-output/probe-error.json', JSON.stringify({ status: 'UNKNOWN', error: String(err), at: new Date().toISOString() }, null, 2));
  console.error('Preview probe UNKNOWN: ' + String(err));
  process.exitCode = 2;
});
