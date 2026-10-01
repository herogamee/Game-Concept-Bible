# NPC life and persistence — player-first model

**Status:** v0.2.1 direction correction.  
**Owner principle:** NPCs make the world feel alive, but real players remain the primary adventurers.

## Purpose

NPC systems exist to strengthen the player's adventurer fantasy.

They should provide:

- believable settlements and Guild halls;
- recurring characters and relationships;
- services and information;
- rivals, mentors and companions;
- visible change over time;
- narrative consequences;
- support when a player chooses to play solo or lacks a party role.

They should **not** become autonomous bot players that independently run the same core career loop as a human player.

## Four NPC categories

### 1. World NPC

Guild staff, blacksmiths, merchants, innkeepers, healers, villagers, guards, nobles and similar characters.

Use authored schedules, service states, relationship flags and regional-event responses.

They do not require adventurer career simulation.

### 2. Ambient Adventurer NPC

These characters create the impression that the Guild and town contain other working adventurers.

Visible states may include:

- reading a board;
- training;
- packing equipment;
- leaving town;
- returning tired or injured;
- celebrating;
- arguing over shares;
- changing seats or routines;
- discussing rumors.

These states may be selected from authored tables or lightweight world conditions. They do not reserve or consume the player's real contract instances.

### 3. Story Adventurer NPC

Named rivals, friends, veterans, mentors and recurring adventurers.

Persistent state may include:

- ID;
- rank;
- aptitude/role;
- relationship;
- location;
- injury/recovery;
- party/story affiliation;
- visible equipment;
- current authored state;
- availability;
- milestone flags.

Their progression is driven by authored milestones, explicit world-state milestones and player interaction.

A story adventurer may later appear at a higher rank, with new equipment or in a new occupation, but the game does not need to secretly simulate a full sequence of player-like quests, reward settlements and merit grinding to justify that change.

### 4. Companion NPC

Companions support a player's adventure.

They can have combat AI, skills, equipment, personality, relationships and limited tactical commands.

They may receive a fair in-world party share where appropriate to the fiction, but that share is not the basis of a hidden autonomous bot economy.

Companions do not independently push Main Dungeon progression or major Guild progression without players.

## Persistence model

“Persistent” means continuity, not autonomous gameplay.

Save only state that can affect the player-facing world.

Recommended persistent fields for important NPCs:

- stable ID;
- current role/rank;
- relationship state;
- injury/recovery;
- location;
- current story state;
- availability;
- visible equipment tier;
- relevant knowledge/rumor flags;
- major event flags.

Do not create hidden per-NPC economic ledgers, full contract histories or promotion-grind systems unless a specific authored story needs them.

## State changes

NPC state can change when:

- the player completes or fails a relevant objective;
- a regional/world event reaches a milestone;
- an authored passage of in-world time occurs;
- a character-specific story resolves;
- the player develops a relationship;
- a promotion/retirement/move is explicitly scheduled by content.

Example:

N15 Kevi Ash may begin as an F-rank fighter saving for a better blade.

Later, after an authored milestone, the player may see:

- a new blade;
- an E-rank tag;
- changed dialogue;
- a new party role.

The game does not need to simulate Kevi consuming six real Quest Board contracts behind the player's back.

## Quest Board boundary

Do **not** use this loop as the default NPC model:

Idle → Evaluate player-facing jobs → Reserve → Complete → Settle → Grind merit → Promote.

Player-facing Guild contracts belong to the Player Contract Pool.

NPC Narrative Activity is separate.

An NPC may visibly “leave for work” or return from an off-screen expedition, but that activity normally comes from authored background states rather than removing a meaningful player contract.

This avoids the design problem where fallback quests are required because NPC bots consumed the player's progression route.

## Main Dungeon boundary

NPCs may provide:

- historical expedition records;
- veteran stories;
- previously mapped areas;
- missing-party hooks;
- safe-route knowledge;
- companion support.

During active play, meaningful new Main Dungeon breakthroughs should primarily come from real players or player parties.

Do not advance the frontier simply because an off-screen NPC simulation tick succeeded.

## Major events

NPCs can participate in world events as supporting actors.

Example raid:

- guards hold the gate;
- healers treat casualties;
- ambient adventurers fight in secondary areas;
- story NPCs react according to their role.

Player objectives determine important outcomes such as defeating the commander, closing the breach, rescuing a target or recovering critical evidence.

## Economy boundary

NPC life does not require a large autonomous economy.

Allowed:

- shop stock changes;
- shortages;
- authored supply responses;
- service availability;
- visible equipment upgrades;
- story-driven financial pressure.

Avoid:

- thousands of NPCs farming resources;
- NPC auction manipulation;
- continuous bot trading;
- bot adventurers dominating loot supply;
- NPC economic behavior that makes player activity irrelevant.

## Low-population support

The future shared-world direction may use companion and ambient NPCs to prevent empty-feeling social spaces when population is low.

When many real players are present, real adventurers should provide much of the life of Guild halls and towns.

Dynamic NPC density is a future implementation option, not a v0.2.1 requirement.

## Vertical-slice acceptance

The slice only needs to prove:

- at least two named NPCs visibly change state;
- a companion can support solo play;
- the Guild feels occupied even without networking;
- NPC activity never removes critical player content;
- no NPC completes a Main Dungeon breakthrough for the player;
- save/load preserves relevant NPC continuity.

No autonomous NPC player economy or career simulator is required for the slice.
