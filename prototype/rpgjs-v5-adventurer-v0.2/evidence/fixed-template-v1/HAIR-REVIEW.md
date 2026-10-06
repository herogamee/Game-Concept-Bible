# Front short-hair size repair — 2026-10-06

The owner identified the swept blue hair as visibly smaller than the other two hairstyles and authorized repair. Equal1254×1254 PNG canvases and a shared origin had established registration, but did not establish consistent painted hair volume.

## Result and trial standard

The repaired blue overlay is532×396px at alpha≥128, versus460×314px before. Its top is y82,97px above the immutable skull top y179; previously y166/13px. Chestnut remains555×477px/top37/clearance142; silver remains490×349px/top117/clearance62. These are painted bounds, not item scaling targets. All canvases, (0,0) registration, head, eyes, cheek sets, clothes, cap and common gallery crop stay unchanged.

`tools/fixed-hair-template.mjs` records the head axis/scalp/temple/ear/neck references and a **trial envelope for these three short front hairstyles**: width490–570px, crown clearance55–155px, bottom≤524. Sources outside this envelope fail the build rather than being stretched or recentered. Other views, long hair and other hairstyle families require their own authoring profiles/review; this range is not an accepted universal production specification. Silhouettes deliberately retain different heights and shapes.

The lab displays measured sizes and selected crown clearance. “จุดอ้างอิง” overlays the same skull-top/axis and allowed crown-height lines on the head and full standing preview. The standing and front-motion exports consume the same corrected hair source; cap coverage still uses the shared y310 mask.

## Actual authoring

Four built-in ImageGen edits were necessary. The first remained too low; the second enlarged/repositioned the isolated hair and is rejected. The third restored the larger crown on a registered portrait, but combining it with every original lower pixel created a visible horizontal splice. Feathering that splice produced ghosted outer edges; those trials are rejected. The fourth repainted the splice as a coherent full hairstyle. The selected export therefore uses the coherent revised hair, including repainted fringe strands, rather than claiming the old fringe bytes are unchanged.

The generated portrait/head never enters runtime. A source-specific blue-colour matte within the common source window discards skin, face, ears and the small neck remnant. The original head is composited independently, unchanged. This matte is authoring support for this one blue source, not a general segmentation or mass-production process. Original outputs, exact prompts and guides are retained through [generation records](../../assets/fixed-front-motion-v1/generation-records.json); the earlier blue overlay/source remains available for comparison.

## Validation and review

`npm run verify:hair-standard` checks all three source sizes, measured-envelope membership, unobstructed central eye/nose/mouth/neck fixtures, and rejection of the original undersized blue source. `verify:fixed-template` passed108 standing cases; `verify:headwear` passed162 looks; `verify:front-motion` passed810 pose compositions with stable head appearance and clothing/body fixtures. These checks verify registration, visibility and the specified size envelope, not artistic quality.

The actual in-app page was reloaded. New dimensions appeared in its gallery/status; green eyes, blush, mage clothing and blue hair composed while walking with the cap. Cap removal restored the larger blue hair and retained the walking action/other selections. All six gallery canvases are310×270; guide toggling produced no page errors. See [browser checks](hair-browser-checks.json), [actual page](browser-hair-size.png), [before/after](hair-volume-before-after.png), [first join trials](hair-volume-trials.png) and [final join trials](hair-volume-final-trials.png). The final complete overlay additionally removes the generated neck remnant; the unused diagnostic full-overlay trial includes that remnant.

**Owner visual acceptance remains pending.** This repairs the front blue-hair volume and adds a bounded authoring check. It does not supply side/back coverage, broader hairstyles, accepted natural walking or production catalog throughput.
