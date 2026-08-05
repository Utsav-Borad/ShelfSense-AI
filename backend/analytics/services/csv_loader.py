"""Offline CSV data source for analytics model development.

Production analytics continues to use the Django database loader. This module
only reads the checked-in generated dataset for offline training.
"""

from pathlib import Path

import pandas as pd


DATASET_DIRECTORY = (
    Path(__file__).resolve().parents[3] / "dataset_generator" / "output"
)
CSV_FILES = {
    "businesses": "business.csv",
    "categories": "categories.csv",
    "suppliers": "suppliers.csv",
    "products": "products.csv",
    "inventory": "inventory.csv",
    "sales": "sales.csv",
}


def load_all_csv_data():
    """Load offline CSV datasets using the ``load_all_data`` dictionary shape."""
    datasets = {}

    for dataset_name, filename in CSV_FILES.items():
        file_path = DATASET_DIRECTORY / filename
        if not file_path.is_file():
            raise FileNotFoundError(
                f"Offline training dataset is missing: {file_path}"
            )
        datasets[dataset_name] = pd.read_csv(file_path)

    return datasets
