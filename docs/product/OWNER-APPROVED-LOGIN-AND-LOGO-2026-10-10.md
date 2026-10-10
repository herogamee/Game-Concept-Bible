# NewLife Quest — Owner-approved logo and login baseline (2026-10-10)

**Status: OWNER-APPROVED / LOCKED FOR CURRENT DESIGN PASS.** Only the owner may approve replacing these references. This is a visual/product decision, **not** a claim that the login has been implemented, that a 1920 × 1080 master was delivered, or that the original PNGs have already been committed.

## Exact approved source files

The owner explicitly selected and re-uploaded these **two exact image files** in the 2026-10-10 ChatGPT conversation. The most recent files replace prior exploratory/generated revisions.

| Role | Owner-uploaded filename | Proposed repository path after original binary import | Actual pixels | Format | Source SHA-256 |
| --- | --- | --- | --- | --- | --- |
| Official game logo | `NewLife Quest Fantasy Logo(3).png` | `assets/branding/newlife-quest-logo-approved.png` | **1536 × 1024** | PNG RGBA, transparent | `36da04e03ca6a696e3bd1523d0fec7ec02619812aa1c993773f87a9d1bfdde45` |
| Login screen visual baseline | `NewLife Quest_ Sky Castle Login.png` | `assets/branding/newlife-quest-login-approved.png` | **1672 × 941** | PNG RGBA, opaque pixels | `d8acf685e97b6a7716c617e6cc05662eb52e1066eb344c88f1d6c913f6e511c2` |

**Asset import status at this documentation checkpoint: PENDING.** The connected GitHub write interface used for this update can commit UTF-8 text but cannot transfer the uploaded binary PNGs directly. Consequently, do **not** state that `assets/branding/*.png` already exists until verified in GitHub. Import the original, unmodified PNG bytes to the proposed paths when an authenticated binary upload mechanism is available, then check SHA-256 against this table. Do not commit reconstructed screenshots, thumbnails or placeholders in place of originals.

## Logo: what is approved

- Use **this exact current NewLife Quest wordmark** as the brand baseline: polished gold/cream “NewLife”, blue “Quest”, ornate compass/star details and ribbon with “Another Story Awaits You”.
- Preserve the existing lettering, gold/blue palette, hierarchy, ornamentation and silhouette. No unsolicited redesign, added mascot, replaced font or return to an earlier logo.
- The supplied PNG has actual alpha transparency. Preserve alpha and tidy edges when used in-game.
- The English brand title/tagline **inside the approved logo** is a brand-art exception to UI localization, not permission to leave surrounding UI untranslated.

## Login: what is approved

- Use the **exact owner-selected Sky Castle Login composition** as the current visual reference: warm bright anime-fantasy city/castle setting, blue/gold/cream treatment, illustrated chibi character and pet, large logo, gold-bordered central login panel, and coherent loading/progress presentation.
- Preserve the reference's composition, visual identity and intended entry experience. Do not silently replace it with a different login layout, dark RPG login, or generic UI.
- **Do not ship a full-screen static screenshot as the functional login.** Use scene/background assets and genuinely interactive controls; buttons, username/password fields, remember-login choice, settings, account actions, errors and loading indicators need real logic.
- Thai `th-TH` and English `en-US` must each have **complete** working text and layout; re-render UI labels rather than leaving Thai text baked into an English screenshot. Thai diacritics, font coverage and clipping must be tested.
- Target a **16:9 1920 × 1080 design viewport**, but acknowledge that the approved input screenshot is **1672 × 941**, not 1920 × 1080 source pixels. Preserve aspect ratio without claiming upscaling creates genuine higher-resolution art. Adapt safely to desktop browser and **landscape** mobile web.
- Implement authentication/security using Codex's implementation decisions and relevant existing contracts. The visual approval does not prescribe a backend, storage or credential scheme.

## Acceptance and change control

1. Verify that the actual delivered logo/login assets match the source SHA-256 **after they are imported**; no fake or placeholder originals.
2. Match the approved logo and login visual treatment in both locale presentations.
3. Functional login and loading UI remain interactable at desktop 16:9 and mobile landscape aspect ratios.
4. No changing the logo, replacing the login composition, or approving new branding without a later explicit owner decision.
5. Keep related technical work in a scoped PR, with real tests and no unauthorized production deployment.

## Non-goal

**The post-login Home / City Hub artwork, building placement and final mockup are NOT approved/locked by this file.** See [City Hub and Living City decisions](CITY-HUB-LIVING-CITY-DIRECTION-2026-10-10.md): interaction direction is captured; final Home visual design will be updated with the owner later.
