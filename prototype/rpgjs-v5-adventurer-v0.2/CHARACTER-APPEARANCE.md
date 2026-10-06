# Character appearance contract

The durable, synchronized `player.appearance` prop stores versioned cosmetic IDs separately from `adventure` combat/progression and future item ownership. Missing/corrupt/pre-schema saves migrate to the original painted adventurer. Map join/load applies a normalized server-resolved graphic stack; arbitrary client URLs/graphic IDs are never accepted. A finite experimental `equip` command and wardrobe UI now exist for the rejected limb rig; they do not establish an accepted original-art wardrobe.

## Owner requirement — customization across every action, 2026-10-06

Face, hair and clothing must be independently selectable, as in the studied DDTank dressing behavior, and the chosen appearance must persist through every supported direction and action: standing, walking, sword attacks, gun shooting and later authored actions. This is a product requirement, not a claim about the current prototype or every internal DDTank implementation.

- Keep selected cosmetic IDs independent of direction, animation, frame and facial expression. Changing an action must not reset the face, hair or clothing to defaults. An expression selects a compatible frame of the chosen face rather than another face identity.
- Resolve each item's compatible visual representation for the current direction/action/frame, or attach it to a properly authored shared animation rig. All layers use the same pose, time, frame origin and logical body proportions. A single static front PNG is not assumed to cover side/back views or moving limbs.
- Outfit replacement must replace the appropriate dressed-body/clothing layer, including its required motion coverage. New outfits must not be painted permanently into a character's only walk/attack source. A cached flattened composite is allowed as a derived optimization when it is reproducible from independently selectable source layers and invalidated on item changes.
- Changing supported cosmetics during motion must retain movement, animation phase and authoritative combat timing. Correct pose-specific occlusion, head/hair/hat coverage and weapon grip attachment remain required. The rejected rig's current equip handler stops navigation; it therefore does **not** satisfy this target behavior.
- Empty basic slots resolve to the selected character/sex's default face, hair and dressed body without overwriting the user's selection. Optional equipment can be absent. Default layers must cover the same enabled actions and directions.
- Check required action/direction coverage before presenting an item as compatible. In authoring review, expose missing coverage and keep the last valid composition; do not silently substitute another face/outfit on attack, stretch a mismatched image, or treat a complete fixed costume as independent customization.

The next bounded walking proof must use at least **two face identities × two hairstyles × two dressed bodies**, yielding eight independent combinations through every frame of the first supported walking direction. Check item changes during walking, action transitions and missing-slot defaults. A one-costume walk can be an intermediate authoring study but cannot pass this customization gate. Before describing the character system as complete, repeat the wardrobe coverage checks for every enabled direction and action, including actual sword/gun actions when implemented. Owner review must cover both natural motion and clothing/head registration; numeric checks alone do not pass it.

The earlier original-art checkpoint was the [front head/hair toggle](evidence/character-master/head-hair/REVIEW.md): one face/head, one hairstyle and one dressed body, standing forward. That checkpoint alone does not pass the eight-combination walking gate. The [local 4.0 reference compositor](evidence/registered-character/REVIEW.md) demonstrates selection/composition with existing external art; it does not supply original animation assets.

Follow-up: the [first original side-walk study](evidence/walk-side-v1/REVIEW.md) now supplies eight combinations across eight frames and preserves phase/position during cosmetic changes. It uses two face variants, two hairstyles and two colourways of one clothing silhouette. Its technical coverage is measured; natural gait and owner visual acceptance remain pending. Neutral side idle/action transitions, other original views and combat actions remain absent, so the full all-action customization requirement is not complete.

## Existing implementation and layer inputs

Slots, back-to-front baseline: body, face, eyes, pants, shoes, shirt, hair, hat, weapon. `src/game/appearance.ts` owns the typed catalog, normalization and renderer ID resolution. For animations that put an arm/weapon behind the body, add a rig-specific front/back pass rather than assuming this fixed order covers every pose. Hat/hair masking and helmet occlusion must be authored when those assets arrive.

Current `painted-adventurer` is a **baked full costume**, not a naked body. Other slots are null and have no selectable assets. Adding a shirt over it will not remove the old shirt. To ship customization, replace that base with a compatible body and transparent layers; do not claim today's original sheet can change eyes/hair independently.

Each new layer must supply:

- Stable cosmetic ID, slot, rig ID, registered RPGJS graphic ID and source/credit/license record.
- Identical frame timeline, direction order and origin across all layers of a compatible character. The historical painted rig uses 8 columns × 8 rows with a logical 64×64 footprint and anchor (0.5, 0.625); down/left/right/up walk rows, then matching slash rows. These inherited dimensions are not a required source resolution or final layout for the new original-art rig.
- Idle/walk/slash coverage and explicit fallbacks for hurt/death; future thrust/shoot/spellcast must supply compatible frames before enabling those abilities.
- For 128px source frames, preserve the same logical 64px footprint, anchor and frame timings through a renderer scale adapter. Do not enlarge collision or change weapon reach because source art has more pixels. Atlas padding/extrusion is required for filtered transparent layers to avoid adjacent-frame bleed.
- Validated ownership/unlock/equip changes on the server. Weapon visual ID must not set attack damage; actual equipment stats belong to a separate authoritative equipment model. Add save migrations when the schema changes.

The current multi-graphic resolver is wired into join/load/reset. Unit tests verify ordering with synthetic catalog IDs and reject malformed/mismatched cosmetics; they do not certify real future layered artwork. The rejected experiment's dressing UI has finite hair/clothing/hat/weapon choices but no interchangeable face/eyes. An accepted animated original wardrobe, dye palette and equipment bonuses remain unimplemented.
