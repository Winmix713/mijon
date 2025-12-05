import csv
import json
import logging
import uuid
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional, List
import os

from supabase import create_client, Client


class MLLogger:
    """Centralized logging for ML predictions and events with CSV + Supabase persistence."""

    def __init__(
        self,
        supabase_url: Optional[str] = None,
        supabase_key: Optional[str] = None,
        log_dir: str = "ml_pipeline/logs",
    ):
        self.supabase_url = supabase_url or os.getenv("SUPABASE_URL")
        self.supabase_key = supabase_key or os.getenv("SUPABASE_SERVICE_KEY")
        self.log_dir = Path(log_dir)
        self.log_dir.mkdir(parents=True, exist_ok=True)

        # Initialize logger
        self.logger = logging.getLogger("ml_pipeline")
        if not self.logger.handlers:
            handler = logging.FileHandler(self.log_dir / "ml_pipeline.log")
            formatter = logging.Formatter(
                "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
            )
            handler.setFormatter(formatter)
            self.logger.addHandler(handler)
            self.logger.setLevel(logging.INFO)

        # Supabase client
        self.supabase: Optional[Client] = None
        if self.supabase_url and self.supabase_key:
            try:
                self.supabase = create_client(self.supabase_url, self.supabase_key)
            except Exception as e:
                self.logger.warning(f"Failed to initialize Supabase: {e}")

        # CSV file for evaluation logs
        self.eval_log_path = self.log_dir / "evaluation_log.csv"
        self._init_eval_log_csv()

    def _init_eval_log_csv(self) -> None:
        """Initialize evaluation log CSV with headers if it doesn't exist."""
        if not self.eval_log_path.exists():
            headers = [
                "timestamp",
                "event_id",
                "event_type",
                "model_id",
                "match_id",
                "prediction",
                "actual_result",
                "confidence",
                "accuracy",
                "metadata",
                "status",
            ]
            with open(self.eval_log_path, "w", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=headers)
                writer.writeheader()

    def log_prediction(
        self,
        model_id: str,
        match_id: str,
        prediction: str,
        confidence: float,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Log a prediction event with UUID tracking."""
        event_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        log_entry = {
            "timestamp": timestamp,
            "event_id": event_id,
            "event_type": "prediction",
            "model_id": model_id,
            "match_id": match_id,
            "prediction": prediction,
            "actual_result": None,
            "confidence": confidence,
            "accuracy": None,
            "metadata": json.dumps(metadata or {}),
            "status": "pending",
        }

        # Write to CSV
        self._write_to_csv(log_entry)

        # Write to Supabase
        if self.supabase:
            self._write_to_supabase("evaluation_log", log_entry)

        self.logger.info(
            f"Logged prediction: {event_id} for match {match_id} with confidence {confidence}"
        )
        return event_id

    def log_evaluation(
        self,
        event_id: str,
        actual_result: str,
        accuracy: float,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Update prediction with evaluation result."""
        timestamp = datetime.utcnow().isoformat()

        update_entry = {
            "timestamp": timestamp,
            "event_id": event_id,
            "actual_result": actual_result,
            "accuracy": accuracy,
            "metadata": json.dumps(metadata or {}),
            "status": "evaluated",
        }

        # Read current CSV, update entry, write back
        self._update_csv_entry(event_id, update_entry)

        # Update in Supabase
        if self.supabase:
            self._update_supabase_entry("evaluation_log", event_id, update_entry)

        self.logger.info(f"Logged evaluation: {event_id} with accuracy {accuracy}")

    def log_training_event(
        self,
        run_id: str,
        model_id: str,
        metrics: Dict[str, Any],
        dataset_size: int,
        source: str = "manual",
    ) -> None:
        """Log model training run."""
        timestamp = datetime.utcnow().isoformat()

        training_entry = {
            "timestamp": timestamp,
            "run_id": run_id,
            "model_id": model_id,
            "dataset_size": dataset_size,
            "source": source,
            "metrics": json.dumps(metrics),
            "status": "completed",
        }

        # Write to Supabase
        if self.supabase:
            self._write_to_supabase("model_training_runs", training_entry)

        self.logger.info(f"Logged training run: {run_id} for model {model_id}")

    def _write_to_csv(self, entry: Dict[str, Any]) -> None:
        """Append entry to CSV file."""
        try:
            with open(self.eval_log_path, "a", newline="") as f:
                writer = csv.DictWriter(f, fieldnames=entry.keys())
                writer.writerow(entry)
        except Exception as e:
            self.logger.error(f"Failed to write to CSV: {e}")

    def _update_csv_entry(self, event_id: str, updates: Dict[str, Any]) -> None:
        """Update an existing entry in the CSV file."""
        try:
            rows = []
            with open(self.eval_log_path, "r", newline="") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    if row["event_id"] == event_id:
                        row.update(updates)
                    rows.append(row)

            with open(self.eval_log_path, "w", newline="") as f:
                if rows:
                    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
                    writer.writeheader()
                    writer.writerows(rows)
        except Exception as e:
            self.logger.error(f"Failed to update CSV entry: {e}")

    def _write_to_supabase(self, table: str, entry: Dict[str, Any]) -> None:
        """Write entry to Supabase table."""
        try:
            if not self.supabase:
                return
            self.supabase.table(table).insert(entry).execute()
        except Exception as e:
            self.logger.error(f"Failed to write to Supabase table {table}: {e}")

    def _update_supabase_entry(
        self, table: str, event_id: str, updates: Dict[str, Any]
    ) -> None:
        """Update entry in Supabase table."""
        try:
            if not self.supabase:
                return
            self.supabase.table(table).update(updates).eq("event_id", event_id).execute()
        except Exception as e:
            self.logger.error(f"Failed to update Supabase table {table}: {e}")

    def reconcile_logs(self) -> Dict[str, Any]:
        """Reconcile evaluation logs and generate reconciliation report."""
        try:
            report = {
                "timestamp": datetime.utcnow().isoformat(),
                "total_predictions": 0,
                "evaluated": 0,
                "pending": 0,
                "accuracy_mean": 0.0,
                "discrepancies": [],
            }

            # Read CSV
            accuracies = []
            with open(self.eval_log_path, "r") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    report["total_predictions"] += 1
                    if row["status"] == "evaluated":
                        report["evaluated"] += 1
                        if row["accuracy"] and row["accuracy"] != "None":
                            accuracies.append(float(row["accuracy"]))
                    elif row["status"] == "pending":
                        report["pending"] += 1

            if accuracies:
                report["accuracy_mean"] = sum(accuracies) / len(accuracies)

            # Check Supabase discrepancies
            if self.supabase:
                db_count = self.supabase.table("evaluation_log").select("*").execute()
                csv_count = report["total_predictions"]
                if len(db_count.data) != csv_count:
                    report["discrepancies"].append(
                        {
                            "issue": "count_mismatch",
                            "csv_count": csv_count,
                            "db_count": len(db_count.data),
                        }
                    )

            self.logger.info(f"Reconciliation report: {report}")
            return report
        except Exception as e:
            self.logger.error(f"Failed to reconcile logs: {e}")
            return {
                "timestamp": datetime.utcnow().isoformat(),
                "error": str(e),
            }


def get_logger(
    supabase_url: Optional[str] = None,
    supabase_key: Optional[str] = None,
) -> MLLogger:
    """Factory function to get ML logger instance."""
    return MLLogger(supabase_url, supabase_key)
