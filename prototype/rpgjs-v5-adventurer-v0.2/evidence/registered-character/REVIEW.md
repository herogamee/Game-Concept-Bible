# Registered character composition — local web proof, 2026-10-06

This checkpoint implements a bitmap-layer compositor and working wardrobe controls. It **does not complete the original-art wardrobe**. The previously generated cutout pieces remain rejected. A later [original head/hair checkpoint](../character-master/head-hair/REVIEW.md) now derives three layers for one front pose and runs at `/original`; its art review and broader wardrobe remain pending.

## What actually runs

`tools/registered-character/compositor.mjs` loads all selected registered layer frames before drawing, rejects malformed/out-of-bounds frames, and draws each source frame at the shared origin at its original size. There are no bone rotations, alpha-bounds fitting, independent part scaling or per-combination alignment repairs. Display enlargement applies to the whole canvas through CSS.

The separate local 4.0 portrait adapter uses the verified Lab order: face, hair, cloth, effect, hat, glasses, weapon. It retains independent selected slots and sex defaults. Hat metadata chooses hair A/B; hiding a hat restores B. Portrait face-expression columns use 250px frame strides. Source portrait PNGs are often 250×312 (face 1000×312), so the 250×342 target pads the remaining area with transparency instead of stretching the source to fill it.

The web page offers male/female selection, separate face/hair/cloth and additional equipment selectors, four expression indices, empty-slot fallback, individual layer visibility, and a clickable two-face × two-hair × two-cloth comparison. A revision guard prevents slower old asset requests from overwriting the latest selection.

The source adapter reads the already cataloged 4.0 installation through the external DDTank Lab. Its loopback server serves only whitelisted image IDs and known local page files. The original game's repository receives code and numeric verification results, **no copied commercial sprites or rendered screenshots containing those sprites**. The local reference/combination sheets and UI screenshots are saved under the DDTank Lab's tests directory.

## Reproduce

From `prototype/rpgjs-v5-adventurer-v0.2`:

```powershell
npm run lab:registered -- D:/Codex/DDtank 5199
npm run verify:registered -- D:/Codex/DDtank
```

Open `http://127.0.0.1:5199/`. The external directory must contain `settings.json`, `data/assets.json`, `data/equipment.json`, and the accessible original/converted images referenced by the existing Lab. The server binds to 127.0.0.1. It is a local research tool, separate from the RPGJS game and production build.

## Verification and limits

The verification harness rendered sixteen distinct combinations (eight per sex) using identical source-frame origins. Male/female defaults matched the independently exported Godot Lab reference with max alpha delta 1 and max premultiplied color delta approximately 1.40/1.96, within different bitmap blending implementations' rounding tolerance. Seven independent missing-slot fallbacks per sex preserved the exact baseline and did not mutate selections. Visible hat A and hidden-hat B rendering, expression frame selection, incompatible sex/slot/item rejection, invalid frame rejection and failed-load preservation passed.

In the browser, the male face/hair/cloth selectors changed to 6102/3102/5102 and produced the corresponding composed character. Switching to female restored 6201/3201/5201. Clicking the female matrix's 6202/3202/5202 combination updated all three slots. Clearing selections restored the female defaults. Choosing hat 1202 loaded hair A. The female eight-combination gallery was captured at `D:/Codex/DDtank/tests/screenshots/registered-web-female-matrix.png`.

The catalog exposes 3,449 ready portrait items; this is a source count, not a claim that every item/hat/face expression combination was tested. Missing variant/frame images report an error and retain the previous composed image. No battle animations, wings/auras, production inventory ownership or original-art integration were added here.

**Conclusion of this reference checkpoint:** the new web compositor can dress a character when source layers already share the character's frame/pose. The old generated pieces lack that correspondence. The subsequent original head/hair study supplies a first bounded layer set, with its own measured limits; neither this reference proof nor that single-hair test establishes a complete original wardrobe or owner acceptance.
