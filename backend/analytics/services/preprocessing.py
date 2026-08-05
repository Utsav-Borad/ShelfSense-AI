"""
preprocessing.py

Preprocesses the master dataset
before Machine Learning training.
"""

import pandas as pd

from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from analytics.ml.models.dataset_builder import DatasetBuilder


class DataPreprocessor:
    """
    Preprocess dataset for
    Machine Learning.
    """

    TARGET_COLUMN = "quantity_sold"
    RANDOM_STATE = 42
    LEAKAGE_COLUMNS = {
        "revenue", "profit", "total_amount", "average_sale_value",
        "discount_percentage", "dead_stock_candidate",
    }
    IDENTIFIER_COLUMNS = {
        "id", "id_category", "id_supplier", "id_business", "product_id",
        "invoice_number", "barcode",
    }
    NON_PREDICTIVE_COLUMNS = {
        "phone", "phone_business", "email", "gst_number", "owner_id",
        "address", "address_business", "shop_name", "created_at",
    }
    RAW_DATE_COLUMNS = {
        "manufacturing_date", "expiry_date", "last_updated", "sale_date",
    }

    def __init__(self, data=None):
        builder = DatasetBuilder(data=data)

        self.dataset = builder.build()

        self.transformer = None

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

        return dataset

    @classmethod
    def preprocess_all(cls, raw_data):
        """Build and clean a database-backed dataset for feature engineering."""
        return cls(data=raw_data).preprocess()

    @classmethod
    def _feature_columns(cls, dataset):
        merge_identifier_columns = {
            column for column in dataset.columns
            if (
                column == "id"
                or column.startswith("id_")
                or column.endswith("_id")
                or "_id_" in column
            )
        }
        excluded_columns = (
            cls.LEAKAGE_COLUMNS
            | cls.IDENTIFIER_COLUMNS
            | merge_identifier_columns
            | cls.NON_PREDICTIVE_COLUMNS
            | cls.RAW_DATE_COLUMNS
            | {cls.TARGET_COLUMN}
        )
        return [column for column in dataset.columns if column not in excluded_columns]

    def split_features_target(self, dataset, test_size=0.2):
        """Split raw model features before fitting any transformer."""
        if self.TARGET_COLUMN not in dataset.columns:
            raise ValueError(
                f"Dataset must contain '{self.TARGET_COLUMN}' as the target."
            )

        training_data = dataset.dropna(subset=[self.TARGET_COLUMN]).copy()
        features = training_data[self._feature_columns(training_data)]
        target = training_data[self.TARGET_COLUMN]

        return train_test_split(
            features,
            target,
            test_size=test_size,
            random_state=self.RANDOM_STATE,
        )

    def build_transformer(self, features, scale_numeric=False):
        """Create an unfitted transformer for the selected model type.

        Tree models use ``scale_numeric=False``; linear, KNN, and SVR models
        use ``scale_numeric=True``.
        """
        numeric_columns = features.select_dtypes(
            include=["number", "bool"],
        ).columns.tolist()
        categorical_columns = features.select_dtypes(
            include=["object", "category"],
        ).columns.tolist()
        datetime_columns = features.select_dtypes(
            include=["datetime", "datetimetz"],
        ).columns.tolist()

        if datetime_columns:
            raise ValueError(
                "Extract date features before preprocessing; remaining date "
                f"columns: {datetime_columns}"
            )

        numeric_steps = [("imputer", SimpleImputer(strategy="median"))]
        if scale_numeric:
            numeric_steps.append(("scaler", StandardScaler()))

        transformers = []
        if numeric_columns:
            transformers.append((
                "numeric", Pipeline(steps=numeric_steps), numeric_columns,
            ))
        if categorical_columns:
            transformers.append((
                "categorical",
                Pipeline(steps=[
                    ("imputer", SimpleImputer(strategy="most_frequent")),
                    ("encoder", OneHotEncoder(handle_unknown="ignore")),
                ]),
                categorical_columns,
            ))

        if not transformers:
            raise ValueError("No supported model features are available.")

        return ColumnTransformer(transformers=transformers)

    def fit_transform_splits(self, x_train, x_test, scale_numeric=False):
        """Fit preprocessing only on training data, then transform test data."""
        self.transformer = self.build_transformer(
            x_train,
            scale_numeric=scale_numeric,
        )
        x_train_transformed = self.transformer.fit_transform(x_train)
        x_test_transformed = self.transformer.transform(x_test)

        return x_train_transformed, x_test_transformed

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
