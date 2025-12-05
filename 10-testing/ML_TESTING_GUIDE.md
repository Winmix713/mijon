---
title: "ML Pipeline Testing Guide"
description: "Comprehensive testing strategy for ML modules, integration tests, and E2E validation"
category: "10-testing"
language: "en"
version: "1.0.0"
last_updated: "2025-01-01"
status: "active"
tags: ["testing", "ml-pipeline", "pytest", "coverage", "quality-assurance"]
---

# ML Pipeline Testing Guide

## Testing Strategy

The WinMix TipsterHub testing infrastructure includes:

1. **Unit Tests (Pytest)**: ML module functionality
2. **Integration Tests (Pytest)**: Data pipeline, logging, and Supabase integration
3. **Vitest Unit Tests**: Frontend analytics utilities
4. **E2E Tests (Playwright)**: User workflows and critical paths
5. **Policy Tests (Supabase)**: RLS and Edge Function validation

## Quick Start

```bash
# Run all tests
npm run test:all

# Frontend only
npm run test
npm run test:watch
npm run test:coverage

# E2E tests
npm run test:e2e

# ML pipeline tests
pytest ml_pipeline/tests/ -v

# With coverage
pytest ml_pipeline/tests/ --cov=ml_pipeline --cov-report=html
```

## Unit Tests

### Frontend (Vitest)

**Location**: `src/**/*.test.ts`, `src/__tests__/*`

**Configuration**: `vitest.config.ts`

**Example Test**:

```typescript
// src/lib/__tests__/analytics.test.ts
import { describe, it, expect } from 'vitest';

describe('Analytics Utilities', () => {
  it('should identify streaks correctly', () => {
    const sequence = ['H', 'H', 'H', 'D', 'V'];
    // Test streak detection
    expect(streakLength).toBe(3);
  });

  it('should validate confidence thresholds', () => {
    const confidence = 0.85;
    expect(confidence >= 0.60).toBe(true);
  });
});
```

**Running**:

```bash
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

**Coverage Gates**:

```
Statements   | Branches | Functions | Lines
70% minimum for merge
```

### ML Pipeline (Pytest)

**Location**: `ml_pipeline/tests/`

**Test Modules**:

- `test_logging.py`: MLLogger functionality
- `test_prediction_engine.py`: Prediction engine
- `test_train_model.py`: Model training pipeline
- `test_utils.py`: Data loading and evaluation utilities

**Example Test**:

```python
# ml_pipeline/tests/test_prediction_engine.py
import pytest
from prediction_engine import PredictionEngine

@pytest.fixture
def engine():
    return PredictionEngine(config_path="ml_pipeline/model_config.yaml")

class TestPredictionEngine:
    def test_make_prediction(self, engine):
        features = [7.5, 6.2, 8.0, 7.5, 0.5]
        result = engine.predict(features, match_id="test_match_001")
        
        assert result is not None
        assert "prediction" in result
        assert result["confidence"] >= 0
        assert result["prediction"] in ["H", "D", "V"]
    
    def test_batch_prediction(self, engine):
        import pandas as pd
        data = pd.DataFrame({
            "home_team_form": [7.5, 6.8],
            "away_team_form": [6.2, 7.1],
            "home_team_strength": [8.0, 7.2],
            "away_team_strength": [7.5, 8.0],
            "home_advantage": [0.5, 0.5],
            "match_id": ["match_001", "match_002"],
        })
        
        results = engine.batch_predict(data)
        assert len(results) == 2
        assert "prediction" in results.columns
```

**Running**:

```bash
# All tests
pytest ml_pipeline/tests/ -v

# Specific test
pytest ml_pipeline/tests/test_prediction_engine.py::TestPredictionEngine::test_make_prediction -v

# With coverage
pytest ml_pipeline/tests/ --cov=ml_pipeline --cov-report=html

# Show coverage report
open htmlcov/index.html
```

**Coverage Target**: 80% for ML modules

## Integration Tests

### Logging Integration

Tests that ML predictions are properly logged to both CSV and Supabase:

```python
# ml_pipeline/tests/test_logging.py
def test_prediction_logging_to_csv(logger):
    """Verify predictions are logged to CSV."""
    event_id = logger.log_prediction(
        model_id="test_model",
        match_id="match_001",
        prediction="H",
        confidence=0.85,
    )
    
    # Read CSV and verify
    with open(logger.eval_log_path, "r") as f:
        assert "match_001" in f.read()

def test_log_reconciliation(logger):
    """Verify log reconciliation works."""
    # Log predictions
    for i in range(5):
        logger.log_prediction(
            model_id="test_model",
            match_id=f"match_{i:03d}",
            prediction="H",
            confidence=0.75,
        )
    
    # Reconcile
    report = logger.reconcile_logs()
    assert report["total_predictions"] >= 5
```

### Data Pipeline Integration

Tests that data flows correctly from CSV to Supabase:

```python
# ml_pipeline/tests/test_data_loader.py
def test_evaluation_log_loading(data_loader):
    """Load evaluation log from CSV."""
    df = data_loader.load_evaluation_log()
    assert len(df) > 0
    assert "event_id" in df.columns

def test_error_filtering(data_loader):
    """Filter prediction errors."""
    eval_df = data_loader.load_evaluation_log()
    errors = data_loader.get_prediction_errors(eval_df)
    assert all(errors["prediction"] != errors["actual_result"])
```

### Edge Function Integration

Tests that Edge Functions trigger ML operations:

```python
# tests/edge-functions.test.ts
import { describe, it, expect } from '@jest/globals';

describe('Edge Functions', () => {
  it('should trigger training on schedule', async () => {
    // Mock scheduled trigger
    const response = await fetch(
      'http://localhost:54321/functions/v1/train-model',
      { method: 'POST' }
    );
    
    expect(response.status).toBe(200);
  });

  it('should return predictions from engine', async () => {
    const response = await fetch(
      'http://localhost:54321/functions/v1/predict',
      {
        method: 'POST',
        body: JSON.stringify({
          features: [7.5, 6.2, 8.0, 7.5, 0.5],
          matchId: 'match_001',
        }),
      }
    );
    
    const data = await response.json();
    expect(data.prediction).toMatch(/^[HDV]$/);
  });
});
```

## E2E Tests

### Using Playwright

**Location**: `e2e/**/*.spec.ts`

**Configuration**: `playwright.config.ts`

**Example Test**:

```typescript
// e2e/predictions.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Prediction Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display predictions on dashboard', async ({ page }) => {
    // Wait for predictions to load
    await page.waitForSelector('[data-testid="predictions-list"]');
    
    // Verify prediction cards are visible
    const predictions = await page.locator('[data-testid="prediction-card"]');
    const count = await predictions.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show prediction details', async ({ page }) => {
    // Click first prediction
    await page.locator('[data-testid="prediction-card"]').first().click();
    
    // Verify details panel
    await expect(page.locator('text=Confidence')).toBeVisible();
    await expect(page.locator('text=Model ID')).toBeVisible();
  });

  test('should handle prediction evaluation', async ({ page }) => {
    // Open prediction
    await page.locator('[data-testid="prediction-card"]').first().click();
    
    // Submit evaluation
    await page.locator('[data-testid="evaluate-btn"]').click();
    await page.selectOption('[data-testid="result-select"]', 'H');
    await page.locator('[data-testid="submit-btn"]').click();
    
    // Verify success
    await expect(page.locator('text=Evaluation recorded')).toBeVisible();
  });
});
```

**Running**:

```bash
# Run all E2E tests
npm run test:e2e

# Run specific test
npm run test:e2e -- e2e/predictions.spec.ts

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Supabase/Deno Policy Tests

### Testing RLS Policies

```typescript
// supabase/functions/_shared/test-rls.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const testRLS = async () => {
  const client = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!
  );

  // Test: Anonymous can't access evaluation_log
  const { data, error } = await client
    .from("evaluation_log")
    .select("*");

  if (error) {
    console.log("✓ RLS policy working: ", error.message);
  } else {
    console.error("✗ RLS policy failed: data accessible");
  }
};
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test -- run
      - run: npm run test:coverage

  ml:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r ml_pipeline/requirements.txt
      - run: pytest ml_pipeline/tests/ -v --cov=ml_pipeline
      - run: coverage report --fail-under=80

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Test Coverage Goals

| Component | Target | Current |
|-----------|--------|---------|
| Frontend Utils | 70% | TBD |
| ML Modules | 80% | TBD |
| Integration | 75% | TBD |
| E2E Critical Paths | 100% | TBD |

## Best Practices

### 1. Test Organization

```
tests/
├── unit/           # Pure function tests
├── integration/    # Component + external service tests
├── e2e/           # User workflow tests
└── fixtures/      # Test data and helpers
```

### 2. Naming Conventions

```typescript
// Good
it('should return predictions with confidence > 0.5', () => {});

// Bad
it('test prediction', () => {});
```

### 3. Mocking External Services

```python
# Use fixtures to mock Supabase
@pytest.fixture
def mock_supabase(monkeypatch):
    def mock_insert(*args, **kwargs):
        return MockResponse(data={}, error=None)
    
    monkeypatch.setattr("supabase.table.insert", mock_insert)
    return mock_insert
```

### 4. Data-Driven Tests

```python
@pytest.mark.parametrize("input_features,expected_class", [
    ([7.5, 6.2, 8.0, 7.5, 0.5], "H"),
    ([5.0, 7.5, 6.0, 8.0, 0.5], "V"),
    ([6.5, 6.5, 7.0, 7.0, 0.5], "D"),
])
def test_predictions(input_features, expected_class, engine):
    result = engine.predict(input_features, "match_001")
    assert result["prediction"] == expected_class
```

## Debugging Tests

### Python Debugging

```bash
# Run with print statements
pytest ml_pipeline/tests/test_logging.py -v -s

# Drop into debugger
pytest ml_pipeline/tests/ --pdb

# Show fixture setup
pytest ml_pipeline/tests/ --setup-show
```

### Frontend Debugging

```bash
# View full page in Playwright inspector
npx playwright test --debug

# Verbose logging
DEBUG=pw:api npm run test:e2e
```

## Performance Testing

```bash
# Measure prediction latency
time python ml_pipeline/prediction_engine.py --predict 7.5 6.2 8.0 7.5 0.5

# Profile training
python -m cProfile -s cumtime ml_pipeline/train_model.py
```

## Related Documentation

- [Testing Guide](./TESTING_GUIDE.md)
- [ML Deployment Guide](../11-deployment/ML_DEPLOYMENT_GUIDE.md)
- [Operations Runbook](../11-deployment/OPERATIONS_RUNBOOK.md)
