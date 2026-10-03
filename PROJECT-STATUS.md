# Implemented game status — 2026-10-03

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
| Save / online | Standalone save/load/reload; two-client authoritative death/single reward proof. Online guest reconnect cleanup and durable accounts/storage remain open. |
| Portability | Committed source/assets/lockfile/maps plus build commands and portable standalone packaging. Node.js 22+ required for local launcher. |

This checkpoint passed TypeScript, **33 focused tests**, build and root/subpath production smoke including active HD textures. Browser checks exercised both display modes (1280×720 vs 800×450 backing at the same 1280px CSS viewport), cross-map rendering, kill rewards and standalone save/reload. See candidate evidence reports for historical multiplayer observations and this checkpoint's additions.

Not implemented: complete character customization, equipment stats/ownership UI, classes/professions, Guild rank progression, broad quest chains, crafting, parties/guild systems, durable accounts, production multiplayer hosting or the 100-floor dungeon. The corresponding Bible proposals remain design work.

Next bounded work: owner chooses image/control feel; author a modular body and compatible transparent costume/face/hair/weapon layers; continue controlled load/frame benchmarking and online visual/input regression. Local Full HD camera/scenery observations are recorded in the candidate evidence/camera/REVIEW.md. Avoid expanding MMO systems before these gates. Production engine choice remains open; no Phaser runtime is installed.

