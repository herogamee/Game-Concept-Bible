# Shared proportions and neck overlap — 2026-10-06

The owner compared the full generated master with the assembled portrait and rejected the compressed body. They also required clothing to include a neck, with the face above that join, and supplied the external DDTank female `cloth/cloth2/1/show.png` as evidence of a body/neck resource.

**Superseded neck implementation:** the owner subsequently rejected the neck mask described below because it retained chin/face ink and clipped the scarf. The 2608/2222 pixel counts were a failed gate. Current clothing uses complete body-only sources; see [HEADLESS-CLOTHING-REVIEW.md](HEADLESS-CLOTHING-REVIEW.md). The shared uniform export correction remains active. The image galleries now show current body-only clothing, not the superseded mask result.

## What failed

| Former export | Horizontal scale | Vertical scale | Effect |
|---|---:|---:|---|
| Head / eyes / hair / cap | 0.289720 | 0.303529 | Head enlarged separately; 4.77% vertical stretch |
| Clothing / body | 0.244444 | 0.175559 | Body height squeezed 28.18% relative to width |

The independent family transforms altered the head/body ratio. The full master and active default also used different hair/eye edit sources. Both layers were cut at native y627 without enough neck overlap. Dimension, origin and combination tests passed while these visual defects remained.

## Current implementation

One recorded matrix `[0.21075455333911536, 0, 0, 0.21075455333911536, −32.59291891935706, 49.19774501300952]` converts every shared-master part. Source top y56 and ground y1209 map to y61 and y304. No item bounds are measured to fit or reposition an item. Canonical ordinary 250×312 PNGs, 1000×312 face sheets, 250×342 composition canvases and original item IDs remain unchanged.

Default brown hair and amber eye features come from `master.png`; the two other hairstyles use their original larger edits. Compact hair and alternate amber edits remain preserved, marked superseded. The raw 17 images and exact generation prompts were not changed or regenerated in this correction.

A shared curved jaw mask separates the head. Clothing includes a shared neck extending above y627, copied from the master and hidden behind the jaw. Its lower body and protected limbs retain the existing sources. Original clothing declares `headOverlap: behind-face`, so the compositor draws `cloth → face → hair → eff → head → glass → arm`. This is explicit original-art behavior under the owner's correction, not a claim about the measured Flash default order. The reference defaults keep the measured order and exact pixels.

## Evidence and checks

- `before-proportion-fix.png` preserves the rejected original-only portrait.
- `proportion-comparison.png` shows the rejected portrait, full master uniformly reduced, and current assembly at equal canvas sizes.
- `master-uniform-preview.png` preserves the scaled full source; `original-standing-gallery.png` covers the three hairstyles/cap and outfits.
- Reject the old anisotropic body matrix and independent head/body calibration.
- All three clothing exports preserve native bounding aspect ratio within 0.7% raster rounding; the old 28.18% distortion would fail the 3% gate.
- Every outfit retains 2608 native neck pixels above the old cut, including 2222 behind the jaw. Every original combination draws clothing before the face.
- Pass 162 original combinations, three visible independent eye sets with identical head alpha, 5874 protected limb pixels, ear protection, cap crown coverage/restoration, 12 format/render substitutions and exact installed male/female baseline pixels.
- Browser review covers full source/assembly side by side, the clothing-only preview, independent knight/blue/green/cap and mage/silver/joy selections, cap hiding and reset. Mixed screenshots stay in the external lab.

This passes a bounded uniform export and standing neck-overlap check. The curved masks remain source-specific authoring work. Minor regenerated head/feature differences, seams, original/reference anatomical fit, other poses, original Flash registration and owner visual acceptance remain pending. Preserving the master proportions does not make its neck/head/body landmarks identical to the commercial template. Canonical file sizes alone do not certify 100% interchange.
