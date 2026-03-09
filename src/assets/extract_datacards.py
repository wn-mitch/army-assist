#!/usr/bin/env python3
"""
Extracts data from the 39k.pro JS bundle and transforms it into the app's
existing JSON format.

Usage:
    python3 src/assets/extract_datacards.py [path_to_bundle.js]

If no path is given, fetches the current bundle from https://39k.pro/.
"""

import json
import os
import re
import hashlib
import ssl
import sys
import urllib.request

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "json")

# Maps publication name → app faction_id
PUBLICATION_TO_FACTION = {
    "Adepta Sororitas": "AS",
    "Adeptus Custodes": "AC",
    "Adeptus Mechanicus": "AdM",
    "Aeldari": "AE",
    "Agents of the Imperium": "AoI",
    "Astra Militarum": "AM",
    "Black Templars": "SM",
    "Blood Angels": "SM",
    "Chaos Daemons": "CD",
    "Chaos Knights": "QT",
    "Chaos Space Marines": "CSM",
    "Dark Angels": "SM",
    "Death Guard": "DG",
    "Deathwatch": "SM",
    "Drukhari": "DRU",
    "Emperor's Children": "EC",
    "Genestealer Cults": "GC",
    "Grey Knights": "GK",
    "Imperial Armour: Aeldari": "AE",
    "Imperial Armour: Astra Militarum": "AM",
    "Imperial Armour: Chaos Daemons": "CD",
    "Imperial Armour: Chaos Space Marines": "CSM",
    "Imperial Armour: Chaos Titan Legions": "QT",
    "Imperial Armour: Death Guard": "DG",
    "Imperial Armour: Drukhari": "DRU",
    "Imperial Armour: Grey Knights": "GK",
    "Imperial Armour: Imperial Knights": "QI",
    "Imperial Armour: Necrons": "NEC",
    "Imperial Armour: Orks": "ORK",
    "Imperial Armour: Space Marines": "SM",
    "Imperial Armour: T'au Empire": "TAU",
    "Imperial Armour: Titan Legions": "QI",
    "Imperial Armour: Tyranids": "TYR",
    "Imperial Knights": "QI",
    "Leagues of Votann": "LoV",
    "Necrons": "NEC",
    "Orks": "ORK",
    "Space Marines": "SM",
    "Space Wolves": "SM",
    "T'au Empire": "TAU",
    "Thousand Sons": "TS",
    "Tyranids": "TYR",
    "Unaligned Forces": "UN",
    "World Eaters": "WE",
}

# faction_keyword name → app faction_id
FACTION_KEYWORD_TO_FACTION = {
    "Adepta Sororitas": "AS",
    "Adeptus Astartes": "SM",
    "Adeptus Custodes": "AC",
    "Adeptus Mechanicus": "AdM",
    "Aeldari": "AE",
    "Agents of the Imperium": "AoI",
    "Astra Militarum": "AM",
    "Chaos Daemons": "CD",
    "Chaos Knights": "QT",
    "Chaos Space Marines": "CSM",
    "Death Guard": "DG",
    "Drukhari": "DRU",
    "Emperor's Children": "EC",
    "Genestealer Cults": "GC",
    "Grey Knights": "GK",
    "Heretic Astartes": "CSM",
    "Imperial Knights": "QI",
    "Leagues of Votann": "LoV",
    "Necrons": "NEC",
    "Orks": "ORK",
    "T'au Empire": "TAU",
    "Thousand Sons": "TS",
    "Tyranids": "TYR",
    "Unaligned": "UN",
    "World Eaters": "WE",
}

# SM subfaction publications — get a separate faction entry but share faction_id SM
SM_SUBFACTION_PUBLICATIONS = {
    "Black Templars",
    "Blood Angels",
    "Dark Angels",
    "Deathwatch",
    "Space Wolves",
}

# Canonical display names for each faction_id (matching ListForge/BSData expectations)
FACTION_DISPLAY_NAMES = {
    "AS": "Adepta Sororitas",
    "AC": "Adeptus Custodes",
    "AdM": "Adeptus Mechanicus",
    "AE": "Aeldari",
    "AoI": "Agents of the Imperium",
    "AM": "Astra Militarum",
    "SM": "Space Marines",
    "CSM": "Chaos Space Marines",
    "CD": "Chaos Daemons",
    "QT": "Chaos Knights",
    "DG": "Death Guard",
    "DRU": "Drukhari",
    "EC": "Emperor's Children",
    "GC": "Genestealer Cults",
    "GK": "Grey Knights",
    "QI": "Imperial Knights",
    "LoV": "Leagues of Votann",
    "NEC": "Necrons",
    "ORK": "Orks",
    "TAU": "T'au Empire",
    "TS": "Thousand Sons",
    "TYR": "Tyranids",
    "UN": "Unaligned Forces",
    "WE": "World Eaters",
}


def stable_id(text: str) -> str:
    """Generate a stable 9-digit ID from text for cross-referencing."""
    return hashlib.md5(text.encode()).hexdigest()[:9]


# ─── JS Bundle Parsing ──────────────────────────────────────────────────────

def fetch_bundle_url():
    """Fetch 39k.pro and find the current bundle URL."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(
        "https://39k.pro/",
        headers={"User-Agent": "Mozilla/5.0 army-assist-extractor"},
    )
    with urllib.request.urlopen(req, context=ctx) as resp:
        html = resp.read().decode()
    m = re.search(r'src="(/assets/index-[^"]+\.js)"', html)
    if not m:
        raise RuntimeError("Could not find bundle URL in 39k.pro HTML")
    return "https://39k.pro" + m.group(1)


def download_bundle(url: str) -> str:
    """Download the JS bundle."""
    print(f"Downloading bundle from {url}...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    req = urllib.request.Request(
        url, headers={"User-Agent": "Mozilla/5.0 army-assist-extractor"}
    )
    with urllib.request.urlopen(req, context=ctx) as resp:
        return resp.read().decode()


def extract_js_array(content: str, start: int) -> str:
    """Extract a JSON array starting at position `start` (the '[' char)."""
    depth = 0
    i = start
    in_string = False
    string_char = None
    prev_char = ""

    while i < len(content):
        c = content[i]

        if in_string:
            if c == "\\" and prev_char != "\\":
                prev_char = c
                i += 1
                continue
            if c == string_char and prev_char != "\\":
                in_string = False
            prev_char = c
            i += 1
            continue

        if c in ('"', "'", "`"):
            in_string = True
            string_char = c
        elif c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return content[start : i + 1]

        prev_char = c
        i += 1

    raise RuntimeError(f"Unmatched bracket starting at offset {start}")


def js_to_json(js_str: str) -> str:
    """Convert JS object literal syntax to valid JSON using a state-machine parser."""
    out = []
    i = 0
    n = len(js_str)

    while i < n:
        c = js_str[i]

        # ── Backtick string ──────────────────────────────────────────
        if c == '`':
            i += 1
            buf = []
            while i < n and js_str[i] != '`':
                if js_str[i] == '\\' and i + 1 < n:
                    next_c = js_str[i + 1]
                    if next_c == '`':
                        buf.append('`')
                        i += 2
                        continue
                    elif next_c == 'n':
                        buf.append('\\n')
                        i += 2
                        continue
                    elif next_c == '\\':
                        buf.append('\\\\')
                        i += 2
                        continue
                    else:
                        buf.append('\\')
                        buf.append(next_c)
                        i += 2
                        continue
                elif js_str[i] == '\n':
                    buf.append('\\n')
                    i += 1
                    continue
                elif js_str[i] == '\r':
                    i += 1
                    continue
                elif js_str[i] == '\t':
                    buf.append('\\t')
                    i += 1
                    continue
                elif js_str[i] == '"':
                    buf.append('\\"')
                    i += 1
                    continue
                buf.append(js_str[i])
                i += 1
            i += 1  # skip closing backtick
            out.append('"')
            out.append(''.join(buf))
            out.append('"')
            continue

        # ── Single-quoted string ─────────────────────────────────────
        if c == "'":
            i += 1
            buf = []
            while i < n and js_str[i] != "'":
                if js_str[i] == '\\' and i + 1 < n:
                    next_c = js_str[i + 1]
                    if next_c == "'":
                        buf.append("'")
                        i += 2
                        continue
                    elif next_c == '"':
                        buf.append('\\"')
                        i += 2
                        continue
                    else:
                        buf.append(js_str[i])
                        buf.append(next_c)
                        i += 2
                        continue
                elif js_str[i] == '"':
                    buf.append('\\"')
                    i += 1
                    continue
                buf.append(js_str[i])
                i += 1
            i += 1  # skip closing quote
            out.append('"')
            out.append(''.join(buf))
            out.append('"')
            continue

        # ── Double-quoted string (pass through, fix JS escapes) ─────
        if c == '"':
            out.append(c)
            i += 1
            while i < n and js_str[i] != '"':
                if js_str[i] == '\\' and i + 1 < n:
                    next_c = js_str[i + 1]
                    # Convert JS \xNN to JSON \u00NN
                    if next_c == 'x' and i + 3 < n:
                        hex_digits = js_str[i + 2 : i + 4]
                        out.append('\\u00')
                        out.append(hex_digits)
                        i += 4
                        continue
                    out.append(js_str[i])
                    out.append(next_c)
                    i += 2
                    continue
                # Escape bare control characters
                ch = js_str[i]
                if ord(ch) < 0x20:
                    out.append(f'\\u{ord(ch):04x}')
                    i += 1
                    continue
                out.append(ch)
                i += 1
            if i < n:
                out.append(js_str[i])  # closing quote
                i += 1
            continue

        # ── !0 / !1 → true / false ──────────────────────────────────
        if c == '!' and i + 1 < n and js_str[i + 1] in ('0', '1'):
            out.append('true' if js_str[i + 1] == '0' else 'false')
            i += 2
            continue

        # ── Number literal (including scientific notation like 1e3) ──
        if c.isdigit() or (c == '-' and i + 1 < n and js_str[i + 1].isdigit()):
            j = i
            if c == '-':
                j += 1
            while j < n and js_str[j].isdigit():
                j += 1
            if j < n and js_str[j] == '.':
                j += 1
                while j < n and js_str[j].isdigit():
                    j += 1
            if j < n and js_str[j] in ('e', 'E'):
                j += 1
                if j < n and js_str[j] in ('+', '-'):
                    j += 1
                while j < n and js_str[j].isdigit():
                    j += 1
            num_str = js_str[i:j]
            # Convert scientific notation to integer for JSON compatibility
            try:
                val = float(num_str)
                if val == int(val) and 'e' in num_str.lower():
                    out.append(str(int(val)))
                else:
                    out.append(num_str)
            except ValueError:
                out.append(num_str)
            i = j
            continue

        # ── Unquoted key: identifier followed by : ───────────────────
        if c.isalpha() or c == '_':
            # Collect the identifier
            j = i
            while j < n and (js_str[j].isalnum() or js_str[j] == '_'):
                j += 1
            word = js_str[i:j]

            # Check if followed by ':'  (it's a key)
            if j < n and js_str[j] == ':':
                # It's a key — but check it's not a value keyword
                if word == 'null':
                    out.append('null')
                elif word == 'true':
                    out.append('true')
                elif word == 'false':
                    out.append('false')
                else:
                    out.append('"')
                    out.append(word)
                    out.append('"')
                i = j
                continue
            else:
                # It's a value keyword (null, true, false) or something else
                if word in ('null', 'true', 'false'):
                    out.append(word)
                    i = j
                    continue
                else:
                    # Unknown bare word — quote it as a string
                    out.append('"')
                    out.append(word)
                    out.append('"')
                    i = j
                    continue

        # ── Trailing commas: skip comma before ] or } ────────────────
        if c == ',':
            # Look ahead past whitespace for ] or }
            j = i + 1
            while j < n and js_str[j] in ' \t\n\r':
                j += 1
            if j < n and js_str[j] in ']}':
                i = j  # skip the comma
                continue
            out.append(c)
            i += 1
            continue

        # ── Everything else (brackets, colons, numbers, etc.) ────────
        out.append(c)
        i += 1

    return ''.join(out)


def find_table(content: str, table_name: str, signature_field: str) -> list:
    """Find a table in the JS bundle by name and signature field, extract and parse it."""
    pattern = r"(?<![a-zA-Z_])" + re.escape(table_name) + r":\["
    for m in re.finditer(pattern, content):
        start = m.start()
        # Check if the signature field appears within the first 500 chars
        peek = content[start : start + 500]
        if signature_field in peek:
            # Found the right table instance
            array_start = content.index("[", start)
            js_array = extract_js_array(content, array_start)
            json_str = js_to_json(js_array)
            try:
                return json.loads(json_str)
            except json.JSONDecodeError as e:
                # Try to show context around the error
                pos = e.pos or 0
                context = json_str[max(0, pos - 100) : pos + 100]
                print(f"  JSON parse error in {table_name} at pos {pos}: {e.msg}")
                print(f"  Context: ...{context}...")
                raise
    raise RuntimeError(f"Table '{table_name}' with signature '{signature_field}' not found")


def extract_tables(content: str) -> dict:
    """Extract all needed tables from the JS bundle."""
    tables = {}

    table_specs = [
        ("datasheet", "publicationId:"),
        ("miniature", "movement:"),
        ("publication", "factionKeywordId:"),
        ("faction_keyword", "commonName:"),
        ("keyword", "allyRestrictingKeywordId:"),
        ("wargear_item", "wargearType:"),
        ("wargear_item_profile", "ballisticSkill:"),
        ("wargear_item_profile_wargear_ability", "wargearItemProfileId:"),
        ("wargear_ability", "lore:"),
        ("wargear_option_group", "isStaticWargear:"),
        ("wargear_option", "wargearOptionGroupId:"),
        ("datasheet_ability", "abilityType:"),
        ("datasheet_datasheet_ability", "datasheetAbilityId:"),
        ("datasheet_sub_ability", "datasheetAbilityId:"),
        ("datasheet_rule", "datasheetId:"),
        ("datasheet_damage", "datasheetId:"),
        ("datasheet_faction_keyword", "factionKeywordId:"),
        ("miniature_keyword", "miniatureId:"),
        ("invulnerable_save", "rangedSave:"),
        ("stratagem", "whenRules:"),
        ("enhancement", "basePointsCost:"),
        ("army_rule", "publicationId:"),
        ("detachment_rule", "detachmentId:"),
        ("detachment", "bannerImage:"),
        ("rule_container_component", "textContent:"),
    ]

    for table_name, sig in table_specs:
        print(f"  Extracting {table_name}...")
        try:
            tables[table_name] = find_table(content, table_name, sig)
            print(f"    -> {len(tables[table_name])} rows")
        except RuntimeError as e:
            print(f"    WARNING: {e}")
            tables[table_name] = []

    return tables


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
        r'^(Scout)\s+(.+)$',
        r'^(Firing Deck)\s+(.+)$',
    ]
    for pattern in patterns:
        m = re.match(pattern, core_str)
        if m:
            return m.group(1), m.group(2)
    return core_str, ""


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


# ─── Main extraction ─────────────────────────────────────────────────────────

def extract_all(bundle_content: str):
    tables = extract_tables(bundle_content)

    # Build lookup indices
    print("\nBuilding indices...")

    # publication id -> publication record
    pub_by_id = {p["id"]: p for p in tables["publication"]}

    # faction_keyword id -> record (built first since pub_to_faction needs it)
    fk_by_id = {fk["id"]: fk for fk in tables["faction_keyword"]}

    # publication id -> faction_id (app)
    pub_to_faction = {}
    for pub in tables["publication"]:
        pub_name = pub["name"]
        faction_id = PUBLICATION_TO_FACTION.get(pub_name)
        if not faction_id:
            # Try stripping common prefixes
            for prefix in ["Codex: ", "Index: ", "Combat Patrol: "]:
                if pub_name.startswith(prefix):
                    stripped = pub_name[len(prefix):]
                    faction_id = PUBLICATION_TO_FACTION.get(stripped)
                    if faction_id:
                        break
        if not faction_id:
            # Try via factionKeywordId -> faction_keyword -> FACTION_KEYWORD_TO_FACTION
            fk_id = pub.get("factionKeywordId")
            if fk_id:
                fk = fk_by_id.get(fk_id, {})
                fk_name = fk.get("name", "")
                faction_id = FACTION_KEYWORD_TO_FACTION.get(fk_name)
        if faction_id:
            pub_to_faction[pub["id"]] = faction_id

    # keyword id -> record
    kw_by_id = {kw["id"]: kw for kw in tables["keyword"]}

    # datasheet_ability id -> record
    ability_by_id = {a["id"]: a for a in tables["datasheet_ability"]}

    # datasheetAbilityId -> list of sub-abilities
    sub_abilities_by_parent = {}
    for sa in tables["datasheet_sub_ability"]:
        parent_id = sa.get("datasheetAbilityId", "")
        sub_abilities_by_parent.setdefault(parent_id, []).append(sa)

    # wargear_item id -> record
    wargear_item_by_id = {wi["id"]: wi for wi in tables["wargear_item"]}

    # wargear_ability id -> record
    wargear_ability_by_id = {wa["id"]: wa for wa in tables["wargear_ability"]}

    # wargear_item_profile id -> list of wargear_ability names
    profile_abilities = {}
    for link in tables["wargear_item_profile_wargear_ability"]:
        pid = link["wargearItemProfileId"]
        aid = link["wargearAbilityId"]
        wa = wargear_ability_by_id.get(aid, {})
        profile_abilities.setdefault(pid, []).append(wa.get("name", ""))

    # datasheet id -> invulnerable_save record
    invul_by_ds = {}
    for inv in tables["invulnerable_save"]:
        ds_id = inv.get("datasheetId")
        if ds_id:
            invul_by_ds[ds_id] = inv

    # datasheet id -> datasheet_damage records
    damage_by_ds = {}
    for dmg in tables["datasheet_damage"]:
        ds_id = dmg.get("datasheetId")
        if ds_id:
            damage_by_ds.setdefault(ds_id, []).append(dmg)

    # datasheet id -> datasheet_rule records
    rules_by_ds = {}
    for rule in tables["datasheet_rule"]:
        ds_id = rule.get("datasheetId")
        if ds_id:
            rules_by_ds.setdefault(ds_id, []).append(rule)

    # miniature datasheetId -> list of miniatures
    minis_by_ds = {}
    for mini in tables["miniature"]:
        ds_id = mini.get("datasheetId", "")
        minis_by_ds.setdefault(ds_id, []).append(mini)

    # Sort miniatures by displayOrder
    for ds_id in minis_by_ds:
        minis_by_ds[ds_id].sort(key=lambda m: m.get("displayOrder", 0))

    # datasheetId -> list of ability links (sorted by displayOrder)
    ability_links_by_ds = {}
    for link in tables["datasheet_datasheet_ability"]:
        ds_id = link.get("datasheetId", "")
        ability_links_by_ds.setdefault(ds_id, []).append(link)
    for ds_id in ability_links_by_ds:
        ability_links_by_ds[ds_id].sort(key=lambda x: x.get("displayOrder", 0))

    # datasheetId -> list of faction keyword links
    ds_fk_links = {}
    for link in tables["datasheet_faction_keyword"]:
        ds_id = link.get("datasheetId", "")
        ds_fk_links.setdefault(ds_id, []).append(link)

    # miniatureId -> list of keyword links
    mini_kw_links = {}
    for link in tables["miniature_keyword"]:
        mid = link.get("miniatureId", "")
        mini_kw_links.setdefault(mid, []).append(link)

    # wargearItemId -> list of profiles
    profiles_by_wargear = {}
    for prof in tables["wargear_item_profile"]:
        wi_id = prof.get("wargearItemId", "")
        profiles_by_wargear.setdefault(wi_id, []).append(prof)

    # Build datasheetId -> set of wargearItemIds via wargear_option_group + wargear_option
    # Chain: wargear_option_group (datasheetId) -> wargear_option (wargearOptionGroupId -> wargearItemId)
    wog_to_ds = {}  # wargearOptionGroupId -> datasheetId
    for wog in tables.get("wargear_option_group", []):
        wog_to_ds[wog["id"]] = wog.get("datasheetId", "")

    wargear_to_ds = {}  # wargearItemId -> set of datasheetIds
    for wo in tables.get("wargear_option", []):
        wi_id = wo.get("wargearItemId", "")
        wog_id = wo.get("wargearOptionGroupId", "")
        ds_id = wog_to_ds.get(wog_id, "")
        if ds_id and wi_id:
            wargear_to_ds.setdefault(wi_id, set()).add(ds_id)

    # Build datasheetId -> list of wargear_item_profiles
    wargear_profiles_by_ds = {}
    for prof in tables["wargear_item_profile"]:
        wi_id = prof.get("wargearItemId", "")
        ds_ids = wargear_to_ds.get(wi_id, set())
        for ds_id in ds_ids:
            wargear_profiles_by_ds.setdefault(ds_id, []).append(prof)

    # detachment id -> record
    det_by_id = {d["id"]: d for d in tables["detachment"]}

    # army_rule id -> record
    army_rule_by_id = {ar["id"]: ar for ar in tables["army_rule"]}

    # detachment_rule id -> record
    det_rule_by_id = {dr["id"]: dr for dr in tables["detachment_rule"]}

    # rule_container_component: armyRuleId -> list of text components
    rcc_by_army_rule = {}
    rcc_by_det_rule = {}
    for rcc in tables["rule_container_component"]:
        ar_id = rcc.get("armyRuleId")
        dr_id = rcc.get("detachmentRuleId")
        if ar_id:
            rcc_by_army_rule.setdefault(ar_id, []).append(rcc)
        if dr_id:
            rcc_by_det_rule.setdefault(dr_id, []).append(rcc)

    # Sort rule components by displayOrder
    for key in rcc_by_army_rule:
        rcc_by_army_rule[key].sort(key=lambda x: x.get("displayOrder", 0))
    for key in rcc_by_det_rule:
        rcc_by_det_rule[key].sort(key=lambda x: x.get("displayOrder", 0))

    # army_rule_faction_keyword junction: find it
    print("  Extracting army_rule_faction_keyword junction...")
    try:
        ar_fk_junction = find_table(bundle_content, "army_rule_faction_keyword", "armyRuleId:")
        print(f"    -> {len(ar_fk_junction)} rows")
    except RuntimeError:
        # Try alternate naming
        try:
            ar_fk_junction = find_table(bundle_content, "army_rule", "factionKeywordId:")
            print(f"    -> {len(ar_fk_junction)} rows")
        except RuntimeError:
            ar_fk_junction = []
            print("    WARNING: not found, army rules won't have faction mapping")

    # armyRuleId -> factionKeywordId
    ar_to_fk = {}
    for entry in ar_fk_junction:
        ar_to_fk[entry.get("armyRuleId", "")] = entry.get("factionKeywordId", "")

    # ─── Build output data ───────────────────────────────────────────────

    datasheets = []
    datasheet_models = []
    datasheet_abilities = []
    datasheet_wargear = []
    datasheet_keywords = []
    datasheet_leader = []
    enhancements_out = []
    stratagems_out = []
    factions = []
    army_abilities = []
    detachment_abilities = []

    seen_faction_ids = set()

    print("\nProcessing datasheets...")
    for ds in tables["datasheet"]:
        ds_id = ds["id"]
        pub_id = ds.get("publicationId", "")
        faction_id = pub_to_faction.get(pub_id, "")

        if not faction_id:
            # Try to infer faction from faction keywords on this datasheet
            fk_links = ds_fk_links.get(ds_id, [])
            for fk_link in fk_links:
                fk_id = fk_link.get("factionKeywordId", "")
                fk = fk_by_id.get(fk_id, {})
                fk_name = fk.get("name", "")
                if fk_name in FACTION_KEYWORD_TO_FACTION:
                    faction_id = FACTION_KEYWORD_TO_FACTION[fk_name]
                    break

        if not faction_id:
            # Skip datasheets we can't map to a faction
            continue

        # Skip combat patrol datasheets
        pub = pub_by_id.get(pub_id, {})
        if pub.get("isCombatPatrol"):
            continue

        # Build faction entry
        pub = pub_by_id.get(pub_id, {})
        pub_name = pub.get("name", "")

        if faction_id not in seen_faction_ids:
            faction_display = FACTION_DISPLAY_NAMES.get(faction_id, faction_id)
            factions.append({
                "id": faction_id,
                "name": faction_display,
                "link": "",
            })
            seen_faction_ids.add(faction_id)

        # SM subfaction extra entries
        # Derive subfaction name from publication
        subfaction_name = pub_name
        for prefix in ["Codex: ", "Codex Supplement: ", "Index: "]:
            if subfaction_name.startswith(prefix):
                subfaction_name = subfaction_name[len(prefix):]
                break
        if subfaction_name in SM_SUBFACTION_PUBLICATIONS:
            if not any(f["name"] == subfaction_name and f["id"] == "SM" for f in factions):
                factions.append({
                    "id": "SM",
                    "name": subfaction_name,
                    "link": "",
                })

        # Damaged info
        damaged_w = ""
        damaged_desc = ""
        damage_records = damage_by_ds.get(ds_id, [])
        if damage_records:
            dmg = damage_records[0]
            damaged_w = dmg.get("name", "")
            damaged_desc = strip_markdown(dmg.get("rules", ""))

        # Leader/transport info from datasheet_rule
        leader_text = ""
        transport_text = ""
        loadout_text = ds.get("unitComposition", "") or ""
        for rule in rules_by_ds.get(ds_id, []):
            rule_name = (rule.get("name", "") or "").lower()
            rule_text = rule.get("rules", "") or ""
            if rule_name == "leader":
                leader_text = strip_markdown(rule_text)
            elif rule_name == "transport":
                transport_text = strip_markdown(rule_text)

        datasheets.append({
            "id": ds_id,
            "name": ds["name"],
            "faction_id": faction_id,
            "source_id": "",
            "legend": ds.get("lore", "") or "",
            "role": "",
            "loadout": strip_markdown(loadout_text),
            "transport": transport_text,
            "virtual": "false",
            "leader_head": leader_text,
            "leader_footer": "",
            "damaged_w": damaged_w,
            "damaged_description": damaged_desc,
            "link": "",
        })

        # ─── Stats / Models ──────────────────────────────────────────
        invul = invul_by_ds.get(ds_id, {})
        invul_value = invul.get("save", "") or ""
        invul_info = invul.get("rules", "") or ""
        if invul_value.endswith("+"):
            invul_value = invul_value[:-1]

        miniatures = minis_by_ds.get(ds_id, [])
        for line_idx, mini in enumerate(miniatures, start=1):
            mv = mini.get("movement", "") or ""
            sv = mini.get("save", "") or ""

            datasheet_models.append({
                "datasheet_id": ds_id,
                "line": str(line_idx),
                "name": mini.get("name", ds["name"]),
                "M": mv,
                "T": mini.get("toughness", "") or "",
                "Sv": sv,
                "inv_sv": invul_value if invul_value else "-",
                "inv_sv_descr": strip_markdown(invul_info),
                "W": mini.get("wounds", "") or "",
                "Ld": mini.get("leadership", "") or "",
                "OC": mini.get("objectiveControl", "") or "",
                "base_size": ds.get("baseSize", "") or "",
                "base_size_descr": "",
            })

        # ─── Weapons ─────────────────────────────────────────────────
        profiles = wargear_profiles_by_ds.get(ds_id, [])
        # Sort by displayOrder
        profiles.sort(key=lambda p: p.get("displayOrder", 0))

        wargear_line = 1
        for prof in profiles:
            prof_type = prof.get("type", "")
            is_melee = prof_type == "melee"
            is_ranged = prof_type == "ranged"

            rng = prof.get("range", "") or ""
            if is_melee:
                rng = "Melee"
            elif rng:
                rng = rng.replace('"', '').replace("\"", "")

            bs_ws = ""
            if is_ranged:
                bs_ws = (prof.get("ballisticSkill", "") or "").replace("+", "")
            else:
                bs_ws = (prof.get("weaponSkill", "") or "").replace("+", "")

            # Get weapon ability keywords
            ability_names = profile_abilities.get(prof["id"], [])
            description = ", ".join(n.lower() for n in ability_names if n)

            # Use the wargear_item name if the profile name is "standard"
            name = prof.get("name", "")
            if name == "standard":
                wi_id = prof.get("wargearItemId", "")
                wi = wargear_item_by_id.get(wi_id, {})
                name = wi.get("name", name)
            # If profile has a distinct name and differs from wargear_item,
            # it's a weapon profile variant — prefix with wargear_item name
            elif name:
                wi_id = prof.get("wargearItemId", "")
                wi = wargear_item_by_id.get(wi_id, {})
                wi_name = wi.get("name", "")
                if wi_name and wi_name != name:
                    name = f"{wi_name} – {name}"

            datasheet_wargear.append({
                "datasheet_id": ds_id,
                "line": str(wargear_line),
                "line_in_wargear": "1",
                "dice": "",
                "name": name,
                "description": description,
                "range": rng,
                "type": "Ranged" if is_ranged else "Melee",
                "A": prof.get("attacks", "") or "",
                "BS_WS": bs_ws,
                "S": prof.get("strength", "") or "",
                "AP": prof.get("armourPenetration", "") or "",
                "D": prof.get("damage", "") or "",
            })
            wargear_line += 1

        # ─── Abilities ───────────────────────────────────────────────
        ability_line = 1
        ability_links = ability_links_by_ds.get(ds_id, [])

        for link in ability_links:
            ab_id = link.get("datasheetAbilityId", "")
            ab = ability_by_id.get(ab_id, {})
            if not ab:
                continue

            ab_type = ab.get("abilityType", "")
            ab_name = ab.get("name", "")
            ab_rules = strip_markdown(ab.get("rules", "") or "")

            # Map abilityType to our type categories
            type_map = {
                "core": "Core",
                "faction": "Faction",
                "datasheet": "Other",
                "wargear": "Wargear",
                "special": "Special",
                "primarch": "Primarch",
            }
            mapped_type = type_map.get(ab_type, "Other")

            # For core abilities, extract parameter and add description
            parameter = ""
            if mapped_type == "Core":
                ab_name, parameter = parse_core_ability(ab_name)
                if not ab_rules or ab_rules == "-":
                    ab_rules = get_core_ability_description(ab_name)
                if parameter:
                    ab_name = f"{ab_name} {parameter}"

            # For faction abilities, rules is often just "-"
            if mapped_type == "Faction" and ab_rules == "-":
                ab_rules = ""

            # Handle sub-abilities (e.g., Primarch abilities)
            sub_abs = sub_abilities_by_parent.get(ab_id, [])
            if sub_abs:
                sub_abs.sort(key=lambda x: x.get("displayOrder", 0))
                if ab.get("subAbilityHeader"):
                    ab_rules = ab.get("subAbilityHeader", "") + " "
                for sub in sub_abs:
                    sub_name = sub.get("name", "")
                    sub_rules = strip_markdown(sub.get("rules", "") or "")
                    ab_rules += f"{sub_name}: {sub_rules} "
                ab_rules = ab_rules.strip()

            datasheet_abilities.append({
                "datasheet_id": ds_id,
                "line": str(ability_line),
                "ability_id": "",
                "model": "",
                "name": ab_name,
                "description": ab_rules,
                "type": mapped_type,
                "parameter": parameter,
            })
            ability_line += 1

        # Damaged ability
        if damaged_w and damaged_desc:
            datasheet_abilities.append({
                "datasheet_id": ds_id,
                "line": str(ability_line),
                "ability_id": "",
                "model": "",
                "name": damaged_w,
                "description": damaged_desc,
                "type": "Other",
                "parameter": "",
            })
            ability_line += 1

        # ─── Keywords ────────────────────────────────────────────────
        # Faction keywords
        for fk_link in ds_fk_links.get(ds_id, []):
            fk_id = fk_link.get("factionKeywordId", "")
            fk = fk_by_id.get(fk_id, {})
            fk_name = fk.get("name", "")
            if fk_name:
                datasheet_keywords.append({
                    "datasheet_id": ds_id,
                    "keyword": fk_name,
                    "model": "",
                    "is_faction_keyword": "true",
                })

        # Unit keywords (from miniatures)
        seen_keywords = set()
        for mini in miniatures:
            for kw_link in mini_kw_links.get(mini["id"], []):
                kw_id = kw_link.get("keywordId", "")
                kw = kw_by_id.get(kw_id, {})
                kw_name = kw.get("name", "")
                if kw_name and kw_name not in seen_keywords:
                    seen_keywords.add(kw_name)
                    datasheet_keywords.append({
                        "datasheet_id": ds_id,
                        "keyword": kw_name,
                        "model": "",
                        "is_faction_keyword": "false",
                    })

        # ─── Leader attachments ──────────────────────────────────────
        # From datasheet_rule with name "Leader", parse the unit names
        for rule in rules_by_ds.get(ds_id, []):
            rule_name = (rule.get("name", "") or "").lower()
            if rule_name == "leader":
                rule_text = rule.get("rules", "") or ""
                # Parse "■ **UNIT NAME**" patterns
                for m in re.finditer(r'■\s*\*\*([^*]+)\*\*', rule_text):
                    target_name = m.group(1).strip()
                    # Find matching datasheet by name and faction
                    target_ds = None
                    for other_ds in tables["datasheet"]:
                        if other_ds["name"].upper() == target_name.upper():
                            other_faction = pub_to_faction.get(other_ds.get("publicationId", ""), "")
                            if other_faction == faction_id:
                                target_ds = other_ds
                                break
                    if not target_ds:
                        # Try without faction match
                        for other_ds in tables["datasheet"]:
                            if other_ds["name"].upper() == target_name.upper():
                                target_ds = other_ds
                                break
                    if target_ds:
                        datasheet_leader.append({
                            "leader_id": ds_id,
                            "attached_id": target_ds["id"],
                        })

    # ─── Post-processing: fix missing invuln save descriptions ──────────
    INVULN_DESCR_FIXES = {
        ("Chaos Questoris Knight Styrix", "QT"): "Against ranged attacks only",
        ("Chaos Questoris Knight Magaera", "QT"): "Against ranged attacks only",
        ("Chaos Cerastus Knight Atrapos", "QT"): "Against ranged attacks only",
    }
    ds_lookup = {d["id"]: d for d in datasheets}
    for model in datasheet_models:
        ds = ds_lookup.get(model["datasheet_id"], {})
        key = (ds.get("name", ""), ds.get("faction_id", ""))
        if key in INVULN_DESCR_FIXES:
            model["inv_sv_descr"] = INVULN_DESCR_FIXES[key]

    # ─── Stratagems ──────────────────────────────────────────────────────
    print("Processing stratagems...")

    # Build core stratagem entries
    core_strat_phase_map = {
        "yourTurn": "Your turn",
        "opponentsTurn": "Opponent's turn",
        "either": "Either player's turn",
    }

    for strat in tables["stratagem"]:
        pub_id = strat.get("publicationId", "")
        det_id = strat.get("detachmentId", "")
        faction_id = pub_to_faction.get(pub_id, "")

        det = det_by_id.get(det_id, {})
        det_name = det.get("name", "")

        # Build description
        parts = []
        if strat.get("whenRules"):
            parts.append(f"WHEN: {strat['whenRules']}")
        if strat.get("targetRules"):
            parts.append(f"TARGET: {strat['targetRules']}")
        if strat.get("effectRules"):
            parts.append(f"EFFECT: {strat['effectRules']}")
        if strat.get("restrictionRules"):
            parts.append(f"RESTRICTIONS: {strat['restrictionRules']}")
        description = strip_markdown("".join(parts))

        # Phase from whenRules
        when = strat.get("whenRules", "") or ""
        phase_str = when.split(".")[0] if when else ""

        # Category mapping
        category = strat.get("category", "")
        category_map = {
            "battleTactic": "Battle Tactic",
            "strategicPloy": "Strategic Ploy",
            "epicDeed": "Epic Deed",
        }
        cat_display = category_map.get(category, category)

        turn = strat.get("key", "")
        turn_display = core_strat_phase_map.get(turn, turn)

        type_str = f"{det_name} - {cat_display} Stratagem" if det_name else f"Core - {cat_display} Stratagem"

        stratagems_out.append({
            "faction_id": faction_id,
            "name": strat["name"].upper(),
            "id": strat["id"],
            "type": type_str,
            "cp_cost": str(strat.get("cpCost", "")),
            "legend": strat.get("lore", "") or "",
            "turn": turn_display,
            "phase": phase_str,
            "detachment": det_name,
            "detachment_id": "",
            "description": description,
        })

    # ─── Enhancements ────────────────────────────────────────────────────
    print("Processing enhancements...")
    for enh in tables["enhancement"]:
        pub_id = enh.get("publicationId", "")
        det_id = enh.get("detachmentId", "")
        faction_id = pub_to_faction.get(pub_id, "")
        if not faction_id:
            continue

        # Skip combat patrol enhancements (no detachment, no cost)
        if enh.get("isCombatPatrol"):
            continue

        det = det_by_id.get(det_id, {})
        det_name = det.get("name", "")

        cost = enh.get("basePointsCost")
        cost_str = str(cost) if cost is not None else ""

        enhancements_out.append({
            "faction_id": faction_id,
            "id": enh["id"],
            "name": enh["name"],
            "cost": cost_str,
            "detachment": det_name,
            "detachment_id": "",
            "legend": "",
            "description": strip_markdown(enh.get("rules", "") or ""),
        })

    # ─── Army Rules ──────────────────────────────────────────────────────
    print("Processing army rules...")
    seen_army_abilities = set()  # (faction_id, name) for dedup
    for ar in tables["army_rule"]:
        if ar.get("hiddenFromCommandBunker"):
            continue

        ar_id = ar["id"]
        fk_id = ar_to_fk.get(ar_id, "")
        fk = fk_by_id.get(fk_id, {})
        fk_name = fk.get("name", "")
        faction_id = FACTION_KEYWORD_TO_FACTION.get(fk_name, "")

        if not faction_id:
            # Try via publication
            pub_id = ar.get("publicationId", "")
            faction_id = pub_to_faction.get(pub_id, "")

        if not faction_id:
            continue

        # Skip combat patrol army rules
        pub = pub_by_id.get(ar.get("publicationId", ""), {})
        if pub.get("isCombatPatrol"):
            continue

        # Deduplicate by (faction_id, name)
        dedup_key = (faction_id, ar["name"])
        if dedup_key in seen_army_abilities:
            continue
        seen_army_abilities.add(dedup_key)

        # Build rules text from rule_container_components
        components = rcc_by_army_rule.get(ar_id, [])
        rules_text = " ".join(
            strip_markdown(c.get("textContent", "") or "")
            for c in components
            if c.get("textContent")
        )

        army_abilities.append({
            "id": stable_id(f"{faction_id}-{ar['name']}"),
            "name": ar["name"],
            "legend": "",
            "faction_id": faction_id,
            "description": rules_text,
        })

    # ─── Detachment Rules ────────────────────────────────────────────────
    print("Processing detachment rules...")
    for dr in tables["detachment_rule"]:
        if dr.get("hiddenFromCommandBunker"):
            continue

        dr_id = dr["id"]
        det_id = dr.get("detachmentId", "")
        det = det_by_id.get(det_id, {})
        det_name = det.get("name", "")

        # Get faction from detachment's publication
        det_pub_id = det.get("publicationId", "")
        faction_id = pub_to_faction.get(det_pub_id, "")

        if not faction_id:
            continue

        # Build rules text from rule_container_components
        components = rcc_by_det_rule.get(dr_id, [])
        rules_text = " ".join(
            strip_markdown(c.get("textContent", "") or "")
            for c in components
            if c.get("textContent")
        )

        detachment_abilities.append({
            "id": stable_id(f"{faction_id}-{det_name}-{dr['name']}"),
            "faction_id": faction_id,
            "name": dr["name"],
            "legend": "",
            "description": rules_text,
            "detachment": det_name,
            "detachment_id": "",
        })

    # Add extra faction aliases needed by the app
    extra_factions = [
        {"id": "AE", "name": "Ynnari", "link": ""},
        {"id": "AE", "name": "Craftworlds", "link": ""},
        {"id": "SM", "name": "Adeptus Astartes", "link": ""},
        {"id": "TAU", "name": "T'au Empire", "link": ""},
    ]
    for ef in extra_factions:
        if not any(f["id"] == ef["id"] and f["name"] == ef["name"] for f in factions):
            factions.append(ef)

    # ─── Phase tagging ───────────────────────────────────────────────────
    print("\nRunning phase tagger on abilities...")
    for ability in datasheet_abilities:
        desc = ability.get("description", "")
        name = ability.get("name", "")
        text = f"{name} {desc}"
        ability["phases"] = determine_phases(text)

    print("Running phase tagger on army abilities...")
    for ability in army_abilities:
        ability["phases"] = determine_phases(ability.get("description", ""))

    print("Running phase tagger on detachment abilities...")
    for ability in detachment_abilities:
        ability["phases"] = determine_phases(ability.get("description", ""))

    print("Running phase tagger on enhancements...")
    for enh in enhancements_out:
        enh["phases"] = determine_phases(enh.get("description", ""))

    print("Running phase tagger on stratagems...")
    for strat in stratagems_out:
        strat["phases"] = determine_phases(strat.get("phase", ""), is_stratagem=True)

    # ─── Write output files ──────────────────────────────────────────────
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    files = {
        "Datasheets.json": datasheets,
        "Datasheets_models.json": datasheet_models,
        "Datasheets_abilities.json": datasheet_abilities,
        "Datasheets_abilities_modified.json": datasheet_abilities,
        "Datasheets_wargear.json": datasheet_wargear,
        "Datasheets_keywords.json": datasheet_keywords,
        "Datasheets_leader.json": datasheet_leader,
        "Enhancements.json": enhancements_out,
        "Enhancements_modified.json": enhancements_out,
        "Stratagems.json": stratagems_out,
        "Stratagems_modified.json": stratagems_out,
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


if __name__ == "__main__":
    if len(sys.argv) > 1:
        bundle_path = sys.argv[1]
        print(f"Reading bundle from {bundle_path}...")
        with open(bundle_path, "r") as f:
            content = f.read()
    else:
        try:
            bundle_url = fetch_bundle_url()
            content = download_bundle(bundle_url)
        except Exception as e:
            print(f"Failed to fetch bundle: {e}")
            print("Usage: python3 src/assets/extract_datacards.py [path_to_bundle.js]")
            sys.exit(1)

    extract_all(content)
