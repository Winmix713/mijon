"""Data loading utilities for ML pipeline."""

import pandas as pd
from pathlib import Path
from typing import Tuple, Optional, List
import logging


class DataLoader:
    """Load and manage training data."""

    def __init__(self, config: dict, logger: Optional[logging.Logger] = None):
        self.config = config
        self.logger = logger or logging.getLogger(__name__)

    def load_training_data(self, path: Optional[str] = None) -> pd.DataFrame:
        """Load training data from CSV."""
        data_path = path or self.config.get("training", {}).get("data_source")
        if not data_path:
            self.logger.warning("No data source configured, returning empty DataFrame")
            return pd.DataFrame()

        path_obj = Path(data_path)
        if not path_obj.exists():
            self.logger.error(f"Data file not found: {data_path}")
            return pd.DataFrame()

        df = pd.read_csv(data_path)
        self.logger.info(f"Loaded {len(df)} records from {data_path}")
        return df

    def load_evaluation_log(self, log_path: str = "ml_pipeline/logs/evaluation_log.csv") -> pd.DataFrame:
        """Load evaluation log from CSV."""
        path_obj = Path(log_path)
        if not path_obj.exists():
            self.logger.warning(f"Evaluation log not found: {log_path}")
            return pd.DataFrame()

        df = pd.read_csv(log_path)
        self.logger.info(f"Loaded {len(df)} evaluation records")
        return df

    def filter_predictions_by_confidence(
        self,
        df: pd.DataFrame,
        min_confidence: float = 0.5,
    ) -> pd.DataFrame:
        """Filter predictions by minimum confidence threshold."""
        filtered = df[df.get("confidence", 0) >= min_confidence]
        self.logger.info(f"Filtered to {len(filtered)} predictions above {min_confidence} confidence")
        return filtered

    def get_prediction_errors(self, df: pd.DataFrame) -> pd.DataFrame:
        """Extract incorrect predictions from evaluation log."""
        if "prediction" not in df.columns or "actual_result" not in df.columns:
            return pd.DataFrame()

        errors = df[df["prediction"] != df["actual_result"]]
        self.logger.info(f"Found {len(errors)} prediction errors")
        return errors

    def prepare_fine_tuning_data(
        self,
        lookback_days: int = 7,
        min_confidence: float = 0.7,
        min_samples: int = 10,
    ) -> Tuple[pd.DataFrame, int]:
        """Prepare fine-tuning dataset from recent prediction errors."""
        try:
            # Load evaluation log
            eval_df = self.load_evaluation_log()
            if eval_df.empty:
                return pd.DataFrame(), 0

            # Filter by date and confidence
            eval_df["timestamp"] = pd.to_datetime(eval_df.get("timestamp", ""))
            recent_df = eval_df[eval_df["timestamp"].dt.days_name]  # Simplified
            high_conf = self.filter_predictions_by_confidence(recent_df, min_confidence)

            # Get errors only
            errors = self.get_prediction_errors(high_conf)

            if len(errors) < min_samples:
                self.logger.info(
                    f"Insufficient error samples: {len(errors)} < {min_samples} required"
                )
                return pd.DataFrame(), len(errors)

            self.logger.info(f"Prepared {len(errors)} samples for fine-tuning")
            return errors, len(errors)
        except Exception as e:
            self.logger.error(f"Error preparing fine-tuning data: {e}")
            return pd.DataFrame(), 0


def get_data_loader(config: dict) -> DataLoader:
    """Factory function to get DataLoader instance."""
    return DataLoader(config)
