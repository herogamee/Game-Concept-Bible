# Codex/agent instructions — Game-Concept-Bible

This repository is the design source of truth for the original **Adventurer Life RPG**. The user's decisions override new proposals. Do not silently rewrite the world or expand the game into an unrelated system.

## Read first
1. `README.md` (source-of-truth hierarchy and current stage).
2. `design/WORLD-SYSTEM-INTEGRATION-GUARDRAILS-v0.1.md`.
3. `design/CONSOLIDATION-AUDIT-2026-10-03.md`.
4. `design/decisions.md` and the relevant specialist document.
5. The task's GitHub Issue and any linked PR/comments.
6. For `prototype/web-pixel-rpg-v0.1/`, also read its **nested** `AGENTS.md` and migration handoffs.

## Scope guardrails
- Preserve the Player-First Adventurer World and the initial F-to-E playable slice. Existing decisions about engine and online stack remain open; RPGJS v5 + TypeScript + Tiled + LPC is the **current prototype migration direction**, not a mandate to replace all code or switch to Godot.
- Do not copy DDTank visuals, proprietary sprites or other protected assets; references are inspiration only.
- Do not claim that a prototype, build, test or integration passed without execution evidence.
- Keep changes tightly scoped. For large changes, propose a plan and request owner approval for world/Bible locks, stack migration or production-risk changes.

## ChatGPT ↔ Codex handoff
Follow `docs/coordination/CHATGPT-CODEX-BRIDGE.md`.
- **GitHub Issue** = task specification and questions.
- **Branch + PR** = implementation and inspectable results.
- **Issue/PR comments** = asynchronous dialogue and review findings.
- Link every PR to an Issue; describe files changed, tests run, evidence, blockers and next actions.
- Never silently merge, deploy, reset a working tree, force-push or change `main`. The owner reviews the merge.
- Prefer a separate working branch/worktree; inspect `git status` before modifying.
- Do not commit tokens, secrets, local credentials or user data.
- Do not assume ChatGPT or Codex is monitoring GitHub in real time. A human-triggered check or an explicitly configured automation is required.

Existing deeper `AGENTS.md` files continue to apply to their own directories.
