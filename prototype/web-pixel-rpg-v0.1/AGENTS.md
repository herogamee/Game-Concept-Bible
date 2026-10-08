# Web pixel RPG prototype — local instructions

Root `AGENTS.md` applies: **Codex makes in-scope technical/UI decisions independently**; ChatGPT proposals are nonbinding. Owner controls locked game outcomes and high-risk changes.

**Baseline:** `prototype/web-pixel-rpg-v0.1/index.html` (working gameplay loop). **Goal:** browser-first, ordinary-PC performance. **Current prototype migration direction:** RPGJS v5 + TypeScript + Tiled + Universal LPC-compatible sprites (not a final-engine lock).

## Read only what the task requires

Use the current Issue and pertinent files/tests. Consult, **only if relevant**:
- World/Bible: `design/WORLD-SYSTEM-INTEGRATION-GUARDRAILS-v0.1.md`, `design/CONSOLIDATION-AUDIT-2026-10-03.md`.
- Prototype status: `prototype/PROTOTYPE-STATUS-2026-10-03.md`.
- Engine/assets: `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-RPGJS-v0.2.md`, `research/open-source-game-development-stack-2026-10-02.md`.
- Combat: `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-COMBAT-v0.3.md`, `design/COMBAT-KERNEL-v0.1.md`.

Do **not** re-read all these references for a small Issue.

## Guardrails, not micromanagement

- Preserve functioning movement/combat/quest/save and other agents' local changes.
- Codex chooses reusable components, data models, implementation, UI and optimization based on evidence. Do not add heavy dependencies without a clear benefit.
- Preserve web/low-spec goal, licensed art credits and server-authoritative online economy/PvP when implemented. Never use copied commercial game sprites.
- Keep Player-First NPC behavior and existing F→E scope. Big new standalone systems go to owner as proposals; in-scope quality/bug fixes are Codex decisions.
- Codex may test alternate engines/tools, but **owner approval is required for a full migration**. Existing RPGJS direction is the default prototype path.
- Report actual build/tests and linked PR; update docs only as relevant. ChatGPT review is advisory except for objective defects and missed owner-approved requirements.
