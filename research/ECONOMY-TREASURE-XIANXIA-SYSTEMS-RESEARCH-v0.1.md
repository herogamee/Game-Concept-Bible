# Economy, Treasure & Chinese-Fantasy Systems Research v0.1

**Date:** 2026-10-03  
**Status:** Research findings and design hypotheses — NOT canonical balance  
**Purpose:** Ground the next Adventurer Life RPG design pass for currency, treasures, techniques, markets, auctions, collections and cooperative social economy.

---

# 1. Research question

How can the game make **money, weapons, rare treasures, manuals, hidden realms and player trade exciting for years** without producing:

- runaway inflation;
- endless stat inflation;
- market monopolies;
- kill stealing;
- forced PvP;
- scams;
- mandatory grinding;
- a world where only hardcore traders can afford anything?

This pass studies transferable system structures from online RPG economies and Chinese fantasy/xianxia storytelling. It does not copy protected lore, named artifacts, techniques, characters or plots.

---

# 2. Major finding — value needs both sources and sinks

Player economies fail if currency and items continuously enter but rarely leave.

Guild Wars 2 explicitly charges a non-refundable 5% listing fee plus 10% exchange fee on Trading Post sales. Its support documentation presents these as ordinary costs that remove gold from players.

Source:
- https://help.guildwars2.com/hc/en-us/articles/222384087-Missing-Gold

Final Fantasy XIV uses a server-wide Market Board and applies transaction taxes; market taxation is one way currency leaves circulation.

Sources:
- https://na.finalfantasyxiv.com/uiguide/item/
- https://ffxiv.consolegameswiki.com/wiki/Market_Board

Albion Online has repeatedly adjusted system costs specifically as Silver sinks when currency creation outpaced destruction. A 2019 economy patch explicitly stated that increased Silver entering the game required more Silver leaving it to prevent runaway inflation.

Source:
- https://albiononline.com/news/percival-patch-7-is-here

## Design hypothesis for Oravel

Currency sinks should feel like real services rather than punishment:

- market listing/settlement fees;
- Guild escrow/insurance;
- repair and restoration;
- travel;
- lodging;
- appraisal;
- artifact identification;
- crafting-station services;
- housing;
- cosmetic commissions;
- storage expansion;
- expedition preparation;
- archive copying;
- rare-relic conservation/restoration.

Do not make food/repair so expensive that ordinary play feels like paying bills.

---

# 3. Major finding — items also need sinks

Albion's crafting history is useful because it documents a classic problem: players craft many low/mid-level items to gain skill, flood the market and undercut one another.

Albion introduced Study Crafting so an item can be destroyed in exchange for crafting progression.

Source:
- https://albiononline.com/news/feature-study-crafting

Albion's Black Market also buys player-crafted gear and redistributes it into PvE loot; some purchased items are deliberately removed, maintaining demand for lower-tier equipment.

Source:
- https://albiononline.com/news/video-black-market-feature

## Oravel adaptation

Do NOT copy Albion's full-loot PvP dependence.

Instead use peaceful/world-consistent item sinks:

### Guild Requisition
The Guild buys ordinary equipment for:
- rescue depots;
- frontier branches;
- training;
- disaster relief;
- caravan guards.

Some equipment leaves circulation permanently.

### Study / Disassembly
Craftspeople may study an item to learn:
- construction method;
- material behavior;
- technique familiarity.

The studied item is consumed.

### Repair lifecycle
Normal gear remains repairable for a long time, but repeated severe damage can reduce restoration efficiency.

Avoid surprise permanent destruction.

### Donation / Museum / Archive
Rare historical items may be donated for:
- prestige;
- research;
- replica rights;
- titles;
- collection credit.

### Expedition consumption
Tools, maps, wards, medicines, food and prepared magical devices create recurring demand without deleting beloved weapons every week.

---

# 4. Major finding — a player economy benefits from transparent markets

Guild Wars 2's Trading Post supports anonymous/autonomous offers rather than requiring players to physically find a trading partner.

Source:
- https://wiki.guildwars2.com/wiki/Trading_post

FFXIV's official UI exposes item search, category filters, transaction history and wish lists.

Sources:
- https://na.finalfantasyxiv.com/uiguide/item/
- https://na.finalfantasyxiv.com/uiguide/item/item-market/market_search.html

## Oravel proposal direction

Use two complementary systems:

### Common Exchange
For ordinary materials, consumables, crafted gear and repeatable goods.

Features:
- searchable listings;
- buy orders;
- sell orders;
- recent price history;
- quantity;
- clear fees;
- anonymous default;
- anti-scam confirmation.

### Curated Auction
For exceptional provenance-rich items:
- relics;
- unique maps;
- rare manuals;
- named equipment;
- ancient materials;
- unusual housing collectibles.

Auction should feel like an event, not the only way to buy bread or iron.

---

# 5. Chinese fantasy finding — money can also be useful material

In *A Record of a Mortal's Journey to Immortality* (凡人修仙传), spirit stones function as exchange media but are also useful resources in cultivation/magical activity. Public reference material describes graded spirit stones and multiple practical uses.

Reference:
- https://www.webnovel.com/fil/book/22305390000123802/9734063464188192

This is structurally interesting because holding the resource competes with consuming it.

Path of Exile independently demonstrates a related game-economic structure: many currency items are themselves consumable crafting tools, so spending currency on crafting destroys purchasing power and acts as an item/currency sink.

Official item-data reference:
- https://www.pathofexile.com/item-data

## Oravel adaptation

Do NOT replace copper/silver/gold with copied "spirit stones."

Keep ordinary coin for readable everyday economics.

Add a second class of **functional magical resource** later, working name:

> **Drift Crystal / Pattern Shard** — NOT FINAL NAME

Possible uses:
- advanced Pattern Magic;
- artifact repair;
- ritual activation;
- hidden-realm keys;
- high-level crafting;
- expedition equipment;
- rare trade.

This creates a meaningful choice:

> Sell it? Keep it? Craft with it? Spend it opening something?

Unlike ordinary gold, it has intrinsic use.

---

# 6. Chinese fantasy finding — the best treasure market exceeds simple money

A recurring structure in 凡人修仙传 is that sufficiently rare materials/artifacts may be sold for spirit stones, but exceptional exchange meetings can shift toward barter: rare item for rare item, with money used only if no desired material appears.

Example public text:
- https://www.hetushu.com/book/38/25674.html

This creates an important fantasy:

> Wealth is useful, but knowledge, timing and possession of the right rare object can matter more than being the richest player.

## Oravel adaptation

Use three exchange layers:

1. **Coin Market** — everyday goods.
2. **Specialist Exchange** — rare materials/manual fragments/artifact components.
3. **Prestige Auction / Barter Event** — exceptional objects whose owner may request a category of treasure rather than only money.

Critical social rule:

Do not let one rich guild permanently monopolize progression-essential treasures.

Story-critical techniques and required progression must have non-market acquisition routes.

---

# 7. Treasure should have provenance, not only rarity color

Chinese fantasy is compelling when a treasure is tied to:

- where it came from;
- who used it;
- what it can do;
- what it costs to use;
- what it may unlock;
- what other characters know about it.

Our treasure system should therefore store provenance.

Example data fields:

- item_id;
- discovered_name;
- true_name;
- object_type;
- age;
- maker/culture;
- known_history;
- previous_owner;
- discovery_location;
- appraised_properties;
- unknown_properties;
- activation_condition;
- repair_state;
- technique_synergy;
- hidden-realm link;
- trade_status;
- replica_status;
- collection_record.

Two visually identical old swords can therefore have different histories.

---

# 8. Proposed treasure families

These are original working categories.

## Ordinary Equipment
Reliable, repairable, craftable.

## Fine Craft
Superior workmanship; desirable but not supernatural.

## Named Equipment
Known maker/history; distinctive behavior.

## Pattern Relic
Old object with magical Pattern function.

## Legacy Artifact
Historically important object with unusual rules.

## World Relic
Extremely rare object connected to ancient systems or world mystery.

Important:

Higher category does NOT automatically mean higher DPS.

A World Relic could be:
- a map;
- compass;
- archive key;
- language lens;
- weather device;
- door activator;
- memory recorder.

---

# 9. Manuals / secret techniques

The appeal of a rare manual is not merely "+50% damage."

A manual can contain:

- complete technique;
- incomplete technique;
- theory;
- training method;
- lost craft;
- map clue;
- ritual;
- monster knowledge;
- language;
- Pattern formula.

Possible states:

- readable immediately;
- requires mentor;
- requires language knowledge;
- requires another fragment;
- requires specific weapon mastery;
- dangerous if practiced incorrectly;
- contains false/edited sections;
- can be copied with quality loss or restrictions.

Do not copy named cultivation arts from existing fiction.

---

# 10. Hidden realms / secret areas

Chinese fantasy frequently makes rare areas exciting because access itself is part of the story.

Oravel can translate this into original settings:

- sealed Underfold side-node;
- temporary tidal island;
- old Pattern laboratory;
- abandoned school;
- mountain basin;
- spatially unstable ruin;
- archive accessible only under a certain world condition.

Good access chain:

> rumor -> clue -> preparation -> key/condition -> expedition -> discovery -> consequence

Avoid:
- arbitrary 0.01% portals;
- real-money keys;
- first guild permanently owning the entrance.

---

# 11. Auction as social storytelling

Auction scenes are effective when the player learns about the world from what people value.

An auction catalogue can reveal:

- war in another region;
- newly discovered ruin;
- famous craftsman;
- missing expedition;
- material shortage;
- faction activity.

Therefore auctions can be **narrative content**, not only UI.

Potential event rhythm:
- ordinary exchange always available;
- regional specialist sale occasionally;
- major seasonal auction announced well in advance.

No mandatory fixed-hour attendance: allow proxy bids / asynchronous participation.

---

# 12. Preventing player conflict

The owner explicitly wants a social world where game systems do not manufacture hostility.

## Do

- personal/party loot;
- contribution credit;
- instanced or recoverable rare encounters;
- buy/sell orders instead of spam haggling for common goods;
- clear trade confirmations;
- price history;
- escrow;
- report/log records;
- asynchronous auctions;
- multiple acquisition paths;
- beginner market protections;
- useful low-tier crafting;
- cooperative discovery credit.

## Avoid

- open-world PvP for essential resources;
- one-player tagging of world bosses;
- permanent ownership of progression-critical spawns;
- trade windows where last-second item swaps can scam;
- essential crafting materials only from one guild-controlled source;
- anonymous market manipulation with no system safeguards;
- limited-time power items that punish absence.

---

# 13. Regional economy without forced PvP

Albion demonstrates that regional production bonuses can make cities economically distinct and create transport/trade opportunities.

Source:
- https://albiononline.com/news/devtalk-merlyn-economy-changes

Oravel can use the peaceful version:

- Bellcross: metalwork advantage;
- Fenwick: river goods/fish;
- Highmere: herbs/wool;
- Istrane ports: imported materials;
- Ulreth: cold-region materials;
- capital: appraisal/auction/archive services.

Travel creates opportunity, but players do not need to risk PvP robbery.

Costs can be:
- time;
- freight fee;
- route disruption;
- weather;
- caravan preparation.

---

# 14. Crafting should create identity

Albion's official crafting guides explicitly frame crafting as a major player-economy profession and use specialized crafting lines and regional production incentives.

Sources:
- https://albiononline.com/news/guide-crafting
- https://albiononline.com/news/crafting-guide

Oravel should allow a player to become known as:

- swordsmith;
- bowyer;
- Pattern instrument maker;
- alchemist;
- cook;
- tailor;
- relic restorer;
- appraiser;
- cartographer.

Crafting fame should not require producing mountains of useless trash.

Use:
- commissions;
- study;
- restoration;
- Guild requisitions;
- quality challenges;
- signature items.

---

# 15. First economy architecture proposal

Keep the existing early-life denominations:

- copper;
- silver;
- gold.

Existing prototype conversion:
- 100 copper = 1 silver;
- 100 silver = 1 gold.

Do not change those numbers yet.

Add conceptual resource classes later:

### Money
Everyday unit of account.

### Materials
Physical production inputs.

### Functional Magical Resources
Tradeable and consumable for magic/crafting/access.

### Merit / Reputation
NOT tradeable money.

### Discovery / Knowledge
NOT directly purchasable progression.

### Premium Currency
No design decision yet. Do not connect real-money currency to combat power during this research phase.

---

# 16. Anti-inflation loop

Money enters from:
- contracts;
- NPC procurement;
- world events;
- limited treasure liquidation.

Money leaves through:
- market fees;
- Guild services;
- repair/restoration;
- travel;
- housing;
- crafting services;
- appraisal;
- storage;
- cosmetic services;
- expedition preparation.

Items enter from:
- gathering;
- crafting;
- exploration;
- monster/ecology rewards.

Items leave through:
- consumption;
- study;
- Guild requisition;
- restoration loss where fair;
- donation;
- crafting conversion.

The server should monitor:
- currency created/day;
- currency destroyed/day;
- median player wealth;
- new-player purchasing power;
- key commodity price index;
- item creation/destruction;
- market concentration.

Balance from telemetry rather than guessing forever.

---

# 17. Strongest direction emerging from research

The current best synthesis is:

> **Ordinary life uses understandable coin. Adventure creates materials and rare knowledge. Exceptional treasures have provenance and unusual functions. Some magical resources are useful enough to act like secondary money. Common trade is transparent and safe; exceptional trade becomes social/narrative content. The system destroys enough money and items to stay healthy without destroying players' favorite possessions arbitrarily.**

This fits the project's Player-First, cooperative, low-pressure direction better than:
- pure auction-house capitalism;
- full-loot PvP;
- endless gear-score tiers;
- gacha rarity;
- mandatory daily markets.

---

# 18. Next research questions

Before locking v0.1 economy proposals:

1. Should gold remain the highest ordinary coin or should high-value banking use notes/letters of credit?
2. Should functional magical resources be globally standardized or region-specific?
3. Which items can be freely traded?
4. Which rare items become account/character-bound, and why?
5. Can manuals be copied?
6. Can artifacts be replicated as weaker reproductions?
7. How do auctions prevent cartel behavior?
8. How do new/casual players participate in treasure discovery?
9. How much price history should the UI expose?
10. How do we make collecting valuable without combat power creep?
11. What should happen to a unique treasure if its owner stops playing?
12. How should hidden realms work in a shared world without first-come monopolization?

---

# 19. Copyright / originality boundary

Chinese fantasy, anime, manga and existing games are used only to study transferable design structures.

Never copy:
- named artifacts;
- named cultivation techniques;
- sects;
- characters;
- scenes;
- dialogue;
- maps;
- proprietary progression ladders;
- visual designs.

Final names, mechanics, lore, treasures and techniques must be original to Oravel / Adventurer Life RPG.
