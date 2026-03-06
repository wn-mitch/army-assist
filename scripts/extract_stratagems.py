#!/usr/bin/env python3
"""
Extract stratagems from game-datacards datasources and produce
Stratagems_modified.json in the app's expected format.

Data source: https://github.com/game-datacards/datasources
"""

import json
import urllib.request
from pathlib import Path

ASSETS_DIR = Path(__file__).parent.parent / "src" / "assets" / "json"
BASE_URL = "https://raw.githubusercontent.com/game-datacards/datasources/main/10th/json"

# Faction files to fetch (excludes marines_leviathan, titan, unaligned, enhancements)
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
    "LGEC": "CSM",
    "GSC": "GC",
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

# Phases that also get "Saves" added
SAVES_PHASES = {"fight", "shooting", "charge", "movement", "command"}


def fetch_json(filename: str) -> dict:
    url = f"{BASE_URL}/{filename}.json"
    req = urllib.request.Request(url, headers={"User-Agent": "army-assist"})
    return json.loads(urllib.request.urlopen(req).read())


def build_description(s: dict) -> str:
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


def map_phases(phase_list: list[str]) -> list[str]:
    phases = []
    has_saves = False
    for p in phase_list:
        mapped = PHASE_MAP.get(p, p.capitalize())
        if mapped == "Any":
            # "any" phase means it applies to all phases
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
    faction_id = "" if is_core else FACTION_ID_MAP.get(s.get("faction_id", ""), s.get("faction_id", ""))
    detachment = "Core Rules" if is_core else s.get("detachment", "")

    strat_type = s.get("type", "")
    if is_core:
        type_str = f"Core - {strat_type} Stratagem"
    else:
        type_str = f"{detachment} - {strat_type} Stratagem"

    phase_list = s.get("phase", [])
    if isinstance(phase_list, str):
        phase_list = [phase_list]

    when_text = s.get("when", "")

    return {
        "faction_id": faction_id,
        "name": s.get("name", "").upper(),
        "id": s.get("id", ""),
        "type": type_str,
        "cp_cost": str(s.get("cost", "")),
        "legend": s.get("fluff", ""),
        "turn": TURN_MAP.get(s.get("turn", ""), s.get("turn", "")),
        "phase": when_text,
        "detachment": detachment,
        "detachment_id": "",
        "description": build_description(s),
        "phases": map_phases(phase_list),
    }


def main():
    all_stratagems = []

    # Fetch core stratagems
    print("Fetching core.json...")
    core_data = fetch_json("core")
    for s in core_data.get("stratagems", []):
        all_stratagems.append(transform_stratagem(s, is_core=True))
    print(f"  Core Rules: {len(core_data.get('stratagems', []))} stratagems")

    # Fetch faction stratagems
    for fname in FACTION_FILES:
        print(f"Fetching {fname}.json...")
        data = fetch_json(fname)
        strats = data.get("stratagems", [])
        for s in strats:
            all_stratagems.append(transform_stratagem(s))
        print(f"  {fname}: {len(strats)} stratagems")

    # Write output
    output_path = ASSETS_DIR / "Stratagems_modified.json"
    with open(output_path, "w") as f:
        json.dump(all_stratagems, f, indent=4, ensure_ascii=False)

    print(f"\nWrote {len(all_stratagems)} stratagems to {output_path}")

    # Summary stats
    from collections import Counter
    fac_counts = Counter(s["faction_id"] for s in all_stratagems)
    print(f"Faction IDs: {dict(sorted(fac_counts.items()))}")
    det_counts = Counter(s["detachment"] for s in all_stratagems)
    print(f"Unique detachments: {len(det_counts)}")
    empty_fac = sum(1 for s in all_stratagems if not s["faction_id"])
    print(f"Empty faction_id (Core Rules only): {empty_fac}")


if __name__ == "__main__":
    main()
