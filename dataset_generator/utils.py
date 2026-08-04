import csv
import os


def create_output_folder():
    """
    Creates output folder if it doesn't exist.
    """

    output_folder = "output"

    os.makedirs(output_folder, exist_ok=True)

    return output_folder


def save_csv(filename, headers, rows):
    """
    Saves CSV file.
    """

    output_folder = create_output_folder()

    filepath = os.path.join(output_folder, filename)

    with open(filepath, "w", newline="", encoding="utf-8") as file:

        writer = csv.writer(file)

        writer.writerow(headers)

        writer.writerows(rows)

    print(f"✅ {filename} generated successfully.")