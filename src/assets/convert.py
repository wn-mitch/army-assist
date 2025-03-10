import csv
import json
import os
import re

replacements = {
    r"<[:\.\-\w\d\s;#\\+()\.,\[\]_=\"/]+>": "",
    r"\u2019": "\'",
    r"\u2018": "\'",
}

# Define the conditions for rows to be ignored
ignore_conditions = [
    # Cabal of Sorcerers
    {"id": "000008424", "faction_id": "CSM"},
    
    # Nurgles Gift
    {"id": "000008396", "faction_id": "CSM"},
    
    # Blessings of Khorne
    {"id": "000008428", "faction_id": "CSM"},
    
    # Oath of Moment
    {"id": "000008350", "faction_id": "CSM"},
    {"id": "000008350", "faction_id": "WE"},
    {"id": "000008350", "faction_id": "DG"},
    {"id": "000008350", "faction_id": "TS"},
    
    # Dark Pacts
    {"id": "000008359", "faction_id": "WE"},
    {"id": "000008359", "faction_id": "DG"},
    {"id": "000008359", "faction_id": "TS"},
    {"id": "000008359", "faction_id": "QT"},
    
    # Thrillseekers when added
]

def should_ignore_row(row):
    for condition in ignore_conditions:
        if all(row.get(key) == value for key, value in condition.items()):
            return True
    return False

def csv_to_json(csv_filepath, json_filepath):
    data = []

    with open(csv_filepath, mode='r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter='|')
        for row in csv_reader:
            if should_ignore_row(row):
                continue
            for key, value in row.items():
                if value is not None:
                    for old_text, new_text in replacements.items():
                        value = re.sub(old_text, new_text, value)
                row[key] = value
            data.append(row)
            
    with open(json_filepath, mode='w', encoding='utf-8') as json_file:
        json.dump(data, json_file, indent=4)


def convert_all_csv_in_directory(csv_directory, json_directory):
    if not os.path.exists(json_directory):
        os.makedirs(json_directory)

    for filename in os.listdir(csv_directory):
        if filename.endswith('.csv'):
            csv_filepath = os.path.join(csv_directory, filename)
            json_filename = filename.replace('.csv', '.json')
            json_filepath = os.path.join(json_directory, json_filename)
            csv_to_json(csv_filepath, json_filepath)
            print(f'Converted {csv_filepath} to {json_filepath}')


if __name__ == "__main__":
    csv_directory = 'src/assets/csv'
    json_directory = 'src/assets/json'
    convert_all_csv_in_directory(csv_directory, json_directory)
