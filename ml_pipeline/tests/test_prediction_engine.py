"""Tests for prediction engine."""

import json
import tempfile
from pathlib import Path

import pytest

from prediction_engine import PredictionEngine


@pytest.fixture
def engine():
    """Create PredictionEngine instance for testing."""
    return PredictionEngine(config_path="ml_pipeline/model_config.yaml")


class TestPredictionEngine:
    """Test cases for PredictionEngine."""

    def test_engine_initialization(self, engine):
        """Test PredictionEngine initialization."""
        assert engine is not None
        assert engine.config is not None
        assert engine.model_registry is not None

    def test_load_config(self, engine):
        """Test configuration loading."""
        assert engine.config["meta"]["domain"] == "football_prediction"
        assert engine.config["inference"]["active_model_id"] == "logistic_regression_v1"

    def test_load_model_registry(self, engine):
        """Test model registry loading."""
        assert engine.model_registry is not None
        assert "models" in engine.model_registry
        assert len(engine.model_registry["models"]) > 0

    def test_decode_prediction(self, engine):
        """Test prediction decoding."""
        assert engine._decode_prediction(0) == "H"
        assert engine._decode_prediction(1) == "D"
        assert engine._decode_prediction(2) == "V"

    def test_make_prediction(self, engine):
        """Test making a prediction."""
        features = [7.5, 6.2, 8.0, 7.5, 0.5]
        result = engine.predict(features, match_id="test_match_001")

        assert result is not None
        assert "event_id" in result
        assert "prediction" in result
        assert "confidence" in result
        assert result["prediction"] in ["H", "D", "V"]
        assert 0 <= result["confidence"] <= 1.0

    def test_preprocess_features(self, engine):
        """Test feature preprocessing."""
        features = [7.5, 6.2, 8.0, 7.5, 0.5]
        X = engine.preprocess_features(features)

        assert X is not None
        assert X.shape == (1, 5)

    def test_get_model_info(self, engine):
        """Test retrieving model information."""
        info = engine.get_model_info()

        assert info is not None
        assert "model_id" in info
        assert "algorithm" in info
        assert "metrics" in info

    def test_batch_prediction(self, engine):
        """Test batch predictions."""
        import pandas as pd

        data = pd.DataFrame({
            "home_team_form": [7.5, 6.8, 8.2],
            "away_team_form": [6.2, 7.1, 5.5],
            "home_team_strength": [8.0, 7.2, 8.5],
            "away_team_strength": [7.5, 8.0, 6.0],
            "home_advantage": [0.5, 0.5, 0.5],
            "match_id": ["match_001", "match_002", "match_003"],
        })

        results = engine.batch_predict(data)

        assert results is not None
        assert len(results) == 3
        assert "prediction" in results.columns
        assert "confidence" in results.columns


class TestPredictionEngineIntegration:
    """Integration tests for PredictionEngine."""

    def test_prediction_logging_integration(self, engine):
        """Test prediction logging integration."""
        features = [7.5, 6.2, 8.0, 7.5, 0.5]
        result = engine.predict(features, match_id="test_match_001")

        # Verify event_id is present
        assert "event_id" in result
        assert result["event_id"] is not None

    def test_model_info_retrieval(self, engine):
        """Test model info retrieval."""
        model_info = engine.get_model_info()

        assert model_info is not None
        assert model_info["status"] in ["active", "candidate", "experimental"]
        assert "metrics" in model_info
        assert "accuracy" in model_info["metrics"]
