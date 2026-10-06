# Original head and hair composition — 2026-10-06

This checkpoint supplies actual original head/face, hair and dressed-body PNGs and a working browser toggle. It is bounded to one front standing pose and one hairstyle. Owner visual review remains pending.

## What runs

Start the local tool from the candidate directory:

```powershell
npm run lab:registered -- D:/Codex/DDtank 5199
```

Open `http://127.0.0.1:5199/original`. Its three original images load through the same frame-preserving compositor used in the reference proof. All are 1254 × 1254 and draw at (0, 0). Removing hair removes that one layer; it does not refit the remaining character to its visible bounds. CSS scales the complete canvas for display. A fixed crop supplies both head comparisons.

The current server also hosts the external 4.0 reference catalog, so startup requires the local DDTank Lab. The `/original` rendering uses only project original-art layers; no commercial image is included in these PNGs or this review screenshot.

## Measured verification

`npm run verify:head-hair` passed. [verification.json](verification.json) records full-frame dimensions, shared origins, six exact pixel comparisons between hair-on and hair-off, zero hair pixels in those protected regions, and deterministic re-equipping. Protected regions are the two irises, the interior of each ear, the mouth, and the complete neck/body below row 543. These are specified rectangles, not a claim that every facial pixel is outside the hair footprint.

The dressed-body region also matches the preserved original master exactly. Reassembly is **not pixel-identical to the flattened master**: the newly generated bald underpainting and authored mask edges produce a mean premultiplied RGB channel difference of 0.4232, a maximum of 251.0157, and 24,202 pixels with a channel difference over 3, across 1,572,516 canvas pixels. The maximum includes changed edge/background pixels; the mean does not by itself establish visual quality.

In the actual browser, clicking “ถอดผม” changed the main canvas state to `data-hair-visible=false` and the selected control to `aria-pressed=true`; the visible bald head retained the eyes, mouth, ears and body placement. Clicking “ใส่ผม” restored `data-hair-visible=true`. [browser-head-pair.png](browser-head-pair.png) captures the side-by-side result on the working page. [head-close-review.png](head-close-review.png) additionally compares the original flattened master, reassembly and bald head.

Before saving the repository checkpoint, `git diff --check`, `npm run typecheck`, all 44 existing candidate tests, `npm run build`, and the root/subpath production preview smoke passed. Existing Vite configuration/chunk-size warnings remain. These checks preserve the candidate's technical baseline; they do not approve the rejected rig art or the new head/hair art.

## Remaining work

The generated bald edit is not a layered source drawing and changed some outer head/ear details. The extraction masks are specific to this pose. Hair-edge quality and the art itself still need owner review. A second independently authored compatible hairstyle, complete outfit replacement, sex defaults, hats, other directions, animation and integration into the playable character remain unimplemented for this original character. The earlier limb and head/hair experiments remain rejected.

Sources, exact generation prompts and the unused failed extraction are retained in [asset provenance](../../../assets/character-master/head-hair/PROVENANCE.md).
