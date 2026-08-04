"""
preprocessing.py

Professional preprocessing pipeline
for ShelfSense AI Machine Learning.
"""

import pandas as pd
import numpy as np

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    OneHotEncoder,
    LabelEncoder,
    StandardScaler,
)
from sklearn.impute import SimpleImputer
from sklearn.model_selection import train_test_split


class DataPreprocessor:
    """
    Handles complete preprocessing
    for both Regression and Classification.
    """

    def __init__(self):

        self.label_encoders = {}

        self.regression_pipeline = None

        self.classification_pipeline = None

    # -------------------------------------------------------
    # PRODUCT DATA CLEANING
    # -------------------------------------------------------

    @staticmethod
    def clean_products(df):

        df = df.copy()

        df.drop_duplicates(inplace=True)

        df["selling_price"] = df["selling_price"].fillna(0)

        df["minimum_stock"] = df["minimum_stock"].fillna(0)

        df["expiry_date"] = pd.to_datetime(
            df["expiry_date"],
            errors="coerce",
        )

        return df

    # -------------------------------------------------------
    # INVENTORY DATA CLEANING
    # -------------------------------------------------------

    @staticmethod
    def clean_inventory(df):

        df = df.copy()

        df.fillna(0, inplace=True)

        df["last_updated"] = pd.to_datetime(
            df["last_updated"],
            errors="coerce",
        )

        return df

    # -------------------------------------------------------
    # SALES DATA CLEANING
    # -------------------------------------------------------

    @staticmethod
    def clean_sales(df):

        df = df.copy()

        df.drop_duplicates(inplace=True)

        df["sale_date"] = pd.to_datetime(
            df["sale_date"],
            errors="coerce",
        )

        numeric_columns = [
            "quantity_sold",
            "selling_price",
            "discount",
            "total_amount",
        ]

        for column in numeric_columns:
            df[column] = df[column].fillna(0)

        return df