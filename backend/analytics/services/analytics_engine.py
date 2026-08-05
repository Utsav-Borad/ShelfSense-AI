"""
analytics_engine.py

Coordinates the complete Analytics pipeline.
"""

from analytics.services.data_loader import load_all_data
from analytics.services.preprocessing import DataPreprocessor
from analytics.services.feature_engineering import FeatureEngineer


class AnalyticsEngine:

    @staticmethod
    def run():

        # Step 1
        raw_data = load_all_data()

        # Step 2: build and clean the database-backed master dataset.
        cleaned_data = DataPreprocessor.preprocess_all(raw_data)

        # Step 3: create model-ready features. Model-specific preprocessing is
        # intentionally deferred until after the train/test split.
        engineered_data = FeatureEngineer.engineer_all(cleaned_data)

        return engineered_data
