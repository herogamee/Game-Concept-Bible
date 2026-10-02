# Character appearance contract

The durable, synchronized `player.appearance` prop stores versioned cosmetic IDs separately from `adventure` combat/progression and future item ownership. Missing/corrupt/pre-schema saves migrate to the original painted adventurer. Map join/load applies a normalized server-resolved graphic stack; arbitrary client URLs/graphic IDs are never accepted. No equip socket command is exposed yet.

Slots, back-to-front baseline: body, face, eyes, pants, shoes, shirt, hair, hat, weapon. `src/game/appearance.ts` owns the typed catalog, normalization and renderer ID resolution. For animations that put an arm/weapon behind the body, add a rig-specific front/back pass rather than assuming this fixed order covers every pose. Hat/hair masking and helmet occlusion must be authored when those assets arrive.

Current `painted-adventurer` is a **baked full costume**, not a naked body. Other slots are null and have no selectable assets. Adding a shirt over it will not remove the old shirt. To ship customization, replace that base with a compatible body and transparent layers; do not claim today's original sheet can change eyes/hair independently.

Each new layer must supply:

- Stable cosmetic ID, slot, rig ID, registered RPGJS graphic ID and source/credit/license record.
- Identical frame timeline, direction order and origin across all layers. Current rig: 8 columns × 8 rows, 64×64 frames, anchor (0.5, 0.625); down/left/right/up walk rows, then matching slash rows.
- Idle/walk/slash coverage and explicit fallbacks for hurt/death; future thrust/shoot/spellcast must supply compatible frames before enabling those abilities.
- For 128px source frames, preserve the same logical 64px footprint, anchor and frame timings through a renderer scale adapter. Do not enlarge collision or change weapon reach because source art has more pixels. Atlas padding/extrusion is required for filtered transparent layers to avoid adjacent-frame bleed.
- Validated ownership/unlock/equip changes on the server. Weapon visual ID must not set attack damage; actual equipment stats belong to a separate authoritative equipment model. Add save migrations when the schema changes.

The current multi-graphic resolver is wired into join/load/reset. Unit tests verify ordering with synthetic catalog IDs and reject malformed/mismatched cosmetics; they do not certify real future layered artwork. A dressing UI, dye palette, equipment bonuses and full wardrobe are not implemented in this step.
