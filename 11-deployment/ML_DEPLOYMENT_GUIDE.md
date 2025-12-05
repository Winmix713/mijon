---
title: "ML Pipeline Deployment Guide"
description: "Comprehensive guide for deploying and managing the ML pipeline"
category: "11-deployment"
language: "en"
version: "1.0.0"
last_updated: "2025-01-01"
status: "active"
tags: ["deployment", "ml-pipeline", "docker", "training", "inference"]
---

# ML Pipeline Deployment Guide

## Overview

The WinMix TipsterHub ML pipeline consists of:
- **Prediction Engine**: Real-time inference service
- **Training Service**: Batch model training and fine-tuning
- **Evaluation Logger**: Prediction tracking and metrics persistence
- **Docker ML Worker**: Containerized ML environment

## Quick Start

### 1. Local Development Setup

```bash
# Bootstrap entire environment
./scripts/dev/bootstrap.sh

# Or manually:
npm install
pip install -r ml_pipeline/requirements.txt
docker-compose up -d

# Start development server
npm run dev

# In another terminal, start ML worker
python ml_pipeline/prediction_engine.py --info
```

### 2. Build Docker Image

```bash
# Build ML worker image
docker build -f Dockerfile.ml -t winmix-ml-worker:latest .

# Or via docker-compose
docker-compose build ml_worker
```

### 3. Run ML Pipeline

```bash
# Make a single prediction
python ml_pipeline/prediction_engine.py --predict 7.5 6.2 8.0 7.5 0.5 --match-id match_001

# Train a model
python ml_pipeline/train_model.py

# Batch predictions
python ml_pipeline/prediction_engine.py --batch data.csv

# Get model info
python ml_pipeline/prediction_engine.py --info
```

## Environment Configuration

### Required Environment Variables

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key

# ML Configuration
LOG_LEVEL=INFO
DEBUG=false
```

### Configuration File (`ml_pipeline/model_config.yaml`)

```yaml
meta:
  domain: "football_prediction"
  version: "1.0.0"
  environment: "production"

inference:
  active_model_id: "logistic_regression_v1"
  min_confidence_threshold: 0.60

training:
  algorithm: "LogisticRegression"
  data_source: "ml_pipeline/data/training_dataset.csv"
  
evaluation:
  cross_validation:
    enabled: true
    n_folds: 5

auto_reinforcement:
  enabled: true
  lookback_days: 7
  min_error_samples: 10
  error_confidence_threshold: 0.7

decay_monitoring:
  enabled: true
  decay_threshold: 0.05
  check_frequency_hours: 24
```

## Deployment Steps

### Step 1: Preparation

```bash
# 1. Verify configuration
python ml_pipeline/train_model.py --help

# 2. Check data availability
ls -la ml_pipeline/data/

# 3. Validate model registry
cat ml_pipeline/models/model_registry.json | python -m json.tool

# 4. Run local tests
npm run test
pytest ml_pipeline/tests/ -v
```

### Step 2: Training

```bash
# Train initial model
python ml_pipeline/train_model.py

# Train specific algorithm
python ml_pipeline/train_model.py --algorithm RandomForest

# Use custom model ID
python ml_pipeline/train_model.py --model-id custom_model_v1
```

### Step 3: Validation

```bash
# Load and test model
python ml_pipeline/prediction_engine.py --model-id logistic_regression_v1 --predict 7.5 6.2 8.0 7.5 0.5

# Check evaluation logs
cat ml_pipeline/logs/evaluation_log.csv

# View training logs
cat ml_pipeline/logs/train_model.log
```

### Step 4: Docker Deployment

```bash
# Start all services
docker-compose up -d

# Verify ML worker
docker-compose logs ml_worker

# Run prediction in container
docker-compose exec ml_worker python ml_pipeline/prediction_engine.py --info

# Check health
docker-compose ps
```

### Step 5: Integration Testing

```bash
# Run full test suite
npm run test:all

# E2E tests
npm run test:e2e

# Python tests with coverage
pytest ml_pipeline/tests/ --cov=ml_pipeline --cov-report=html
```

## Monitoring & Observability

### Evaluation Logs

The system maintains evaluation logs in two formats:

1. **CSV Format** (`ml_pipeline/logs/evaluation_log.csv`):
```
timestamp,event_id,event_type,model_id,match_id,prediction,actual_result,confidence,accuracy,metadata,status
2025-01-01T12:00:00.000Z,uuid-1,prediction,logistic_regression_v1,match_001,H,H,0.85,1.0,{...},evaluated
```

2. **Supabase Table** (`evaluation_log`):
- Synced automatically
- Queryable via SQL
- Real-time insights via Edge Functions

### Logging Configuration

```python
from ml_pipeline import get_logger

logger = get_logger(
    supabase_url=os.getenv("SUPABASE_URL"),
    supabase_key=os.getenv("SUPABASE_SERVICE_KEY"),
)

# Log a prediction
event_id = logger.log_prediction(
    model_id="logistic_regression_v1",
    match_id="match_001",
    prediction="H",
    confidence=0.85,
)

# Evaluate it later
logger.log_evaluation(
    event_id=event_id,
    actual_result="H",
    accuracy=1.0,
)

# Reconcile logs
report = logger.reconcile_logs()
```

### Metrics Tracking

```python
from ml_pipeline.utils import EvaluationManager

evaluator = EvaluationManager()

# Record metrics
evaluator.record_metrics(
    model_id="logistic_regression_v1",
    metrics={
        "accuracy": 0.75,
        "precision": 0.77,
        "recall": 0.73,
        "f1_score": 0.75,
    },
    dataset_size=1000,
)

# Check for decay
decay = evaluator.calculate_decay(current_metrics, previous_metrics)
if evaluator.detect_decay_alert(decay):
    # Trigger alert
    pass

# Export metrics
evaluator.export_metrics("ml_pipeline/logs/metrics_history.json")
```

## Champion/Challenger Evaluation

### Workflow

1. **Champion Model**: Current production model
2. **Challenger Model**: Candidate replacement
3. **Evaluation Period**: Run both for N predictions or D days
4. **Promotion Decision**: Promote challenger if it outperforms champion by threshold

### Configuration

```yaml
champion_challenger:
  enabled: true
  promotion_threshold: 0.03  # 3% improvement required
  min_evaluated_predictions: 100
  evaluation_window_days: 7
  auto_promote: false  # Manual review before promotion
```

### Manual Promotion

```python
from ml_pipeline.utils import EvaluationManager

evaluator = EvaluationManager()

# Get metrics for both models
champion_metrics = {...}
challenger_metrics = {...}

# Compare
comparison = evaluator.champion_challenger_comparison(
    champion_metrics,
    challenger_metrics,
    threshold=0.03,
)

# Decide to promote
if evaluator.should_promote_challenger(comparison, min_evaluated=100):
    # Update model_registry.json
    # Update active_model_id in model_config.yaml
    # Log promotion in evaluation_log
    pass
```

## Auto-Reinforcement (Fine-tuning)

### Configuration

```yaml
auto_reinforcement:
  enabled: true
  lookback_days: 7
  min_error_samples: 10
  error_confidence_threshold: 0.7
  fine_tune_epochs: 5
  fine_tune_learning_rate: 0.001
```

### Triggering Fine-tuning

```bash
# Automatic: Scheduled via GitHub Actions (daily at 2:00 UTC)

# Manual trigger from CLI
python ml_pipeline/train_model.py --algorithm LogisticRegression --fine-tune
```

### Fine-tuning Flow

1. **Collect Errors**: Find high-confidence prediction errors from last 7 days
2. **Filter**: Keep only errors with confidence >= 70%
3. **Threshold**: Need minimum 10 samples
4. **Train**: Fine-tune on error dataset
5. **Evaluate**: Compare metrics with champion
6. **Decide**: Promote if metrics improve

## Decay Monitoring & Alerts

### Configuration

```yaml
decay_monitoring:
  enabled: true
  decay_threshold: 0.05  # Alert if accuracy drops > 5%
  check_frequency_hours: 24
  alert_recipients:
    - admin@winmix.local
```

### Decay Detection

```python
# Monitor accuracy trend
previous_accuracy = 0.75
current_accuracy = 0.71

decay = (current_accuracy - previous_accuracy) / previous_accuracy
# decay = -0.0533 (-5.33%)

if decay < -0.05:  # Exceeds threshold
    # Trigger alert
    # Consider retraining
    # Review recent predictions
```

## Troubleshooting

### Issue: Model predictions are poor quality

```bash
# 1. Check model info
python ml_pipeline/prediction_engine.py --info

# 2. Review training metrics
cat ml_pipeline/logs/train_model.log

# 3. Inspect evaluation log
head -20 ml_pipeline/logs/evaluation_log.csv

# 4. Retrain model
python ml_pipeline/train_model.py

# 5. Compare with challenger
python ml_pipeline/prediction_engine.py --model-id random_forest_v1 --predict ...
```

### Issue: Docker ML worker not starting

```bash
# Check image build
docker build -f Dockerfile.ml -t winmix-ml-worker:latest . --no-cache

# View logs
docker-compose logs ml_worker

# Test locally
docker run -it --rm winmix-ml-worker:latest python ml_pipeline/prediction_engine.py --info

# Verify environment
docker-compose exec ml_worker env | grep SUPABASE
```

### Issue: Evaluation logs not syncing to Supabase

```bash
# Check CSV exists
ls -la ml_pipeline/logs/evaluation_log.csv

# Verify Supabase credentials
echo $SUPABASE_URL
echo $SUPABASE_SERVICE_KEY

# Test connection
python -c "from supabase import create_client; c = create_client('$SUPABASE_URL', '$SUPABASE_SERVICE_KEY'); print(c)"

# Check table exists
# SELECT * FROM evaluation_log LIMIT 1;
```

## Performance Tuning

### ML Worker Resources

```yaml
ml_worker:
  resources:
    limits:
      cpus: '2'
      memory: 2G
    reservations:
      cpus: '1'
      memory: 1G
```

### Model Optimization

```python
# Use Random Forest for higher accuracy
trainer = ModelTrainer()
result = trainer.run_training_pipeline(algorithm="RandomForest")

# Or ensemble for robustness
# Configure ensemble in model_config.yaml
```

### Inference Caching

```yaml
inference:
  cache_predictions: true
  cache_ttl_seconds: 3600
  cache_backend: redis
```

## Rollback Procedures

### Rollback to Previous Model

```bash
# 1. Identify previous model in registry
cat ml_pipeline/models/model_registry.json | grep -A5 '"previous_champion"'

# 2. Update active model
# Edit ml_pipeline/model_config.yaml
# Set active_model_id to previous model

# 3. Restart services
docker-compose restart ml_worker

# 4. Verify
python ml_pipeline/prediction_engine.py --info
```

### Rollback Database

```bash
# If evaluation logs are corrupt:
supabase db push --dry-run  # Review changes
supabase db push  # Apply

# Or restore from backup:
supabase db reset
psql $DATABASE_URL < backup.sql
```

## Health Checks

```bash
#!/bin/bash
# health_check.sh

# Check ML worker
curl -s http://localhost:8000/health || echo "ML worker unhealthy"

# Check database
psql $DATABASE_URL -c "SELECT 1" || echo "Database unhealthy"

# Check models exist
ls ml_pipeline/models/*.pkl || echo "Models missing"

# Check recent evaluations
tail -1 ml_pipeline/logs/evaluation_log.csv | grep evaluated || echo "No recent evaluations"
```

## Related Documentation

- [Testing Guide](../10-testing/TESTING_GUIDE.md)
- [Operations Runbook](./OPERATIONS_RUNBOOK.md)
- [Local Setup](../12-development/LOCAL_SETUP.md)
- [ML Pipeline README](../../ML_README.md)
