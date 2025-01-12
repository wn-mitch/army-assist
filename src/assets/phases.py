import json
import re

# Define the phases and their corresponding text patterns
phase_patterns = {
    "Movement": ["Move characteristic", "Movement phase"],
    "Shooting": ["shooting phase"],
    "Charge": ["charge phase"],
    "Fight": ["fight phase", "melee attack", "melee weapon", "choppa"],
    "Morale": ["morale phase"],
    "Command": ["command phase"],
    "Saves": ["save characteristic", "saving throw"],  # Add patterns for the new Saves phase
}

def determine_phases(description):
    phases = []
    for phase, patterns in phase_patterns.items():
        for pattern in patterns:
            if re.search(pattern, description, re.IGNORECASE):
                phases.append(phase)
                break
    return phases

def process_abilities(input_file, output_file):
    with open(input_file, 'r') as infile:
        abilities = json.load(infile)

    for ability in abilities:
        description = ability.get("description", "")
        ability["phases"] = determine_phases(description)

    with open(output_file, 'w') as outfile:
        json.dump(abilities, outfile, indent=4)

if __name__ == "__main__":
    input_file = './src/assets/json/Datasheets_abilities.json'  # Corrected file path
    output_file = './src/assets/json/Abilities_modified.json'  # Corrected file path
    process_abilities(input_file, output_file)