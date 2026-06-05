#!/usr/bin/env python3
"""
Extract all game data from game-datacards/datasources and produce
the full set of JSON files the app consumes.

Data source: https://github.com/game-datacards/datasources

Replaces the old extract_datacards.py (39k.pro scraper) and
extract_stratagems.py (game-datacards stratagems only) with a single
unified pipeline.
"""

import json
import re
import urllib.request
from collections import Counter
from pathlib import Path

ASSETS_DIR = Path(__file__).parent.parent / "src" / "assets" / "json"
BASE_URL = "https://raw.githubusercontent.com/game-datacards/datasources/main/10th/json"

FACTION_FILES = [
    "adeptasororitas",
    "adeptuscustodes",
    "adeptusmechanicus",
    "aeldari",
    "agents",
    "astramilitarum",
    "blacktemplar",
    "bloodangels",
    "chaos_spacemarines",
    "chaosdaemons",
    "chaosknights",
    "darkangels",
    "deathguard",
    "deathwatch",
    "drukhari",
    "emperors_children",
    "greyknights",
    "gsc",
    "imperialknights",
    "necrons",
    "orks",
    "space_marines",
    "spacewolves",
    "tau",
    "thousandsons",
    "tyranids",
    "votann",
    "worldeaters",
]

# Map game-datacards faction_id to app faction_id where they differ
FACTION_ID_MAP = {
    "CHBA": "SM",
    "CHDA": "SM",
    "CHSW": "SM",
    "CHBT": "SM",
    "CHDW": "SM",
    "LGEC": "EC",
    "GSC": "GC",
}

# SM subfaction publications that get their own Factions.json entries
SM_SUBFACTION_NAMES = {
    "CHBA": "Blood Angels",
    "CHDA": "Dark Angels",
    "CHSW": "Space Wolves",
    "CHBT": "Black Templars",
    "CHDW": "Deathwatch",
}

TURN_MAP = {
    "your": "Your turn",
    "opponents": "Opponent's turn",
    "either": "Either player's turn",
}

PHASE_MAP = {
    "fight": "Fight",
    "shooting": "Shooting",
    "charge": "Charge",
    "movement": "Movement",
    "command": "Command",
    "any": "Any",
}

SAVES_PHASES = {"fight", "shooting", "charge", "movement", "command"}


# ─── Phase tagging ──────────────────────────────────────────────────────────

phase_patterns = {
    "Pregame": [
        "must be your Warlord", "If a model from your army with the Leader ability can be attached",
        "selected as your Warlord", "cannot be your Warlord",
        "include this FORTIFICATION in your army", "this FORTIFICATION is set up",
        "Infiltrators", "Scouts", "attach up to two Leader units",
        "include any ETHEREAL units", "army cannot contain", "At the start of the battle",
        "FORTIFICATION must be set up", "you can include",
        "At the start of the first battle round", "During deployment",
    ],
    "Command": [
        "start of the battle round", "in your Command phase",
        "At the end of your Command phase", "At the start of your Command phase",
        "each time you take a Battle-shock test", "Stratagem", "Objective Control",
        "Declare Battle Formations step", "attached to this unit instead",
        "that unit takes a Battle-shock or Leadership test", "synapse",
        "at the end of any phase", "be attached to this unit", "Battle-shock step",
        "This OFFICER can issue", "Leadership tests", "Officer", "different Orders",
        "each player's Command phase", "at the end of your opponent's turn",
        "use a Fate dice", "Battle-shock or Leadership test", "given Enhancements",
        "Leadership characteristic", "issues an Order", "at the start of any phase",
        "at the start of any Command phase",
        "must select one of the keywords below", "re-roll Leadership and Battle-shock",
        "TRANSPORT keyword", "Reanimation Protocols",
        "start of the first battle round", "pain token", "cabal point",
        "Battle-shock test is taken for that unit",
        "you select this model to include in your army", "Blessings of Khorne",
        "Chapter, a successor", "Miracle dice", "re-roll Battle-shock tests",
        "Shadow of Chaos", "takes a Battle-shock test", "is your Warlord",
        "model in this unit is destroyed, any remaining",
        "opponent gains a CP as the result of an ability", "At the end of each phase",
        "this model's unit fails a Battle-shock test", "When this model is set up",
        "Acts of Faith", "Act of Faith",
        "first set up on the battlefield",
        "that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it",
        "has the PSYKER keyword", "You must attach", "this unit contains no",
        "Shadow in the Warp", "either player's Command phase",
        "your Army Faction is not AGENTS OF THE IMPERIUM",
        "when the bearer is attached", "Acquisition objective marker", "entry zone",
        "Feed the Swarm", "Secure Site", "use a Ritual", "Twisting Fate",
        "bearer's unit can be regenerated", "enemy unit opens a Hatchway",
        "bearer fails a Battle-shock test", "bearer's Aura abilities",
        "In each Command Phase", "You start the battle",
        "each player's Command phase", "bearer issues Taktiks",
        "Bondsman ability",
        "can ignore any or all modifiers to their characteristics",
    ],
    "Movement": [
        "Move characteristic", "at the end of your Movement phase",
        "At the start of your Movement phase",
        "after this unit ends a Normal move", "in your Movement phase",
        "unit arrives from Strategic Reserves", "this unit ends a Normal move",
        "when an enemy unit ends a Normal, Advance or Fall Back move",
        "unit is eligible to charge in a turn in which it Advanced", "redeploy",
        "reserves", "Normal move", "in which it Advanced",
        "Advance and Charge rolls", "that unit is selected to Fall Back",
        "can be set up or end any type of move", "Deep Strike",
        "Enemy units cannot start or end an Advance move",
        "this unit or an enemy unit ends a move",
        "this model is selected to Advance", "set up in the Reinforcements step",
        "at the end of any phase", "disembark", "embark",
        "is selected to Fall Back", "Remained Stationary",
        "use a Fate dice", "re-roll Advance rolls", "at the start of any phase",
        "Normal or Advance move", "TRANSPORT keyword", "Eviscerating Fly-by",
        "pain token", "cabal point", "Normal, Advance or Fall Back move",
        "Miracle dice", "opponent gains a CP as the result of an ability",
        "At the end of each phase", "Act of Faith", "Acts of Faith",
        "re-roll Charge and Advance rolls",
        "that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it",
        "this unit contains no", "Thievin' Scavengers", "one Advance roll",
        "use a Ritual", "bearer's Aura abilities", "Psionic Parasitism",
        "bearer attempts to operate a closed Hatchway",
        "can ignore any or all modifiers to their characteristics",
    ],
    "Shooting": [
        "roll to determine the number of attacks made with a flamer",
        "Improve the Strength characteristic", "Improve the Attacks characteristic",
        "eadbanger", "each time a model in that unit makes a ranged attack",
        "from the Toughness characteristic of models in that unit",
        "Each time a model in this unit makes a ranged attack",
        "unit is selected to shoot in your Shooting phase",
        "ranged weapons equipped by models in this unit", "snazzgun",
        "shoot", "fire overwatch", "weapons equipped by models in that unit",
        "this model has shot", "Grenades", "makes an attack that targets",
        "this model destroys an enemy unit", "ranged weapon", "ranged attack made",
        "ranged attacks", "model in that unit makes an attack", "ranged attack",
        "improve the Ballistic Skill and Weapon Skill",
        "attack has been allocated to this model", "Greater Good ability",
        "this unit makes an attack", "MARKERLIGHT", "cannon",
        "at the end of any phase", "destroys an enemy",
        "making a Hit roll for a model in this unit",
        "Heavy weapons equipped by models", "Praetor launcher",
        "bearer's unit has shot", "model is destroyed", "use a Fate dice",
        "missile launcher", "to the Range characteristic",
        "at the start of any phase", "attack with a Psychic weapon",
        "exitus rifle", "select a PSYKER unit as the target",
        "bearer's unit makes an attack", "purifying flame", "Dark Pact",
        "FIRE PRISM", "pain token", "cabal point",
        "weapon targets a unit more than", "storm eagle rockets",
        "Miracle dice", "contagion range",
        "model in that unit makes a Psychic Attack",
        "when an attack is allocated to the bearer",
        "makes an attack with a Blast weapon", "shokk attack gun",
        "your army with this ability has shot",
        "opponent gains a CP as the result of an ability",
        "At the end of each phase", "Act of Faith", "Acts of Faith",
        "is more than 24\" from the bearer", "this model makes an attack",
        "that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it",
        "this unit contains no", "to the Attacks characteristic of weapons",
        "bearer has shot with this weapon", "Deadly Unity",
        "Conqueror Imperative", "Protector Imperative",
        "Acquisition objective marker", "the bearer makes an attack",
        "bearer's unit makes an attack", "re-roll one Hit roll",
        "after making a Hit roll", "ANTI-VEHICLE", "Patient Hunter",
        "Killing Blow", "DEVASTATING WOUNDS", "use a Ritual", "Psychic weapon",
        "focus of hatred is destroyed", "bearer's Aura abilities",
        "Psionic Parasitism", "SUSTAINED HITS", "Flow of Magic",
        "Dark Sacrifice",
        "can ignore any or all modifiers to their characteristics",
        "makes an attack",
    ],
    "Charge": [
        "re-roll Charge rolls", "unit is eligible to declare a charge",
        "eligible to declare a charge this turn", "this unit ends a Charge move",
        "this model ends a Charge move",
        "unit is eligible to charge in a turn in which it Advanced",
        "declare a charge", "Advance and Charge rolls", "Charge move",
        "at the end of any phase", "Charge rolls made for the bearer",
        "use a Fate dice", "at the start of any phase", "pain token",
        "cabal point", "Miracle dice",
        "opponent gains a CP as the result of an ability",
        "At the end of each phase", "each time a Charge roll",
        "Acts of Faith", "Act of Faith", "re-roll Charge and Advance rolls",
        "that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it",
        "re-roll the Charge roll", "start of your Charge phase",
        "this unit contains no", "to Charge rolls made", "one Charge roll",
        "use a Ritual", "bearer declares a charge", "bearer's Aura abilities",
        "bearer's unit as a target of a charge",
        "can ignore any or all modifiers to their characteristics",
    ],
    "Fight": [
        "each time a model in that unit makes a melee attack",
        "to the Attacks characteristic of this model's melee weapons",
        "choppa", "melee weapons equipped by models in that unit",
        "from the Toughness characteristic of models in that unit",
        "urty syringe", "unit Consolidates", "At the start of the Fight phase",
        "Each time this model makes a melee attack", "dread klaw",
        "Each time this model is selected to fight", "heroic intervention",
        "dread killsaws", "this unit is selected to fight",
        "unit is selected to fight", "this model destroys an enemy unit",
        "model in that unit makes an attack", "model fights",
        "crushing teeth and claws",
        "improve the Ballistic Skill and Weapon Skill",
        "attack has been allocated to this model", "this unit makes an attack",
        "synapse", "at the end of any phase", "melee weapons", "melee attack",
        "melee attacks", "melee weapon", "destroys an enemy", "Fights First",
        "making a Hit roll for a model in this unit", "power axe",
        "model is destroyed", "use a Fate dice", "at the start of any phase",
        "attack with a Psychic weapon", "enemy unit finishes making its attacks",
        "select a PSYKER unit as the target", "bearer's unit makes an attack",
        "end of the Fight phase", "Dark Pact", "pain token", "cabal point",
        "Miracle dice", "contagion range",
        "model in that unit makes a Psychic Attack",
        "when an attack is allocated to the bearer", "helbrute fists",
        "hellforged weapons", "In the Fight phase", "las-talon",
        "opponent gains a CP as the result of an ability",
        "At the end of each phase", "Once per Fight phase",
        "Acts of Faith", "Weapon Skill characteristic",
        "this model makes an attack",
        "that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it",
        "this unit contains no", "to the Attacks characteristic of weapons",
        "Deadly Unity", "Conqueror Imperative", "Protector Imperative",
        "Acquisition objective marker", "the bearer makes an attack",
        "bearer's unit makes an attack",
        "bearer's unit Piles In or Consolidates",
        "re-roll one Hit roll", "after making a Hit roll",
        "monomolecular cane-rapier", "bearer is selected to fight",
        "ANTI-VEHICLE", "Killing Blow", "DEVASTATING WOUNDS",
        "use a Ritual", "Psychic weapon", "focus of hatred is destroyed",
        "bearer's Aura abilities", "bearers Haemonculus tools",
        "Psionic Parasitism", "SUSTAINED HITS", "Flow of Magic",
        "Consolidation move", "Dark Sacrifice",
        "can ignore any or all modifiers to their characteristics",
        "makes an attack",
    ],
    "Saves": [
        "halve the Damage characteristic of that attack",
        "attack targets this model", "fire overwatch",
        "attack is allocated to this model", "Feel No Pain",
        "models in that unit have the Benefit of Cover",
        "each time an attack targets this unit", "invulnerable save",
        "bearer's Toughness", "bearer has a Wounds characteristic",
        "Bodyguard unit is destroyed", "Lone Operative",
        "models in that unit have the Stealth", "destroyed by a melee attack",
        "make a saving throw", "each time an attack targets that unit",
        "attack targets this unit", "bearer has the SMOKE",
        "declares a charge against the bearer's unit",
        "Enemy units cannot start or end an Advance move",
        "this unit or an enemy unit ends a move", "has a Save characteristic",
        "bearer has the Stealth",
        "you can ignore any or all modifiers to the characteristics of models in that unit and to any roll or test made for models in that unit",
        "at the end of any phase", "as the target of a charge", "SMOKE keyword",
        "bearer's Wounds characteristic", "its Toughness characteristic",
        "use a Fate dice", "attack is allocated to a model in that unit",
        "attack is allocated to a model in this unit", "Wounds characteristic",
        "saving throw is failed for this model", "at the start of any phase",
        "Deadly Demise ability", "crew token",
        "enemy unit finishes making its attacks",
        "enemy unit fails a Battle-shock test", "cult ambush", "Dark Pact",
        "pain token", "cabal point", "attack is allocated to this FORTIFICATION",
        "Toughness characteristic",
        "Enemy units that are set up on the battlefield as Reinforcements",
        "Miracle dice", "model in that unit makes a Psychic Attack",
        "against this PSYKER", "Foul spores",
        "FORTIFICATION suffers a mortal wound",
        "model in this unit is destroyed, any remaining",
        "each time an attack is allocated to that model",
        "opponent gains a CP as the result of an ability",
        "select this model as the target of an attack",
        "At the end of each phase", "has the Benefits of Cover",
        "models from this unit were destroyed", "in this unit is destroyed",
        "enemy unit must take a Desperate Escape test",
        "to any armour saving throw made against that attack",
        "a saving throw is failed for the bearer's unit",
        "Acts of Faith", "Act of Faith", "attack is made against this unit",
        "that unit can ignore any or all modifiers to its characteristics and to any roll or test made for it",
        "model has the Benefit of Cover", "this unit contains no",
        "kustom force field", "Opponent's",
        "attack is allocated to the bearer",
        "saving throw is failed for the bearer", "Null Aegis",
        "attack targets the bearer", "when a saving throw made for a friendly",
        "an enemy unit attempts to operate a Hatchway",
        "Conqueror Imperative", "Protector Imperative",
        "Acquisition objective marker", "the bearer is destroyed",
        "one saving throw", "saving throw for the bearer",
        "bearer is selected to fight", "Stealth ability",
        "use a Ritual", "bearer fails a Battle-shock test",
        "focus of hatred is destroyed", "bearer's Aura abilities",
        "target of an enemy unit's charge", "Psionic Parasitism",
        "enemy unit opens a closed Hatchway",
        "attack is made against the bearer",
        "can ignore any or all modifiers to their characteristics",
        "bearer's unit Falls Back", "when a saving throw is failed",
        "enemy unit ends a Normal, Advance, or Fall Back move",
    ],
}

stratagems_phase_patterns = {
    "Command": ["Command", "Any"],
    "Movement": ["Movement", "Any"],
    "Shooting": ["Shooting", "Any"],
    "Charge": ["Charge", "Any"],
    "Fight": ["Fight", "Any"],
    "Saves": ["Fight", "Shooting", "Charge", "Movement", "Command", "Any"],
}


def determine_phases(description: str, is_stratagem: bool = False) -> list:
    """Determine which game phases an ability/stratagem is relevant to."""
    phases = []
    if is_stratagem:
        for phase, patterns in stratagems_phase_patterns.items():
            for pattern in patterns:
                if re.search(pattern, description, re.IGNORECASE):
                    phases.append(phase)
                    break
    else:
        for phase, patterns in phase_patterns.items():
            for pattern in patterns:
                if re.search(pattern, description, re.IGNORECASE):
                    phases.append(phase)
                    break
    return phases


def strip_markdown(text: str) -> str:
    """Remove markdown bold/italic markers from text."""
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    return text


def parse_core_ability(core_str: str):
    """Parse a core ability string like 'Feel No Pain 5+' into (name, parameter)."""
    patterns = [
        r'^(Feel No Pain)\s+(\d\+)$',
        r'^(Deadly Demise)\s+(.+)$',
        r'^(Scouts?)\s+(.+)$',
        r'^(Firing Deck)\s+(.+)$',
    ]
    for pattern in patterns:
        m = re.match(pattern, core_str)
        if m:
            return m.group(1), m.group(2)
    return core_str, ""


CORE_ABILITY_DESCRIPTIONS = {
    "Feel No Pain": "Each time this model would lose a wound, roll one D6: if the result equals or exceeds the number shown, that wound is not lost.",
    "Leader": "Before the battle, CHARACTER units with the Leader ability can be attached to one of their Bodyguard units to form an Attached unit.",
    "Scout": "At the start of the first battle round, before the first turn begins, you can move this unit up to the distance shown as if it were the Movement phase.",
    "Scouts": "At the start of the first battle round, before the first turn begins, you can move this unit up to the distance shown as if it were the Movement phase.",
    "Firing Deck": "Each time this TRANSPORT shoots, select one weapon from up to the number shown of models embarked within it whose units have not shot this phase; this TRANSPORT counts as being equipped with those weapons as well.",
    "Infiltrators": "During deployment, if every model in a unit has this ability, then when you set it up, it can be set up anywhere on the battlefield that is more than 9\" horizontally away from the enemy deployment zone and all enemy models.",
    "Deadly Demise": "When this model is destroyed, roll one D6 before removing it from play. On a 6, each unit within 6\" of that model suffers a number of mortal wounds denoted by the value shown.",
    "Fights First": "Units with this ability that are eligible to fight do so in the Fights First step, provided every model in the unit has this ability.",
    "Lone Operative": "Unless part of an Attached unit, this unit can only be selected as the target of a ranged attack if the attacking model is within 12\".",
    "Hover": "When you are instructed to Declare Battle Formations, you can declare this model will be in Hover mode. Its Move characteristic changes to 20\" and it loses the AIRCRAFT keyword.",
    "Deep Strike": "Unit can be set up in Reserves instead of on the battlefield. Unit can be set up in your Reinforcements step, more than 9\" horizontally away from all enemy models.",
    "Stealth": "If every model in a unit has this ability, then each time a ranged attack is made against it, subtract 1 from that attack's Hit roll.",
    "Super-heavy Walker": "Each time a model with this ability makes a Normal, Advance or Fall Back move, it can move through models (excluding TITANIC models) and sections of terrain features that are 4\" or less in height.",
}


# ─── Network ────────────────────────────────────────────────────────────────

def fetch_json(filename: str) -> dict:
    url = f"{BASE_URL}/{filename}.json"
    req = urllib.request.Request(url, headers={"User-Agent": "army-assist"})
    return json.loads(urllib.request.urlopen(req).read())


# ─── Transformers ───────────────────────────────────────────────────────────

def map_faction_id(raw_id: str) -> str:
    return FACTION_ID_MAP.get(raw_id, raw_id)


def transform_datasheet(ds: dict) -> dict:
    abilities = ds.get("abilities", {})
    damaged = abilities.get("damaged", {})
    return {
        "id": ds["id"],
        "name": ds["name"],
        "faction_id": map_faction_id(ds.get("faction_id", "")),
        "source_id": "",
        "legend": ds.get("fluff", ""),
        "role": "",
        "loadout": ds.get("loadout", ""),
        "transport": ds.get("transport", "") or "",
        "virtual": "false",
        "leader_head": ds.get("leader", "") or "",
        "leader_footer": "",
        "damaged_w": damaged.get("range", "") or "",
        "damaged_description": damaged.get("description", "") or "",
        "link": "",
    }


_COMPOSITION_COUNT_RE = re.compile(r"^\s*(\d+(?:-\d+)?)\s+(.+?)\s*$")

# Multi-model composition entries combine several model lines into one string
# using comma + " and " (e.g. "1 Jakhal Pack Leader, 1 Dishonoured and 8 Jakhals").
# Split on these combinators before applying _COMPOSITION_COUNT_RE so each role
# becomes its own model row downstream.
_COMPOSITION_PART_SPLIT_RE = re.compile(r",\s+|\s+and\s+")


def transform_models(ds: dict) -> list:
    abilities = ds.get("abilities", {})
    invul = abilities.get("invul", {})
    inv_val = invul.get("value", "") or ""
    inv_descr = invul.get("info", "") or ""
    # Strip the "+" from "4+" for inv_sv
    inv_sv = inv_val.replace("+", "") if inv_val else ""

    # baseSize lives at datasheet level upstream; propagate to every stat row.
    base_size = ds.get("baseSize", "") or ""

    stats = ds.get("stats", [])
    models = []
    for i, stat in enumerate(stats):
        models.append({
            "datasheet_id": ds["id"],
            "line": str(i + 1),
            "name": stat.get("name", ""),
            "M": stat.get("m", ""),
            "T": stat.get("t", ""),
            "Sv": stat.get("sv", ""),
            "inv_sv": inv_sv,
            "inv_sv_descr": inv_descr,
            "W": stat.get("w", ""),
            "Ld": stat.get("ld", ""),
            "OC": stat.get("oc", ""),
            "base_size": base_size,
            "base_size_descr": "",
        })

    # Synthesize per-model rows from the `composition` field. game-datacards
    # only exposes `stats[]` (often one row per datasheet), but lists squad
    # composition as strings like "1 Infernus Sergeant", "4-9 Infernus Marines".
    # Emit extra rows for each unique model name so Bevy's list parser can
    # resolve sergeants, champions and named characters. Synthesized rows
    # share the primary stat line — upstream doesn't expose per-model distinct
    # stats (a named-character overlay is a separate follow-up).
    if stats:
        primary = stats[0]
        existing_lower = {m["name"].lower() for m in models}
        line = len(models) + 1
        for entry in ds.get("composition", []):
            # Skip choice-style composition entries entirely — "1 Sergeant or 1
            # Lieutenant" describes a unit-level option, not multiple models.
            if " or " in entry.lower():
                continue
            # Split combined entries like "1 Jakhal Pack Leader, 1 Dishonoured and
            # 8 Jakhals" into individual count-prefixed parts. Single-model entries
            # ("4-9 Infernus Marines") split into a one-element list and behave as
            # before.
            for part in _COMPOSITION_PART_SPLIT_RE.split(entry):
                match = _COMPOSITION_COUNT_RE.match(part)
                if not match:
                    continue
                name = match.group(2).strip()
                lower = name.lower()
                # Dedupe case-insensitive, tolerant of singular/plural.
                if (
                    lower in existing_lower
                    or (lower.endswith("s") and lower[:-1] in existing_lower)
                    or f"{lower}s" in existing_lower
                ):
                    continue
                existing_lower.add(lower)
                models.append({
                    "datasheet_id": ds["id"],
                    "line": str(line),
                    "name": name,
                    "M": primary.get("m", ""),
                    "T": primary.get("t", ""),
                    "Sv": primary.get("sv", ""),
                    "inv_sv": inv_sv,
                    "inv_sv_descr": inv_descr,
                    "W": primary.get("w", ""),
                    "Ld": primary.get("ld", ""),
                    "OC": primary.get("oc", ""),
                    "base_size": base_size,
                    "base_size_descr": "",
                })
                line += 1

    return models


def transform_abilities(ds: dict) -> list:
    abilities_data = ds.get("abilities", {})
    result = []
    line = 1

    # Core abilities
    for core_str in abilities_data.get("core", []):
        name, parameter = parse_core_ability(core_str)
        description = CORE_ABILITY_DESCRIPTIONS.get(name, "")
        if parameter and description:
            description = description.replace("the number shown", parameter).replace(
                "the distance shown", parameter
            ).replace("the value shown", parameter)
        entry = {
            "datasheet_id": ds["id"],
            "line": str(line),
            "ability_id": "",
            "model": "",
            "name": core_str,
            "description": description,
            "type": "Core",
            "parameter": parameter,
            "phases": determine_phases(f"{core_str} {description}"),
        }
        result.append(entry)
        line += 1

    # Faction abilities
    for faction_str in abilities_data.get("faction", []):
        entry = {
            "datasheet_id": ds["id"],
            "line": str(line),
            "ability_id": "",
            "model": "",
            "name": faction_str,
            "description": "",
            "type": "Faction",
            "parameter": "",
            "phases": determine_phases(faction_str),
        }
        result.append(entry)
        line += 1

    # Other abilities (have name + description)
    for ability in abilities_data.get("other", []):
        name = ability.get("name", "")
        desc = strip_markdown(ability.get("description", ""))
        entry = {
            "datasheet_id": ds["id"],
            "line": str(line),
            "ability_id": "",
            "model": "",
            "name": name,
            "description": desc,
            "type": "Other",
            "parameter": "",
            "phases": determine_phases(f"{name} {desc}"),
        }
        result.append(entry)
        line += 1

    # Wargear abilities
    for ability in abilities_data.get("wargear", []):
        name = ability.get("name", "")
        desc = strip_markdown(ability.get("description", ""))
        entry = {
            "datasheet_id": ds["id"],
            "line": str(line),
            "ability_id": "",
            "model": "",
            "name": name,
            "description": desc,
            "type": "Wargear",
            "parameter": "",
            "phases": determine_phases(f"{name} {desc}"),
        }
        result.append(entry)
        line += 1

    # Special abilities
    for ability in abilities_data.get("special", []):
        name = ability.get("name", "")
        desc = strip_markdown(ability.get("description", ""))
        entry = {
            "datasheet_id": ds["id"],
            "line": str(line),
            "ability_id": "",
            "model": "",
            "name": name,
            "description": desc,
            "type": "Special",
            "parameter": "",
            "phases": determine_phases(f"{name} {desc}"),
        }
        result.append(entry)
        line += 1

    # Primarch abilities
    for ability in abilities_data.get("primarch", []):
        name = ability.get("name", "")
        desc = strip_markdown(ability.get("description", ""))
        entry = {
            "datasheet_id": ds["id"],
            "line": str(line),
            "ability_id": "",
            "model": "",
            "name": name,
            "description": desc,
            "type": "Primarch",
            "parameter": "",
            "phases": determine_phases(f"{name} {desc}"),
        }
        result.append(entry)
        line += 1

    return result


def transform_wargear(ds: dict) -> list:
    result = []
    line = 1

    for weapon_type, key in [("Ranged", "rangedWeapons"), ("Melee", "meleeWeapons")]:
        for weapon in ds.get(key, []):
            for pi, profile in enumerate(weapon.get("profiles", [])):
                keywords = profile.get("keywords", [])
                result.append({
                    "datasheet_id": ds["id"],
                    "line": str(line),
                    "line_in_wargear": str(pi + 1),
                    "dice": "",
                    "name": profile.get("name", ""),
                    "description": ", ".join(keywords) if keywords else "",
                    "range": profile.get("range", ""),
                    "type": weapon_type,
                    "A": profile.get("attacks", ""),
                    "BS_WS": profile.get("skill", ""),
                    "S": profile.get("strength", ""),
                    "AP": profile.get("ap", ""),
                    "D": profile.get("damage", ""),
                })
                line += 1

    return result


def transform_points(ds: dict) -> list:
    result = []
    for entry in ds.get("points", []):
        result.append({
            "datasheet_id": ds["id"],
            "models": entry.get("models", ""),
            "cost": entry.get("cost", ""),
        })
    return result


def transform_keywords(ds: dict) -> list:
    result = []
    for kw in ds.get("factions", []):
        result.append({
            "datasheet_id": ds["id"],
            "keyword": kw,
            "model": "",
            "is_faction_keyword": "true",
        })
    for kw in ds.get("keywords", []):
        result.append({
            "datasheet_id": ds["id"],
            "keyword": kw,
            "model": "",
            "is_faction_keyword": "false",
        })
    return result


def transform_leaders(all_datasheets: list) -> list:
    """Build leader attachment table by cross-referencing leads.units to datasheet names."""
    # Build name -> id lookup (case-insensitive, per faction)
    name_to_ids: dict[str, list] = {}
    for ds in all_datasheets:
        key = ds["name"].upper()
        name_to_ids.setdefault(key, []).append(ds)

    result = []
    for ds in all_datasheets:
        leads = ds.get("leads")
        if not leads:
            continue
        leader_id = ds["id"]
        leader_faction = map_faction_id(ds.get("faction_id", ""))
        for unit_name in leads.get("units", []):
            key = unit_name.upper()
            candidates = name_to_ids.get(key, [])
            # Prefer same faction
            match = None
            for c in candidates:
                if map_faction_id(c.get("faction_id", "")) == leader_faction:
                    match = c
                    break
            if not match and candidates:
                match = candidates[0]
            if match:
                result.append({
                    "leader_id": leader_id,
                    "attached_id": match["id"],
                })
    return result


def build_stratagem_description(s: dict) -> str:
    parts = []
    if s.get("when"):
        parts.append(f"WHEN: {s['when']}")
    if s.get("target"):
        parts.append(f"TARGET: {s['target']}")
    if s.get("effect"):
        parts.append(f"EFFECT: {s['effect']}")
    if s.get("restrictions"):
        parts.append(f"RESTRICTIONS: {s['restrictions']}")
    return "".join(parts)


def map_stratagem_phases(phase_list: list[str]) -> list[str]:
    phases = []
    has_saves = False
    for p in phase_list:
        mapped = PHASE_MAP.get(p, p.capitalize())
        if mapped == "Any":
            phases.extend(["Command", "Movement", "Shooting", "Charge", "Fight"])
            has_saves = True
        else:
            phases.append(mapped)
        if p in SAVES_PHASES:
            has_saves = True
    if has_saves:
        phases.append("Saves")
    return phases


def transform_stratagem(s: dict, is_core: bool = False) -> dict:
    faction_id = "" if is_core else map_faction_id(s.get("faction_id", ""))
    detachment = "Core Rules" if is_core else s.get("detachment", "")

    strat_type = s.get("type", "")
    if is_core:
        type_str = f"Core - {strat_type} Stratagem"
    else:
        type_str = f"{detachment} - {strat_type} Stratagem"

    phase_list = s.get("phase", [])
    if isinstance(phase_list, str):
        phase_list = [phase_list]

    return {
        "faction_id": faction_id,
        "name": s.get("name", "").upper(),
        "id": s.get("id", ""),
        "type": type_str,
        "cp_cost": str(s.get("cost", "")),
        "legend": s.get("fluff", ""),
        "turn": TURN_MAP.get(s.get("turn", ""), s.get("turn", "")),
        "phase": s.get("when", ""),
        "detachment": detachment,
        "detachment_id": "",
        "description": build_stratagem_description(s),
        "phases": map_stratagem_phases(phase_list),
    }


def transform_enhancements(data: dict) -> list:
    result = []
    for enh in data.get("enhancements", []):
        desc = strip_markdown(enh.get("description", ""))
        result.append({
            "id": enh.get("id", ""),
            "name": enh.get("name", ""),
            "faction_id": map_faction_id(enh.get("faction_id", "")),
            "description": desc,
            "cost": enh.get("cost", ""),
            "detachment": enh.get("detachment", ""),
            "detachment_id": "",
            "legend": "",
            "phases": determine_phases(desc),
        })
    return result


def flatten_rule_text(rules: list) -> str:
    """Flatten a list of rule entries into a single description string."""
    parts = []
    for r in rules:
        rtype = r.get("type", "text")
        text = r.get("text", "")
        if rtype == "header":
            if parts:
                parts.append("\n")
            parts.append(f"{text}: ")
        elif text:
            parts.append(strip_markdown(text))
    return "".join(parts).strip()


def transform_army_abilities(data: dict) -> list:
    faction_id = map_faction_id(data.get("id", ""))
    result = []
    for rule_group in data.get("rules", {}).get("army", []):
        name = rule_group.get("name", "")
        desc = flatten_rule_text(rule_group.get("rules", []))
        result.append({
            "id": "",
            "name": name,
            "faction_id": faction_id,
            "legend": "",
            "description": desc,
            "phases": determine_phases(desc),
        })
    return result


def transform_detachment_abilities(data: dict) -> list:
    faction_id = map_faction_id(data.get("id", ""))
    result = []
    for det_entry in data.get("rules", {}).get("detachment", []):
        detachment = det_entry.get("detachment", "")
        for rule_group in det_entry.get("rules", []):
            name = rule_group.get("name", "")
            desc = flatten_rule_text(rule_group.get("rules", []))
            result.append({
                "id": "",
                "name": name,
                "faction_id": faction_id,
                "detachment": detachment,
                "detachment_id": "",
                "legend": "",
                "description": desc,
                "phases": determine_phases(desc),
            })
    return result


# ─── Main ───────────────────────────────────────────────────────────────────

def main():
    all_datasheets_raw = []  # Raw game-datacards format (for leader resolution)
    datasheets = []
    datasheet_models = []
    datasheet_abilities = []
    datasheet_wargear = []
    datasheet_keywords = []
    datasheet_points = []
    stratagems = []
    enhancements = []
    army_abilities = []
    detachment_abilities = []
    factions_seen: dict[str, str] = {}  # faction_id -> display name

    # Fetch core stratagems
    print("Fetching core.json...")
    core_data = fetch_json("core")
    for s in core_data.get("stratagems", []):
        stratagems.append(transform_stratagem(s, is_core=True))
    print(f"  Core Rules: {len(core_data.get('stratagems', []))} stratagems")

    # Fetch all faction data up front so we can detect datasheet IDs that are
    # shared across multiple factions (e.g. Chaos Rhino / Chaos Spawn appear in
    # 5 chaos faction files with the same id). Downstream consumers like Bevy
    # track `id -> faction` with a single-value map, so shared ids collapse
    # faction membership. Suffix the id with the faction during emission to
    # restore per-faction uniqueness.
    fetched = []  # list of (fname, data, raw_faction_id, faction_id, faction_name)
    for fname in FACTION_FILES:
        print(f"Fetching {fname}.json...")
        data = fetch_json(fname)
        raw_faction_id = data.get("id", "")
        faction_id = map_faction_id(raw_faction_id)
        faction_name = data.get("name", fname)
        fetched.append((fname, data, raw_faction_id, faction_id, faction_name))

    id_to_factions: dict[str, set[str]] = {}
    for (_, data, _, faction_id, _) in fetched:
        for ds in data.get("datasheets", []):
            id_to_factions.setdefault(ds["id"], set()).add(faction_id)

    # Dedupe datasheets emitted more than once with the same effective id.
    # SM chapter subfactions all map to faction_id "SM" and each chapter's
    # upstream file re-lists shared units (Terminator Squad, etc.) with the
    # same upstream id — without this guard we'd emit 3+ identical rows.
    emitted_ds_ids: set[str] = set()

    for (fname, data, raw_faction_id, faction_id, faction_name) in fetched:
        # Track factions
        if faction_id not in factions_seen:
            factions_seen[faction_id] = faction_name
        # SM subfactions get their own entry
        if raw_faction_id in SM_SUBFACTION_NAMES:
            sf_name = SM_SUBFACTION_NAMES[raw_faction_id]
            # Store as additional faction entry (same ID, different name)
            factions_seen.setdefault(f"{faction_id}:{sf_name}", sf_name)

        # Datasheets
        ds_list = data.get("datasheets", [])
        all_datasheets_raw.extend(ds_list)
        for ds in ds_list:
            # Disambiguate shared datasheet ids by suffixing faction.
            if len(id_to_factions.get(ds["id"], set())) > 1:
                ds["id"] = f"{ds['id']}-{faction_id}"
            if ds["id"] in emitted_ds_ids:
                continue
            emitted_ds_ids.add(ds["id"])
            datasheets.append(transform_datasheet(ds))
            datasheet_models.extend(transform_models(ds))
            datasheet_abilities.extend(transform_abilities(ds))
            datasheet_wargear.extend(transform_wargear(ds))
            datasheet_keywords.extend(transform_keywords(ds))
            datasheet_points.extend(transform_points(ds))

        # Stratagems
        strats = data.get("stratagems", [])
        for s in strats:
            stratagems.append(transform_stratagem(s))

        # Enhancements
        enhancements.extend(transform_enhancements(data))

        # Army abilities
        army_abilities.extend(transform_army_abilities(data))

        # Detachment abilities
        detachment_abilities.extend(transform_detachment_abilities(data))

        print(f"  {fname}: {len(ds_list)} datasheets, {len(strats)} stratagems")

    # Leader attachments (needs all datasheets to cross-reference)
    print("\nResolving leader attachments...")
    leader_attachments = transform_leaders(all_datasheets_raw)
    print(f"  {len(leader_attachments)} leader attachment links")

    # Build Factions.json
    factions = []
    for key, name in factions_seen.items():
        fid = key.split(":")[0] if ":" in key else key
        factions.append({"id": fid, "name": name, "link": ""})
    # Ensure extra entries present
    extra = [
        {"id": "SM", "name": "Adeptus Astartes", "link": ""},
        {"id": "AE", "name": "Ynnari", "link": ""},
        {"id": "AE", "name": "Craftworlds", "link": ""},
        {"id": "SM", "name": "Iron Hands", "link": ""},
        {"id": "SM", "name": "Raven Guard", "link": ""},
        {"id": "SM", "name": "Salamanders", "link": ""},
        {"id": "SM", "name": "Ultramarines", "link": ""},
        {"id": "SM", "name": "White Scars", "link": ""},
        {"id": "SM", "name": "Imperial Fists", "link": ""},
        {"id": "SM", "name": "Crimson Fists", "link": ""},
    ]
    for ef in extra:
        if not any(f["id"] == ef["id"] and f["name"] == ef["name"] for f in factions):
            factions.append(ef)

    # Write output files
    ASSETS_DIR.mkdir(parents=True, exist_ok=True)

    files = {
        "Datasheets.json": datasheets,
        "Datasheets_models.json": datasheet_models,
        "Datasheets_abilities.json": datasheet_abilities,
        "Datasheets_abilities_modified.json": datasheet_abilities,
        "Datasheets_wargear.json": datasheet_wargear,
        "Datasheets_keywords.json": datasheet_keywords,
        "Datasheets_points.json": datasheet_points,
        "Datasheets_leader.json": leader_attachments,
        "Enhancements.json": enhancements,
        "Enhancements_modified.json": enhancements,
        "Stratagems.json": stratagems,
        "Stratagems_modified.json": stratagems,
        "Factions.json": factions,
        "Abilities.json": army_abilities,
        "Abilities_modified.json": army_abilities,
        "Detachment_abilities.json": detachment_abilities,
        "Detachment_abilities_modified.json": detachment_abilities,
    }

    print("\nWriting output files...")
    for output_fname, data in files.items():
        path = ASSETS_DIR / output_fname
        with open(path, "w") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"  {output_fname}: {len(data)} entries")

    # Summary
    print(f"\nDone! {len(datasheets)} datasheets, {len(factions)} factions.")
    fac_counts = Counter(d["faction_id"] for d in datasheets)
    print(f"Faction counts: {dict(sorted(fac_counts.items()))}")


if __name__ == "__main__":
    main()
