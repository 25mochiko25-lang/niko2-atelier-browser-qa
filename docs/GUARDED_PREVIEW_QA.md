# NIKO² ATELIER — cost-guarded Combined Preview QA (candidate)

Status: **proposal / isolated QA branch, NOT enabled on main**. Related product work: [Issue #24](https://github.com/25mochiko25-lang/niko2-atelier/issues/24), [Draft PR #25](https://github.com/25mochiko25-lang/niko2-atelier/pull/25).

## What this actually does

The new workflow is separate from existing interactive visitor observation. It checks the public **Combined Preview** HTML and up to 16 same-origin linked JS/CSS files once per day (23:43 JST) or on an explicitly selected workflow dispatch. It compares the byte fingerprint against a short-lived GitHub Actions cache.

| Event | Behavior |
| --- | --- |
| Same digest + last smoke PASS | Skip browser job. One light network probe only. |
| Same digest + last FAIL/UNKNOWN | Preserve failure, exit nonzero without expensive repeated browsers. Manual recheck can override. |
| Changed digest or first observation | Run a bounded browser smoke. |
| Explicit mode smoke/full | Rerun even if digest is unchanged. |
| Fingerprint inaccessible, incomplete, oversized | UNKNOWN/FAIL job, not a false PASS. |
| Security/rights finding from other review | Separate urgent stop; never auto-approve a release. |

Profiles: touch-enabled mobile WebKit 430×932 / 390×844; touch-enabled Chromium 390×844; desktop Chromium and desktop WebKit 1440×900. Full manual mode adds Firefox desktop and a narrow Chromium mobile viewport. These are **browser simulations**, not physical Android/iPhone devices.

Current smoke scope is **Home entry -> Intro -> Garden** using browser-issued coordinate taps/clicks, plus page errors and overflow diagnostics. The exact Garden route is required for a PASS. Missing selectors, intercepted requests, missing proof, blocked site writes or uncertain state become UNKNOWN/FAIL rather than imagined success. All POST/PUT/PATCH/DELETE requests are blocked by the test harness. The current script **does not** prove Diary finger swipes, long-lived saves, Hotel, rights, Contact delivery, Cloudflare bindings, audio, every map, or source-SHA matching.

**Important:** The existing live observer's mobile scroll uses wheel input; that is *not* a real WebKit finger swipe. Do not call it a passed touch gesture. A full automated physical iPhone gesture test is not available in this change.

## Billing, storage, permissions

- Public GitHub repository, standard Linux hosted runners only; no AWS Device Farm, paid runner, AI API, paid subscription, or change to billing settings.
- Probe job is Node-only. The browser image/container launches only when a new digest needs checking or on a forced manual run.
- Bounded: HTML <=8 MiB; each asset <=5 MiB; entire fingerprint <=24 MiB; 16 linked assets maximum. Job timeouts: probe 6 minutes, browser 15 minutes.
- Cache contains only a tiny digest and PASS/FAIL/UNKNOWN, never site data, credentials, screenshots, Contact submissions or internal documents. Cache is ephemeral and may expire; expiry causes a safe repeat, not data loss.
- Passing runs retain no screenshots or trace. Failed/uncertain runs may retain one JPEG per device and compact diagnostic JSON for 2 days using an Actions artifact. No new per-step screenshots committed to Git history.
- The fingerprint probe makes read-only GET requests to the exact Combined Preview origin. Browsers may load GET subresources from third-party font/CDN hosts referenced by the Preview, but external **navigation** is blocked and every site write method is rejected. No Production navigation, repo write, Cloudflare Deploy, or user data mutation.
- Website fingerprint is **not** an immutable source SHA or proof that rights/privacy/release checks passed.
- GitHub Actions eligibility and owner account-level storage/limits are independent; if runners are unavailable, stop and mark UNKNOWN instead of buying additional capacity.

## Interaction with the other two QA roles

- **Light checker**: this job, automatic on new *detected public bytes*, bounded and deterministic.
- **Ji-ro-ji-ro observer**: existing [LIVE_OBSERVER.md](../LIVE_OBSERVER.md) flow; still requires an observing Chat agent to choose screen-led actions. It is **not automatically driven by this workflow**. Intended to be invoked irregularly when a large day's changes accumulate, not on unchanged days.
- **Production gate**: only before an expressly authorized Production promotion, with immediate STOP on obvious serious risks found earlier. Includes provenance/rights/privacy/security/recovery/binding verification and must never be inferred from this smoke PASS.

Founder keeps final publication authority. Codex owns implementation and technical handoff; self-reported local PASS is not independent QA or an iPhone proof. The product's [AGENTS.md](https://github.com/25mochiko25-lang/niko2-atelier/blob/main/AGENTS.md) and Issue #24 govern.

## How to adopt

1. Confirm this candidate's offline policy tests and a real public QA-hosted branch trial, inspecting its run ID and logs. Keep the one-off branch-only push test trigger *out of the final main version*.
2. Confirm unchanged digest skip, changed digest smoke and preserved-failure logic across representative test cases. A single green workflow is insufficient.
3. Review the browser smoke against current Combined Preview to avoid false PASS/FAIL and, in a separate scoped follow-up, add prior known-bug fixtures (Diary, taps, Garden 5/5) with explicit expected outcomes.
4. Do not merge this draft or enable daily scheduling until the QA workflow is actually safe and compatible with the existing public runner quota. Public repo main, product main/review, and Production remain untouched until then.
5. After adoption, the schedule is only a lightweight byte-based watcher. It is not a replacement for the irregular observer or Production gate.

## Temporary tester safety

The one-off branch-only push trigger was **removed from this proposed final workflow** after starting the isolated trial. No push/PR trigger remains. Only daily scheduled (when adopted on main) and explicit manual dispatch are defined. Every other workflow in this repository remains untouched.
