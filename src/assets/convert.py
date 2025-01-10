import csv
import json
import os


def csv_to_json(csv_filepath, json_filepath):
    data = []

    with open(csv_filepath, mode='r', encoding='utf-8-sig') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter='|')
        for row in csv_reader:
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
    csv_directory = 'csv'
    json_directory = 'json'
    convert_all_csv_in_directory(csv_directory, json_directory)
