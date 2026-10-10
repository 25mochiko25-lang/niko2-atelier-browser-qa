# QA Agent Handoff

Repository: `25mochiko25-lang/niko2-atelier-browser-qa`

## Choose the right method

For a first-time visitor report, read **LIVE_OBSERVER.md** and use the existing observer-driven live browser. It keeps the same fresh WebKit context open between observations and has no 18/30-action cutoff. View the actual screenshots, choose each action from the screen, and explicitly stop for a recorded visitor reason. Do not invent a reason for a technical interruption.

The legacy `requests/*.json` -> `qa/visitor.mjs` method is a **synthetic diagnostic**. It scores controls using programmed rules and has a step limit. It is evidence of the interactions executed, not of an independent visitor's curiosity, comprehension, boredom, or willingness to continue. A successful workflow is not proof that the site or an entire visit passed.

Never recycle another session's browser state or feelings as your own first-time visit. Use a unique session ID and control file. Do not write to `live-control/first-time-visual-001.json`, which belongs to visitor 1.

## Default visitor contract

When the Founder only specifies a visitor personality or framing such as "play as this kind of visitor" or "see whether this is interesting to this kind of person", treat that alone as a complete visitor-QA request.

Unless the Founder explicitly overrides it, automatically:

- use the current Combined Preview
- use the observer-driven live browser from **LIVE_OBSERVER.md**
- start a fresh, unique touch-enabled mobile WebKit session
- enter without reading the product source, private specifications, implementation history, or other visitors' reports
- look at the actual screen and let the specified visitor personality decide what to tap, where to wander, what to ignore, and when to leave
- continue for as long as that visitor remains genuinely interested; there is no requirement to visit every room
- report ordinary visitor reactions first, then clearly broken behavior, then suspicious or unclear behavior

The Founder does not need to provide a Preview URL, browser method, session name, screenshots, action script, or step count for an ordinary visitor-QA request.

A technical interruption or workflow limit is infrastructure, not visitor boredom. If the Founder explicitly asks for production, desktop, synthetic diagnostics, a fixed operation sequence, or another environment, that instruction overrides this default. For Founder-device visual verification, use the same live observer with `device: "founder"` (430x932 touch mobile WebKit). For desktop, use `device: "desktop"`; do not switch browser systems just to obtain another viewport.

## Visitor roles

- `first-time`: ordinary first-time visitor
- `sloppy-mobile`: impatient mobile visitor
- `wanderer`: detours and revisits
- `outside-critic`: external critic without deference to the author
- `genre-fan`: genre-familiar visitor with higher expectations

These roles guide the observing agent's choices and interpretation. Merely changing a synthetic script's persona ID does not create an independently thinking visitor.

## Rules for reviewing agents

1. Do not read the product source repository, private specifications, implementation history, or other visitors' bug reports before forming the first-time assessment.
2. Use the combined Preview unless the Founder explicitly selects production:
   `https://niko2-atelier-combined-preview.25mochiko25.workers.dev/`
3. Treat browser evidence as authoritative for what was actually reached. Never claim an absent interaction happened.
4. Separate the observation, interpretation, and uncertainty. Do not excuse confusion with invented artistic intent or force conventional website norms on an unusual work.
5. Do not ask the Founder for screenshots. The observer browser captures its own small screenshots. The live image-delivery workflow exports them with one-day retention.
6. Stop when satisfied, uninterested, or blocked after ordinary attempts. Five seconds of voluntary disengagement is valid. Visiting every room is not required. An action/time/environment limit is not evidence of dislike.
7. Mobile WebKit emulation is not a physical iPhone. The live harness's wheel operation can be unsupported in mobile WebKit; do not report that as a website scroll bug. Keyboard PageDown/Tab can inspect lower content but do not validate finger-swipe behavior.
8. Audio and continuous animation are not validated merely by looking at screenshots.
9. Do not modify or deploy the product during a visitor session.

## Shared-infrastructure rule

Use the existing workflows and a uniquely named request/session. Do not create another workflow or alter shared runner behavior merely to start a visitor. Never overwrite another agent's request, control file, or result.

The live observer uses `live-requests/<session>.json`, `live-control/<session>.json`, and `live-results/<session>/`. See LIVE_OBSERVER.md for the precise command protocol and explicit stop command.

For intentionally synthetic diagnostics only, a new `requests/<unique>.json` can contain `persona`, `target`, `seed`, and `maxSteps`. Its results go under `results/`; label them as diagnostics, not first-time feelings.

## Required report order

### Ordinary visitor reaction
Record meaningful good and bad reactions without padding: what was fun; what was intriguing despite not understanding it; what got in the way; where the visitor did not know what to do; boredom; 'why did that happen?' moments; what made the visitor want to keep looking; and where or why the visitor stopped.

### Clearly broken
For each: place/state / immediately preceding action / what happened / practical impact.

### Suspicious or unclear
For each: place/state / what felt wrong or confusing / why it stood out.

Do not add redesign proposals unless explicitly asked. State what remained untested. Do not treat an infrastructure interruption as a completed visitor evaluation.

## Game-literacy and genre-aware criticism (Founder, 2026-10-10)

**The first-time browser pass stays blind; the later expert assessment must be literate, not naïve.** These are separate stages and must not be conflated:

1. **Blind observation**: interact with the actual screen without consulting private specifications; record only what was visibly done and what happened. A role-played early departure is a chosen simulation endpoint, **not a human retention statistic, not proof of a real person's boredom**.
2. **Convention recognition**: after freezing the first-impression report, check ordinary game / interactive-web conventions (skip, collectables, gates, level exit, inventory, save, revisit, tutorial). Consult documented implementation intent or Founder clarification at this stage if needed; never misreport a conventional skip as a newly discovered deep hidden route. Distinguish deliberately undisclosed details from normal gameplay affordances.
3. **Artistic divergence and quality judgment**: explain how NIKO² differs from those conventions, and ask whether the divergence is enjoyable, intriguing, distracting, or simply friction. Separate (a) operational failures, (b) deliberate mystery/inconvenience, (c) aesthetic preference, and (d) genre-specific originality. Critique the aesthetic **on its own terms**; do not assert the author must make it conventional or remove visible AI identity.

**Known Garden clarification**: the top-right `夢の見覚え ✧︎` in the 2026-10-10 dreamcore visit is an intentional **skip route** leading to the floating garden/petal, not a mysterious deep branch. The observed visuals are real, but earlier praise for independently uncovering an advanced secret was a reviewer error. The pre-5/5 gate behavior needs separate spec/implementation comparison before calling it broken or magical.

**Tutorial design constraint**: it was intentionally kept short so visitors start playing quickly. Founder considers current text readable enough and rejects turning it into a dense, oversized instruction screen. Do not recommend more words, large fonts or a dramatic restyle just because a 390px screenshot contains small pale type. Human readability is not established by an AI agent successfully clicking buttons, since it may use DOM text and control rectangles. Only concrete, reproduced comprehension or legibility failures justify a *minimal* targeted change, with the existing composition preserved.

**Garden design constraint**: the deliberately approachable, sweet, beautiful first Garden has a role. Some visitors choosing to leave is an acceptable design trade-off, not a mandate to add overt weirdness or reveal deeper surprises. In evaluation, consider the value of a welcoming shallows separately from later complexity.
