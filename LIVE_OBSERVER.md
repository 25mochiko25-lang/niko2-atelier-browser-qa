# Screen-led first-time visits

Use this mode for visitor reactions. `qa/visitor.mjs` remains a synthetic diagnostic, not an independently thinking visitor. Do not label its scored choices, cutoff, or fixed waits as human curiosity, boredom, or confusion.

## No interaction-count cutoff

Create `live-requests/<unique-session>.json` containing `session`, the approved public `target`, and `mode: "observer-driven"`. The separate `live-observer.yml` workflow starts a fresh WebKit context and keeps it alive between observations. There is no 18/30-step cutoff.

Default is the existing mobile profile: 390x844, mobile=true, touch=true.

For the Founder reference device, add `"device": "founder"`. This uses a 430x932 touch-enabled mobile WebKit viewport, matching the iPhone 15 Plus CSS viewport used as the visual reference point.

For a desktop check, add `"device": "desktop"` to the request. Desktop uses 1440x900, mobile=false, touch=false in the same WebKit observer. The same `tap` command works in both modes; the harness uses touch on mobile and mouse click on desktop.

Read `live-results/<session>/state.json`, then view the image at its `screenshotUrl`. This is an actual screenshot, not a screenshot the Founder must supply. The URL is pinned to the image commit, avoiding stale screenshots.

Choose the next action from what is actually visible. Create or update `live-control/<session>.json` with a unique `id` and one of:

```json
{"id":"01","op":"tap","x":195,"y":520,"note":"The entrance is the thing I want to open."}
```

Supported operations: `tap`, `scroll` (x, y, dx, dy), `type` (text, into the already-focused field), `key`, `back`, `forward`, `reload`, `look`, `wait`, `note`, `stop`. `wait` is milliseconds after the action. Use only normal visible page interactions. Do not inject progress, seed storage, read private product sources, or force hidden controls.

The observer, not a scoring script, selects the action. Wait for `state.json.lastCommand` to equal the command ID before selecting another action. The browser captures the state and image after every command.

Stop explicitly:

```json
{"id":"end","op":"stop","reason":"I finished the experience that interested me and do not want another loop today."}
```

A five-second voluntary departure is valid. A longer visit is valid. Completion of all maps is not required. Record a concrete reason, not a post-hoc excuse for a cap.

Safety guards remain: 20 minutes without an observer command and the workflow's 90-minute runtime guard. These are infrastructure interruptions and must never be reported as boredom or a completed visitor evaluation. WebKit mobile emulation is not physical iPhone testing. Desktop WebKit is a viewport/input comparison, not proof of every desktop browser. Screenshots do not establish audio or frame-by-frame animation quality.

Read only your own session before forming the first-time report. Keep ordinary reactions first, then clear failures, then uncertain friction. Distinguish actual observed behavior from your interpretation. This mode does not write to the product repository or deploy the site.
