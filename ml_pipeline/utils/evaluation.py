"""Evaluation utilities for model assessment."""

import json
import logging
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, List, Optional

import pandas as pd


class EvaluationManager:
    """Manage model evaluation and metrics tracking."""

    def __init__(self, logger: Optional[logging.Logger] = None):
        self.logger = logger or logging.getLogger(__name__)
        self.metrics_history: List[Dict[str, Any]] = []

    def record_metrics(
        self,
        model_id: str,
        metrics: Dict[str, float],
        dataset_size: int,
    ) -> None:
        """Record model metrics."""
        entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "model_id": model_id,
            "metrics": metrics,
            "dataset_size": dataset_size,
        }
        self.metrics_history.append(entry)
        self.logger.info(f"Recorded metrics for {model_id}: {metrics}")

    def calculate_decay(
        self,
        current_metrics: Dict[str, float],
        previous_metrics: Dict[str, float],
    ) -> Dict[str, float]:
        """Calculate model performance decay."""
        decay = {}
        for key in current_metrics:
            if key in previous_metrics and previous_metrics[key] != 0:
                change = (current_metrics[key] - previous_metrics[key]) / previous_metrics[key]
                decay[key] = change
        return decay

    def detect_decay_alert(
        self,
        decay: Dict[str, float],
        threshold: float = -0.05,
    ) -> bool:
        """Check if model decay exceeds threshold."""
        for key, value in decay.items():
            if value < threshold:
                self.logger.warning(f"Model decay detected in {key}: {value:.2%}")
                return True
        return False

    def champion_challenger_comparison(
        self,
        champion_metrics: Dict[str, float],
        challenger_metrics: Dict[str, float],
        threshold: float = 0.03,
    ) -> Dict[str, Any]:
        """Compare champion and challenger models."""
        comparison = {
            "champion": champion_metrics,
            "challenger": challenger_metrics,
            "differences": {},
            "challenger_wins": False,
        }

        for metric in champion_metrics:
            if metric in challenger_metrics:
                diff = challenger_metrics[metric] - champion_metrics[metric]
                comparison["differences"][metric] = diff
                if diff > threshold:
                    comparison["challenger_wins"] = True

        self.logger.info(f"Comparison result: {comparison}")
        return comparison

    def should_promote_challenger(
        self,
        comparison: Dict[str, Any],
        min_evaluated: int = 100,
        current_evaluated: int = 0,
    ) -> bool:
        """Determine if challenger should be promoted to champion."""
        if current_evaluated < min_evaluated:
            self.logger.info(
                f"Not enough evaluated predictions: {current_evaluated} < {min_evaluated}"
            )
            return False

        if not comparison.get("challenger_wins"):
            self.logger.info("Challenger did not outperform champion")
            return False

        return True

    def export_metrics(self, output_path: str = "ml_pipeline/logs/metrics_history.json") -> None:
        """Export metrics history to JSON."""
        try:
            output_file = Path(output_path)
            output_file.parent.mkdir(parents=True, exist_ok=True)
            with open(output_file, "w") as f:
                json.dump(self.metrics_history, f, indent=2)
            self.logger.info(f"Exported metrics to {output_path}")
        except Exception as e:
            self.logger.error(f"Failed to export metrics: {e}")

    def get_model_health_status(
        self,
        model_metrics: Dict[str, float],
        accuracy_threshold: float = 0.65,
    ) -> str:
        """Determine model health status."""
        accuracy = model_metrics.get("accuracy", 0)

        if accuracy >= 0.75:
            return "excellent"
        elif accuracy >= accuracy_threshold:
            return "good"
        elif accuracy >= 0.50:
            return "degraded"
        else:
            return "poor"


def get_evaluation_manager() -> EvaluationManager:
    """Factory function to get EvaluationManager instance."""
    return EvaluationManager()
