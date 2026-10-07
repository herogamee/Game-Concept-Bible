# Shared wardrobe across front standing and walking — 2026-10-06

The owner authorized two new hairstyles, one hat, and a standing/walking trial that keeps independent cosmetic choices. `/fixed-template` now provides those controls and the live motion panel, along with the preserved three-outfit and nine-eye/face galleries.

## What exists

- Three hairstyle IDs: original chestnut, new swept blue and new silver curls. One brown adventurer cap uses the same upper-hair mask for every hairstyle; removal restores selected hair. The head geometry/eyes/face stay registered.
- One original neutral front stand and four individually authored front walk key poses, at6fps with a120ms transition. All three clothing IDs cover every enabled pose. Head/eye/face/hair/hat selections share the same original source layers across every frame. These are raster walking poses, not rotations of cut-out limbs or a translated standing PNG.
- Independent eye sets(3), face states(none/scar/blush), hair(3), hat(none/cap) and clothing(3): **162 visible looks**. Preloaded assets let swaps preserve the motion clock. Slow playback and frame stepping support inspection.

Eight-frame sheet generation failed registration and was replaced with four separate key-pose sources. All three failed sheets, a wrong-foot contact attempt, cap repairs, original outputs and exact prompts remain retained. [Provenance](../../assets/fixed-front-motion-v1/PROVENANCE.md) and [generation records](../../assets/fixed-front-motion-v1/generation-records.json) describe the initial21 jobs and4 subsequent blue-hair repairs. This repair effort is evidence against assuming automatic catalog throughput.

Later hair-size repair: the [front blue-hair review](../fixed-template-v1/HAIR-REVIEW.md) records the larger coherent overlay, shared trial envelope and refreshed cap/walk exports. Earlier browser screenshots below remain the initial checkpoint; [current headwear screenshot](../fixed-template-v1/browser-hair-size.png) and [current size/browser checks](../fixed-template-v1/hair-standard-verification.json) record this revision. The810 pose-composition checks were rerun after the replacement.

## Technical checks

Run `npm run assets:fixed-template`, `npm run assets:front-motion`, `npm run verify:fixed-template`, `npm run verify:headwear`, and `npm run verify:front-motion`. Start `npm run lab:registered -- D:/Codex/DDtank 5199`, then open `http://127.0.0.1:5199/fixed-template`.

- Existing108 standing selection/visibility cases passed. New162 fully visible headwear/wardrobe cases are distinct; origin, hair restoration, hidden-hair/cap independence and missing hat-compatible representation rejection pass.
- **810 rendered motion compositions passed**:162 looks ×(neutral stand +4 walk poses). Registered head pixels above y238 stay identical across every clothing/action/frame. The original neck joins the body in every tested combination. No source fitting is performed.
- Per-pose body masks preserve3,673–4,137 eroded canonical skin/outline fixture pixels across all three outfits. The first broad colour mask captured cream garment patches; retaining anatomical connected components fixed the visibly reviewed armour artifacts. This remains a source-specific technique with bounded exposure rules, not a general naked-body master.
- Motion/action changes preserve cosmetic IDs; equip/reset keeps animation phase, stepping pauses the current pose, invalid actions/frames and missing clothing coverage fail explicitly. Existing playable schema/saves and engine APIs are unchanged.
- Syntax checks and11 HTTP routes passed, including preserved `/original` and `/walk`, both new modules, headwear exports and motion atlas. The existing lab remains loopback-only.

[verification.json](verification.json) includes support/raised boot samples at alpha>180 in fixed columns125..184 and205..269; the central gap prevents one forward toe from being counted on both sides. Source pose support bottoms vary475..479; clothing variants differ by at most1 canonical pixel in the sampled columns. The left contact remains4–5px above the standing ground reference480 and needs art review/polish. No per-item vertical fitting is applied; these measurements do not certify a planted-foot trajectory or natural gait.

Native comparison: [three outfits × five poses](three-outfits-five-poses.png). Each row is traveler/knight/mage; columns are stand, right contact, left passing, left contact, right passing. Headwear comparison: [six hair/cap combinations](../fixed-template-v1/six-headwear-combinations.png).

## Actual browser review

The existing in-app tab was reloaded at its normal691×614 viewport. Knight→mage during playback kept green eyes, blush, silver hair, cap and the walking action. Pausing a frame and changing all head slots retained its exact phase. Removing the cap restored selected blue hair; hiding hair kept the cap. Returning to stand retained all selected IDs. Reset restored null selections/default appearance without resetting a paused motion phase. Slow playback, neutral/walk transitions and source galleries were inspected in the actual page. See [browser checks](browser-checks.json), [motion panel](browser-motion.png), [headwear gallery](browser-headwear.png) and [full page](browser-page.png).

## Acceptance and limits

This is a bounded **front-facing stationary gait and animated-wardrobe proof**. Owner art/feel acceptance remains pending. Four key poses need cadence, foot-support and sleeve-boundary refinement plus authored in-between poses before production use. Head bob/turns, side/back direction coverage, movement/collision, gun/sword actions, glasses/wings/full costumes, arbitrary clothing topology, playable inventory ownership/saves and measured production capacity are not supplied by this change. Preserve earlier studies and the v0.1 quality reference. Do not call this the completed game or a validated thousands-item asset pipeline.
