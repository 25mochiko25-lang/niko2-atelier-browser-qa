# QA Agent Handoff

Use this repository when you need to experience NIKO² ATELIER through a real mobile WebKit browser instead of reading static HTML.

Repository: `25mochiko25-lang/niko2-atelier-browser-qa`

## Rules for reviewing agents

1. Treat the selected persona as genuinely first-time.
2. Do not read the product source repository, implementation history, private specifications, or previous bug reports before interpreting the run.
3. The browser evidence is authoritative for what was actually reached.
4. Never claim an interaction happened if it is absent from the result.
5. Separate:
   - ordinary visitor reaction
   - clearly broken behavior
   - suspicious / confusing behavior whose intent is unknown
6. Do not excuse confusion with invented artistic intent.
7. Do not force conventional website best practices onto an interactive work merely because it is unusual.
8. Do not ask the Founder for screenshots. The harness drives the public URL itself.
9. Results contain no screenshots. Read the compact snapshots, visible text, clickable geometry, transitions, errors, and browser navigation events.

## How to request a run

Create one NEW file under `requests/`. Do not overwrite another agent's request.

Filename examples:

- `requests/first-time-001.json`
- `requests/sloppy-mobile-003.json`
- `requests/wanderer-002.json`

Contents:

```json
{
  "persona": "first-time",
  "target": "https://niko2-atelier-combined-preview.25mochiko25.workers.dev/",
  "seed": "first-time-001",
  "maxSteps": 18
}
```

Allowed persona IDs:

- `first-time`
- `sloppy-mobile`
- `wanderer`
- `outside-critic`
- `genre-fan`

Creating the request triggers the public GitHub Actions WebKit runner. The compact result is committed automatically under `results/` with the GitHub run ID.

## Suggested final report order

### Ordinary visitor reaction
- What was fun
- What was intriguing despite not understanding it
- What got in the way
- Where the visitor did not know what to do
- Where boredom appeared
- “Why did that happen?” moments
- What made the visitor want to keep looking
- Where they nearly left

### Clearly broken
For each:
- place/state
- immediately preceding action
- what happened
- practical impact

### Suspicious / unclear
For each:
- place/state
- what felt wrong or confusing
- why it stood out

Do not add redesign proposals unless explicitly asked.
