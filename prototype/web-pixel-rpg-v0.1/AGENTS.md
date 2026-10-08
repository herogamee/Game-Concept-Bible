# Prototype-specific Codex guidance — web-pixel-rpg-v0.1

Applies within this prototype directory alongside root `AGENTS.md`.

**Codex is the Technical & Implementation Lead.** Choose the concrete architecture, code structure, algorithms, UI/UX implementation, optimizations and test plan independently. ChatGPT mockups and proposed implementation details are references, not commands. Preserve the **owner's approved experience and existing working features**.

## Local context

- Goal: browser-first, low-spec Adventurer Life RPG prototype; gameplay reliability first.
- Current playable baseline: `prototype/web-pixel-rpg-v0.1/index.html`.
- Existing **prototype migration direction**: RPGJS v5 + TypeScript + Tiled + Universal LPC-compatible sprites. This is not a decision that permanently locks the final engine.
- If an alternative approach solves an observed technical blocker better, Codex can investigate, benchmark and propose it. **Full-stack/engine migration** requires owner approval; small internal choices do not.

## Read only relevant sources

Do **not** reread all docs on every task. Follow the one GitHub Issue, inspect pertinent files, and consult these when the change needs them:

- World/game identity: `design/WORLD-SYSTEM-INTEGRATION-GUARDRAILS-v0.1.md` and `design/CONSOLIDATION-AUDIT-2026-10-03.md`.
- Existing prototype state: `prototype/PROTOTYPE-STATUS-2026-10-03.md`.
- Engine/asset migration: `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-RPGJS-v0.2.md` and `research/open-source-game-development-stack-2026-10-02.md`.
- Combat: `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-COMBAT-v0.3.md` and `design/COMBAT-KERNEL-v0.1.md`.

Read as much as necessary to be correct, no more than is useful. If the task changes architecture, review the affected contracts and tests.

## Technical and game safeguards

- Preserve functioning movement/combat/quest/save, and inspect `git status` before changing files; avoid breaking another agent's work.
- Prefer data-driven NPC/item/quest/monster definitions and reusable components when beneficial, but choose the actual design based on tests and codebase evidence.
- Keep ordinary-PC and web performance viable. Do not add heavy dependencies without demonstrated value.
- Use LPC/Kenney/open assets only with license/credit records; never copy commercial game sprites.
- Online valuable economy/PvP operations must remain server-authoritative when implemented.
- Keep NPC simulation Player-First; do not let autonomous NPCs replace player progression.
- Current feature breadth is intentionally bounded until the v0.3 combat prototype has evidence. Feel free to improve *in-scope* design and quality; suggest bigger standalone systems separately for owner approval.
- Do not claim migrations, builds or playtests passed unless actually run. Update README/CHANGELOG as appropriate for meaningful implemented changes, and deliver a linked PR for owner review.

**Decision autonomy:** For technical/visual implementation details, Codex decides; for locked world/feature outcomes, major engine/platform pivots or risky irreversible operations, owner decides. ChatGPT comments are advisory except factual regressions, safety or unmet owner-approved requirements.
