# Blank-head / hair-only pair — 2026-10-06

Owner-directed replacement for the rejected ghost-head method: generate the standard head wearing the intended hairstyle first, then derive a hair-only transparent PNG from that exact master. The owner corrected the initial eyed preview: both final images must have no eyes, eyebrows or mouth. Those features remain an independent eye set.

Built-in ImageGen made an initial eyed preview, a corrected blank-head/hair master, and the matching hair-only output. Exact prompts and original PNGs are preserved in `assets/ddtank40-three-quarter-v1/hair-pair-v1/`. `blank-head-hair.png` and `hair-only.png` are the delivered pair. Pre-correction references/preview remain in its `history/` subdirectory, not in the delivered view.

`review-hair-pair.mjs` draws each source at(0,0) on1254×1254 without fitting, cropping, rescaling or skin segmentation. It also composites the new hair above the unchanged original head (`reassembled-blank-head.png`). Both delivered images and reassembly were visually inspected: no eyes, brows or mouth. The standard head SHA256 fixture remains unchanged; generated skin does not replace it.

The two ImageGen outputs are not pixel-identical in their hair. A blue-pixel diagnostic gives silhouette IoU0.969746 and average absolute RGB-channel difference12.305 on their intersection. This is a rough colour classifier, not authoritative segmentation or an artistic acceptance score. Some contour/shading pixels were redrawn during extraction. Transparent face/ear samples pass; they do not certify all edges. Owner visual acceptance and an exact repeatable production process remain pending.

The lab shows both files and reassembly, with the old rejected ghost-head proof collapsed and labelled. The new pair is review-only and does not add or replace a catalog item. Canonical DDTank resource dimensions, existing apparel/face selections, runtime exports and save schemas remain unchanged. The head+hair master is a preview/design resource; using it as a hair layer would cover interchangeable eye sets.

Verification: `node tools/ddtank40/review-hair-pair.mjs`; report `blank-head-hair-pair-verification.json`; native proof `blank-head-hair-pair-review.png`. Browser proof is stored externally in `D:/Codex/DDtank/research/compatibility-4.0/blank-head-hair-pair-browser.png` after checking the visible lab. This does not certify Flash integration, new expressions, actions or female poses.
