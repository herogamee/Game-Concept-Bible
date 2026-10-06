# One standing-pose correction — 2026-10-06

This is an art-review input, not an accepted game rig or animation asset. Built-in OpenAI ImageGen produced one front-facing headless **continuous dressed body**, using the project's own generated shirt/contact sheet as appearance references. No commercial-game image was supplied to generation. DDTank 4.0's cloth/face layers were inspected locally to verify the composition method, not imported into this repository.

Original output: `exec-c1c62d7a-cea5-45b2-973f-357b37c6a398.png`, 1254×1254 transparent PNG. Copied here as `traveler-body-front.png`; original remains in the task's generated-images directory. The exact generation prompt is in `PROMPT.txt`.

`tools/build-standing-review.ts` assembles this one body behind the existing original head and chestnut hair. Body proportions are preserved with one uniform scale. No detached upper-arm/forearm/thigh/shin parts are drawn. `registration.json` records the one-pose coordinates used; it is a calibration record, not a multi-view production contract. The head and hair remain independently selectable authoring layers.

Outputs: `evidence/modular/standing-front-corrected.png` and `standing-front-comparison.png`. The image is not wired into walk/attack/four-direction gameplay, and it does not prove interchangeable shirts or production animation. Review this standing silhouette first. Subsequent authored layers need a shared full-frame template, consistent origins and deliberate overlaps; do not extrapolate many cosmetics from independently generated bounding boxes.

## Head/hair registration v2

Status: **rejected by the owner**, along with the previous review. Preserve these outputs as failure evidence; they are not an accepted character or compatible wardrobe template.

The owner also rejected the head/hair fit in that first correction: the scalp protruded above the hair and the temples did not align. The first exporter stretched the head to 30×30 logical pixels and the hair to 33×28 despite their different source aspect ratios.

`npx tsx tools/build-head-registration-review.ts` now preserves each original source aspect ratio with one uniform scale. The head is 30×29.18 logical pixels with its chin fixed at y=35; the hair is 34×31.86 with top y=0.5. These are explicitly authored coordinates for this front pose, not automatic fitting rules for arbitrary hairstyles. No raster art was regenerated or repainted in this correction.

The resulting head and hair remain separate RGBA layers on identical untrimmed 768×768 canvases (64×64 logical, scale 12). The review compositor draws both at (0,0), without independently cropping the registered exports. `registration-v2.json` records the source rectangles, uniform scales and positions. The old review and masters are preserved.

Outputs: `head-front-registered-v2.png`, `hair-chestnut-front-registered-v2.png`, and evidence images `standing-front-registered-v2.png`, `head-hair-registration-comparison-v2.png`, `head-hair-layers-v2.png`. Inspected both enlarged head and full standing pose. Front alignment is the scope of this review; source alpha fringe cleanup, other hairstyles, side/back views and gameplay integration remain pending. Owner acceptance remains pending.
