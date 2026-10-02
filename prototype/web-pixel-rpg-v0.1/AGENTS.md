# AGENTS.md

Goal: browser-first low-spec pixel RPG/MMORPG. Gameplay first, art later.

Current baseline: `prototype/web-pixel-rpg-v0.1/index.html` is the first playable loop.

Read before architecture work:
- `research/open-source-game-development-stack-2026-10-02.md`
- `prototype/web-pixel-rpg-v0.1/CODEX-HANDOFF-RPGJS-v0.2.md`

Rules:
- Keep browser-first and low-spec.
- Preserve working movement/combat/quest/save behavior.
- Prefer data-driven NPC/item/quest/monster definitions.
- Do not add heavy graphics dependencies before gameplay needs them.
- Next architecture target is **RPGJS v5 + TypeScript + Tiled + Universal LPC-compatible sprites**.
- RPGJS v5 is the primary engine. Do not add Phaser or Colyseus unless a concrete RPGJS blocker is documented first.
- Use LPC/Kenney/open assets only with license/credit records; never copy commercial game sprites.
- Online mode must remain server-authoritative before valuable economy/PvP systems are added.
- Keep NPC simulation bounded by the Player-First Adventurer World design.
- Meaningful changes should update README/CHANGELOG and remain easy for ChatGPT/Codex/Claude to continue.
