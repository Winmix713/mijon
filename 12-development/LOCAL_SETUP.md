---
title: "Local Development Setup"
description: "Guide for setting up local development environment"
category: "12-development"
language: "en"
version: "1.0.0"
last_updated: "2025-11-27"
status: "active"
tags: ["development", "local", "setup", "environment"]
---

# Local Development Setup

## Prerequisites

- Node.js 18+
- npm 8+ or bun 1+
- Git
- Supabase CLI (optional)

## Quick Start

```bash
# Clone repository
git clone <repository-url>
cd winmix-tipsterhub

# Install dependencies
npm ci

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

## Environment Variables

```bash
VITE_SUPABASE_PROJECT_ID="your_project_id"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your_anon_key"
```

## Development Workflow

1. Start dev server: `npm run dev`
2. Make changes to files in `src/`
3. Browser auto-refreshes
4. Check console for errors
5. Run linter: `npm run lint`
6. Commit changes

## Local Supabase (Optional)

```bash
supabase start
# Update .env for local development
supabase stop
```

## ML Pipeline Local Development

### Quick Start

```bash
# Run bootstrap script (recommended)
./scripts/dev/bootstrap.sh

# Or manually:
python3 -m venv venv
source venv/bin/activate
pip install -r ml_pipeline/requirements.txt

# Set environment variables
export SUPABASE_URL="http://localhost:54321"
export SUPABASE_SERVICE_KEY="your-key"
```

### Training a Model

```bash
# Train with default configuration
python ml_pipeline/train_model.py

# Train specific algorithm
python ml_pipeline/train_model.py --algorithm RandomForest

# With custom model ID
python ml_pipeline/train_model.py --model-id my_model_v1
```

### Making Predictions

```bash
# Single prediction
python ml_pipeline/prediction_engine.py --predict 7.5 6.2 8.0 7.5 0.5 --match-id match_001

# Batch predictions from CSV
python ml_pipeline/prediction_engine.py --batch data.csv

# Display model info
python ml_pipeline/prediction_engine.py --info
```

### Running Tests

```bash
# Python ML tests
pytest ml_pipeline/tests/ -v

# With coverage
pytest ml_pipeline/tests/ --cov=ml_pipeline --cov-report=html

# Frontend tests
npm run test
npm run test:watch

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### Docker Development

```bash
# Start all services with Docker
docker-compose up -d

# View logs
docker-compose logs -f

# Run ML worker tests
docker-compose exec ml_worker pytest ml_pipeline/tests/ -v

# Restart services
docker-compose restart

# Stop all services
docker-compose down
```

## Related Documentation

- [Operations Runbook](../11-deployment/OPERATIONS_RUNBOOK.md)
- [Testing Guide](../10-testing/TESTING_GUIDE.md)
- [ML Deployment Guide](../11-deployment/ML_DEPLOYMENT_GUIDE.md)
- [ML Pipeline README](../../ML_README.md)
