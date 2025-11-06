import json
import os
import re

import pandas as pd
import requests

# http://wahapedia.ru/wh40k10ed/Datasheets_stratagems.csv

replacements = {
    # HTML tags
    r"<[:\.\-\w\d\s;#\\+()\.,\[\]_=\"/]+>": "",
    # BOM artifacts - handle both individual and combined sequences
    r"\u00ef\u00bb\u00bf": "",  # UTF-8 BOM sequence
    r"ï»¿": "",  # BOM as literal characters
    r"\u00ef": "",  # Individual BOM components
    r"\u00bb": "",
    r"\u00bf": "",
    # Removes cyrillic
    "Ã¢": "â",
    "â": "'",
    "â": "-",
    "Ð": "",
    "Ñ": "",
    "": "",
    "¡": "",
    "": "",
    "": "",
    "µ": "",
    "°": "",
    "²": "",
    "": "",
    "º": "",
    "¾": "",
    "½": "",
    # Common UTF-8 encoding artifacts for punctuation
    r"\u00e2\u0080\u0099": "'",  # Right single quotation mark (')
    r"\u00e2\u0080\u0098": "'",  # Left single quotation mark (')
    r"\u00e2\u0080\u009c": '"',  # Left double quotation mark (")
    r"\u00e2\u0080\u009d": '"',  # Right double quotation mark (")
    r"\u00e2\u0080\u0093": "-",  # En dash (–)
    r"\u00e2\u0080\u0094": "-",  # Em dash (—)
    r"\u00e2\u0080\u00a6": "...",  # Horizontal ellipsis (…)
    # Standard Unicode replacements
    r"\u2019": "'",  # Right single quotation mark
    r"\u2018": "'",  # Left single quotation mark
    r"\u201c": '"',  # Left double quotation mark
    r"\u201d": '"',  # Right double quotation mark
    r"\u2013": "-",  # En dash
    r"\u2014": "-",  # Em dash
    r"\u2026": "...",  # Horizontal ellipsis
    # Game-specific cleanup
    r" \(Aura\)": "",
    r"\'": "'",  # Normalize apostrophes
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
    {"id": "000008359", "faction_id": "CD"},
    # Thrillseekers when added
    # Agents of the Imperium
    {"id": "000008452", "faction_id": "SM"},
    # Deathwatch
    {"id": "000008521", "faction_id": "SM"},
    # We don't care about Boarding Actions
    {"id": "000009218006", "name": "EXPLOSIVE CLEARANCE"},
    {"id": "000009218005", "name": "INSANE BRAVERY"},
    {"id": "000009218004", "name": "COUNTER-OFFENSIVE"},
    {"id": "000009218003", "name": "BATTLEFIELD COMMAND"},
    {"id": "000009218002", "name": "COMMAND RE-ROLL"},
]


def clean_text(text):
    """
    Clean text by applying all replacements in the correct order
    """
    if text is None:
        return text

    # Convert to string if not already
    text = str(text)

    # First, handle BOM at the start of strings specifically
    if text.startswith("\ufeff"):
        text = text[1:]
    if text.startswith("ï»¿"):
        text = text[3:]

    # Apply all replacements
    for pattern, replacement in replacements.items():
        text = re.sub(pattern, replacement, text)

    # Final cleanup - remove any remaining null bytes or weird characters
    text = text.replace("\x00", "")

    return text


def should_ignore_row(row):
    for condition in ignore_conditions:
        if all(row.get(key) == value for key, value in condition.items()):
            return True
    if "detachment" in row:
        return False
    return False


def csv_to_json(csv_filepath, json_filepath):
    data = []

    # Try different encoding approaches
    encodings_to_try = ["utf-8-sig", "utf-8", "latin1"]

    for encoding in encodings_to_try:
        try:
            with open(csv_filepath, mode="r", encoding=encoding) as csv_file:
                content = csv_file.read()
                # Clean the entire content first
                content = clean_text(content)

                # Parse the cleaned content
                lines = content.split("\n")
                if not lines:
                    continue

                # Get headers and clean them
                headers = [clean_text(h) for h in lines[0].split("|")]

                for line in lines[1:]:
                    if not line.strip():
                        continue

                    values = line.split("|")
                    if len(values) != len(headers):
                        continue

                    row = {}
                    for i, header in enumerate(headers):
                        if i < len(values):
                            row[header] = clean_text(values[i])
                        else:
                            row[header] = ""

                    if not should_ignore_row(row):
                        data.append(row)

                break  # If we get here, parsing was successful

        except UnicodeDecodeError:
            continue  # Try next encoding
        except Exception as e:
            print(f"Error parsing {csv_filepath} with {encoding}: {e}")
            continue

    if not data:
        print(f"Failed to parse {csv_filepath} with any encoding")
        return

    with open(json_filepath, mode="w", encoding="utf-8") as json_file:
        json.dump(data, json_file, indent=4, ensure_ascii=False)


def convert_all_csv_in_directory(csv_directory, json_directory):
    if not os.path.exists(json_directory):
        os.makedirs(json_directory)

    for filename in os.listdir(csv_directory):
        if filename.endswith(".csv"):
            csv_filepath = os.path.join(csv_directory, filename)
            json_filename = filename.replace(".csv", ".json")
            json_filepath = os.path.join(json_directory, json_filename)
            csv_to_json(csv_filepath, json_filepath)
            print(f"Converted {csv_filepath} to {json_filepath}")


def extract_urls_from_excel(excel_filepath):
    """
    Extract all CSV filenames from the Export Data Specs Excel file
    and construct wahapedia URLs
    Returns a list of dictionaries containing URL information
    """
    try:
        # Read the Excel file
        df = pd.read_excel(excel_filepath)

        urls = []
        base_url = "http://wahapedia.ru/wh40k10ed/"

        # Look for CSV filenames in the Specification column
        for _, row in df.iterrows():
            if pd.notna(row["Specification"]):
                spec_text = str(row["Specification"])

                # Check if this line contains a CSV filename
                if spec_text.endswith(".csv"):
                    csv_filename = spec_text.strip()
                    full_url = base_url + csv_filename

                    url_info = {
                        "filename": csv_filename,
                        "url": full_url,
                        "description": f"Wahapedia {csv_filename} export",
                    }
                    urls.append(url_info)

        return urls

    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return []


def download_csv_from_url(url, output_directory):
    """
    Download a CSV file from a URL to the specified directory
    """
    try:
        response = requests.get(url)
        response.raise_for_status()

        # Extract filename from URL
        filename = url.split("/")[-1]
        if not filename.endswith(".csv"):
            filename += ".csv"

        output_path = os.path.join(output_directory, filename)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(response.text)

        print(f"Downloaded {url} to {output_path}")
        return output_path

    except Exception as e:
        print(f"Error downloading {url}: {e}")
        return None


def download_all_csvs_from_specs(excel_filepath, csv_directory):
    """
    Extract URLs from Excel specs and download all CSV files
    """
    urls = extract_urls_from_excel(excel_filepath)

    if not urls:
        print("No URLs found in the Excel file")
        return

    if not os.path.exists(csv_directory):
        os.makedirs(csv_directory)

    print(f"Found {len(urls)} URLs to download:")
    for url_info in urls:
        if "url" in url_info:
            print(f"  - {url_info['url']}")
            download_csv_from_url(url_info["url"], csv_directory)


if __name__ == "__main__":
    csv_directory = "src/assets/csv"
    json_directory = "src/assets/json"
    excel_filepath = "src/assets/csv/Export Data Specs.xlsx"

    # First, extract and download CSVs from the Excel specs
    print("Extracting URLs from Export Data Specs...")
    download_all_csvs_from_specs(excel_filepath, csv_directory)

    print("\nConverting all CSV files to JSON...")
    convert_all_csv_in_directory(csv_directory, json_directory)
