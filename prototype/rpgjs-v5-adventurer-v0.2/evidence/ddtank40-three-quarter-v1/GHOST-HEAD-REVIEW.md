# Hair around an invisible standard head — 2026-10-06

Historical failed art checkpoint: the owner rejected this resource's fit/eye occlusion after the numerical checks below passed. Item `ours-310900004` / `ours_hair_4` now publishes the paired hair-only source as “ผมฟ้า · คู่ภาพหัวมาตรฐาน”; it no longer publishes `hair-ghost-teal.png`. Original rejected masters remain preserved. See [current pair/replacement review](HAIR-PAIR-REVIEW.md). The publication descriptions below record the earlier state.

The owner requires the existing blank head to be the geometric authority. Hair is authored as a separate transparent resource; the head is an input guide, never part of the hair output. Brown hair supplies a volume comparison, not replacement head geometry.

## Published example

`ours-310900004` / `ours_hair_4` is one additional blue standing trial. The existing three styles, head, face and clothing are preserved. Native B is [hair-ghost-teal.png](../../assets/ddtank40-three-quarter-v1/layers/hair-ghost-teal.png); A uses the same existing cap coverage. Runtime resources remain250×312 at(0,0). The common whole-character export matrix is unchanged.

The raw source [hair-teal-ghost-generated-v5.png](../../assets/ddtank40-three-quarter-v1/hair-teal-ghost-generated-v5.png) contains only hair. The final [prompt](../../assets/ddtank40-three-quarter-v1/hair-teal-ghost-v5-PROMPT.txt) locally corrects the left face opening using the hair-only brown guide and blank-head guide. Earlier blue prompts/sources remain preserved. No generated face was deleted, no skin segmentation was used and no ear-shaped hole was punched.

The first generation-space calibration [0.82,0,0,0.82,110,-9] did not pass the eye clearance review; v3/v4 registered trial PNGs are historical, not runtime resources. The final source family uses one fixed uniform import [0.625,0,0,0.625,216,-20], recorded in `ghost-head-import.mjs` and `ghost-head-standard.json`, before the common character export. It resamples the full transparent canvas, retains the hair alpha and does not derive a transform from each item's measured bounds. Future items in this family must use the same matrix and be rejected on drift. This is a calibrated trial, not evidence that an image prompt alone fixes geometry.

`ghost-head-guide-v3.png` was the transformed input guide in the actual blue generation. `ghost-head-guide-v5.png` expresses the unchanged head in the final import's inverse coordinates for subsequent authoring; it was prepared after calibration. Both are guide images only and never enter the hair file. Raw hair retains the model's geometry; the final import is explicitly recorded rather than hidden as runtime fitting.

## Checks and visual limits

[Native proof](ghost-head-native-review.png) shows the unchanged head, standalone hair over a checkerboard and head+eyes+hair. The lab exposes this proof and links both independent files. It adds the selectable “ผมฟ้า · ทดลองหัวล่องหน” without replacing the earlier blue/silver designs.

[Current verification](ghost-head-verification.json) covers16 items/36 PNGs/216 standing combinations,12 source substitutions and unchanged installed defaults. Fixed SHA256 fixtures protect the head and brown hair. New hair copies its registered source byte-for-byte, preserves the actual eye/mouth fixtures, exposes the entire existing ear rectangle and restores B after cap removal. A single connected hair mass is retained. Earlier small blue/silver silhouettes fail the new volume gate.

At alpha≥128, brown hair is631×479 pixels; the new blue is643×467 (width+1.90%, height−2.51%, opaque area−6.35%). This passes the declared short-hair trial envelope of±5% dimensions and±10% opaque area. The outer contour is a new design, not100% identical to brown. Exact head fit, bang occlusion and artistic quality still need owner visual acceptance; three transparent fixtures do not certify every visible pixel around the eyes.

Eight built-in `image_gen` calls were used: blue v3; oversized silver v3; low-position silver correction; silver v3 style transfer; blue v4 ear correction; silver v4 ear correction; blue v5 left-opening correction; rejected silver v5 transfer. Every raw result/prompt is preserved. All outputs were hair alone, but repeated prompts changed size/placement and required calibration. Silver attempts are deliberately unpublished. This does not establish a reliable thousands-of-items pipeline, all poses or100% DDTank interoperability.

Actual browser checks: selecting the new blue then green eyes retains the new hair ID; cap selects A and hiding cap restores B; the1254-square native source loads; console warnings/errors are absent. The current page is left on the new blue and default amber face. Browser proof is external at `D:/Codex/DDtank/research/compatibility-4.0/ghost-head-browser-review.png`.
