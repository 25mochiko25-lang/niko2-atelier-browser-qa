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

A technical interruption or workflow limit is infrastructure, not visitor boredom. If the Founder explicitly asks for production, desktop, synthetic diagnostics, a fixed operation sequence, or another environment, that instruction overrides this default. For desktop, use the same live observer with `device: "desktop"`; do not switch browser systems just to obtain a desktop viewport.

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
