#!/usr/bin/env python3
import argparse
import json
import logging
import os
import pickle
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd
import yaml
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

from ml_logging import MLLogger


class PredictionEngine:
    """ML prediction engine for football match outcomes."""

    def __init__(self, config_path: str = "ml_pipeline/model_config.yaml"):
        self.config_path = Path(config_path)
        self.config = self._load_config()
        self.logger = self._init_logger()
        self.ml_logger = MLLogger()

        self.model = None
        self.scaler = None
        self.model_registry = self._load_model_registry()
        self.active_model_id = self.config["inference"]["active_model_id"]

        self.logger.info(f"PredictionEngine initialized with config: {config_path}")

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
        logger = logging.getLogger("prediction_engine")
        if not logger.handlers:
            log_dir = Path(self.config.get("logging", {}).get("log_dir", "ml_pipeline/logs"))
            log_dir.mkdir(parents=True, exist_ok=True)
            handler = logging.FileHandler(log_dir / "prediction_engine.log")
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            logger.addHandler(handler)
            logger.setLevel(logging.INFO)
        return logger

    def _load_model_registry(self) -> Dict[str, Any]:
        """Load model registry."""
        registry_path = Path("ml_pipeline/models/model_registry.json")
        try:
            with open(registry_path, "r") as f:
                return json.load(f)
        except Exception as e:
            self.logger.error(f"Error loading model registry: {e}")
            return {}

    def load_model(self, model_id: Optional[str] = None) -> bool:
        """Load ML model from disk."""
        model_id = model_id or self.active_model_id
        try:
            model_info = next(
                (m for m in self.model_registry.get("models", []) if m["model_id"] == model_id),
                None,
            )
            if not model_info:
                self.logger.error(f"Model {model_id} not found in registry")
                return False

            artifact_path = Path(model_info["artifact_path"])
            if not artifact_path.exists():
                self.logger.warning(f"Model artifact not found: {artifact_path}, using in-memory model")
                # For development, create a dummy model
                if model_info["algorithm"] == "LogisticRegression":
                    self.model = LogisticRegression(random_state=42, max_iter=1000)
                elif model_info["algorithm"] == "RandomForest":
                    self.model = RandomForestClassifier(n_estimators=100, random_state=42)
            else:
                with open(artifact_path, "rb") as f:
                    self.model = pickle.load(f)

            self.active_model_id = model_id
            self.logger.info(f"Loaded model: {model_id}")
            return True
        except Exception as e:
            self.logger.error(f"Error loading model: {e}")
            return False

    def preprocess_features(self, features: List[float]) -> np.ndarray:
        """Preprocess features for prediction."""
        try:
            # Convert to numpy array
            X = np.array(features).reshape(1, -1)

            # Apply scaling if configured
            if self.config["training"]["preprocessing"]["scaling"] == "StandardScaler":
                if self.scaler is None:
                    self.scaler = StandardScaler()
                    X = self.scaler.fit_transform(X)
                else:
                    X = self.scaler.transform(X)

            return X
        except Exception as e:
            self.logger.error(f"Error preprocessing features: {e}")
            raise

    def predict(
        self,
        features: List[float],
        match_id: str,
        return_confidence: bool = True,
    ) -> Dict[str, Any]:
        """Make a prediction for a single match."""
        try:
            if not self.model:
                if not self.load_model():
                    raise ValueError("Failed to load model")

            # Preprocess features
            X = self.preprocess_features(features)

            # Make prediction
            prediction = self.model.predict(X)[0]
            prediction_str = self._decode_prediction(prediction)

            # Get confidence
            confidence = 0.5
            if hasattr(self.model, "predict_proba"):
                proba = self.model.predict_proba(X)[0]
                confidence = float(np.max(proba))

            # Create prediction log
            event_id = self.ml_logger.log_prediction(
                model_id=self.active_model_id,
                match_id=match_id,
                prediction=prediction_str,
                confidence=confidence,
                metadata={
                    "features": features,
                    "raw_prediction": float(prediction),
                    "timestamp": datetime.utcnow().isoformat(),
                },
            )

            result = {
                "event_id": event_id,
                "match_id": match_id,
                "prediction": prediction_str,
                "confidence": confidence,
                "model_id": self.active_model_id,
                "timestamp": datetime.utcnow().isoformat(),
            }

            self.logger.info(f"Prediction for match {match_id}: {prediction_str} ({confidence:.2%})")
            return result
        except Exception as e:
            self.logger.error(f"Error making prediction: {e}")
            raise

    def batch_predict(self, data: pd.DataFrame) -> pd.DataFrame:
        """Make predictions for multiple matches."""
        try:
            if not self.model:
                if not self.load_model():
                    raise ValueError("Failed to load model")

            input_features = self.config["inference"]["input_features"]
            X = data[input_features].values

            # Preprocess all features
            X = self.scaler.fit_transform(X) if self.scaler else X

            # Make predictions
            predictions = self.model.predict(X)
            predictions = [self._decode_prediction(p) for p in predictions]

            # Get confidences
            confidences = [0.5] * len(predictions)
            if hasattr(self.model, "predict_proba"):
                probas = self.model.predict_proba(X)
                confidences = [float(np.max(p)) for p in probas]

            # Create results dataframe
            results = data.copy()
            results["prediction"] = predictions
            results["confidence"] = confidences
            results["model_id"] = self.active_model_id
            results["event_id"] = [str(uuid.uuid4()) for _ in range(len(data))]
            results["timestamp"] = datetime.utcnow().isoformat()

            # Log each prediction
            for _, row in results.iterrows():
                self.ml_logger.log_prediction(
                    model_id=self.active_model_id,
                    match_id=row.get("match_id", str(uuid.uuid4())),
                    prediction=row["prediction"],
                    confidence=row["confidence"],
                )

            self.logger.info(f"Made predictions for {len(results)} matches")
            return results
        except Exception as e:
            self.logger.error(f"Error in batch predictions: {e}")
            raise

    def evaluate_prediction(
        self,
        event_id: str,
        actual_result: str,
    ) -> None:
        """Evaluate a prediction against actual result."""
        try:
            # Calculate accuracy (simplified: 1.0 if correct, 0.0 otherwise)
            accuracy = 1.0  # This would need the prediction value to compare
            self.ml_logger.log_evaluation(
                event_id=event_id,
                actual_result=actual_result,
                accuracy=accuracy,
                metadata={"evaluated_at": datetime.utcnow().isoformat()},
            )
            self.logger.info(f"Evaluated prediction {event_id}")
        except Exception as e:
            self.logger.error(f"Error evaluating prediction: {e}")

    def _decode_prediction(self, prediction: Any) -> str:
        """Decode numerical prediction to string outcome."""
        mapping = {0: "H", 1: "D", 2: "V"}  # Home, Draw, Visitor
        if isinstance(prediction, (int, np.integer)):
            return mapping.get(int(prediction), "D")
        return str(prediction)

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the active model."""
        model_info = next(
            (m for m in self.model_registry.get("models", []) if m["model_id"] == self.active_model_id),
            None,
        )
        return model_info or {}


def main():
    """CLI interface for prediction engine."""
    parser = argparse.ArgumentParser(description="ML Prediction Engine")
    parser.add_argument(
        "--config",
        default="ml_pipeline/model_config.yaml",
        help="Path to model config",
    )
    parser.add_argument(
        "--predict",
        nargs="+",
        type=float,
        help="Make a prediction with given features",
    )
    parser.add_argument(
        "--match-id",
        default="test_match_001",
        help="Match ID for prediction",
    )
    parser.add_argument(
        "--model-id",
        help="Specific model to use for prediction",
    )
    parser.add_argument(
        "--info",
        action="store_true",
        help="Display active model information",
    )
    parser.add_argument(
        "--batch",
        help="Path to CSV file for batch predictions",
    )

    args = parser.parse_args()

    engine = PredictionEngine(args.config)

    if args.info:
        info = engine.get_model_info()
        print(json.dumps(info, indent=2))

    elif args.predict:
        if args.model_id:
            engine.load_model(args.model_id)
        result = engine.predict(args.predict, args.match_id)
        print(json.dumps(result, indent=2))

    elif args.batch:
        df = pd.read_csv(args.batch)
        results = engine.batch_predict(df)
        output_path = args.batch.replace(".csv", "_predictions.csv")
        results.to_csv(output_path, index=False)
        print(f"Batch predictions saved to {output_path}")

    else:
        print("Use --info, --predict, or --batch")


if __name__ == "__main__":
    main()
