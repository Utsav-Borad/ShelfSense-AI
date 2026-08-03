"""Normalization performed only after a CSV report has passed validation."""

from __future__ import annotations

import pandas as pd

from .schemas import CsvSchema


def clean_dataframe(frame: pd.DataFrame, schema: CsvSchema) -> pd.DataFrame:
    """Return a canonical, typed copy without dropping or silently altering rows."""
    cleaned = frame.copy()
    cleaned.columns = [str(column).strip() for column in cleaned.columns]
    for rule in schema.columns:
        if rule.kind == "text":
            cleaned[rule.name] = cleaned[rule.name].astype("string").str.strip()
        elif rule.kind == "date":
            cleaned[rule.name] = pd.to_datetime(cleaned[rule.name]).dt.date
        elif rule.kind == "number":
            cleaned[rule.name] = pd.to_numeric(cleaned[rule.name])
    return cleaned.loc[:, schema.required_columns]
