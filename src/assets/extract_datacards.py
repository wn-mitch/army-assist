#!/usr/bin/env python3
"""
Extracts data from game-datacards/datasources JSON files and transforms them
into the app's existing Wahapedia-compatible JSON format.

Usage:
    python3 src/assets/extract_datacards.py

Downloads faction JSONs from the game-datacards GitHub repo, transforms them
to match the existing TypeScript types (Datasheet, DatasheetModel, Ability, etc.),
and runs the keyword-based phase tagger.
"""

import json
import os
import re
import hashlib
import urllib.request

REPO_BASE = "https://raw.githubusercontent.com/game-datacards/datasources/main/10th/json"
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "json")

# Faction files to download and their faction IDs used by the app.
# Maps game-datacards filename -> app faction_id
FACTION_FILES = {
    "adeptasororitas.json": "AS",
    "adeptuscustodes.json": "AC",
    "adeptusmechanicus.json": "AdM",
    "aeldari.json": "AE",
    "agents.json": "AoI",
    "astramilitarum.json": "AM",
    "blacktemplar.json": "SM",
    "bloodangels.json": "SM",
    "chaos_spacemarines.json": "CSM",
    "chaosdaemons.json": "CD",
    "chaosknights.json": "QT",
    "darkangels.json": "SM",
    "deathguard.json": "DG",
    "deathwatch.json": "SM",
    "drukhari.json": "DRU",
    "emperors_children.json": "EC",
    "greyknights.json": "GK",
    "gsc.json": "GC",
    "imperialknights.json": "QI",
    "marines_leviathan.json": "SM",
    "necrons.json": "NEC",
    "orks.json": "ORK",
    "space_marines.json": "SM",
    "spacewolves.json": "SM",
    "tau.json": "TAU",
    "thousandsons.json": "TS",
    "tyranids.json": "TYR",
    "unaligned.json": "UN",
    "votann.json": "LoV",
    "worldeaters.json": "WE",
}

# Subfaction files that share a parent faction_id but have their own name in the factions list
SM_SUBFACTION_FILES = {
    "blacktemplar.json",
    "bloodangels.json",
    "darkangels.json",
    "deathwatch.json",
    "spacewolves.json",
    "marines_leviathan.json",
}


def stable_id(text: str) -> str:
    """Generate a stable 9-digit ID from text for cross-referencing."""
    return hashlib.md5(text.encode()).hexdigest()[:9]


def download_json(filename: str) -> dict:
    """Download a JSON file from the game-datacards repo."""
    url = f"{REPO_BASE}/{filename}"
    print(f"  Downloading {filename}...")
    req = urllib.request.Request(url, headers={"User-Agent": "army-assist-extractor"})
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode())


def strip_markdown(text: str) -> str:
    """Remove markdown bold/italic markers from text."""
    text = re.sub(r'\*\*([^*]+)\*\*', r'\1', text)
    text = re.sub(r'\*([^*]+)\*', r'\1', text)
    return text


def rules_to_text(rules_list: list) -> str:
    """Convert a game-datacards rules array into a single description string."""
    parts = []
    for rule in rules_list:
        rtype = rule.get("type", "text")
        text = rule.get("text", "")
        if rtype == "header":
            parts.append(text + ": ")
        elif rtype == "text" or rtype == "quote":
            parts.append(strip_markdown(text))
        # Skip 'image' type
    return "".join(parts)


def parse_core_ability(core_str: str):
    """Parse a core ability string like 'Feel No Pain 5+' or 'Scout 6"' into (name, parameter)."""
    patterns = [
        (r'^(Feel No Pain)\s+(\d\+)$', None),
        (r'^(Deadly Demise)\s+(.+)$', None),
        (r'^(Scout)\s+(.+)$', None),
        (r'^(Firing Deck)\s+(.+)$', None),
    ]
    for pattern, _ in patterns:
        m = re.match(pattern, core_str)
        if m:
            return m.group(1), m.group(2)
    return core_str, ""


# ─── Phase tagging ───────────────────────────────────────────────────────────

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


# ─── Main extraction ─────────────────────────────────────────────────────────

def extract_all():
    datasheets = []
    datasheet_models = []
    datasheet_abilities = []
    datasheet_wargear = []
    datasheet_keywords = []
    datasheet_leader = []
    enhancements = []
    stratagems = []
    factions = []
    army_abilities = []
    detachment_abilities = []

    # Track seen datasheet IDs to avoid duplicates across SM subfaction files
    seen_datasheet_ids = set()
    # Track faction IDs we've already added to factions list
    seen_faction_ids = set()

    # Download and process core stratagems first
    print("Downloading core.json...")
    core_data = download_json("core.json")
    for strat in core_data.get("stratagems", []):
        stratagems.append({
            "faction_id": "",
            "name": strat["name"].upper(),
            "id": strat["id"],
            "type": f"Core - {strat.get('type', '')} Stratagem",
            "cp_cost": str(strat.get("cost", "")),
            "legend": strat.get("fluff", ""),
            "turn": strat.get("turn", ""),
            "phase": ", ".join(p.capitalize() + " phase" for p in strat.get("phase", [])) if strat.get("phase") else "",
            "detachment": "",
            "detachment_id": "",
            "description": build_stratagem_description(strat),
        })

    for filename, app_faction_id in FACTION_FILES.items():
        print(f"\nProcessing {filename} (faction: {app_faction_id})...")
        try:
            data = download_json(filename)
        except Exception as e:
            print(f"  ERROR downloading {filename}: {e}")
            continue

        gc_faction_id = data.get("id", "")
        gc_faction_name = data.get("name", "")

        # Build faction entry
        if app_faction_id not in seen_faction_ids:
            factions.append({
                "id": app_faction_id,
                "name": gc_faction_name,
                "link": data.get("link", ""),
            })
            seen_faction_ids.add(app_faction_id)

        # For SM subfactions, add extra faction entry so lists using the subfaction name resolve
        if filename in SM_SUBFACTION_FILES and gc_faction_name:
            factions.append({
                "id": app_faction_id,
                "name": gc_faction_name,
                "link": data.get("link", ""),
            })

        # ─── Datasheets ──────────────────────────────────────────────
        # Build a name->id lookup for leader cross-referencing within this faction
        # Use uppercase keys since leads.units[] uses UPPERCASE names
        name_to_id = {}
        for ds in data.get("datasheets", []):
            ds_id = ds["id"]
            name_to_id[ds["name"].upper()] = ds_id

        for ds in data.get("datasheets", []):
            ds_id = ds["id"]

            if ds_id in seen_datasheet_ids:
                continue
            seen_datasheet_ids.add(ds_id)

            # Damaged ability info
            damaged_w = ""
            damaged_desc = ""
            if ds["abilities"].get("damaged") and ds["abilities"]["damaged"].get("range"):
                damaged_w = ds["abilities"]["damaged"]["range"]
                damaged_desc = ds["abilities"]["damaged"].get("description", "")

            datasheets.append({
                "id": ds_id,
                "name": ds["name"],
                "faction_id": app_faction_id,
                "source_id": "",
                "legend": ds.get("fluff", ""),
                "role": "",
                "loadout": ds.get("loadout", ""),
                "transport": ds.get("transport", ""),
                "virtual": "false",
                "leader_head": ds.get("leader", ""),
                "leader_footer": "",
                "damaged_w": damaged_w,
                "damaged_description": damaged_desc,
                "link": "",
            })

            # ─── Stats / Models ──────────────────────────────────────
            invul_value = ""
            invul_info = ""
            invul_data = ds["abilities"].get("invul")
            if invul_data and invul_data.get("value"):
                invul_value = invul_data["value"]
                invul_info = invul_data.get("info", "") or ""
                # Strip the "+" from invul for consistency with existing data
                # Existing data stores just the number (e.g., "5" not "5+")
                if invul_value.endswith("+"):
                    invul_value = invul_value[:-1]

            for line_idx, stat in enumerate(ds.get("stats", []), start=1):
                datasheet_models.append({
                    "datasheet_id": ds_id,
                    "line": str(line_idx),
                    "name": stat.get("name", ds["name"]),
                    "M": stat.get("m", ""),
                    "T": stat.get("t", ""),
                    "Sv": stat.get("sv", ""),
                    "inv_sv": invul_value if invul_value else "-",
                    "inv_sv_descr": invul_info,
                    "W": stat.get("w", ""),
                    "Ld": stat.get("ld", ""),
                    "OC": stat.get("oc", ""),
                    "base_size": "",
                    "base_size_descr": "",
                })

            # ─── Weapons ─────────────────────────────────────────────
            wargear_line = 1
            for weapon_group in ds.get("rangedWeapons", []):
                for profile in weapon_group.get("profiles", []):
                    rng = profile.get("range", "")
                    if rng and rng != "Melee":
                        rng = rng.replace('"', '').replace("\"", "")
                    datasheet_wargear.append({
                        "datasheet_id": ds_id,
                        "line": str(wargear_line),
                        "line_in_wargear": "1",
                        "dice": "",
                        "name": profile["name"],
                        "description": ", ".join(k.lower() for k in profile.get("keywords", [])),
                        "range": rng,
                        "type": "Ranged",
                        "A": profile.get("attacks", ""),
                        "BS_WS": profile.get("skill", "").replace("+", ""),
                        "S": profile.get("strength", ""),
                        "AP": profile.get("ap", ""),
                        "D": profile.get("damage", ""),
                    })
                    wargear_line += 1

            for weapon_group in ds.get("meleeWeapons", []):
                for profile in weapon_group.get("profiles", []):
                    datasheet_wargear.append({
                        "datasheet_id": ds_id,
                        "line": str(wargear_line),
                        "line_in_wargear": "1",
                        "dice": "",
                        "name": profile["name"],
                        "description": ", ".join(k.lower() for k in profile.get("keywords", [])),
                        "range": "Melee",
                        "type": "Melee",
                        "A": profile.get("attacks", ""),
                        "BS_WS": profile.get("skill", "").replace("+", ""),
                        "S": profile.get("strength", ""),
                        "AP": profile.get("ap", ""),
                        "D": profile.get("damage", ""),
                    })
                    wargear_line += 1

            # ─── Abilities ───────────────────────────────────────────
            ability_line = 1

            # Core abilities
            for core_str in ds["abilities"].get("core", []):
                name, parameter = parse_core_ability(core_str)

                # Build description for core abilities
                description = get_core_ability_description(name)

                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": name if not parameter else f"{name} {parameter}",
                    "description": description,
                    "type": "Core",
                    "parameter": parameter,
                })
                ability_line += 1

            # Faction abilities
            for faction_str in ds["abilities"].get("faction", []):
                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": faction_str,
                    "description": "",
                    "type": "Faction",
                    "parameter": "",
                })
                ability_line += 1

            # Other abilities
            for ability in ds["abilities"].get("other", []):
                desc = strip_markdown(ability.get("description", ""))
                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": ability["name"],
                    "description": desc,
                    "type": "Other",
                    "parameter": "",
                })
                ability_line += 1

            # Wargear abilities
            for ability in ds["abilities"].get("wargear", []):
                desc = strip_markdown(ability.get("description", ""))
                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": ability["name"],
                    "description": desc,
                    "type": "Wargear",
                    "parameter": "",
                })
                ability_line += 1

            # Special abilities
            for ability in ds["abilities"].get("special", []):
                desc = strip_markdown(ability.get("description", ""))
                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": ability["name"],
                    "description": desc,
                    "type": "Special",
                    "parameter": "",
                })
                ability_line += 1

            # Primarch abilities
            for ability in ds["abilities"].get("primarch", []):
                desc = strip_markdown(ability.get("description", ""))
                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": ability["name"],
                    "description": desc,
                    "type": "Primarch",
                    "parameter": "",
                })
                ability_line += 1

            # Damaged ability
            if damaged_w and damaged_desc:
                datasheet_abilities.append({
                    "datasheet_id": ds_id,
                    "line": str(ability_line),
                    "ability_id": "",
                    "model": "",
                    "name": f"Damaged: {damaged_w}",
                    "description": strip_markdown(damaged_desc),
                    "type": "Other",
                    "parameter": "",
                })
                ability_line += 1

            # ─── Keywords ────────────────────────────────────────────
            for kw in ds.get("keywords", []):
                datasheet_keywords.append({
                    "datasheet_id": ds_id,
                    "keyword": kw,
                    "model": "",
                    "is_faction_keyword": "true" if kw in ds.get("factions", []) else "false",
                })

            # Also add faction keywords
            for fkw in ds.get("factions", []):
                if fkw not in ds.get("keywords", []):
                    datasheet_keywords.append({
                        "datasheet_id": ds_id,
                        "keyword": fkw,
                        "model": "",
                        "is_faction_keyword": "true",
                    })

            # ─── Leader attachments ──────────────────────────────────
            if ds.get("leads") and ds["leads"].get("units"):
                for unit_name in ds["leads"]["units"]:
                    # Look up the target unit's ID (leads uses UPPERCASE names)
                    target_id = name_to_id.get(unit_name.upper(), "")
                    if target_id:
                        datasheet_leader.append({
                            "leader_id": ds_id,
                            "attached_id": target_id,
                        })

        # ─── Stratagems ──────────────────────────────────────────────
        for strat in data.get("stratagems", []):
            phase_str = ", ".join(
                p.capitalize() + " phase" for p in strat.get("phase", [])
            ) if strat.get("phase") else ""

            stratagems.append({
                "faction_id": app_faction_id,
                "name": strat["name"].upper(),
                "id": strat.get("id", ""),
                "type": f"{strat.get('detachment', '')} - {strat.get('type', '')} Stratagem",
                "cp_cost": str(strat.get("cost", "")),
                "legend": strat.get("fluff", ""),
                "turn": strat.get("turn", ""),
                "phase": phase_str,
                "detachment": strat.get("detachment", ""),
                "detachment_id": "",
                "description": build_stratagem_description(strat),
            })

        # ─── Enhancements ────────────────────────────────────────────
        for enh in data.get("enhancements", []):
            enhancements.append({
                "faction_id": app_faction_id,
                "id": enh.get("id", ""),
                "name": enh["name"],
                "cost": str(enh.get("cost", "")),
                "detachment": enh.get("detachment", ""),
                "detachment_id": "",
                "legend": "",
                "description": strip_markdown(enh.get("description", "")),
            })

        # ─── Army rules ──────────────────────────────────────────────
        for rule in data.get("rules", {}).get("army", []):
            rule_name = rule.get("name", "")
            rule_text = rules_to_text(rule.get("rules", []))
            army_abilities.append({
                "id": stable_id(f"{app_faction_id}-{rule_name}"),
                "name": rule_name,
                "legend": "",
                "faction_id": app_faction_id,
                "description": strip_markdown(rule_text),
            })

        # ─── Detachment rules ────────────────────────────────────────
        for det_rule in data.get("rules", {}).get("detachment", []):
            det_name = det_rule.get("detachment", "")
            for sub_rule in det_rule.get("rules", []):
                rule_name = sub_rule.get("name", "")
                rule_text = rules_to_text(sub_rule.get("rules", []))
                detachment_abilities.append({
                    "id": stable_id(f"{app_faction_id}-{det_name}-{rule_name}"),
                    "faction_id": app_faction_id,
                    "name": rule_name,
                    "legend": "",
                    "description": strip_markdown(rule_text),
                    "detachment": det_name,
                    "detachment_id": "",
                })

    # Add extra faction aliases needed by the app
    extra_factions = [
        {"id": "AE", "name": "Ynnari", "link": ""},
        {"id": "SM", "name": "Adeptus Astartes", "link": ""},
        {"id": "TAU", "name": "T'au Empire", "link": ""},
    ]
    for ef in extra_factions:
        # Only add if not already present
        if not any(f["id"] == ef["id"] and f["name"] == ef["name"] for f in factions):
            factions.append(ef)

    # ─── Phase tagging ───────────────────────────────────────────────
    print("\nRunning phase tagger on abilities...")
    for ability in datasheet_abilities:
        desc = ability.get("description", "")
        name = ability.get("name", "")
        # Use name + description for phase detection
        text = f"{name} {desc}"
        ability["phases"] = determine_phases(text)

    print("Running phase tagger on army abilities...")
    for ability in army_abilities:
        ability["phases"] = determine_phases(ability.get("description", ""))

    print("Running phase tagger on detachment abilities...")
    for ability in detachment_abilities:
        ability["phases"] = determine_phases(ability.get("description", ""))

    print("Running phase tagger on enhancements...")
    for enh in enhancements:
        enh["phases"] = determine_phases(enh.get("description", ""))

    print("Running phase tagger on stratagems...")
    for strat in stratagems:
        strat["phases"] = determine_phases(strat.get("phase", ""), is_stratagem=True)

    # ─── Write output files ──────────────────────────────────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    files = {
        "Datasheets.json": datasheets,
        "Datasheets_models.json": datasheet_models,
        "Datasheets_abilities.json": datasheet_abilities,
        "Datasheets_abilities_modified.json": datasheet_abilities,
        "Datasheets_wargear.json": datasheet_wargear,
        "Datasheets_keywords.json": datasheet_keywords,
        "Datasheets_leader.json": datasheet_leader,
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

    for fname, data in files.items():
        path = os.path.join(OUTPUT_DIR, fname)
        with open(path, "w") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"  Wrote {fname} ({len(data)} entries)")

    print(f"\nDone! {len(datasheets)} datasheets, {len(factions)} factions.")


def build_stratagem_description(strat: dict) -> str:
    """Build the combined description from when/target/effect/restrictions fields."""
    parts = []
    if strat.get("when"):
        parts.append(f"WHEN: {strat['when']}")
    if strat.get("target"):
        parts.append(f"TARGET: {strat['target']}")
    if strat.get("effect"):
        parts.append(f"EFFECT: {strat['effect']}")
    if strat.get("restrictions"):
        parts.append(f"RESTRICTIONS: {strat['restrictions']}")
    return strip_markdown("".join(parts))


def get_core_ability_description(name: str) -> str:
    """Return a standard description for well-known core abilities."""
    descriptions = {
        "Feel No Pain": "Each time this model would lose a wound, roll one D6: if the result equals or exceeds the number shown, that wound is not lost.",
        "Leader": "Before the battle, CHARACTER units with the Leader ability can be attached to one of their Bodyguard units to form an Attached unit.",
        "Scout": "At the start of the first battle round, before the first turn begins, you can move this unit up to the distance shown as if it were the Movement phase.",
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
    return descriptions.get(name, "")


if __name__ == "__main__":
    extract_all()
