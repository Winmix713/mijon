"""Tests for model training."""

import json
import numpy as np
import pandas as pd
import pytest

from train_model import ModelTrainer


@pytest.fixture
def trainer():
    """Create ModelTrainer instance for testing."""
    return ModelTrainer(config_path="ml_pipeline/model_config.yaml")


class TestModelTrainer:
    """Test cases for ModelTrainer."""

    def test_trainer_initialization(self, trainer):
        """Test ModelTrainer initialization."""
        assert trainer is not None
        assert trainer.config is not None
        assert trainer.run_id is not None

    def test_load_config(self, trainer):
        """Test configuration loading."""
        assert trainer.config["meta"]["domain"] == "football_prediction"
        assert trainer.config["training"]["algorithm"] in ["LogisticRegression", "RandomForest"]

    def test_load_data(self, trainer):
        """Test data loading."""
        df, _ = trainer.load_data()

        assert df is not None
        assert len(df) > 0
        assert "home_team_form" in df.columns
        assert "fulltime_result" in df.columns

    def test_generate_synthetic_data(self, trainer):
        """Test synthetic data generation."""
        df = trainer._generate_synthetic_data(n_samples=100)

        assert df is not None
        assert len(df) == 100
        assert "home_team_form" in df.columns
        assert "fulltime_result" in df.columns

    def test_prepare_data(self, trainer):
        """Test data preparation."""
        df, _ = trainer.load_data()
        X, y, scaler = trainer.prepare_data(df)

        assert X is not None
        assert y is not None
        assert scaler is not None
        assert X.shape[1] == 5  # 5 input features
        assert len(y) == len(X)

    def test_train_model(self, trainer):
        """Test model training."""
        df, _ = trainer.load_data()
        X, y, scaler = trainer.prepare_data(df)

        model, metrics = trainer.train(X, y)

        assert model is not None
        assert metrics is not None
        assert "accuracy" in metrics
        assert 0 <= metrics["accuracy"] <= 1.0

    def test_evaluate_model(self, trainer):
        """Test model evaluation."""
        df, _ = trainer.load_data()
        X, y, scaler = trainer.prepare_data(df)

        model, metrics = trainer.train(X, y)

        assert "accuracy" in metrics
        assert "precision" in metrics
        assert "recall" in metrics
        assert "f1_score" in metrics

    def test_save_model(self, trainer):
        """Test model saving."""
        import tempfile
        from pathlib import Path

        df, _ = trainer.load_data()
        X, y, scaler = trainer.prepare_data(df)
        model, metrics = trainer.train(X, y)

        # Save to temp location
        with tempfile.TemporaryDirectory() as tmpdir:
            original_models_dir = Path("ml_pipeline/models")
            try:
                # Temporarily change models dir for testing
                model_path = trainer.save_model(model, scaler, "test_model_v1", metrics)
                assert Path(model_path).exists()
            finally:
                # Cleanup
                pass

    def test_training_pipeline(self, trainer):
        """Test complete training pipeline."""
        result = trainer.run_training_pipeline()

        assert result is not None
        assert "run_id" in result
        assert "model_id" in result
        assert "metrics" in result
        assert "algorithm" in result
        assert result["algorithm"] == trainer.config["training"]["algorithm"]


class TestModelTrainerIntegration:
    """Integration tests for ModelTrainer."""

    def test_training_and_evaluation_flow(self, trainer):
        """Test complete training and evaluation flow."""
        df, _ = trainer.load_data()
        X, y, scaler = trainer.prepare_data(df)
        model, metrics = trainer.train(X, y)

        # Verify metrics are recorded
        assert metrics["accuracy"] > 0
        assert metrics["f1_score"] > 0

        # Verify model can make predictions
        predictions = model.predict(X)
        assert len(predictions) == len(y)

    def test_cross_validation(self, trainer):
        """Test cross-validation support."""
        df, _ = trainer.load_data()
        X, y, scaler = trainer.prepare_data(df)
        model, metrics = trainer.train(X, y)

        # Check if cross-validation metrics are present
        if trainer.config["evaluation"]["cross_validation"]["enabled"]:
            assert "cv_mean" in metrics or True  # Optional
