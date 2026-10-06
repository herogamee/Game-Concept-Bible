> **Technical experiment, not accepted replacement:** v0.1 is the current playable quality reference. Visual/control parity has not passed. See [active reset](../../design/implementation-reset-2026-10-02.md) and [next handoff](../CODEX-HANDOFF-QUALITY-PARITY.md).

# Willowbrook — RPGJS v5 Adventurer v0.2

Walking lab, 2026-10-07: `/fixed-template-walk` is a standalone HTML/Canvas experiment using two outfits, two hairstyles, three eye sets and one shared8-frame clock. The owner rejected its joint bending and duck-like gait; the page labels that failure.192 composition/session checks do not prove natural walking. See `evidence/ddtank40-walk-v1/REVIEW.md`. An independent-part ImageGen draft is preserved for diagnosis and is not used at runtime. Motion landmarks are original trial authoring data, not DDTank measurements. No Godot/Phaser loader or runtime has been added.

Current hair catalog (owner removal, 2026-10-06): only brown `ours-310900001` and paired blue `ours-310900004` remain in `/fixed-template`. The old side-swept blue and silver curls are removed from the active catalog, gallery, native route and six runtime PNGs. Source/history artifacts remain archival. Rebuild and verification pass: 14 items, 30 PNGs, 108 standing compositions, 14 active native layers. Earlier counts below describe historical checkpoints.

Current lab replacement: the new paired hair-only PNG now replaces the rejected ghost hair on existing item `ours-310900004`, named “ผมฟ้า · คู่ภาพหัวมาตรฐาน”. Native `hair-paired-teal.png` copies the delivered source byte-for-byte; A/B exports keep `ours_hair_4` and the shared character matrix. Choose the item to see it on the actual dressed character. Head, eye sets and other items remain unchanged. `verify:ddt40` checks source/export identity and216 standing compositions. The following initial review-only status is historical; artwork and exact generated-pair identity remain unaccepted.

Latest owner correction: the ghost-head hair trial below was visually rejected. `/fixed-template` now shows a new ordered pair: standard blank head with hair, then the corresponding hair-only alpha image, both without eyes, brows or mouth. A third view recomposes the hair on the unchanged original head without fitting. See the [pair review](evidence/ddtank40-three-quarter-v1/HAIR-PAIR-REVIEW.md). Both raw outputs and prompts are saved in `assets/ddtank40-three-quarter-v1/hair-pair-v1/`. This is review-only; ImageGen redrew some contour/shading pixels, so exact pair identity and owner visual acceptance have not passed. No new catalog item or runtime export is introduced by this pair.

Ghost-head hair trial: `/fixed-template` now adds one selectable “ผมฟ้า · ทดลองหัวล่องหน” (`ours-310900004`) beside the preserved three hairstyles. Hair-only generation uses the unchanged blank head as a reference; the output contains no head/face. A declared fixed import registers this new source family before the unchanged common character export. The lab shows head, hair alone and their overlay, with separate file links. Current exports contain16 items/36 PNGs/216 standing combinations. See the [ghost-head review](evidence/ddtank40-three-quarter-v1/GHOST-HEAD-REVIEW.md) for exact prompts, preserved rejected attempts,±5% trial volume limits and browser evidence. Eight image calls produced one published blue example; silver attempts still drifted and were rejected. This is a bounded demonstration, not100% geometric generation or validated catalog throughput.

Active character resource direction: DDTank 4.0 dimensions/relative origins/frame grids/category folders are canonical. `tools/ddtank40/profile.json` records the measured contract. `npm run assets:ddt40` exports 16 original standing items as 36 registered PNGs under `assets/ddtank40-compatible-v1/image/equip/m/...`; face means head plus expression, eff means face detail, cloth means dressed body, and hair includes A/B. The three-quarter-left source art/prompts are in `assets/ddtank40-three-quarter-v1`. Three new body-only clothing sources replace the rejected practice of cutting heads off outfit portraits; native clothing PNGs copy the new sources byte-for-byte with complete neck/scarf/collar, without repair patches. See the [body-only source review](evidence/ddtank40-three-quarter-v1/HEADLESS-CLOTHING-REVIEW.md) and historical [proportion review](evidence/ddtank40-three-quarter-v1/PROPORTION-REVIEW.md). Every part uses one uniform export matrix. Clothing draws before the face; the lab displays full source, assembly, reference and clothing-only preview. `/fixed-template` uses the common adapter; earlier experiments remain at `/fixed-template-legacy`, `/original` and `/walk`. Run `npm run verify:ddt40 -- D:/Codex/DDtank`; commercial proof stays external. Byte preservation, dimensions and 216 composition checks do not establish exact anatomical invariance, owner visual acceptance, all actions/female originals or real Flash ingestion. The production gate still rejects missing coverage. Playable engine, saves and v0.1 remain preserved.

Hair source correction: all three active standing hairstyles now come from standalone hair-only ImageGen images, with raw PNGs and exact prompts preserved. One fixed 72% uniform import registers the new source family; the full-character export matrix stays the same. Native B copies the registered hair PNG byte-for-byte, without face/skin/ear extraction. A derives only from the shared cap-coverage rule. See the [hair-only source review](evidence/ddtank40-three-quarter-v1/HAIR-ONLY-REVIEW.md) and native standalone/assembled proof. The lab now includes “ดูไฟล์ทรงผมเดี่ยว” and a link to each native1254×1254 PNG; exported hair remains250×312. Source identity, connected-lock/ear/cap fixtures,162 compositions and browser A/B/reset pass; owner visual acceptance remains pending.

Face source correction: the default amber eye set previously copied brown bangs from the full master into the exported face. It now uses the preserved hairless `eyes-amber-generated.png`, matching the source policy of the other two eye sets. Hair swaps redraw the independently selected layers and keep the same face resource. The lab includes “ดูใบหน้าโดยไม่ใส่ผม” with a link to the actual exported face PNG. See the [hair-free face review](evidence/ddtank40-three-quarter-v1/FACE-HAIR-FREE-REVIEW.md), native before/after proof and current verification. The earlier standalone-hair checks did not certify a clean face; this fix adds explicit regression fixtures. Original art acceptance and broader action coverage remain pending.

Earlier hair-size repair: the [front short-hair review](evidence/fixed-template-v1/HAIR-REVIEW.md) records the blue overlay change460×314→532×396px and a bounded size envelope shared by the three current front hairstyles. /fixed-template-legacy shows the earlier authoring dimensions and common crown guides; `npm run verify:hair-standard` rejects the previous undersized source. The immutable head and common origin remain fixed. This is a front-only trial standard awaiting owner art review, not validated catalog production.

HD art checkpoint: original clean-outline chibi hero and matching HUD avatar, higher-density NPC/slime/props from preserved masters, and terrain rendered at2× density. World geometry and saved appearance IDs stay compatible. See `evidence/art-hd/REVIEW.md` for actual source resolution, validation and unfinished art scope. Rebuild exports with `npm run assets:parity`.

Bounded RPGJS v5 presentation/control experiment using the original v0.1 artwork. v0.1 remains the default playable until owner review. See `PARITY-REVIEW.md` for current results.

Current runtime checkpoint: selectable smooth/native-density or original pixel rendering; a synchronized, saved legacy cosmetic schema for body/face/eyes/pants/shoes/shirt/hair/hat/weapon. This is not the owner's corrected category model. The active [fixed-template asset standard](CHARACTER-APPEARANCE.md#owner-defined-fixed-template-asset-standard--2026-10-06) uses one normal head/body, independent eye sets and face sets, integrated clothing and full costumes, all with fixed registration. A separate front-pose subset now exists in the lab; the saved playable runtime does not implement the corrected schema. Read `../../PROJECT-STATUS.md` and `../../DEVELOPING.md` for the precise scope and portable setup.

Preserved front-motion trial: [independent wardrobe across front stand/walk](evidence/fixed-front-motion-v1/REVIEW.md), at `http://127.0.0.1:5199/fixed-template-legacy` through the same local lab server. Three outfits, three eye sets, two cheek-detail face sets plus none, three hairstyles and one cap retain independent IDs across the original neutral stand and four authored walk key poses. Hat removal restores selected hair; swaps/default reset preserve phase. Compare source galleries, slow playback or step frames. Rebuild with `npm run assets:fixed-template` and `npm run assets:front-motion`; verify with `npm run verify:fixed-template` (108 cases), `npm run verify:headwear` (162 looks), and `npm run verify:front-motion` (810 pose compositions). This is a stationary front gait trial; cadence, foot-support, sleeve boundaries and owner acceptance need review before production. Other directions/actions, broad equipment/topology, playable integration and catalog throughput remain unfinished.

Separate original-art study: [the first head/hair proof](evidence/character-master/head-hair/REVIEW.md) runs at `http://127.0.0.1:5199/original` through `npm run lab:registered -- D:/Codex/DDtank 5199`. It toggles one hairstyle using three registered front-pose layers, with a reconstructed scalp and unchanged dressed body. It is not integrated into the playable appearance; alternate hairstyles/outfits, animation and owner visual acceptance remain pending. Rebuild with `npm run assets:head-hair` and verify with `npm run verify:head-hair`.

Animated customization remains an owner requirement: independently selected eye sets, face sets, hair and outfits must persist through every enabled action and direction. The [appearance contract](CHARACTER-APPEARANCE.md) now prioritizes the fixed-template production process; the earlier eight-combination walk is preserved evidence, not acceptance of that process.

The [side-walk study](evidence/walk-side-v1/REVIEW.md) now previews 2 face variants × 2 hairstyles × 2 outfit colourways through eight frames at `http://127.0.0.1:5199/walk`, using the same local server. Rebuild with `npm run assets:walk-side` and verify with `npm run verify:walk-side`. Cosmetic changes preserve motion phase/position; 64 composition cases passed. Natural gait and owner art acceptance remain pending. No original side idle, front/back motion or combat actions were added.

Camera/movement follow-up: settings now save camera distance (80–150%), vertical framing and steady/follow behavior. Desktop default distance is 125%; the view fits the authored map. WASD/arrows support normalized diagonals; click routes continue through intermediate waypoints; static scenery is anchored to authored coordinates. See `evidence/camera/REVIEW.md` for measured results and limits.

Responsive checkpoint: continuous walking cadence, larger overhead labels, compact action dock, scrollable responsive dialogs, saved UI scale and a touch joystick foundation. See `MOBILE-FOUNDATION.md` for device targets and remaining acceptance checks.

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

Thirty-one focused rules/runtime/appearance tests cover active-only damage, one hit per swing, death/interruption/revival, atomic kill rewards, three-kill quest, level growth, potion limits, navigation, Tiled IDs, credits, appearance migration/catalog validation and display-resolution bounds. Production smoke test builds and serves maps, original PNGs and the UI theme at root and `/quest/`; it is not an online deployment test. See `PARITY-REVIEW.md` for current browser results; `ACCEPTANCE.md` preserves the earlier implementation's evidence.

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
# 1080p visual follow-up

Static props now use an image-only event renderer. Death switches slimes to an invisible graphic until the authoritative five-second respawn; HP/rewards remain server-owned. Collision tiles are transparent and preserve the same footprints. See `evidence/1080p/` and [the original chibi art direction](../../design/art-reference/README.md). The current 64×64 source artwork still limits fine detail at 1080p; the new concept is not a playable animation or modular clothing set.


