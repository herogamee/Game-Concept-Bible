# Headwear and front walking sources — 2026-10-06

Built-in **OpenAI ImageGen edit mode**, transparency requested for every job. [Generation records](generation-records.json) list all **21 jobs**, their original output paths, retained PNGs, exact prompt TXT files, references and used/unused status. All originals remain at their tool-output paths and unchanged project copies. References are this project's original character/art and native engineering guides; no commercial-game pixels or owner game screenshots were submitted for these edits.

## Headwear

Two new independent overlays are kept in `../fixed-template-v1`: `hair-teal` (swept blue side part), `hair-silver-curls` (short silver curls), and one `hat-adventurer` brown cap. Sources and exports retain full1254×1254 canvas coordinates; no item bounds, recentering, fitted scale or runtime offsets. Both first hair attempts fit the inherited head. Two earlier cap attempts sat too low and are preserved unused; the third cap edit is used.

Exact prompts: [blue hair](../fixed-template-v1/hair-teal-PROMPT.txt), [silver curls](../fixed-template-v1/hair-silver-curls-PROMPT.txt), [cap initial](../fixed-template-v1/hat-adventurer-PROMPT.txt), [cap correction](../fixed-template-v1/hat-adventurer-correction-PROMPT.txt), [cap final](../fixed-template-v1/hat-adventurer-final-PROMPT.txt). `build-fixed-template.mjs` exports the same upper-hair cut at y310 for every hairstyle when this cap is equipped. It keeps selected hair IDs; removing the cap restores the original full overlay. Hidden hair leaves the cap visible.

## Front walk

Three 8-frame whole-sheet attempts failed registration/phase review. Both full-figure sheets changed neck/head scale; the headless sheet displaced rows/neck cuts. `placement-guide.png`, `body-only-guide.png`, their prompts/results and `assembled-source-review.png` retain that failure evidence. **None enters runtime exports.** They are not accepted motion assets.

The replacement uses four **individual** full1254×1254 front-pose edits of the same original `bald-edit-master.png`. A contact-pose correction swaps the leading leg; the first wrong-foot version remains unused. Eight further edits apply the two already-defined knight/mage designs to those four pose sources. They add motion coverage, not extra clothing IDs. Exact prompt/source links for every edit are in the generation records.

Final phase order is right contact → left passing → left contact → right passing. Raw job names reflect original prompts; `tools/front-motion-layout.mjs` explicitly maps each final anatomical phase to its retained source key, rather than renaming or overwriting raw attempts.

## Registered exports and body protection

`tools/build-front-motion.mjs` uses **one template-wide mapping** of every1254×1254 source to384×512: scale0.36, x−33, y42.52; neck(192,238). This mapping is authored once and never calculated from an item's visible bounds. Four untrimmed pose cells pack in one1536×512 row; runtime layers draw at(0,0) with explicit integer source rectangles. The inherited neutral stand is a separate exported pose. All head/eyes/face/hair/cap layers come from the original fixed-template exports; every generated pose head is discarded above source y543. Head parts share the same mapping and remain identical across clothing/actions/frames.

Walking clothes are complete dressed-body rasters, with a small original neck fixture. One frozen protection mask per traveler pose is reused for every outfit. `front-motion-layout.mjs` records the same anatomical regions, skin-colour rule, connected-component counts and5px dilation. Each arm keeps its largest skin component; the leg region keeps two. This excludes disconnected warm-cream tunic pixels that the first broad threshold erroneously pasted onto armour. Per-pose `*-protection-guide.png` files show the resulting regions. This is **source-specific authoring support**, not a validated general skin/garment segmentation or scalable body-template production process. Arbitrary sleeves, skirts, covered anatomy and new pose families still require authoring review.

No limb bone rotations, per-item fitting, pose-dependent cosmetic ID reset or commercial asset import are used. The four key poses at6fps remain an experimental front gait with a120ms standing/walking blend. Native sources and art-only guides stay separate from served runtime files. See [review and limits](../../evidence/fixed-front-motion-v1/REVIEW.md).
