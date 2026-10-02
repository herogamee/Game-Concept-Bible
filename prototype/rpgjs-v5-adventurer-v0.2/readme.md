> **Technical experiment, not accepted replacement:** v0.1 is the current playable quality reference. Visual/control parity has not passed. See [active reset](../../design/implementation-reset-2026-10-02.md) and [next handoff](../CODEX-HANDOFF-QUALITY-PARITY.md).

# Willowbrook — RPGJS v5 Adventurer v0.2

Bounded RPGJS v5 presentation/control experiment using the original v0.1 artwork. v0.1 remains the default playable until owner review. See `PARITY-REVIEW.md` for current results.

Current checkpoint: selectable smooth/native-density or original pixel rendering; a synchronized, saved cosmetic schema for body/face/eyes/pants/shoes/shirt/hair/hat/weapon. Real separate costume layers are not authored yet. Read `CHARACTER-APPEARANCE.md`, `../../PROJECT-STATUS.md` and `../../DEVELOPING.md` for the precise scope and portable setup.

## Run

Node 22.23.2 was used on Windows. From this directory:

```powershell
npm.cmd ci
npm.cmd run dev -- --host 127.0.0.1 --port 5173 --strictPort
```

Open http://localhost:5173/ for standalone mode. For authoritative multiplayer, use a second terminal:

```powershell
npm.cmd run dev:online
```

Open http://localhost:5174/ in two independent tabs. Session-scoped connection IDs allow separate players. These are guest sessions, not authenticated accounts.

Click ground to walk; click a slime or its HUD button to pursue and slash. WASD/arrows override click navigation. Z/Space slash, E/Enter talk, I inventory, 1 potion, K save, L load. The elder is north of the village spawn; the south portal reaches the meadow. The travel button walks through the portal. Audio unlocks on a gesture or the sound button; volume and mute are stored separately from v0.1. Debug player/monster telemetry is behind the ข้อมูลทดสอบ toggle.

## Verify

```powershell
npm.cmd run typecheck
npm.cmd test
npm.cmd run build
npm.cmd run test:production
```

Twenty-five focused rules/runtime/appearance tests cover active-only damage, one hit per swing, death/interruption/revival, atomic kill rewards, three-kill quest, level growth, potion limits, navigation, Tiled IDs, credits, appearance migration/catalog validation and display-resolution bounds. Production smoke test builds and serves maps, original PNGs and the UI theme at root and `/quest/`; it is not an online deployment test. See `PARITY-REVIEW.md` for current browser results; `ACCEPTANCE.md` preserves the earlier implementation's evidence.

## Architecture and authority

- `src/game/rules.ts`: combat phases and data definitions; sword 90ms windup, 120ms active, 140ms recovery, 48px range, 100-degree arc. Player attack damage follows level. Reward claim occurs atomically before save promises.
- `src/game/runtime.ts`: server action validation, hit sets, line-of-wall rejection, HP/EXP/drop, quest, potion, portals, save checkpoints and slime state machine. Clients send intentions, never damage/reward values. The MMORPG process owns this state. Standalone uses the same server logic in the browser and is not cheat-resistant.
- `src/modules/main/player.ts` and `server.ts`: RPGJS lifecycle hooks, shared maps/events, explicit `player.on` command listener. Public IDs are preserved across storage hydration; browser save slots remove a past room ID before applying a snapshot.
- Durable progress and monster state use synchronized RPGJS `props`. JSON strings avoid a concrete standalone `structuredClone` failure with nested reactive object proxies. Transient swing timers/target paths stay server-local; combat phase/world HUD signals are non-permanent. `worldView` is a synchronized read-only HUD projection.
- `src/game/animation.ts` adapts the original painted hero/NPC/slime/prop frames; the prior LPC adapter and credits remain for history. Hurt/death hold a readable opaque idle frame with red ground feedback. No new thrust/shoot/spell abilities are enabled.
- `parity-scene.ce` and `presentation.ts` use the documented CanvasEngine viewport context for the 800×450 camera and correct CSS-scaled mouse coordinates. Map/host resize must not change logical renderer dimensions. The ground renders as one original bitmap; a sparse Tiled layer supplies footprint collision and renders matching ground pieces. The frame uses `overflow:clip` so focusing controls cannot scroll the entire world.
- Movement authority is explicitly server-side and local prediction is disabled in both modes: otherwise native keyboard prediction can mask server click-route coordinates. This trades latency hiding for consistent authoritative positions; remote-network input latency remains unmeasured.
- Tiled TMX objects provide stable IDs and content properties. `tools/build-maps.mjs` generates TMX/TSX and the matching server content registry/collision grid. Edit this authored source and run `npm.cmd run maps`; independent TMX edits must also update the registry. Click routes use BFS and movement uses RPGJS `LinearMove`/physics collision. Native `moveTo` has a coarse arrival tolerance that was unsuitable for 16px route waypoints.

Slimes wander, chase, attack, hurt, die and respawn after five seconds. Aggro is leashed to their authored homes so persistent online monsters cannot camp the map entrance. Three confirmed kills make the elder quest ready; turn-in grants 50 Gold and 20 EXP. Potion heals 18, clamps to max HP and consumes one item only when usable. Each kill grants 8 EXP, 2 Gold and 1 Gel; the inventory is a minimal starter sword/count-based bag rather than a full equipment UI.

## Save and limitations

Standalone slot 0 uses localStorage key `adventurer-rpgjs-v02-slots1`, separate from v0.1. Save includes map/position and progress; transient combat resets on restore. Online currently uses RPGJS's server-owned in-memory strategy. Restarting the development server loses online slots; durable storage/authentication and room persistence are future work. Do not use this guest prototype as a production account service.

The village/meadow layouts and painted actors/props now reuse v0.1 originals. Collision uses a conservative 16px footprint mask, with eight-way click routes that avoid cutting blocked corners. No broad class tree, crafting/guild simulation or 100-floor generator is implemented. Built JS contains large RPGJS/CanvasEngine chunks; loading/performance optimization remains future work. Vite emits forward-looking native-config compatibility warnings. Dependency audit currently reports transitive advisories; review/update before deployment.

## Assets and provenance

Active art is the original project-generated painted set from v0.1, with provenance in its `ART-DIRECTION.md`. `npm.cmd run maps` reproduces copied runtime art, NPC columns, deterministic reference terrain and Tiled content. `@napi-rs/canvas` is build-only. Read `assets/LICENSES.md`. The retained inactive LPC source/composite still requires its per-layer OGA-BY credits if redistributed.

Starter: https://github.com/rpgjs/starter/tree/v5. RPGJS packages pinned to 5.0.0; TypeScript 6.0.3 (7 caused the starter declaration plugin to fail). Official RPGJS agent skill installed in the repository, inspected upstream at `2560a72fa9ca8b33ef9b61e69003e58872e4f344`, plus current v5 docs. LPC source tree fetched at `4963a69795255fb15a934c47f478a8bdcf3668f5`; all selected source images/definitions are retained for reproducibility.

The starter sample Pipoya assets/maps remain as references, unregistered in gameplay. v0.1's click/keyboard movement, village/meadow loop, quest, inventory, EXP/save and audio intentions are retained; the candidate now reuses its illustrated artwork and original village/meadow music with a separate audio preference key.
