# NewLife Quest — City Hub and Living City direction (owner decisions, 2026-10-10)

**Status: OWNER-APPROVED interaction/product direction; HOME VISUALS PENDING OWNER REVIEW.**

This document captures explicit decisions from the user's iterative City Hub / Living City design discussion. It must not be misconstrued as approval of any of the generated Home mockup images. Do not lock a final Home illustration, exact road plan, building geometry, composition, UI coordinates or icon package yet.

## Locked interaction decisions

### A — City Hub is the first Home after character creation
- Default after character creation/selection: **City Hub in เมืองเทิร์นเฮเวน / Ternhaven**.
- Entire city is visible as one connected interactive illustration, desktop baseline **1920 × 1080**, landscape aspect ratio. **C1:** no required camera scrolling, zooming or district drilldowns to access the main buildings.
- **There is no player avatar displayed on the City Hub city scene.** City Hub shows only the city/environment and minimal UI; the avatar exists in character screens and Living City.
- **Click/tap the actual visible building or site** to access its destination/service directly. Do not require clicking floating nameplates, icon cards or separate building buttons.
- Labels appear **above or below** their locations and **must never cover building silhouettes, entrances, or clickable façades**. Use true runtime localized labels and separate hit regions; do not bake labels into the panoramic artwork.
- The town must privilege **large, visually distinct, easy-to-tap buildings separated by readable paths**, not an overly dense landscape/forest/monument composition. Trees and scenery are secondary.
- On pointer hover/focus/touch, give understandable feedback. Clear affordances/accessibility alternatives are needed for keyboard and touch.

### A2 — Convenient core services plus rewarding Living City exploration
- **City Hub** makes essential daily services available directly: Guild registration/contracts/reporting/ranks, market/shops, smithy, inn/rest, clinic, training, route selection and dungeon planning under existing eligibility rules.
- **Living City** is the same actual town navigable with the player's character, with conversations, player/social encounters, environmental clues, optional secret quests and discoverable corners.
- Optional discoveries should reward exploration without turning basic everyday activities or mandatory story progress into repeated forced walking. Previously discovered places or secrets should persist and be readable through appropriate normal UI.
- NPC background behavior remains subject to the **Player-First** canonical rule; NPCs must not autonomously consume the player contract pool.

### B2 — Only significant interiors need actual walkable scenes
- Prototype real interiors for meaningful places such as the Adventurer Guild, a shared inn/tavern and the Underfold gatehouse where exploration/interaction benefits from it.
- Ordinary stores, smithy service counters and routine buildings can open the appropriate real UI after entering interaction range. The same service UI works via a building click in City Hub.
- Not every house is fully explorable. Exact interior list and level extent are production details, to be validated through the bounded F→E slice.

### One world, one state
- Both modes use shared IDs and authoritative state for locations, inventories, money, quests/contracts, NPC state and services. Do not author two separate economies, services or progression flows.
- Enter Living City by a clear **เดินสำรวจเมือง / Explore City** action; return to City Hub without losing in-world progress.
- Preserve Living City location or choose a justified safe position when changing modes; mode switching must not act as unrestricted teleportation, bypass permit/route restrictions or escape in-combat risks.
- City Hub building clicks may open services quickly but do not override world travel, unlock levels or unearned dungeon access.

## Supporting UX decisions discussed and accepted as constraints

- Desktop City Hub's **lower-left corner is reserved for in-game chat**. The inn/hotel building and its label need enough distance **above the chat-safe zone** that the chat window does not cover its clickable area.
- Chat can be collapsible/minimized on **mobile landscape** to prevent blocking city sites. Keyboard input, touch safety and chat channels must be handled in the actual UI.
- Bottom area may host compact icons for Inventory, Quests, Map, Friends and an Explore City action; exact graphic styling/placement is **not yet final**.
- Visual reference for building composition and interaction ergonomics: DDTank Hall's *building-first* city-lobby pattern, **not** its copyrighted/proprietary art/assets. Use original NewLife Quest town architecture.
- Live 2.5D Living City is a practical near-term candidate; 3D remains an option to evaluate, **not an approved engine/pipeline migration**.
- The game is intended for **landscape gameplay** across desktop web, computers and mobile web. Responsive scaling must preserve building visibility, tap usability and labels. The reference desktop canvas size is not a mandate to stretch a single raster screenshot across every aspect ratio.
- **Thai `th-TH` and English `en-US` have equal full-localization requirements** across locations, NPC names where localized, dialogs, UI, quests, systems, chat UI and error messages. Thai display names such as เมืองเทิร์นเฮเวน should be used in Thai; English names in English. Transliteration of proposed lore locations remains subject to the owner glossary and [localization Issue #6](https://github.com/herogamee/NewLife-Quest/issues/6).

## Intended clickable town services (planning list, not visual-placement lock)

- **กิลด์นักผจญภัย / Adventurer Guild** — primary center
- **ตลาดกลาง / Central Market**
- **โรงตีเหล็ก / Smithy**
- **โรงแรม / Inn**
- **สถานพยาบาล / Clinic**
- **ลานฝึก / Training Yard**
- **ประตูเมือง / Town Gate** — travel routes with eligibility rules
- **ท่าเรือ / Harbor** — travel/river service only when implemented
- **อันเดอร์โฟลด์ / Underfold** — dungeon gate/preparation with eligibility rules

Other story landmarks may be planned, but do not treat them as already playable, finalized art or new approved systems.

## What is explicitly **NOT locked**

- **Home/City Hub final art and mockup** — owner will return to this later. Recent City Hub image generations and iterations are **exploratory**, not the visual source of truth.
- Exact building x/y positions, town map, exact size, building count, street geometry, color grading, chosen Home image and exact chat panel pixels.
- Final engine (2.5D vs 3D), networking backend, production asset pipeline or release-ready responsive implementation.
- Out-of-scope story systems such as a full 100-floor implementation, all continent travel and major new standalone mechanics.

## Initial implementation approach and checks (advisory to Codex)

1. Preserve the existing prototype and F→E game loop; don't rebuild Home/City Hub art yet just because this decision was recorded.
2. When authorized to implement the Hub, use a semantic mapping of location IDs to interactable building hit areas and service routes; validate hit targets from the **actual building image**, not a label overlay.
3. Test all primary buildings at 1920 × 1080, a narrower 16:9 landscape viewport and a wide phone-landscape viewport. A fallback accessible location menu is acceptable on especially constrained screens, not as a replacement for building clicking.
4. Confirm the hotel remains visible and clickable with desktop chat open, and phone chat collapsed/open.
5. Confirm both languages have full coverage without embedded text in the scene art.
6. A City Hub action and its Living City counterpart must yield the same in-game result and permission checks.
7. Respect `AGENTS.md` decision authority and explicit owner approvals.

Related: [owner-approved logo/login](OWNER-APPROVED-LOGIN-AND-LOGO-2026-10-10.md), `design/vertical-slice.md`, `world/starter-region.md`, `bible/GAME-CONCEPT-BIBLE-v0.2.1.md`.
