# Original modular chibi art — 2026-10-06

Eight transparent PNG masters were generated with the built-in OpenAI ImageGen tool for this project. No DDTank/commercial-game pixels, LPC layers, or external reference images were supplied. The existing DDTank 4.0 installation remains a local research reference, separate from these runtime assets. Preserve these masters and this record when distributing the prototype.

## Generation brief and layout

Common brief: original clean-outline fantasy anime chibi, approximately 2.5 heads tall, warm light skin, amber eyes, dark brown outlines, flat cel shading, readable at small size, illustrated rather than pixel art. Transparent RGBA; detached production pieces only, generous margins, no labels/grid/text, consistent four views. Directions are south/front, west/left, east/right, north/back. All parts must match one shared cutout rig.

| Master | Prompt specification / layout |
|---|---|
| `base-parts.png` | Exactly 4×4 equal cells. Row 0: bald neutral heads in four directions, full face/ears, no hair/hat. Row 1: neutral skin torso in four directions, no clothes. Row 2: vertical upper arm, forearm, hand, bare foot. Row 3: neck, dark brown shorts/hip, thigh, shin. No complete characters. |
| `hair-chestnut.png` | Detached chestnut spiky hair crown in exactly 2×2 views: front, left, right, back. No face/head/ears inside; front has an empty transparent face opening. |
| `hair-silver.png` | Matching detached silver soft bob with blue-gray shading; same 2×2 views and empty face opening. |
| `boots.png` | Single dark brown adventurer boot with a gold buckle, four matching views in 2×2. No legs or feet inside. |
| `hat.png` | Green adventurer cap with cream feather and brown band, four matching views in 2×2. No head/hair/face. |
| `shirt-traveler.png` | Exactly 4 columns × 2 rows. Row 0: cream linen shirt, short brown vest, small teal scarf and brass belt as detached torso garment, four directions. Row 1: matching short cream upper-arm sleeves in four directions. Transparent armholes, no skin/hands/legs. |
| `shirt-blue.png` | Same 4×2 garment layout: royal-blue gold-edged jacket, cream collar/silver clasp/navy belt, matching blue sleeves. |
| `sword.png` | One isolated upright silver short sword, gold crossguard and brown grip, full blade and grip visible, no hand/character/text. Portrait transparent canvas. The generated master has a faint translucent edge halo; further cleanup is art review work. |

These are production-brief records, not a claim of byte-for-byte original prompt transcripts. The original tool responses are retained in the Codex task; the committed masters are the reproducible input to the rig/export pipeline. `tools/build-modular-assets.ts` analyzes alpha bounds in each cell and exports a crop manifest without repainting the masters.

## Source mapping

Original output names (task `01a10f4c-08c6-74b0-a73d-a7aa1e81e592`):

- Base: `exec-b518323a-8ad1-4962-b950-2e445bc0935b.png`
- Chestnut hair: `exec-141e5621-39fc-46ea-8d0b-2b097e25799a.png`
- Silver hair: `exec-8adff71e-2575-4a80-b1e2-187c4d4f5633.png`
- Boots: `exec-6b572baa-9b8e-47e3-ab57-41b063b7880d.png`
- Hat: `exec-f799180f-f604-4de1-ace6-ac112fd03cc5.png`
- Traveler shirt: `exec-0f5ac452-9823-4d31-8de4-0100a47ea481.png`
- Blue shirt: `exec-33cf5ae1-1466-4d69-81ad-8cd4baa5f890.png`
- Sword: `exec-e54575a0-405a-49bb-af52-ac6bb85d501b.png`

## Runtime exports

`npm run assets:modular` creates 47 cropped part references, eight original part images for the large portrait/gallery, and sixteen 1536×1536 atlases (192px cells, logical scale 1/3). Four walk rows then four slash rows; eight frames per action/direction. These are deterministic skeletal/cutout exports, not individually generated full-costume animation frames. The old painted hero remains a separate comparison option.

The sixteen-combination cache is deliberately bounded to this first slice. Hundreds of items should use layered runtime rendering or an on-demand cache with eviction; do not expand a Cartesian export across a production wardrobe. Faces/eyes/sex variants, dyes, wings, auras and equipment stat/ownership systems are future work. This art requires owner visual/feel review and cleanup before being called production-ready.
