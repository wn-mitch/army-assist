#!/usr/bin/env python3
"""
Rebuild Datasheets_leader.json from leader_head text fields in Datasheets.json.

The game-datacards data source has broken attached_id references in
Datasheets_leader.json (31% don't exist in Datasheets.json). This script
parses the leader_head text — which contains "■ UNIT_NAME" patterns — to
rebuild correct leader→unit relationships.
"""

import json
import re
import unicodedata
from pathlib import Path

ASSETS_DIR = Path(__file__).parent.parent / "src" / "assets" / "json"


def normalize_text(text: str) -> str:
    """Normalize unicode dashes, whitespace, and case for matching."""
    # Replace various dash characters with standard hyphen
    text = unicodedata.normalize("NFKC", text)
    text = re.sub(r"[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]", "-", text)
    return text.strip().lower()


# Manual overrides for unit names that don't match exactly
UNIT_NAME_ALIASES: dict[str, str] = {
    "lootaz": "lootas",
    "sisters novitate squad": "sisters novitiate squad",
}


def main():
    with open(ASSETS_DIR / "Datasheets.json") as f:
        datasheets = json.load(f)

    # Build lookup: normalized name -> list of datasheets
    name_map: dict[str, list[dict]] = {}
    for d in datasheets:
        key = normalize_text(d["name"])
        name_map.setdefault(key, []).append(d)

    leaders = [d for d in datasheets if d.get("leader_head", "").strip()]
    new_entries = []
    missing = []

    for leader in leaders:
        unit_names = re.findall(r"■\s*(.+)", leader["leader_head"])
        for raw_name in unit_names:
            name = normalize_text(raw_name)

            # Apply aliases
            if name in UNIT_NAME_ALIASES:
                name = UNIT_NAME_ALIASES[name]

            candidates = name_map.get(name, [])

            # For "acolyte hybrids" — match both variants
            if not candidates and "acolyte hybrids" in name:
                candidates = []
                for key, ds_list in name_map.items():
                    if key.startswith("acolyte hybrids"):
                        candidates.extend(ds_list)

            # For "imperium battleline infantry" — skip, it's a keyword not a datasheet
            if not candidates and "imperium battleline" in name:
                continue

            if candidates:
                # Prefer same faction
                match = next(
                    (c for c in candidates if c["faction_id"] == leader["faction_id"]),
                    candidates[0],
                )
                new_entries.append(
                    {"leader_id": leader["id"], "attached_id": match["id"]}
                )
            else:
                missing.append(
                    (leader["name"], leader["faction_id"], raw_name.strip())
                )

    # Report
    print(f"Generated {len(new_entries)} leader attachment entries")
    if missing:
        print(f"Unresolved ({len(missing)}):")
        for leader_name, faction, unit_name in missing:
            print(f"  {leader_name} ({faction}) -> {unit_name}")

    # Write output
    output_path = ASSETS_DIR / "Datasheets_leader.json"
    with open(output_path, "w") as f:
        json.dump(new_entries, f, indent=4)
    print(f"Wrote {output_path}")


if __name__ == "__main__":
    main()
