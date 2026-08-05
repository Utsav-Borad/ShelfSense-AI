"""In-memory regression training for ShelfSense AI demand modelling.

Models are intentionally not serialized here. Saving a selected model is a
separate, explicitly approved deployment step.
"""

from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import (
    mean_absolute_error,
    mean_absolute_percentage_error,
    mean_squared_error,
    r2_score,
)
from sklearn.neighbors import KNeighborsRegressor
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor

from analytics.services.csv_loader import load_all_csv_data
from analytics.services.feature_engineering import FeatureEngineer
from analytics.services.preprocessing import DataPreprocessor


class ModelTrainer:
    """Train and evaluate the approved regression models in memory."""

    RANDOM_STATE = 42

    def __init__(self):
        self.models = {}
        self.results = {}
        self.transformers = {}

    def _model_definitions(self):
        """Return model instances and their preprocessing requirements."""
        return {
            "linear_regression": (LinearRegression(), True),
            "decision_tree": (
                DecisionTreeRegressor(random_state=self.RANDOM_STATE),
                False,
            ),
            "random_forest": (
                RandomForestRegressor(
                    n_estimators=200,
                    random_state=self.RANDOM_STATE,
                    n_jobs=-1,
                ),
                False,
            ),
            "knn": (KNeighborsRegressor(), True),
            "svr": (SVR(), True),
        }

    def _build_training_data(self):
        """Load offline CSV data and apply the approved analytics pipeline."""
        raw_data = load_all_csv_data()
        preprocessor = DataPreprocessor(data=raw_data)
        cleaned_data = preprocessor.preprocess()
        engineered_data = FeatureEngineer(dataset=cleaned_data).engineer()

        if engineered_data.empty:
            raise ValueError(
                "No synchronized database data is available for model training."
            )

        x_train, x_test, y_train, y_test = (
            preprocessor.split_features_target(engineered_data)
        )
        return preprocessor, x_train, x_test, y_train, y_test

    @staticmethod
    def _metrics(y_true, predictions):
        """Return regression metrics in a serializable format."""
        return {
            "mae": float(mean_absolute_error(y_true, predictions)),
            "rmse": float(mean_squared_error(y_true, predictions) ** 0.5),
            "r2": float(r2_score(y_true, predictions)),
            "mape": float(mean_absolute_percentage_error(y_true, predictions)),
        }

    def train(self):
        """Train all approved regressors without writing model artifacts.

        Each model receives a preprocessing transformer fitted exclusively on
        the training split. Scaling is enabled only for scale-sensitive models.
        """
        model_definitions = self._model_definitions()
        try:
            preprocessor, x_train, x_test, y_train, y_test = (
                self._build_training_data()
            )
        except Exception as error:
            for model_name in model_definitions:
                self.results[model_name] = {
                    "status": "failed",
                    "error": f"Training data unavailable: {error}",
                }
            return self.results

        for model_name, (model, scale_numeric) in model_definitions.items():
            try:
                x_train_ready, x_test_ready = preprocessor.fit_transform_splits(
                    x_train,
                    x_test,
                    scale_numeric=scale_numeric,
                )
                model.fit(x_train_ready, y_train)
                predictions = model.predict(x_test_ready)

                self.models[model_name] = model
                self.transformers[model_name] = preprocessor.transformer
                self.results[model_name] = {
                    "status": "success",
                    "scaled_numeric_features": scale_numeric,
                    **self._metrics(y_test, predictions),
                }
            except Exception as error:
                self.results[model_name] = {
                    "status": "failed",
                    "error": str(error),
                }

        return self.results
