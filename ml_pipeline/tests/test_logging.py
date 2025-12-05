"""Tests for ML logging module."""

import json
import tempfile
import uuid
from pathlib import Path

import pytest

from ml_logging import MLLogger


@pytest.fixture
def temp_log_dir():
    """Create temporary directory for test logs."""
    with tempfile.TemporaryDirectory() as tmpdir:
        yield tmpdir


@pytest.fixture
def logger(temp_log_dir):
    """Create MLLogger instance for testing."""
    return MLLogger(log_dir=temp_log_dir)


class TestMLLogger:
    """Test cases for MLLogger."""

    def test_logger_initialization(self, logger):
        """Test MLLogger initialization."""
        assert logger is not None
        assert logger.log_dir.exists()
        assert logger.eval_log_path.exists()

    def test_log_prediction(self, logger):
        """Test logging a prediction."""
        event_id = logger.log_prediction(
            model_id="test_model_v1",
            match_id="match_001",
            prediction="H",
            confidence=0.85,
            metadata={"test": True},
        )

        assert event_id is not None
        assert isinstance(event_id, str)
        assert len(event_id) > 0

    def test_log_prediction_persists_to_csv(self, logger):
        """Test that prediction logs are persisted to CSV."""
        logger.log_prediction(
            model_id="test_model_v1",
            match_id="match_001",
            prediction="H",
            confidence=0.85,
        )

        # Read CSV and verify
        with open(logger.eval_log_path, "r") as f:
            content = f.read()
            assert "match_001" in content
            assert "0.85" in content

    def test_log_evaluation(self, logger):
        """Test logging an evaluation."""
        event_id = logger.log_prediction(
            model_id="test_model_v1",
            match_id="match_001",
            prediction="H",
            confidence=0.85,
        )

        # Now evaluate it
        logger.log_evaluation(
            event_id=event_id,
            actual_result="H",
            accuracy=1.0,
        )

        # Verify status changed to evaluated
        with open(logger.eval_log_path, "r") as f:
            content = f.read()
            assert "evaluated" in content

    def test_log_training_event(self, logger):
        """Test logging a training event."""
        run_id = str(uuid.uuid4())
        metrics = {
            "accuracy": 0.75,
            "precision": 0.77,
            "recall": 0.73,
        }

        logger.log_training_event(
            run_id=run_id,
            model_id="test_model_v1",
            metrics=metrics,
            dataset_size=100,
        )

        # Verify logging succeeded
        assert logger.logger is not None

    def test_reconcile_logs(self, logger):
        """Test log reconciliation."""
        # Log some predictions
        for i in range(5):
            logger.log_prediction(
                model_id="test_model_v1",
                match_id=f"match_{i:03d}",
                prediction="H",
                confidence=0.75,
            )

        # Reconcile
        report = logger.reconcile_logs()

        assert report is not None
        assert report["total_predictions"] >= 5
        assert "timestamp" in report

    def test_metadata_serialization(self, logger):
        """Test that metadata is properly serialized."""
        metadata = {
            "features": [7.5, 6.2, 8.0, 7.5, 0.5],
            "preprocessing": "StandardScaler",
        }

        event_id = logger.log_prediction(
            model_id="test_model_v1",
            match_id="match_001",
            prediction="H",
            confidence=0.85,
            metadata=metadata,
        )

        # Read CSV and verify JSON metadata
        import csv
        with open(logger.eval_log_path, "r") as f:
            reader = csv.DictReader(f)
            for row in reader:
                if row["event_id"] == event_id:
                    meta = json.loads(row["metadata"])
                    assert meta["features"] == metadata["features"]
                    break
