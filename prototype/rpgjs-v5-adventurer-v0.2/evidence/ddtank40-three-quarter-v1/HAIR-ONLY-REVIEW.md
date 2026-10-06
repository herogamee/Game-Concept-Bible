# Hair-only source correction — 2026-10-06

The owner rejected the standalone brown hair PNG: skin-colour remnants, damaged bang/sideburn edges and a detached remnant below a mechanically punched ear hole were visible. The earlier skin-seed/morphology/support/ear-mask extraction was the authoring mistake. Matching resource dimensions, combinations and the protected ear rectangle had not proved a good standalone asset.

## New sources and exact prompts

Built-in `image_gen` authored three new transparent PNGs containing hair alone. Rejected original hair layers were hairstyle references; the immutable blank head was a spatial guide only. No face/head was rendered and then removed.

| Style | Preserved raw tool output | Exact prompt | Registered hair / active native B |
|---|---|---|---|
| Brown | [raw](../../assets/ddtank40-three-quarter-v1/hair-chestnut-only-generated-v2.png) | [prompt](../../assets/ddtank40-three-quarter-v1/hair-chestnut-only-v2-PROMPT.txt) | [registered](../../assets/ddtank40-three-quarter-v1/hair-chestnut-only-v2.png) / [native](../../assets/ddtank40-three-quarter-v1/layers/hair-chestnut.png) |
| Blue | [raw](../../assets/ddtank40-three-quarter-v1/hair-teal-only-generated-v2.png) | [prompt](../../assets/ddtank40-three-quarter-v1/hair-teal-only-v2-PROMPT.txt) | [registered](../../assets/ddtank40-three-quarter-v1/hair-teal-only-v2.png) / [native](../../assets/ddtank40-three-quarter-v1/layers/hair-teal.png) |
| Silver | [raw](../../assets/ddtank40-three-quarter-v1/hair-silver-curls-only-generated-v2.png) | [prompt](../../assets/ddtank40-three-quarter-v1/hair-silver-curls-only-v2-PROMPT.txt) | [registered](../../assets/ddtank40-three-quarter-v1/hair-silver-curls-only-v2.png) / [native](../../assets/ddtank40-three-quarter-v1/layers/hair-silver-curls.png) |

All canvases are1254×1254. Raw generation made this source family larger than the existing head template despite the prompt. `hair-only-import.mjs` registers all three with one fixed uniform matrix [0.72,0,0,0.72,168,3]. It does not measure or fit an item's painted bounds, trim transparency, segment skin, punch ears or repair the hair contour. A first shared x translation178 left63 visible brown pixels over the protected ear; a family-wide shift to168 cleared the same fixed ear window for all three. The import retains the raw alpha contours and trace-alpha noise. Native full hair copies each registered PNG byte-for-byte.

The full-character export still uses the shared uniform matrix [0.21075455333911536,0,0,0.21075455333911536,-32.59291891935706,49.19774501300952]. Runtime hair remains250×312 at(0,0), under `image/equip/m/hair/ours_hair_{1|2|3}/1/{A|B}/show.png`. There is no item-specific runtime fit. B is full hair; A derives only from the existing common tilted-cap coverage rule.

## Evidence and bounded checks

- [Native standalone hair and assembled fixed heads](hair-only-native-review.png), regenerated with `node tools/ddtank40/review-hair-only.mjs`. Large views show naturally drawn connected bang/sideburn tips and no visible skin fringe or detached ear remnant.
- [Rejected brown layer](hair-before-hair-only.png) is the exact old native file used as the brown design reference. Blue/silver rejected native references are preserved alongside it. These are original project art, not commercial assets.
- [Current verification](hair-only-verification.json): registered/native byte identity; empty eye/mouth fixtures; empty lower-body regions (alpha<16, not a claim of mathematically zero trace noise); one connected hair mass per style at alpha≥32; no detached component larger than32 pixels; explicit rejection of the old detached brown remnant; unchanged head, shared import/export, ear and cap fixtures.
- `npm run assets:ddt40` and `npm run verify:ddt40 -- D:/Codex/DDtank` pass33 resource dimensions/hashes,162 original standing compositions,12 source substitutions and unchanged installed male/female default pixels.
- Actual browser checks at `http://127.0.0.1:5199/fixed-template`: blue/silver selections update the native source link; cap chooses A; hiding it restores B; reset restores brown; the1254-square native image loads; no console warnings/errors. The new “ดูไฟล์ทรงผมเดี่ยว” disclosure shows the current runtime A/B and a native B link.
- Actual browser screenshot stays external at `D:/Codex/DDtank/research/compatibility-4.0/hair-only-browser-review.png` because it includes the installed commercial reference.

These checks establish the replacement source pipeline and standing review. Owner visual acceptance, other poses/views, catalog throughput and real Flash registration/interoperability remain pending. The full master preserves the earlier brown design for comparison; newly drawn independent hair is not pixel-identical to that full portrait.
