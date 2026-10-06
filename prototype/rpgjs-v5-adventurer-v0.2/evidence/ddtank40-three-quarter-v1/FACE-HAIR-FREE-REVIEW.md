# Remove hair baked into the amber eye set — 2026-10-06

The owner correctly identified brown locks remaining around the blue hairstyle. The blank `layers/head-template.png` was clean. The defect was `layers/eyes-amber.png`: extracting its eye/brow/mouth regions from `master.png` copied brown bangs inside those regions. Export combined that contaminated eye set with the head into `face/ours_face_1/1/show.png`. The runtime selected a separate blue hair layer and did not erase/recolour a brown hairstyle, but its face bitmap already contained those brown fragments.

## Correction and file ownership

- `head-template.png`: the single unchanged blank head/scalp/ears/jaw.
- `eyes-amber.png`, `eyes-determined.png`, `eyes-joy.png`: independently selected eyes+brows+mouth. All three now use their existing `eyes-*-generated.png` hairless source images. This correction reused the preserved clean amber source; it did not generate a new face or change the common template.
- `face/ours_face_{1|2|3}/1/show.png`: canonical1000×312 sheets combining the fixed head with the selected eye set; only frame0 is authored.
- `eff`: independent face marks/details. `hair`: separate selected A/B resource. Switching hair retains the same `face` resource; a hairstyle must never be needed to cover defects in the face.

The common export matrix, head alpha contour, clothing and all hair PNGs remain unchanged. Remove the default master-source special case; record the explicit hairless source map in the authoring manifest. Preserve the rejected amber native/face PNGs as fixtures.

## Evidence

[Before/clean face/blue-hair comparison](face-hair-free-native-review.png) shows the same native head. The original full master remains a design reference, not a runtime base under the blue hairstyle.

[Current verification](face-hair-free-verification.json) passes33 dimensions/hashes,162 combinations and unchanged installed male/female defaults. Three registered forehead fixtures that formerly contained opaque brown hair now match clean template skin. The old fixture is checked to actually contain the rejected hair pixels. All three eye sets retain the same exported head alpha.

The live browser shows “ดูใบหน้าโดยไม่ใส่ผม” and a link to the actual face PNG. Selecting blue or silver hair retains `face/ours_face_1/1/show.png`; the final review is left on blue hair with face-only inspection open. No console warnings/errors. Mixed screenshots remain external at `D:/Codex/DDtank/research/compatibility-4.0/face-hair-free-browser-review.png`.

Earlier hair-only checks validated the hair assets, but missed hair already baked into the eye set. Their passing result did not certify a clean face. This correction is a standing-layer repair; owner art acceptance, other views/actions and full Flash interoperability remain pending.
