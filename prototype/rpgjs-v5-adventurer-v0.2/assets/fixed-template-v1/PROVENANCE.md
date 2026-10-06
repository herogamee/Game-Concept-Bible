# Fixed front-template proof — 2026-10-06

Status: a review candidate for one front standing pose, three eye sets and two cheek-detail face sets. The owner has not accepted this master or its visual quality. It does not implement the full clothing, hair, hat, glasses, wings, full-costume or animated authoring standard.

## Preserved original inputs

The previous [head/hair provenance](../character-master/head-hair/PROVENANCE.md) owns the coherent original character and scalp reconstruction. No commercial-game pixels or owner game screenshots were used as generated-image references here.

- `../character-master/head-hair/head-face.png`: the inherited head geometry and amber eye/brow/mouth source.
- `../character-master/head-hair/body-traveler.png`: copied byte-for-byte as `clothing-traveler.png`. This contains the dressed body, scarf, limbs and shoes. It is **not an independently authored naked body or a new clothing silhouette**.
- `../character-master/head-hair/hair-chestnut.png`: copied byte-for-byte as `hair-chestnut.png`; its original drawing-specific extraction is inherited, not validated for future hairstyles.

## ImageGen sources and exact prompts

Generated with the built-in OpenAI ImageGen tool, transparent background requested. All original results below are retained unchanged alongside their exact submitted prompts. The source-output directory was `C:/Users/Gamee/.codex/generated_images/01a10f4c-08c6-74b0-a73d-a7aa1e81e592/`.

| Retained source | Original output filename | Exact prompt / use |
|---|---|---|
| [head-blank-generated.png](head-blank-generated.png) | `exec-96f10786-7ece-49cf-b86e-402371c78faf.png` | [head-blank-PROMPT.txt](head-blank-PROMPT.txt); remove inherited eyes/brows/mouth, retain nose. Only common feature zones enter the published head. |
| [eyes-determined-generated.png](eyes-determined-generated.png) | `exec-a5255e95-459c-45d4-ad98-68968fa83d77.png` | [eyes-determined-PROMPT.txt](eyes-determined-PROMPT.txt); green determined eyes/brows/smile. |
| [eyes-joy-generated.png](eyes-joy-generated.png) | `exec-ae80be59-0080-43fd-a00e-8c444b2b7051.png` | [eyes-joy-PROMPT.txt](eyes-joy-PROMPT.txt); closed joyful eyes/brows/open mouth. |
| [face-scar-generated.png](face-scar-generated.png) | `exec-f934fc8c-6ef3-4f18-ad8a-b5c96bfb153a.png` | [face-scar-PROMPT.txt](face-scar-PROMPT.txt); unused first attempt, marks too high. |
| [face-blush-generated.png](face-blush-generated.png) | `exec-4c55d4cf-c65e-40ad-90e1-c7e0c2f5e677.png` | [face-blush-PROMPT.txt](face-blush-PROMPT.txt); unused first attempt, freckles too high. |
| [face-scar-correction-generated.png](face-scar-correction-generated.png) | `exec-b58dafd3-ec9b-4eed-971b-ec7a706a9b6c.png` | [face-scar-correction-PROMPT.txt](face-scar-correction-PROMPT.txt); unused numeric-placement correction. |
| [face-blush-correction-generated.png](face-blush-correction-generated.png) | `exec-4d331c28-3f73-4beb-a1f8-e1f66a60d270.png` | [face-blush-correction-PROMPT.txt](face-blush-correction-PROMPT.txt); unused numeric-placement correction. |
| [face-scar-registered-generated.png](face-scar-registered-generated.png) | `exec-192c61ef-4556-4282-98d0-917c17ccb94f.png` | [face-scar-registered-PROMPT.txt](face-scar-registered-PROMPT.txt); final guided cheek source. |
| [face-blush-registered-generated.png](face-blush-registered-generated.png) | `exec-af3b8132-3982-4562-ab86-436181a8bd12.png` | [face-blush-registered-PROMPT.txt](face-blush-registered-PROMPT.txt); final guided cheek source. |

The blank-head edit used the inherited head as target. Eye/initial face edits used the newly published blank head. Numeric face corrections used the previous face result plus the blank head. Final face edits used the blank head plus [cheek-placement-guide.png](cheek-placement-guide.png), a native Canvas engineering annotation of the same canonical cheek boxes. Blue guide marks are not part of the published character artwork.

## Registered export procedure

`tools/build-fixed-template.mjs` requires **1254 × 1254** sources. It never fits, scales, recentres, rotates or moves an item. Every runtime layer retains that full canvas and shared origin **(0,0)**. [manifest.json](manifest.json) records template `fixed-front-v1`, pose `stand-front`, defaults, fixed reference coordinates, draw order and display rectangles.

1. Publish `head-template.png` by replacing only common eye/brow/mouth regions with generated blank skin. Copy the inherited head's alpha everywhere, and its RGB outside those regions. This protects the existing contour, ears, scalp and nose region; owner acceptance of the resulting blank master is pending.
2. Use the **same** three elliptical authoring regions for all eye sets, including inherited amber: centres/radii `(534,383;72,80)`, `(704,383;72,80)`, `(625,487;64,30)`. Export eyes/brows/mouth together.
3. Use the **same** two cheek regions for both initial face sets: `(501,470;29,23)`, `(749,470;29,23)`. Exclude the common eye-set regions. These two face sets are cheek-only; tattoos/earrings and other placements need category authoring review.
4. Feather category-region edges over the outer 12% of their radius. These are **bounded patches with skin underpainting**, not automatic ink-only decal extraction. Minor shading transitions inside authoring zones still require visual review. Raw generated pixels elsewhere do not enter the runtime layers.
5. Keep body/hair unchanged. Compose clothing → head → eye set → face set → hair, all at (0,0). Only after composition, use constant display crops for full character, hair-inclusive head zoom and bald catalog icons. Crops do not depend on the selected item.

Generate the engineering guide with `node tools/fixed-template-authoring-guide.mjs`. Rebuild exported runtime files with `npm run assets:fixed-template`; verify with `npm run verify:fixed-template`.

Nine generation jobs were used for this small trial, including four unused face attempts. Production time/repair throughput was not benchmarked. This is evidence that one bounded template can accept independent feature sets, **not evidence that the process reliably authors thousands of items**. See [the review](../../evidence/fixed-template-v1/REVIEW.md) for tested scope and unfinished work.
