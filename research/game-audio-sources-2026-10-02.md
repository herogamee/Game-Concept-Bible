# Commercial-Safe Game Audio Resource Bible — 2026-10-02

Status: **Technical research / asset-ingestion policy**  
Project: **Adventurer Life RPG**  
Target: **commercial browser-first / PC / mobile game**  
Verified: **2026-10-02**

## Executive decision

Use a **license-first audio pipeline**. "Free download" is not enough.

Priority order:

1. **CC0 / public-domain audio**.
2. **Explicit commercial game licenses with no attribution**.
3. **Attribution licenses**, only through review + generated credits.
4. **NC, ND, unknown-license, no-license, personal-use-only or all-rights-reserved material**: reject.

Recommended starting stack:

- **Kenney Audio** — UI, RPG, impacts, jingles and prototype sound.
- **Sonniss GameAudioGDC** — high-quality production SFX, Foley and ambience.
- **OpenGameArt CC0** — RPG/fantasy music and effects.
- **Freesound CC0** — environmental recordings, ambience and Foley.
- **itch.io CC0 Audio** — extra CC0 music/SFX packs.
- **DURU AI CC0 BGM** — code-synthesized CC0 background music.
- **jfxr / jsfxr / rFXGen** — original generated game effects.

Critical rule: **Mixkit Sound Effects may be used in video games; Mixkit Stock Music may not.**

---

## Source matrix

| Source | Best for | Commercial game | Attribution | Status |
|---|---|---:|---:|---|
| Kenney Audio | UI, RPG, impact, jingles | Yes | No | **ADOPT / Tier A** |
| Sonniss GameAudioGDC | Production SFX, ambience, Foley | Yes | No | **ADOPT / Tier A** |
| OpenGameArt CC0 | Music + RPG/fantasy SFX | Yes | No | **ADOPT / Tier A** |
| Freesound CC0 | Ambience, environment, Foley | Yes | No | **ADOPT / Tier A** |
| itch.io CC0 Audio | Music + SFX packs | Yes | No | **ADOPT after item check** |
| DURU AI CC0 BGM | Code-synthesized BGM | Yes | No | **ADOPT / Tier A** |
| CC0-Public-Domain-Sounds | Aggregated CC0 SFX | Conditional | Usually no | **Discovery; verify upstream** |
| code4fukui/sound-cc0 | Small CC0 collection | Conditional | No | **Optional** |
| jfxr | Generate original SFX | Yes | No | **ADOPT / preferred generator** |
| jsfxr | Generate retro/chiptune SFX | Yes for our own generated output | No | **ADOPT with provenance** |
| rFXGen | Generate retro/chiptune SFX | Yes for our own generated output | No | **ADOPT with provenance** |
| Mixkit Sound Effects | UI, arcade, generic SFX | Yes | No stated requirement | **REVIEW / Tier B** |
| Mixkit Stock Music | Music | **No for video games** | — | **REJECT** |
| Pixabay Audio | Music + SFX | Yes | No | **REVIEW / Tier B** |
| ZapSplat Basic | Broad SFX/music | Yes | **Yes** | **REVIEW** |
| ccMixter CC-BY | Music | Yes | **Yes** | **REVIEW** |
| ccMixter CC-BY-NC | Music | **No** | Yes | **REJECT** |
| Creative Commons Search | Discovery | Depends | Depends | **Discovery only** |

---

# 1. Kenney Audio — primary low-friction library

Site:
- https://kenney.nl/assets
- https://kenney.nl/support

Useful packs:
- RPG Audio: https://kenney.nl/assets/rpg-audio
- Impact Sounds: https://kenney.nl/assets/impact-sounds
- Interface Sounds: https://kenney.nl/assets/interface-sounds
- UI Audio: https://kenney.nl/assets/ui-audio
- Music Jingles: https://kenney.nl/assets/music-jingles
- Sci-Fi Sounds: https://kenney.nl/assets/sci-fi-sounds

Kenney's current support page states that game assets on its asset pages are **CC0/public domain**, usable in commercial projects, with no attribution required.

Recommended uses:
- menu/UI click, confirm, cancel
- inventory/equipment
- pickup/coin
- quest feedback
- level-up/victory
- generic RPG action placeholders

**Import rule:** preserve the asset-page URL and bundled license file.

---

# 2. Sonniss GameAudioGDC — primary production SFX library

Current bundle:
- https://gdc.sonniss.com/

Archive:
- https://sonniss.com/gameaudiogdc/

License:
- https://sonniss.com/gdc-bundle-license/

The 2026 bundle currently advertises **7.47GB+ / 347+ files**, royalty-free commercial use, unlimited projects and no attribution requirement.

The published GameAudioGDC license is **Version 2.0, effective 2026-08-27**. It grants worldwide, non-exclusive, royalty-free use and modification in personal and commercial projects, including games and interactive projects.

Important restrictions/policies:
- embed/synchronize sounds inside our project;
- do not redistribute the raw sounds as a standalone sound library;
- **AI/ML training is prohibited**;
- record the license version and download date because Sonniss states that the version published on the download date governs those files.

Recommended uses:
- swords, axes and metal
- bow/arrow
- monsters/creatures
- footsteps and movement
- fire/water
- forests/caves/dungeons
- doors/chests
- combat impacts and boss effects

**Hard rule:** never place Sonniss GameAudioGDC files in an AI training corpus.

---

# 3. OpenGameArt — CC0 first

Site:
- https://opengameart.org/
- FAQ: https://opengameart.org/node/5571
- Commercial-use SFX collection example: https://opengameart.org/content/sfx-ok-for-commercial-use

OpenGameArt permits commercial use subject to each asset's license.

Project policy:
- **CC0** → accept.
- **OGA-BY** → review + attribution.
- **CC-BY** → review + attribution and platform implications.
- **CC-BY-SA** → license/legal review before production use.
- **GPL media** → do not ingest by default.

Useful categories include RPG SFX, water/slime, retro/synth and 8-bit effects.

---

# 4. Freesound — CC0 by default

Site:
- https://freesound.org/
- License FAQ: https://freesound.org/help/faq/

Project policy:
- **CC0** → accept.
- **CC-BY / Attribution** → review; must enter generated credits.
- **CC-BY-NC / Attribution NonCommercial** → reject.
- legacy licenses → review individually.

Best uses:
- forest/wind/rain
- water/river
- market/crowd
- wood/stone/doors
- footsteps
- blacksmith/metal
- birds/animals
- cave ambience

Because Freesound is user-uploaded, record the sound page, uploader, license and download date.

---

# 5. itch.io CC0 Audio

CC0/free audio filter:
- https://itch.io/game-assets/assets-cc0/free/tag-audio

This filter currently contains audio assets marked **Creative Commons Zero v1.0 Universal**, including music, SFX and UI audio.

**Rule:** search filters are discovery aids. Verify the individual asset page and preserve its license/readme before import.

---

# 6. DURU AI CC0 BGM — code-synthesized music

Canonical repository:
- https://github.com/uncle-sheepsky/duru-ai-cc0-bgm

The repository metadata declares **CC0-1.0** and describes a unified code-synthesized BGM pack free for any use without attribution.

Superseded split repositories:
- https://github.com/uncle-sheepsky/duru-cc0-bgm
- https://github.com/uncle-sheepsky/hyak-cc0-bgm

Use the **unified repository** as canonical.

Good for:
- temporary town/field themes
- minigames
- combat prototypes
- menu/background music

Treat external CC0 BGM as production-safe material, but not automatically the final signature soundtrack.

---

# 7. GitHub CC0 collections

## CC0-Public-Domain-Sounds

- https://github.com/lavenderdotpet/CC0-Public-Domain-Sounds

Useful as a discovery/cache collection.

**Rule:** an aggregator does not replace upstream provenance. Record the original source/pack before shipping.

## code4fukui/sound-cc0

- https://github.com/code4fukui/sound-cc0

Optional CC0-oriented collection. Preserve repository revision and file/source notes.

---

# 8. Open-source SFX generators

## jfxr — preferred generator

Repository:
- https://github.com/ttencate/jfxr

Web:
- https://jfxr.frozenfractal.com/

Its README explicitly states that sounds created with jfxr may be used commercially, attribution is not required, and generated sounds are free for the creator to use without restriction. Code is BSD-3-Clause.

Use for:
- UI blips
- pickup
- level-up
- magic pulses
- simple hits
- retro effects
- confirmation/error tones

**Decision:** preferred generator because output rights are explicitly documented.

## jsfxr

Repository:
- https://github.com/chr15m/jsfxr

Tool:
- https://sfxr.me/

Presets include pickupCoin, laserShoot, explosion, powerUp, hitHurt, jump, blipSelect, synth, tone and click. The software is released under **The Unlicense**.

**Policy:** generate our own sounds and store tool version/commit + parameters. Do not treat the software license as provenance for unrelated audio samples.

## rFXGen

Repository:
- https://github.com/raysan5/rfxgen

Features include Coin, Shoot, Explosion and PowerUp presets, WAV/RAW export and command-line batch generation.

The source is under the **zlib/libpng license**, which permits commercial software use.

**Policy:** store generated parameters/presets and tool version for reproducibility.

---

# 9. Tier B custom-license sources

## Mixkit Sound Effects — allowed after review

License:
- https://mixkit.co/license/modal/sfxFree/

Current license explicitly allows **commercial projects and video games**.

Do not redistribute raw items as stock/source content and do not claim/register them as our own rights-managed work.

## Mixkit Stock Music — blocked

License:
- https://mixkit.co/license/modal/musicFree/

Current Stock Music Free License explicitly lists **Video Games** as **Not Allowed**.

```text
Mixkit SFX   -> REVIEW / MAY ACCEPT
Mixkit Music -> REJECT FOR GAME
```

## Pixabay Audio

License:
- https://pixabay.com/service/license-summary/
- https://pixabay.com/sound-effects/

Current license summary permits free use, modification and no required attribution, but prohibits standalone sale/distribution of the content.

**Policy:** usable embedded in the game after item-level provenance review; rank below CC0/Sonniss/Kenney.

## ZapSplat Basic

License:
- https://www.zapsplat.com/license-type/standard-license/

The current Standard License says Basic/free users may use sounds and music in unlimited commercial projects including games/apps/software, but **must credit ZapSplat**.

**Policy:** use only when Tier A sources cannot fill the need; generate the required credit automatically.

## ccMixter

Guide:
- https://ccmixter.org/media/how-to-attribute-ccmixter-tracks

- **CC BY** → commercial use allowed with attribution.
- **CC BY-NC** → reject for this commercial project.

Store track title, artist, track URL and license URL.

---

# 10. Discovery portal

Creative Commons Search:
- https://search.creativecommons.org/

Useful for finding material across OpenGameArt, ccMixter, Openverse and other sources.

**Never use the search result itself as license proof.** Verify the original asset page.

---

# 11. Production folder plan

```text
assets/audio/
  music/
    title/
    town/
    village/
    field/
    forest/
    dungeon/
    battle/
    boss/
    victory/
    sad/
    event/
    minigame/

  sfx/
    ui/
    combat/
      sword/
      axe/
      bow/
      staff/
      hit/
      critical/
      block/
    magic/
      fire/
      ice/
      lightning/
      heal/
      buff/
    character/
      footsteps/
      jump/
      hurt/
      death/
    monster/
    environment/
      forest/
      cave/
      water/
      wind/
      rain/
      fire/
    items/
      pickup/
      equip/
      potion/
      coin/
    crafting/
      mining/
      woodcutting/
      blacksmith/
      cooking/
    quest/
      accept/
      complete/
      fail/
    system/
      levelup/
      rankup/
      achievement/

  metadata/
    audio-assets.json
    ATTRIBUTION.md
    LICENSE-SNAPSHOTS/
```

---

# 12. Audio metadata contract

Every imported file must have provenance.

```json
{
  "id": "sfx-combat-sword-hit-001",
  "file": "sfx/combat/sword/sword_hit_001.ogg",
  "kind": "sfx",
  "source": "Kenney RPG Audio",
  "sourceUrl": "https://kenney.nl/assets/rpg-audio",
  "author": "Kenney",
  "license": "CC0-1.0",
  "commercialUse": true,
  "attributionRequired": false,
  "downloadedAt": "2026-10-02",
  "sourceRevision": null,
  "aiTrainingAllowed": null,
  "notes": ""
}
```

Generated audio should also store generator name, URL, version/commit and saved parameters.

---

# 13. License gate for Codex / CI

## Auto-accept

```text
CC0-1.0
Public Domain
Kenney CC0
Project-original recording
Project-original synthesis
jfxr-generated with stored provenance
```

Sonniss is also production-approved, but must remain a **named custom license class** due to its AI/ML restriction and download-date/version rule.

## Manual review

```text
CC-BY-4.0
CC-BY-3.0
OGA-BY
Pixabay Content License
Mixkit Sound Effects Free License
ZapSplat Standard License
other custom royalty-free licenses
```

## Reject by default

```text
CC-BY-NC
CC-BY-ND
Non-commercial / NC
No derivatives / ND
Personal use only
Editorial use only
Unknown license
No license
All rights reserved
Mixkit Stock Music Free License (for video-game use)
```

Additional rules:

1. Never infer a license from filename, tags or repository topic.
2. Record source URL + license on download.
3. Keep a local license/readme snapshot where permitted.
4. Do not commit third-party raw audio publicly when redistribution is forbidden.
5. Never use Sonniss GDC files for AI/ML training.
6. Attribution-required assets must appear in generated `ATTRIBUTION.md`.
7. Ambiguous license = quarantine, not ship.

---

# 14. First playable RPG audio set

Do not import thousands of files yet.

### UI
hover/click, confirm, cancel, error, inventory open, equip  
Primary: **Kenney + jfxr**

### Combat
sword swing, sword hit, hard-surface hit, player hurt, slime hurt/death, critical, block  
Primary: **Sonniss + Kenney**

### World
grass/stone footsteps, forest loop, village ambience, cave loop, fire, water  
Primary: **Sonniss + Freesound CC0**

### RPG feedback
coin/item pickup, quest accept/complete, level up, rank promotion  
Primary: **Kenney + jfxr**

### Music
title, starter village, field, dungeon, normal battle, boss, victory  
Primary discovery: **OpenGameArt CC0 + itch.io CC0 + DURU AI CC0 BGM**

---

# 15. Codex handoff

When integrating audio:

1. Read this file first.
2. Create the folder structure above.
3. Create `assets/audio/metadata/audio-assets.json`.
4. Add a validator that blocks rejected license classes.
5. Generate `ATTRIBUTION.md` automatically.
6. Begin only with the first playable audio set.
7. Keep masters/provenance separate from optimized runtime files.
8. Store loop/normalization edits without losing source metadata.
9. Never train models on Sonniss GameAudioGDC material.
10. If a source license changes after this research date, update this Bible before ingesting new files.

---

## Research boundary

This is an engineering asset policy, not legal advice. Licenses and service terms can change.

**Default: if a sound is not clearly licensed for commercial game use, it does not enter the production library.**
