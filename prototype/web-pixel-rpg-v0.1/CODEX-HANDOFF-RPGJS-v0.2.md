> **Historical guidance — superseded on 2026-10-02:** The owner authorized a quality-first reset after rejecting v0.2's presentation/control regression. Read [active implementation direction](../../design/implementation-reset-2026-10-02.md) and [current handoff](../CODEX-HANDOFF-QUALITY-PARITY.md). Preserve this record for history; its mandatory RPGJS/LPC rules are no longer the active engine/art policy.
# CODEX HANDOFF — RPGJS v5 + LPC Playable Migration v0.2

Date: 2026-10-02
Repository: herogamee/Game-Concept-Bible
Source baseline: `prototype/web-pixel-rpg-v0.1/`
Research: `research/open-source-game-development-stack-2026-10-02.md`

## Mission

Create the next playable prototype without deleting or rewriting v0.1.

Build a new folder:

```text
prototype/rpgjs-v5-adventurer-v0.2/
```

Use:

- RPGJS v5
- TypeScript
- Tiled-compatible map flow
- Universal LPC-compatible character spritesheet layout
- no Phaser
- no Colyseus
- no heavy 3D dependencies

## Primary goal

A browser-playable vertical slice with:

- player movement
- four-direction character animation
- sword slash attack
- one slime enemy
- hit/hurt/death
- EXP + simple drop
- quest NPC
- kill-3-slimes quest
- potion/inventory
- portal/map transition
- save/load

Then provide a minimal MMORPG-mode proof with two clients.

## Bootstrap

Use the official v5 starter:

```bash
npx degit rpgjs/starter#v5 prototype/rpgjs-v5-adventurer-v0.2
cd prototype/rpgjs-v5-adventurer-v0.2
npm install
npm run dev
```

Install/read the official RPGJS coding-agent skill before implementing APIs:

```bash
npx skills add https://github.com/RSamaium/RPG-JS#v5
```

## Preserve the v0.1 behavior contract

Read `prototype/web-pixel-rpg-v0.1/index.html` first.

The migration is not accepted if it loses the existing validated loop merely because the new architecture is cleaner.

## Character/animation contract

Create an animation adapter so game logic uses semantic names:

```ts
type CharacterAnim =
  | 'idle'
  | 'walk'
  | 'slash'
  | 'thrust'
  | 'shoot'
  | 'spellcast'
  | 'hurt'
  | 'dead'
```

Never spread raw LPC row/frame numbers throughout gameplay code.

Keep all spritesheet frame mapping in one module/config.

Directions:

```ts
type Facing = 'north' | 'west' | 'south' | 'east'
```

If the selected LPC sheet has no true death animation, use an explicit temporary fallback and document it. Do not silently pretend `hurt` is a final production death animation.

## Combat contract

Use explicit attack phases:

```text
idle/move
 -> attack_windup
 -> attack_active
 -> attack_recovery
 -> idle

alive -> hurt -> idle
hp <= 0 -> dead
```

The sword hitbox MUST only cause damage during `attack_active`.

Required protections:

- one target cannot take multiple hits from the same swing
- dead targets cannot be damaged
- attack cannot restart every render frame while key is held
- server is authoritative in MMORPG mode
- visual animation may be predicted, but final HP/damage ownership is server side

## First sword

Create a data-driven attack definition, not magic numbers inside input handlers.

Suggested starting tuning (change after playtest):

```ts
{
  id: 'starter-sword-slash',
  animation: 'slash',
  windupMs: 90,
  activeMs: 120,
  recoveryMs: 220,
  range: 36,
  arcDegrees: 100,
  damageMultiplier: 1,
  hitOncePerTarget: true
}
```

These are tuning defaults, not locked design values.

## Enemy

One slime is enough.

States:

```text
idle
wander
chase
attack
hurt
dead
respawn
```

Keep AI simple. Do not introduce Yuka until normal TypeScript/RPGJS behavior becomes inadequate.

## Asset rule

Use temporary open assets only.

Preferred order:

1. LPC output with credits file
2. Kenney CC0 placeholder
3. simple project-created placeholder

Do not scrape commercial game sprites.

For every LPC generated asset, commit the associated credits/license export.

## Tiled rule

Use data properties for content IDs / triggers where practical.

Do not encode quest logic into tile coordinates such as:

```ts
if (x === 12 && y === 7) ...
```

Prefer:

```text
object.type = "quest_trigger"
object.properties.questId = "starter-slime-001"
```

## Multiplayer proof

Do not attempt MMO scale yet.

Acceptance requires:

- start server/MMORPG mode
- open client A and client B
- both players join same map
- both see each other's movement
- both see the same slime
- when one player damages/kills slime, final HP/death state is consistent for both
- no duplicate rewards caused by two clients racing the same death

## Tests

Add focused tests where RPGJS v5 test helpers allow it.

Minimum logic tests:

- attack cannot damage before active window
- attack only hits same target once per swing
- zero HP transitions to dead
- dead slime gives reward once
- kill counter increments only on valid server-confirmed kill
- quest completes at 3 valid slime kills
- potion cannot heal past max HP

## Deliverables

Commit:

- new v0.2 prototype folder
- README with exact run commands
- asset/license notes
- architecture note explaining where server authority lives
- test commands
- short migration notes from v0.1
- update root CHANGELOG after prototype actually works

## Stop conditions / escalation

Do not change engine just because an API is unfamiliar.

Document a blocker before proposing an engine pivot. A valid blocker should include:

1. exact requirement
2. exact RPGJS limitation
3. minimal reproduction
4. attempted extension/plugin path
5. why Phaser or another stack materially solves it

## Definition of done

### Standalone gate

Player can:

1. load map
2. walk
3. slash slime
4. take damage
5. kill slime
6. receive EXP/drop
7. accept/complete kill-3-slimes quest
8. use potion
9. change map
10. save and reload

### Online gate

Two clients can:

1. connect
2. share map
3. see each other
4. interact with the same slime
5. observe consistent server-authoritative combat result

Do not continue into full class trees, crafting, guild systems or 100-floor procedural generation until these gates pass.
