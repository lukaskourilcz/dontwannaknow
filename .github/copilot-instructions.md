# Copilot instructions

This repository keeps one shared contract for all assistants in
[`AGENTS.md`](../AGENTS.md). Read it before suggesting changes; it is the
authority for scope, privacy, Czech voice, accessibility and commit style.

Two rules matter most when generating code or data here:

1. **The shipped app calls no model and fetches no historical data at runtime.**
   AI is allowed only at build time, and its output must be committed JSON.
2. **Facts are selected by scored editorial relevance, and deterministic gates
   always outrank scores.** Never invent a scoring scheme. Print the real one
   with `npm run relevance:prompt -- A` (from `dontwannaknow/`) and follow
   [`docs/fact-scoring.md`](../docs/fact-scoring.md).

Verify with `npm run check` from `dontwannaknow/` on Node 22. Commit messages
are Czech.
