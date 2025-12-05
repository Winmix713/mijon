---
title: "Testing Documentation"
description: "Complete testing infrastructure for WinMix TipsterHub"
category: "10-testing"
language: "en"
version: "1.0.0"
last_updated: "2025-01-01"
status: "active"
tags: ["testing", "qa", "quality-assurance", "automation"]
---

# Testing Documentation

Comprehensive testing guide for the WinMix TipsterHub application including frontend, backend ML pipeline, E2E workflows, and infrastructure validation.

## Contents

### Core Documentation

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Frontend testing approach (Vitest, utilities, components)
- **[ML_TESTING_GUIDE.md](./ML_TESTING_GUIDE.md)** - ML pipeline testing (Pytest, integration, E2E validation)

## Quick Reference

### Running Tests

```bash
# All tests
npm run test:all

# Frontend
npm run test              # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage

# E2E
npm run test:e2e

# ML Pipeline
pytest ml_pipeline/tests/ -v
pytest ml_pipeline/tests/ --cov=ml_pipeline
```

## Test Architecture

```
WinMix TipsterHub Testing
├── Unit Tests
│   ├── Frontend (Vitest)
│   │   └── src/**/*.test.ts
│   └── ML Pipeline (Pytest)
│       └── ml_pipeline/tests/
├── Integration Tests
│   ├── API Integration (Vitest + Mock)
│   ├── Data Pipeline (Pytest)
│   └── Supabase Integration (Pytest)
├── E2E Tests
│   ├── Playwright
│   └── e2e/**/*.spec.ts
└── Infrastructure Tests
    ├── RLS Policies (Deno)
    ├── Edge Functions
    └── Docker Compose
```

## Test Coverage Goals

| Component | Type | Target | Status |
|-----------|------|--------|--------|
| Frontend Utils | Unit | 70% | In Progress |
| ML Modules | Unit | 80% | In Progress |
| Data Pipeline | Integration | 75% | In Progress |
| Critical UX Flows | E2E | 100% | In Progress |
| RLS Policies | Policy | 100% | Pending |

## Frontend Testing

### Setup

```bash
npm install
npm run test
```

### Example: Analytics Utility Test

```typescript
import { describe, it, expect } from 'vitest';

describe('Streak Analysis', () => {
  it('identifies winning streaks', () => {
    const results = ['H', 'H', 'H', 'D', 'V'];
    const streak = identifyStreak(results, 'H');
    expect(streak.length).toBe(3);
  });
});
```

### Coverage Report

```bash
npm run test:coverage
open coverage/index.html
```

## ML Pipeline Testing

### Setup

```bash
pip install -r ml_pipeline/requirements.txt
pytest --version
```

### Example: Prediction Engine Test

```python
from prediction_engine import PredictionEngine
import pytest

@pytest.fixture
def engine():
    return PredictionEngine()

def test_prediction(engine):
    result = engine.predict([7.5, 6.2, 8.0, 7.5, 0.5], "match_001")
    assert result["prediction"] in ["H", "D", "V"]
    assert 0 <= result["confidence"] <= 1.0
```

### Running ML Tests

```bash
# All tests
pytest ml_pipeline/tests/ -v

# Specific test file
pytest ml_pipeline/tests/test_prediction_engine.py -v

# With coverage
pytest ml_pipeline/tests/ --cov=ml_pipeline --cov-report=html
open htmlcov/index.html
```

## E2E Testing

### Setup

```bash
npm install @playwright/test
npx playwright install
```

### Example: Prediction Flow Test

```typescript
import { test, expect } from '@playwright/test';

test('should make and display predictions', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=Dashboard')).toBeVisible();
  
  // Verify predictions are displayed
  const predictions = page.locator('[data-testid="prediction-card"]');
  await expect(predictions.first()).toBeVisible();
});
```

### Running E2E Tests

```bash
# Run all tests
npm run test:e2e

# Run specific test
npm run test:e2e -- e2e/predictions.spec.ts

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Integration Testing

### Docker Integration Tests

```bash
# Start services
docker-compose up -d

# Run tests inside container
docker-compose exec ml_worker pytest ml_pipeline/tests/ -v

# Check ML worker health
docker-compose exec ml_worker python -c "from prediction_engine import PredictionEngine; print(PredictionEngine().get_model_info())"
```

### Supabase Policy Tests

```bash
# Test RLS policies
supabase functions serve test-policy --no-verify-jwt

# Call from terminal
curl http://localhost:54321/functions/v1/test-policy
```

## Continuous Integration

### GitHub Actions

The repository includes automated testing via GitHub Actions:

```yaml
# .github/workflows/test.yml
- Lint
- Type checking
- Frontend tests
- ML tests
- E2E tests
- Coverage reports
```

View workflow status: `.github/workflows/`

## Test Development Workflow

### 1. Write Test

```python
# ml_pipeline/tests/test_new_feature.py
def test_new_feature():
    result = new_function()
    assert result is not None
```

### 2. Run Locally

```bash
pytest ml_pipeline/tests/test_new_feature.py -v
```

### 3. Check Coverage

```bash
pytest ml_pipeline/tests/ --cov=ml_pipeline --cov-report=term-missing
```

### 4. Commit & Push

```bash
git add ml_pipeline/tests/
git commit -m "Add tests for new feature"
git push
```

### 5. Review CI Results

Check GitHub Actions for test results

## Best Practices

### 1. Test Naming

```
✓ test_prediction_engine_returns_valid_outcome
✗ test_prediction
```

### 2. Fixtures & Setup

```python
@pytest.fixture
def engine():
    """Isolated engine instance for each test."""
    return PredictionEngine()
```

### 3. Mocking External Services

```python
@pytest.fixture
def mock_supabase(monkeypatch):
    def mock_insert(*args, **kwargs):
        return {"success": True}
    monkeypatch.setattr("supabase.insert", mock_insert)
```

### 4. Parameterized Tests

```python
@pytest.mark.parametrize("input,expected", [
    ([7.5, 6.2, 8.0, 7.5, 0.5], "H"),
    ([5.0, 7.5, 6.0, 8.0, 0.5], "V"),
])
def test_predictions(input, expected, engine):
    result = engine.predict(input, "match_001")
    assert result["prediction"] == expected
```

## Troubleshooting

### Frontend Tests Fail

```bash
# Clear cache
rm -rf node_modules/.vite

# Reinstall
npm ci

# Run with verbose output
npm run test -- --reporter=verbose
```

### ML Tests Fail

```bash
# Check dependencies
pip list | grep -E 'scikit|pandas|numpy'

# Reinstall requirements
pip install -r ml_pipeline/requirements.txt --force-reinstall

# Run with debug output
pytest ml_pipeline/tests/ -v -s
```

### E2E Tests Timeout

```bash
# Increase timeout in playwright.config.ts
timeout: 60 * 1000  // 60 seconds

# Run single test with debug
npx playwright test e2e/predictions.spec.ts --debug
```

## Performance Testing

### Frontend Performance

```bash
npm run test:coverage
# Check coverage/index.html for performance metrics
```

### ML Performance

```bash
time python ml_pipeline/prediction_engine.py --predict 7.5 6.2 8.0 7.5 0.5

python -m cProfile -s cumtime ml_pipeline/train_model.py
```

## Maintenance

### Regular Tasks

- [ ] Update dependencies monthly
- [ ] Review and update test coverage goals
- [ ] Add tests for new features
- [ ] Remove obsolete tests
- [ ] Update documentation

### Monthly Review

```bash
# Check test coverage trend
npm run test:coverage

# Review failing tests
npm run test:e2e -- --reporter=list
```

## Related Documentation

- [ML Deployment Guide](../11-deployment/ML_DEPLOYMENT_GUIDE.md)
- [Operations Runbook](../11-deployment/OPERATIONS_RUNBOOK.md)
- [Local Setup](../12-development/LOCAL_SETUP.md)
- [Architecture Overview](../04-architecture/)
