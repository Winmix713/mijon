#!/usr/bin/env python3
import argparse
import json
import logging
import pickle
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, Tuple

import numpy as np
import pandas as pd
import yaml
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score

from ml_logging import MLLogger


class ModelTrainer:
    """Model training and evaluation pipeline."""

    def __init__(self, config_path: str = "ml_pipeline/model_config.yaml"):
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.logger = self._init_logger()
        self.ml_logger = MLLogger()
        self.run_id = str(uuid.uuid4())

    def _load_config(self) -> Dict[str, Any]:
        """Load model configuration from YAML."""
        try:
            with open(self.config_path, "r") as f:
                config = yaml.safe_load(f)
            return config
        except Exception as e:
            print(f"Error loading config: {e}")
            raise

    def _init_logger(self) -> logging.Logger:
        """Initialize logger."""
        logger = logging.getLogger("model_trainer")
        if not logger.handlers:
            log_dir = Path(self.config.get("logging", {}).get("log_dir", "ml_pipeline/logs"))
            log_dir.mkdir(parents=True, exist_ok=True)
            handler = logging.FileHandler(log_dir / "train_model.log")
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
        return logger

    def load_data(self) -> Tuple[pd.DataFrame, Optional[pd.DataFrame]]:
        """Load training data."""
        try:
            data_source = self.config["training"]["data_source"]
            data_path = Path(data_source)

            if not data_path.exists():
                self.logger.warning(f"Data source not found: {data_source}, generating synthetic data")
                return self._generate_synthetic_data(), None

            df = pd.read_csv(data_path)
            self.logger.info(f"Loaded data from {data_source}: {df.shape}")

            # Handle missing values
            missing_handling = self.config["training"]["preprocessing"]["handle_missing"]
            if missing_handling == "mean":
                df = df.fillna(df.mean(numeric_only=True))

            return df, None
        except Exception as e:
            self.logger.error(f"Error loading data: {e}")
            raise

    def _generate_synthetic_data(self, n_samples: int = 500) -> pd.DataFrame:
        """Generate synthetic training data for development."""
        np.random.seed(42)
        input_features = self.config["inference"]["input_features"]
        target = self.config["inference"]["prediction_target"]

        data = {}
        for feat in input_features:
            data[feat] = np.random.uniform(0, 10, n_samples)

        # Generate synthetic target (0=Home, 1=Draw, 2=Away)
        data[target] = np.random.randint(0, 3, n_samples)
        data["match_id"] = [f"match_{i:04d}" for i in range(n_samples)]

        self.logger.info(f"Generated synthetic data: {len(data[target])} samples")
        return pd.DataFrame(data)

    def prepare_data(
        self,
        df: pd.DataFrame,
    ) -> Tuple[np.ndarray, np.ndarray, StandardScaler]:
        """Prepare data for training."""
        try:
            input_features = self.config["inference"]["input_features"]
            target = self.config["inference"]["prediction_target"]

            X = df[input_features].values
            y = df[target].values

            # Apply scaling
            scaler = StandardScaler()
            X = scaler.fit_transform(X)

            self.logger.info(f"Data prepared: X shape {X.shape}, y shape {y.shape}")
            return X, y, scaler
        except Exception as e:
            self.logger.error(f"Error preparing data: {e}")
            raise

    def train(
        self,
        X: np.ndarray,
        y: np.ndarray,
        algorithm: Optional[str] = None,
    ) -> Tuple[Any, Dict[str, float]]:
        """Train model."""
        try:
            algorithm = algorithm or self.config["training"]["algorithm"]
            hyperparams = self.config["training"]["hyperparameters"]

            if algorithm == "LogisticRegression":
                model = LogisticRegression(
                    learning_rate=hyperparams.get("learning_rate", 0.01),
                    max_iter=hyperparams.get("max_iterations", 1000),
                    penalty=hyperparams.get("regularization", "l2"),
                    C=1.0 / hyperparams.get("penalty", 1.0),
                    random_state=42,
                )
            elif algorithm == "RandomForest":
                model = RandomForestClassifier(
                    n_estimators=hyperparams.get("n_estimators", 100),
                    max_depth=hyperparams.get("max_depth", 10),
                    min_samples_split=hyperparams.get("min_samples_split", 5),
                    random_state=42,
                )
            else:
                raise ValueError(f"Unknown algorithm: {algorithm}")

            # Train model
            model.fit(X, y)
            self.logger.info(f"Trained {algorithm} model")

            # Evaluate
            metrics = self._evaluate_model(model, X, y)
            return model, metrics
        except Exception as e:
            self.logger.error(f"Error training model: {e}")
            raise

    def _evaluate_model(self, model: Any, X: np.ndarray, y: np.ndarray) -> Dict[str, float]:
        """Evaluate model performance."""
        try:
            y_pred = model.predict(X)
            metrics = {
                "accuracy": float(accuracy_score(y, y_pred)),
                "precision": float(precision_score(y, y_pred, average="weighted", zero_division=0)),
                "recall": float(recall_score(y, y_pred, average="weighted", zero_division=0)),
                "f1_score": float(f1_score(y, y_pred, average="weighted", zero_division=0)),
            }

            # Add AUC-ROC if applicable
            if hasattr(model, "predict_proba"):
                try:
                    if len(np.unique(y)) <= 2:
                        metrics["auc_roc"] = float(roc_auc_score(y, model.predict_proba(X)[:, 1]))
                    else:
                        metrics["auc_roc"] = float(
                            roc_auc_score(y, model.predict_proba(X), multi_class="ovr")
                        )
                except Exception as e:
                    self.logger.warning(f"Could not compute AUC-ROC: {e}")

            # Cross-validation
            if self.config["evaluation"]["cross_validation"]["enabled"]:
                n_folds = self.config["evaluation"]["cross_validation"]["n_folds"]
                cv_scores = cross_val_score(model, X, y, cv=n_folds, scoring="accuracy")
                metrics["cv_mean"] = float(cv_scores.mean())
                metrics["cv_std"] = float(cv_scores.std())

            return metrics
        except Exception as e:
            self.logger.error(f"Error evaluating model: {e}")
            return {}

    def save_model(
        self,
        model: Any,
        scaler: StandardScaler,
        model_id: str,
        metrics: Dict[str, float],
    ) -> str:
        """Save trained model to disk."""
        try:
            models_dir = Path("ml_pipeline/models")
            models_dir.mkdir(parents=True, exist_ok=True)

            model_path = models_dir / f"{model_id}.pkl"
            with open(model_path, "wb") as f:
                pickle.dump(model, f)

            scaler_path = models_dir / f"{model_id}_scaler.pkl"
            with open(scaler_path, "wb") as f:
                pickle.dump(scaler, f)

            self.logger.info(f"Saved model to {model_path}")
            return str(model_path)
        except Exception as e:
            self.logger.error(f"Error saving model: {e}")
            raise

    def run_training_pipeline(
        self,
        algorithm: Optional[str] = None,
        model_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Run complete training pipeline."""
        try:
            algorithm = algorithm or self.config["training"]["algorithm"]
            model_id = model_id or f"{algorithm.lower()}_v{int(datetime.utcnow().timestamp())}"

            # Load data
            df, _ = self.load_data()

            # Prepare data
            X, y, scaler = self.prepare_data(df)

            # Train model
            model, metrics = self.train(X, y, algorithm)

            # Save model
            model_path = self.save_model(model, scaler, model_id, metrics)

            # Log training event
            self.ml_logger.log_training_event(
                run_id=self.run_id,
                model_id=model_id,
                metrics=metrics,
                dataset_size=len(df),
                source="manual",
            )

            result = {
                "run_id": self.run_id,
                "model_id": model_id,
                "algorithm": algorithm,
                "dataset_size": len(df),
                "metrics": metrics,
                "model_path": model_path,
                "timestamp": datetime.utcnow().isoformat(),
            }

            self.logger.info(f"Training pipeline completed: {json.dumps(result, indent=2)}")
            return result
        except Exception as e:
            self.logger.error(f"Training pipeline failed: {e}")
            raise


def main():
    """CLI interface for model trainer."""
    parser = argparse.ArgumentParser(description="Model Training Pipeline")
    parser.add_argument(
        "--config",
        default="ml_pipeline/model_config.yaml",
        help="Path to model config",
    )
    parser.add_argument(
        "--algorithm",
        help="Algorithm to train (overrides config)",
    )
    parser.add_argument(
        "--model-id",
        help="Model ID for saving",
    )
    parser.add_argument(
        "--data",
        help="Path to training data CSV",
    )

    args = parser.parse_args()

    trainer = ModelTrainer(args.config)
    result = trainer.run_training_pipeline(algorithm=args.algorithm, model_id=args.model_id)
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
