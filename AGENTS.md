# Codex rules — Game-Concept-Bible (lightweight handoff)

This repository is the original **Adventurer Life RPG**. Preserve the current game, approved Bible decisions and working baseline. The user owns scope and merge decisions.

## When the owner says "ทำ Issue #N" / "work on Issue #N"
1. Open **that one Issue** in `herogamee/Game-Concept-Bible` (`gh issue view N --repo herogamee/Game-Concept-Bible --comments`); use its **latest approved** requirements as the handoff. Do NOT request the full ChatGPT discussion.
2. Inspect `git status`; preserve all uncommitted work. Create/use a scoped branch or isolated worktree; never overwrite another agent's changes.
3. Read **only the source, tests and Bible sections relevant to this Issue**, plus any more-specific nested `AGENTS.md`. Consult `README.md`/canonical decision files when the task touches lore, product direction or architecture. Do not reread the entire Bible for a small UI/code task.
4. Implement and run focused tests. Ask a **specific** question in the Issue only if an essential decision is missing; otherwise use safe small defaults and state assumptions in the PR.
5. Push a branch, open a PR linked to the Issue, report **changed files, PASS/FAIL/not-run tests, evidence, blockers**. Keep the report concise. Never claim a test passed unless it ran.
6. **Do not merge, deploy, force-push or alter `main` without owner approval.** Never commit secrets.

## Shared GitHub communication
- Issue = condensed implementation brief (not full ChatGPT reasoning/history).
- PR = implementation, test evidence, reviewer discussion.
- ChatGPT reviews PRs when the owner asks; neither agent automatically sees GitHub changes.
- No Work/Codex auto-polling; extra agent turns cost usage and are not assumed.
- Guide: `docs/coordination/CHATGPT-CODEX-BRIDGE.md`.

## Game safeguards
- Player-First Adventurer World; avoid unapproved standalone systems or engine migrations.
- Current playable prototype direction is **RPGJS v5 + TypeScript + Tiled + LPC**; final engine is not locked. Do not assume Godot migration.
- Follow nested `prototype/web-pixel-rpg-v0.1/AGENTS.md` when working there.
- No copied DDTank or other proprietary assets.
