---
name: tweakler
description: Run Tweakler's reference-led UI transaction for a new site, a new page, or a visual redesign. Do not use for minor maintenance, copy-only edits, bug fixes, dependency updates, or small component tweaks that do not redesign the page.
---

# Tweakler for Codex

Use the `tweakler` MCP server for in-scope UI work. Explicit `$tweakler`
invocation is reliable; automatic host triggering is best effort. This workflow
is mandatory once invoked, but durable enforcement belongs in repository
`AGENTS.md` policy and CI in a later phase. It is not a general maintenance
workflow.

## Transaction

1. Before any in-scope UI edit, create a run with `create_project`, or resume the
   run ID supplied by the user or found in the current task context. Never reuse
   candidates or state from another run.
2. Call `get_next_action(run_id)` and follow its `next_tool`, `required_inputs`,
   `pending_ids`, `user_decision_required`, and blockers. Call it again after every persisted
   transition. Continue until it reports terminal validation; do not stop after
   discovery, cloning, or implementation.
3. When `user_decision_required` is true, present the bounded choices directly in
   normal chat and wait for the answer. `present_gallery` only opens a gallery;
   it does not record or imply the user's decision, so ask after it returns and
   persist the answer with `save_inspiration`. Codex has no `AskUserQuestion`
   tool; do not refer to or attempt to call one.
4. Treat discovery URLs as visual provenance, not clone targets. For discovered
   references, obtain explicit confirmation of a separate official HTTPS target,
   then obtain the required `owned`, `permissioned`, or `public-or-unknown`
   rights classification. Never infer rights.
5. The adopted Tweakler clone engine app under the run directory is the implementation base.
   Preserve its layout, interactions, and design family while replacing content
   and media transactionally. Do not replace it with a fresh generic scaffold.
6. For host image generation, use the prompt and dimensions returned by
   `generate_images`, write each output only to that task's server-issued
   `write_file` path, then call `submit_generated_image` with the matching
   generation ID, task ID, and lease token. Do not invent paths or write image
   outputs elsewhere.
7. Apply replacements, reinspect the activated generation, and run
   `validate_clone`. Resolve bounded report actions and continue until
   `get_next_action` reports the terminal validation status. A
   `review_required` result is not a production pass.

Keep one run ID throughout. Keep network, subprocess, file, retry, and output
work bounded. Do not implement later-phase intake gates, rendered contexts,
brand kits, or alternate image state.
