"""
preprocessing.py

Preprocesses the master dataset
before Machine Learning training.
"""

import pandas as pd

from sklearn.impute import SimpleImputer
from sklearn.preprocessing import LabelEncoder

from analytics.ml.models.dataset_builder import DatasetBuilder


class DataPreprocessor:
    """
    Preprocess dataset for
    Machine Learning.
    """

    def __init__(self):
        builder = DatasetBuilder()

        self.dataset = builder.build()

        self.encoders = {}

    def preprocess(self):
        """
        Clean and preprocess the dataset.
        """

        dataset = self.dataset.copy()

        # Remove duplicate rows
        dataset.drop_duplicates(
            inplace=True,
        )

        # Convert date columns
        date_columns = [
            "manufacturing_date",
            "expiry_date",
            "last_updated",
            "sale_date",
        ]

        for column in date_columns:

            if column in dataset.columns:

                dataset[column] = pd.to_datetime(
                    dataset[column],
                    errors="coerce",
                )

        # Fill missing numeric values
        numeric_columns = dataset.select_dtypes(
            include=["number"],
        ).columns

        numeric_imputer = SimpleImputer(
            strategy="median",
        )

        dataset[numeric_columns] = numeric_imputer.fit_transform(
            dataset[numeric_columns]
        )

        # Fill missing categorical values
        categorical_columns = dataset.select_dtypes(
            include=["object"],
        ).columns

        categorical_imputer = SimpleImputer(
            strategy="most_frequent",
        )

        dataset[categorical_columns] = (
            categorical_imputer.fit_transform(
                dataset[categorical_columns]
            )
        )

        # Encode categorical columns
        for column in categorical_columns:

            encoder = LabelEncoder()

            dataset[column] = encoder.fit_transform(
                dataset[column].astype(str)
            )

            self.encoders[column] = encoder

        return dataset

    def summary(self):
        """
        Display preprocessing summary.
        """

        dataset = self.preprocess()

        print("=" * 60)
        print("ShelfSense AI Preprocessed Dataset")
        print("=" * 60)

        print(f"Rows            : {dataset.shape[0]}")
        print(f"Columns         : {dataset.shape[1]}")

        print("\nMissing Values")
        print("-" * 60)

        print(dataset.isnull().sum())

        print("\nData Types")
        print("-" * 60)

        print(dataset.dtypes)

        print("\nMemory Usage")
        print("-" * 60)

        memory = (
            dataset.memory_usage(deep=True).sum()
            / 1024
            / 1024
        )

        print(f"{memory:.2f} MB")

        print("=" * 60)

        return dataset

    def get_dataset(self):
        """
        Return the preprocessed dataset.
        """

        return self.preprocess()