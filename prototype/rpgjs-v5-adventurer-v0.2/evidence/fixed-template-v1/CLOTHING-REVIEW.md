# Two clothing bundles on the fixed front template — 2026-10-06

Later checkpoint: [hair/cap compatibility and shared front-motion wardrobe](../fixed-front-motion-v1/REVIEW.md). This document preserves the standing-clothing review at its original checkpoint.

The owner requested **only two new clothing designs**. The local `/fixed-template` page now offers novice knight and novice mage outfits, alongside the unchanged default traveler outfit. Each clothing ID selects shirt + lower garment + shoes together and remains independent of the selected eye set, face set and hair visibility.

## Authored assets and registration

- `clothing-knight`: silver cuirass/navy short sleeves, rust-red tabard, charcoal shorts and reinforced brown boots.
- `clothing-mage`: embroidered violet tunic, braided belt, plum shorts and matching violet boots.
- Each design was created by a separate built-in ImageGen edit of the registered original bald character. These are different garment constructions, not merely palette changes. Both original PNGs and their exact prompts are preserved; see [provenance](../../assets/fixed-template-v1/PROVENANCE.md).
- All exports remain full 1254×1254 transparent frames with origin (0,0), template `fixed-front-v1` and pose `stand-front`. No item-dependent translation, cropping, resizing or fitting is used.
- Generated pixels above the common head/body boundary y543 are discarded. Published head, eye, face and hair assets remain unchanged.
- One shared canonical protection mask copies original neck/arm/hand/knee pixels, including their outline/transparency, into both clothing bundles. [Body protection guide](../../assets/fixed-template-v1/body-protection-guide.png) and `tools/fixed-clothing-template.mjs` record the same paths for every outfit. This preserves the existing exposed body rather than accepting regenerated hands/anatomy.

The runtime clothing images are complete dressed-body bundles. This does not yet create a fully undressed anatomical body master. The shared mask is for this front pose and this sleeve/shorts/boot exposure; it is not a general solution for arbitrary sleeves, skirts or covered limbs.

## Verification and actual browser review

Run `npm run assets:fixed-template`, `npm run verify:fixed-template`, then `npm run lab:registered -- D:/Codex/DDtank 5199`. Open `http://127.0.0.1:5199/fixed-template`.

**108 rendered cases passed**: three outfits × three eye sets × three face states × hair on/off × eye set shown/hidden. The 54 cases with visible eyes are distinct. [verification.json](verification.json) records each selection/hash.

Checks preserve registration, the inherited blank-head alpha/protected pixels, original default outfit/hair files, eye/face independence, fixed exposed-body fixtures, independent cosmetic IDs/defaults and invalid-request rejection. Clothing swaps leave every rendered head-region pixel unchanged. Eye/face changes preserve each selected outfit's alpha footprint; different garments may have different silhouettes.

Solid boot bottoms (alpha >180) in fixed left/right foot supports were:

| Outfit | Left / right bottom row |
|---|---|
| Original | 1217 / 1216 |
| Knight | 1218 / 1218 |
| Mage | 1217 / 1218 |

The maximum measured difference is 2 native pixels, within the preset sole-thickness tolerance; no vertical adjustment is applied. This is a standing registration check, not a planted-foot or gait measurement.

Syntax checks and HTTP smoke passed for the preserved lab routes, new clothing routes and client. In the actual browser, knight→mage kept the selected green eyes/scars; a head-gallery choice kept mage clothing; a clothing-card choice kept joyful eyes/blush and bald visibility. Reset restored all stored selections to null and default outfit/eyes/hair. The final mage/green/blush preview and all three outfit cards were visibly inspected; no warning/error console entries were observed. See [browser checks](browser-clothing-checks.json), [actual clothing gallery](browser-clothing-gallery.png), [full page](browser-clothing-page.png) and [native comparison](three-clothing-combinations.png).

## Remaining scope

This trial adds exactly two front-standing clothing bundles. Owner visual acceptance, alternate clothing topology, long sleeves/skirts, hair/hat compatibility, full costumes, action coverage and repeatable large-catalog production remain pending. The current `/walk` study and playable saves/runtime are preserved; the new clothes are not yet animation assets or inventory-owned game equipment. Existing gameplay tests/builds were not rerun for this isolated authoring-page change.
