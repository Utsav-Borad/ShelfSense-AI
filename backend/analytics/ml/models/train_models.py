"""
train_models.py

Trains Machine Learning models for
ShelfSense AI Analytics.
"""

import joblib
import pandas as pd

from pathlib import Path

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import (
    OneHotEncoder,
    StandardScaler,
    PolynomialFeatures,
)

from sklearn.model_selection import (
    train_test_split,
)

from sklearn.linear_model import (
    LinearRegression,
)

from sklearn.tree import (
    DecisionTreeRegressor,
)

from sklearn.ensemble import (
    RandomForestRegressor,
)

from sklearn.neighbors import (
    KNeighborsRegressor,
)

from sklearn.svm import (
    SVR,
)

from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score,
)

from analytics.services.data_loader import (
    load_sales,
)


class ModelTrainer:
    """
    Train all regression models.
    """

    def __init__(self):

        self.sales_df = load_sales()

        self.models = {}

        self.results = {}

        self.best_model = None

        self.best_score = -999

        self.model_folder = Path(
            "analytics/trained_models"
        )

        self.model_folder.mkdir(
            exist_ok=True
        )