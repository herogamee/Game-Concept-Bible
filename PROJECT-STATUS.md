# Project status

## Locked current character study — 2026-10-07

The owner requested a repository summary and invariant baseline for the latest external DDTank lab. See [design standard v1](design/DDTANK-CHARACTER-STANDARD-v1.md), [contract](characters/ddtank-lab-v1/contract.json), and [verification](characters/ddtank-lab-v1/evidence/verification.json). Original generated art/source/code is now preserved with runtime catalog/PNG guards and a snapshot/live-file verifier. Current custom support: male/downleft, two outfits with real stand and eight walk frames, independent head/hair/eye/detail/cap swaps, blink, standard-head inventory icons, and centered native aura composition. Nine items form 48 looks/384 walk-pose combinations; these counts are not visual-quality approval. Other equipment, directions, combat and production-game integration remain incomplete. This supersedes prior walking trials as the current study checkpoint; no production-engine migration is declared.

## Current character-authoring direction — 2026-10-06

The owner clarified the [fixed-template asset standard](prototype/rpgjs-v5-adventurer-v0.2/CHARACTER-APPEARANCE.md#owner-defined-fixed-template-asset-standard--2026-10-06): one normal head/body with invariant proportions and pose registration; separate eye sets (eyes + brows + mouth), face sets, hair, glasses, hats, wings, integrated clothing (top + trousers/skirt + shoes), and full-costume replacement. These requirements and remaining authoring deliverables are now recorded. The immediate work is to establish a repeatable asset-production process before catalog expansion or engine migration.

The local `/original` and `/walk` studies and their technical checks are preserved. `/walk` combines head/facial-feature images, two hairstyles and two outfit colourways across one right-facing eight-frame clip. It does not separately implement the owner's eye/face sets or prove fixed-template production at thousands of items.

The [`/fixed-template` front-motion follow-up](prototype/rpgjs-v5-adventurer-v0.2/evidence/fixed-front-motion-v1/REVIEW.md) adds two hairstyles and one cap to the three outfit/eye/face wardrobe. The original front stand and four individually authored walk key poses use the same independent cosmetic IDs; head pixels remain fixed across all clothing/actions/frames, and equip/reset preserves the clock. 162 visible looks and 810 pose compositions pass technical checks; actual browser swaps, cap/hair restoration and defaults were inspected. Sources/exact prompts retain 21 new generation jobs, including failed atlas/cap/contact attempts. Four key poses and source-specific exposed-body masks remain review candidates, with gait, foot-support and sleeve polish pending. The master remains unaccepted; broad topology, other directions/actions/equipment, full costumes and catalog throughput remain unfinished. Playable saves and engine APIs are unchanged.

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

