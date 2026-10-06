# Project status

## Current character-authoring direction — 2026-10-06

The owner clarified the [fixed-template asset standard](prototype/rpgjs-v5-adventurer-v0.2/CHARACTER-APPEARANCE.md#owner-defined-fixed-template-asset-standard--2026-10-06): one normal head/body with invariant proportions and pose registration; separate eye sets (eyes + brows + mouth), face sets, hair, glasses, hats, wings, integrated clothing (top + trousers/skirt + shoes), and full-costume replacement. These requirements and remaining authoring deliverables are now recorded. The immediate work is to establish a repeatable asset-production process before catalog expansion or engine migration.

The local `/original` and `/walk` studies and their technical checks are preserved. `/walk` combines head/facial-feature images, two hairstyles and two outfit colourways across one right-facing eight-frame clip. It does not separately implement the owner's eye/face sets or prove fixed-template production at thousands of items.

The [new `/fixed-template` front proof](prototype/rpgjs-v5-adventurer-v0.2/evidence/fixed-template-v1/REVIEW.md) implements independent eye/brow/mouth and cheek-detail face sets: three eye sets × three face states, hair removal and eye hiding, with one invariant published head and unchanged dressed body/hair. All 36 composition/visibility cases passed registration/protected-pixel checks, and browser selection/reset/gallery behavior was inspected. Exact sources, prompts, shared masks and four unused face-placement attempts are preserved. The head/body candidate remains unaccepted; new clothing/hair/equipment, full-costume policy, broad action coverage and production throughput remain unfinished. This lab addition does not change playable appearance saves or engine APIs.

## Historical implemented game checkpoint — 2026-10-03

We are at a **small playable village/meadow prototype**, not a full RPG/MMO. Bible version numbers describe design documents; they are not percentages of implemented gameplay. v0.1 remains the product reference. The RPGJS v0.2 candidate is reviewable, with visual/control acceptance still pending.

| Area | Actual implementation |
|---|---|
| World / art | Village and meadow, original clean-outline chibi hero v2, HD exports of painted scenery/NPCs/slime, 2x deterministic terrain, camera/Y sorting. Hero is a baked costume; complete style unification is pending. |
| Controls | Ground click routing, WASD/arrows, click pursuit, sword slash and cancel. Normalized diagonal WASD/arrows and continuous route/steering corrections are implemented; owner feel review remains pending. |
| Combat / growth | Four Lv.1 slimes, phased server-validated damage, hit feedback, EXP/Gold/Gel, level growth, death/recovery and respawn. Higher monster tiers are in v0.1, not this bounded candidate. |
| Quest / inventory | One three-kill elder quest, real turn-in/rewards, starter sword/count-based bag, potion use and merchant purchase. |
| Audio | Original synthesized village/meadow music, slash/hurt/level effects, separate preferences. New audio research is preserved; no external pack has been ingested. |
| Display | Selectable smooth/native-density vs original pixel mode, separate local preference. Responsive camera crops the 800×450 reference without changing world units; physical resolution is capped at 3×. Saved camera distance/vertical framing and steady/follow choices, with 125% desktop default and map-bounded uniform scale. Compact HUD, scrollable dialogs, 85–130% UI scale and touch foundation; real-device acceptance pending. Higher source detail is not created by this setting. |
| Appearance | Versioned durable/synchronized cosmetic slots, catalog validation and graphic-stack resolution; base-body migration for old saves. No real modular wardrobe or dressing UI yet. |
| Character Lab | Frame/cadence inspector, local PNG/manifest and appearance layers, sword phase/range inspection and separate-save actual-game Slime testing. Missing class assets are explicit; gait redraw and class gameplay remain pending. |
| Save / online | Standalone save/load/reload; two-client authoritative death/single reward proof. Online guest reconnect cleanup and durable accounts/storage remain open. |
| Portability | Committed source/assets/lockfile/maps plus build commands and portable standalone packaging. Node.js 22+ required for local launcher. |

This checkpoint passed TypeScript, **38 focused tests**, build and root/subpath production smoke including active HD textures and the separate Character Lab entry. Browser checks exercised both display modes (1280×720 vs 800×450 backing at the same 1280px CSS viewport), cross-map rendering, kill rewards and standalone save/reload. See candidate evidence reports for historical multiplayer observations and this checkpoint's additions.

Not implemented: complete character customization, equipment stats/ownership UI, classes/professions, Guild rank progression, broad quest chains, crafting, parties/guild systems, durable accounts, production multiplayer hosting or the 100-floor dungeon. The corresponding Bible proposals remain design work.

Next bounded work: owner chooses image/control feel; author a modular body and compatible transparent costume/face/hair/weapon layers; continue controlled load/frame benchmarking and online visual/input regression. Local Full HD camera/scenery observations are recorded in the candidate evidence/camera/REVIEW.md. Avoid expanding MMO systems before these gates. Production engine choice remains open; no Phaser runtime is installed.

