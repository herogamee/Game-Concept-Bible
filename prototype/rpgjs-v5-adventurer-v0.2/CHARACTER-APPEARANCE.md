# Character appearance contract

## Owner-defined fixed-template asset standard — 2026-10-06

**Active authoring requirement, recorded from the owner's corrections and three game screenshots. This section supersedes earlier generic face/eyes and separate shirt/pants/shoes descriptions as the target for new artwork. It is a specification, not a claim that the runtime or production assets implement it.**

The normal character uses **one fixed head template and one fixed body template**. Their proportions, registration and attachment positions remain unchanged when any item is switched. Adding another item does not create a new head/body geometry or a new fitting rule. Do not introduce another body/head family to solve a placement problem.

### Owner categories

The design keys below name intended asset categories; they are not newly implemented save fields or runtime IDs.

| Design key | Owner category | Contents / replacement behavior |
|---|---|---|
| `head_template` | โครงหัวเดิม | Fixed head shape, ear placement, proportions and reference coordinates. This is the common template, not an interchangeable eye-set identity. |
| `body_template` | โครงร่างกายเดิม | Fixed body proportions and pose/attachment geometry. Clothing fits this template rather than changing the underlying anatomy. |
| `eye_set` | ชุดดวงตา | **Eyes + eyebrows + mouth together as one selectable item**. Supports different shapes, colours and expressions on the same head. Do not redraw the head to change an eye set. |
| `face_set` | ชุดใบหน้า | Marks and details on the same face: scars, tattoos, cheek details, earrings and other face-set artwork. Independent of the selected eye set. Use the owner's category name, not only “face accessories.” |
| `hair` | ทรงผม | Registered hair artwork; front/back or hat-compatible representations may be needed. All variants preserve the common head attachment coordinates. |
| `glasses` | แว่น | Separate equipment category shown in the owner's game example; uses the common face registration. |
| `hat` | หมวก | Registered headgear and explicit hair-coverage rules. Equipping a hat must not move or resize the head. |
| `wings` | ปีก | Back/front artwork attached to fixed body reference points; its authored motion does not redefine the character's proportions. |
| `clothing` | เสื้อผ้า | **One selectable clothing set containing shirt + trousers or skirt + shoes**. Separate shirt/pants/shoes choices in the old experiment are not this owner's target category model. |
| `full_costume` | ชุดทั้งตัว | Intentional replacement of the normal character appearance with that costume's appearance, including mascot-style costumes. This is a valid separate category, not a failed attempt at independent normal clothing. Preserve normal selections for removal/restoration. |

Weapon visuals and combat authority remain separate existing concerns; this correction does not enable a new weapon action or change combat stats.

The screenshots supplied by the owner are requirements examples: `Screenshot 2026-10-06 160737.png` shows eye sets; `Screenshot 2026-10-06 160813.png` shows face sets; `Screenshot 2026-10-06 125000.png` shows the game equipment/character window. They are not newly imported game assets. The local DDTank 4.0/reference 4.1 implementation remains research evidence, not proof that every category uses the same internal names or file separation as our intended system.

### Fixed registration rules

- Item changes preserve the head/body template, scale, origin, pose and attachment positions. No per-item bounding-box centering, fitted scale, guessed placement or per-combination position fixes.
- “Fixed position” means the same reference coordinates **within the same canonical pose**. During animation, all compatible items follow the authored pose's reference geometry. It does not freeze a moving character to one screen position or one static pose.
- New clothing, hair and equipment can have different visible silhouettes, but must fit the same underlying template and pose. A full costume can intentionally replace the visible head/body while preserving the character's common registration; it does not modify the normal templates.
- Every export preserves the canonical coordinates and transparent overlap areas. Cropping/atlas packing is allowed only if export metadata reconstructs the original registration exactly; it must not re-center individual items.
- Front/back placement, masking and visibility rules are authored data. Hair under hats must use compatible coverage rather than moving the hair to fit. The exact interaction of optional hats/glasses/wings with full costumes still needs an explicit visibility policy; do not invent one from the screenshots.
- Missing required basic selections resolve to the approved template's default eye set, hair and clothing without overwriting stored selections. An absent face set represents the undecorated face. Optional items can be absent. Removing a full costume restores the normal selected/default composition.

### Authoring work and acceptance

The immediate priority is a repeatable fixed-template asset-production process for a future large catalog. Engine migration and additional combat clips are not the next authoring gate. The intention to reach thousands of distinct items does not mean such production capacity has been established.

| Work | Actual status / next deliverable |
|---|---|
| Record owner categories and fixed-template rules | Defined in this contract. |
| Freeze one normal head/body master and its coordinate/pose map | Not accepted yet. Publish protected template layers, reference positions, layer/visibility rules and numeric export geometry before treating them as production standards. |
| Separate eye sets from face sets on that master | Not implemented in the original-art lab. Author each as its own registered source category, preserving the protected head outside the intended features. |
| Prove new-shaped clothing and hair/hat compatibility | Not verified. Recolouring one garment is insufficient evidence. |
| Define full-costume replacement/restoration and optional-item visibility | Category behavior is specified above; source assets and runtime policy are not implemented. |
| Repeat the same authoring/export/review procedure for varied new items | Not verified. Record time and repair effort before projecting capacity to hundreds/thousands. |

Keep editable, category-specific sources and derive runtime exports from them. AI-generated artwork may supply candidate designs, but regenerated whole characters or item-specific colour/shape extraction masks are not a validated batch-production process. Changes outside the requested category must not enter the protected template. Technical checks should verify source dimensions/registration, protected template pixels, layer independence and required pose coverage; visual review must verify seams, occlusion and natural motion.

The current `/original` and `/walk` pages remain preserved experiments. Their `face` images include the head and facial features; they are **not** separate `eye_set` and `face_set` assets. `/walk` has two outfit colourways, one authored right-facing clip, a fixed scarf strip and drawing-specific hair masks. Its 64 composition checks do not establish compliance with this stricter owner standard, an accepted fixed master, or capacity to manufacture thousands of items. Existing atlas sizes are experimental evidence, not an automatically approved production template.

## Continuing requirement — customization across every action

The independently selected eye set, face set, hair, clothing and other supported equipment must persist through every supported direction and action: standing, walking, sword attacks, gun shooting and later authored actions. This remains a product requirement, not a claim about the current prototype or every internal DDTank implementation. The fixed-template categories above govern authoring.

- Keep selected cosmetic IDs independent of direction, animation, frame and facial expression. Changing an action must not reset eye sets, face sets, hair or clothing to defaults. An expression selects a compatible representation of the chosen eye set rather than another item or a newly generated head.
- Resolve each item's compatible visual representation for the current direction/action/frame, or attach it to a properly authored shared animation rig. All layers use the same pose, time, frame origin and logical body proportions. A single static front PNG is not assumed to cover side/back views or moving limbs.
- Outfit replacement must replace the appropriate dressed-body/clothing layer, including its required motion coverage. New outfits must not be painted permanently into a character's only walk/attack source. A cached flattened composite is allowed as a derived optimization when it is reproducible from independently selectable source layers and invalidated on item changes.
- Changing supported cosmetics during motion must retain movement, animation phase and authoritative combat timing. Correct pose-specific occlusion, head/hair/hat coverage and weapon grip attachment remain required. The rejected rig's current equip handler stops navigation; it therefore does **not** satisfy this target behavior.
- Empty basic slots resolve to the approved template's default eye set, hair and clothing without overwriting the user's selection. Optional face sets/equipment can be absent. Default layers must cover the same enabled actions and directions.
- Check required action/direction coverage before presenting an item as compatible. In authoring review, expose missing coverage and keep the last valid composition; do not silently substitute another eye set/outfit on attack or stretch a mismatched image. A full costume intentionally replaces the normal composition and must be reported as that category rather than as independently selectable normal parts.

The earlier walking study requested two facial-feature variants × two hairstyles × two dressed bodies, yielding eight combinations. Its evidence is preserved below, but it does not replace the current fixed-template authoring gate. After that gate is established, animated wardrobe review must include independent eye and face sets, item changes during motion, action transitions and missing-slot defaults. Before describing the character system as complete, repeat the coverage checks for every enabled direction and action, including actual sword/gun actions when implemented. Owner review must cover both natural motion and registration; numeric checks alone do not pass it.

The earlier original-art checkpoint was the [front head/hair toggle](evidence/character-master/head-hair/REVIEW.md): one face/head, one hairstyle and one dressed body, standing forward. That checkpoint alone does not pass the eight-combination walking gate. The [local 4.0 reference compositor](evidence/registered-character/REVIEW.md) demonstrates selection/composition with existing external art; it does not supply original animation assets.

Follow-up: the [first original side-walk study](evidence/walk-side-v1/REVIEW.md) now supplies eight combinations across eight frames and preserves phase/position during cosmetic changes. It uses two face variants, two hairstyles and two colourways of one clothing silhouette. Its technical coverage is measured; natural gait and owner visual acceptance remain pending. Neutral side idle/action transitions, other original views and combat actions remain absent, so the full all-action customization requirement is not complete.

## Existing implementation and historical layer inputs

**Implementation record only:** the unchanged legacy slots, back-to-front baseline, are body, face, eyes, pants, shoes, shirt, hair, hat, weapon. `src/game/appearance.ts` owns that typed catalog, normalization and renderer ID resolution. These names and separate garment slots do not implement the owner's categories above. Any later integration requires an explicit schema/adapter and save-migration review; do not silently relabel old IDs or change existing saves in this documentation correction. For animations that put an arm/weapon behind the body, add an authored front/back pass rather than assuming this fixed order covers every pose.

The durable, synchronized `player.appearance` prop stores versioned cosmetic IDs separately from `adventure` combat/progression and future item ownership. Missing/corrupt/pre-schema saves migrate to the original painted adventurer. Map join/load applies a normalized server-resolved graphic stack; arbitrary client URLs/graphic IDs are never accepted. A finite experimental `equip` command and wardrobe UI now exist for the rejected limb rig; they do not establish an accepted original-art wardrobe.

Current `painted-adventurer` is a **baked full costume**, not a naked body. Other slots are null and have no selectable assets. Adding a shirt over it will not remove the old shirt. To ship customization, replace that base with a compatible body and transparent layers; do not claim today's original sheet can change eyes/hair independently.

The legacy runtime's layer-input expectations, retained for a future adapter, are:

- Stable cosmetic ID, slot, rig ID, registered RPGJS graphic ID and source/credit/license record.
- Identical frame timeline, direction order and origin across all layers of a compatible character. The historical painted rig uses 8 columns × 8 rows with a logical 64×64 footprint and anchor (0.5, 0.625); down/left/right/up walk rows, then matching slash rows. These inherited dimensions are not a required source resolution or final layout for the new original-art rig.
- Idle/walk/slash coverage and explicit fallbacks for hurt/death; future thrust/shoot/spellcast must supply compatible frames before enabling those abilities.
- For 128px source frames, preserve the same logical 64px footprint, anchor and frame timings through a renderer scale adapter. Do not enlarge collision or change weapon reach because source art has more pixels. Atlas padding/extrusion is required for filtered transparent layers to avoid adjacent-frame bleed.
- Validated ownership/unlock/equip changes on the server. Weapon visual ID must not set attack damage; actual equipment stats belong to a separate authoritative equipment model. Add save migrations when the schema changes.

The current multi-graphic resolver is wired into join/load/reset. Unit tests verify ordering with synthetic catalog IDs and reject malformed/mismatched cosmetics; they do not certify real future layered artwork. The rejected experiment's dressing UI has finite hair/clothing/hat/weapon choices but no interchangeable face/eyes. An accepted animated original wardrobe, dye palette and equipment bonuses remain unimplemented.
