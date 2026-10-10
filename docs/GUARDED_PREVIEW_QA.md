# NIKO² ATELIER — cost-guarded Combined Preview QA

Status: **adopted on this QA repository's `main`** in [commit `6ae3e12`](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/commit/6ae3e12f3382c826223d3f03018b8f33bce661d8) on 2026-10-08. The existing [.github/workflows/guarded-preview-qa.yml](../.github/workflows/guarded-preview-qa.yml) is scheduled once per day at 14:43 UTC (23:43 Asia/Tokyo); GitHub may start a scheduled run later. Related product context: [Issue #24](https://github.com/25mochiko25-lang/niko2-atelier/issues/24), [PR #25](https://github.com/25mochiko25-lang/niko2-atelier/pull/25).

## What this actually does

The existing workflow is separate from interactive visitor observation. It checks the public **Combined Preview** HTML and up to 16 same-origin linked JS/CSS files once per day (23:43 JST) or on an explicitly selected workflow dispatch. Reuse this workflow rather than adding a second daily watcher. It compares the byte fingerprint against a short-lived GitHub Actions cache.

| Event | Behavior |
| --- | --- |
| Same digest + last smoke PASS | Skip browser job. One light network probe only. |
| Same digest + last FAIL/UNKNOWN | Preserve failure, exit nonzero without expensive repeated browsers. Manual recheck can override. |
| Changed digest or first observation | Run a bounded browser smoke. |
| Explicit mode smoke/full | Rerun even if digest is unchanged. |
| Fingerprint inaccessible, incomplete, oversized | UNKNOWN/FAIL job, not a false PASS. |
| Security/rights finding from other review | Separate urgent stop; never auto-approve a release. |

Profiles: touch-enabled mobile WebKit 430×932 / 390×844; touch-enabled Chromium 390×844; desktop Chromium and desktop WebKit 1440×900. Full manual mode adds Firefox desktop and a narrow Chromium mobile viewport. These are **browser simulations**, not physical Android/iPhone devices.

Current smoke scope is **Home entry -> Intro -> Garden** using browser-issued coordinate taps/clicks, plus page errors and overflow diagnostics. The probed delivered bytes are rechecked immediately before and after the browser run; if the public Preview changes in between, the run cannot establish PASS for the original fingerprint. The exact Garden route is required for a PASS. Missing selectors, intercepted requests, missing proof, blocked site writes or uncertain state become UNKNOWN/FAIL rather than imagined success. All POST/PUT/PATCH/DELETE requests are blocked by the test harness. The current script **does not** prove Diary finger swipes, long-lived saves, Hotel, rights, Contact delivery, Cloudflare bindings, audio, every map, or source-SHA matching.

**Important:** The existing live observer's mobile scroll uses wheel input; that is *not* a real WebKit finger swipe. Do not call it a passed touch gesture. A full automated physical iPhone gesture test is not available in this change.

## Billing, storage, permissions

- Public GitHub repository, standard Linux hosted runners only; no AWS Device Farm, paid runner, AI API, paid subscription, or change to billing settings.
- Probe job is Node-only. The browser image/container launches only when a new digest needs checking or on a forced manual run.
- Bounded: HTML <=8 MiB; each asset <=5 MiB; entire fingerprint <=24 MiB; 16 linked assets maximum. Job timeouts: probe 6 minutes, browser 15 minutes.
- Cache contains only a tiny digest and PASS/FAIL/UNKNOWN, never site data, credentials, screenshots, Contact submissions or internal documents. The verdict is saved by an Ubuntu **host** finalize job so the next Ubuntu probe can restore it; saving it inside a Playwright container gave an incompatible cache identity in the initial isolated trial. Cache is ephemeral and may expire; expiry causes a safe repeat, not data loss.
- Passing runs retain no screenshots or trace. Failed/uncertain runs may retain one JPEG per device and compact diagnostic JSON for 2 days using an Actions artifact. No new per-step screenshots committed to Git history.
- The fingerprint probe makes read-only GET requests to the exact Combined Preview origin. Browsers may load GET subresources from third-party font/CDN hosts referenced by the Preview, but external **navigation** is blocked and every site write method is rejected. No Production navigation, repo write, Cloudflare Deploy, or user data mutation.
- Website fingerprint is **not** an immutable source SHA or proof that rights/privacy/release checks passed.
- GitHub Actions eligibility and owner account-level storage/limits are independent; if runners are unavailable, stop and mark UNKNOWN instead of buying additional capacity.

## Interaction with the other two QA roles

- **Light checker**: this job, automatic on new *detected public bytes*, bounded and deterministic.
- **Ji-ro-ji-ro observer**: existing [LIVE_OBSERVER.md](../LIVE_OBSERVER.md) flow; still requires an observing Chat agent to choose screen-led actions. It is **not automatically driven by this workflow**. Intended to be invoked irregularly when a large day's changes accumulate, not on unchanged days.
- **Production gate**: only before an expressly authorized Production promotion, with immediate STOP on obvious serious risks found earlier. Includes provenance/rights/privacy/security/recovery/binding verification and must never be inferred from this smoke PASS.

Founder keeps final publication authority. Codex owns implementation and technical handoff; self-reported local PASS is not independent QA or an iPhone proof. The product's [AGENTS.md](https://github.com/25mochiko25-lang/niko2-atelier/blob/main/AGENTS.md) and Issue #24 govern.

## Current verification and remaining scope

1. Adoption is already recorded in the QA `main` commit above. Its commit message records nine policy tests, five coordinate-entry browser profiles and an unchanged-digest skip. No second adoption or schedule-enabling step is needed.
2. The scheduled [2026-10-08 run `37796481553`](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/37796481553) completed successfully: five browser profiles reported PASS for the limited entry route, and the Ubuntu finalize job saved the tiny verdict. The browser job took 58 seconds. This is evidence for the stated smoke scope, not all-site QA.
3. The scheduled [2026-10-09 run `37947946614`](https://github.com/25mochiko25-lang/niko2-atelier-browser-qa/actions/runs/37947946614) completed successfully: its probe reported `UNCHANGED_SKIP` for 10 resources / 1,878,685 bytes; the browser and finalize jobs were skipped. The probe job took 8 seconds. These measured job times are not account billing totals.
4. Before expanding coverage, separately define expected outcomes for prior known-bug fixtures such as Diary, taps and Garden 5/5. They remain outside the current smoke proof. Keep FAIL/UNKNOWN visible and inspect the exact run and logs when behavior changes.
5. The daily schedule remains a lightweight byte-based watcher. Screen-led visitor observation still uses the existing live observer and an observing agent. Neither workflow supplies a Production release approval. Account-level billing, storage and runner eligibility were not audited by these runs; no new billing settings, paid runner, API key or external QA service is needed for this existing setup.

## Temporary tester safety

The one-off branch-only push trigger was **removed after the isolated trial**. The adopted `main` workflow defines only its existing daily schedule and explicit manual dispatch; it has no push/PR trigger. Existing interactive workflows remain separate. The live observer uses [.github/workflows/live-observer.yml](../.github/workflows/live-observer.yml), and per-command image delivery uses [.github/workflows/live-view-export.yml](../.github/workflows/live-view-export.yml). This document update changes no workflow, product code, Preview or Production deployment.

