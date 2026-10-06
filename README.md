# NIKO² ATELIER Browser QA

Public, read-only browser harness for testing the public NIKO² ATELIER site from the outside.

## What this repository contains

- A Playwright WebKit runner.
- Small JSON request files describing a visitor persona.
- Compact JSON results containing navigation/actions/errors and visible-state summaries.

## What this repository does NOT contain

- NIKO² ATELIER source code.
- Private specifications or design documents.
- Cloudflare credentials or other secrets.
- Uploaded screenshots or site assets.

The browser opens only approved public NIKO² ATELIER hosts and never writes to the product repository or live site.

## Default test device

- Engine: WebKit
- Viewport: 390 x 844
- Touch: enabled
- Mobile context: enabled
- Locale: ja-JP
- Fresh browser storage for each run

## Visitor personas

Suggested persona IDs:

- `first-time` — ordinary first-time visitor. Follows curiosity, not a QA checklist.
- `sloppy-mobile` — impatient mobile visitor. Fast taps, occasional double taps, abrupt scroll/back/reload.
- `wanderer` — detours, revisits, backs out, enters secondary-looking paths.
- `outside-critic` — first-time external critic. Does not invent artistic intent to excuse confusion.
- `genre-fan` — already likes exploratory / interactive web works, so notices shallowness, fake choices, repetition, and weak payoff faster.

## Triggering a run

Create a new JSON file under `requests/`.

Example:

```json
{
  "persona": "first-time",
  "target": "https://niko2-atelier-combined-preview.25mochiko25.workers.dev/",
  "seed": "first-time-001",
  "maxSteps": 18
}
```

Every new request runs in a fresh WebKit context. Results are saved under `results/` as compact JSON.

## Interpretation rule

The browser log is evidence, not the final critique. The reviewing ChatGPT instance should report only what the run actually reached. If an interaction was not performed, say it was not checked. Do not infer the Founder's intent, hidden specifications, or past implementation history.

