# Original front head/hair layers — 2026-10-06

Status: one front standing pose, one hairstyle and the original dressed body. Owner visual review is pending. This is a local authoring/composition proof, not an accepted production wardrobe or animation set.

## Inputs and prompts

- `../front-v1.png`: the preserved complete original character candidate. Its original generation and exact prompt are documented in [the master provenance](../PROVENANCE.md).
- `bald-edit-master.png`: the built-in OpenAI ImageGen tool edited that master to remove hair and reconstruct the scalp. Exact submitted prompt: [bald-edit-PROMPT.txt](bald-edit-PROMPT.txt). Original output, retained unchanged: `C:/Users/Gamee/.codex/generated_images/01a10f4c-08c6-74b0-a73d-a7aa1e81e592/exec-bdd5d2ad-6679-432e-a322-f7847e351e3c.png`.
- `hair-extraction-unregistered.png`: a second ImageGen edit attempted hair isolation. Exact submitted prompt: [hair-extraction-PROMPT.txt](hair-extraction-PROMPT.txt). Original output: `C:/Users/Gamee/.codex/generated_images/01a10f4c-08c6-74b0-a73d-a7aa1e81e592/exec-f8ad984c-d293-4bd4-9b6a-eabd19e86d4d.png`. It enlarged the hair within the canvas, so it is preserved as an **unused, rejected extraction**, not fitted into the character.

Only the original character candidate was submitted as an image reference to these edits. No commercial-game pixels were used in these original-game assets.

## Exported layers

`tools/build-original-head-hair.mjs` partitions the preserved master with native coordinate masks, and uses the bald edit as head underpainting. All three exported PNGs retain the full transparent **1254 × 1254** frame and shared **(0, 0)** origin:

1. `body-traveler.png`: unchanged original raster below row 543, including neck, outfit, arms, legs and boots.
2. `head-face.png`: reconstructed scalp/outer head from the bald edit with retained original central face pixels. The edit slightly changed some visible head/ear pixels; this is not a pixel-identical recovery of the original face.
3. `hair-chestnut.png`: original master pixels selected by a skin/feature mask and spatial hair supports, without rescaling, rotating or repositioning them. It does not use the rejected generated extraction.

`layers.json` records composition order. `assembled.png` and `thumbnail.png` are derived previews. The masks are authored for this particular drawing and pose; they are not a general segmentation system for arbitrary future outfits or hairstyles.

## Reproduction and limits

From the candidate directory, run `npm run assets:head-hair` and `npm run verify:head-hair`. The existing local server shows `/original`, with separate layer views and a hair toggle. The head/face and dressed-body images remain unchanged during that toggle.

See [the measured review](../../../evidence/character-master/head-hair/REVIEW.md) for exact protected regions, composition differences and the browser screenshot. Scalp reconstruction and masking change some head/edge pixels relative to the flattened master. Passing the protected-region checks does not establish clean production alpha, support for a second hairstyle, side views, alternate clothing, animation or owner acceptance. The playable RPGJS character has not been replaced.
