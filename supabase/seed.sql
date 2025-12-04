-- WinMix TipsterHub - Demo Data Seed
-- Populates database with demo leagues, teams, matches, and predictions
-- For local development and testing only

-- ============================================================================
-- DEMO DATA - LEAGUES
-- ============================================================================

INSERT INTO public.leagues (id, name, country, season, home_win_percentage, avg_goals_per_match, btts_percentage)
VALUES
  ('00000000-0000-0000-0001-000000000001', 'Premier League', 'England', '2025-2026', 45.5, 2.8, 62.3),
  ('00000000-0000-0000-0001-000000000002', 'La Liga', 'Spain', '2025-2026', 44.2, 2.9, 61.1),
  ('00000000-0000-0000-0001-000000000003', 'Serie A', 'Italy', '2025-2026', 43.8, 2.6, 58.9),
  ('00000000-0000-0000-0001-000000000004', 'Bundesliga', 'Germany', '2025-2026', 46.1, 3.2, 65.4),
  ('00000000-0000-0000-0001-000000000005', 'Ligue 1', 'France', '2025-2026', 45.0, 2.7, 59.8)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - TEAMS
-- ============================================================================

-- Premier League Teams
INSERT INTO public.teams (id, league_id, name, abbreviation, founded_year, city, stadium)
VALUES
  ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'Manchester City', 'MCI', 1880, 'Manchester', 'Etihad Stadium'),
  ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Liverpool', 'LIV', 1892, 'Liverpool', 'Anfield'),
  ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', 'Arsenal', 'ARS', 1886, 'London', 'Emirates Stadium'),
  ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000001', 'Chelsea', 'CHE', 1905, 'London', 'Stamford Bridge'),
  ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000001', 'Manchester United', 'MUN', 1878, 'Manchester', 'Old Trafford'),
  -- La Liga Teams
  ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000002', 'FC Barcelona', 'BAR', 1899, 'Barcelona', 'Camp Nou'),
  ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000002', 'Real Madrid', 'RMA', 1902, 'Madrid', 'Santiago Bernabéu'),
  ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000002', 'Atletico Madrid', 'ATM', 1903, 'Madrid', 'Wanda Metropolitano'),
  ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0001-000000000002', 'Valencia CF', 'VAL', 1919, 'Valencia', 'Mestalla'),
  ('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0001-000000000002', 'Sevilla FC', 'SEV', 1890, 'Seville', 'Ramón Sánchez-Pizjuán')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - MATCHES
-- ============================================================================

INSERT INTO public.matches (id, league_id, home_team_id, away_team_id, match_date, status, home_score, away_score, halftime_home_score, halftime_away_score)
VALUES
  -- Completed matches
  ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002', '2025-12-01 15:00:00+00', 'completed', 2, 1, 1, 0),
  ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0002-000000000004', '2025-12-01 17:30:00+00', 'completed', 1, 1, 1, 0),
  ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0002-000000000001', '2025-12-02 15:00:00+00', 'completed', 0, 3, 0, 2),
  -- Upcoming matches
  ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000003', '2025-12-15 20:00:00+00', 'pending', NULL, NULL, NULL, NULL),
  ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0002-000000000005', '2025-12-15 17:30:00+00', 'pending', NULL, NULL, NULL, NULL),
  ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0002-000000000007', '2025-12-16 20:00:00+00', 'pending', NULL, NULL, NULL, NULL)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - SCHEDULES
-- ============================================================================

INSERT INTO public.schedules (id, match_id, scheduled_for, sync_status)
VALUES
  ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0003-000000000001', '2025-12-01 15:00:00+00', 'synced'),
  ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0003-000000000002', '2025-12-01 17:30:00+00', 'synced'),
  ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0003-000000000003', '2025-12-02 15:00:00+00', 'synced'),
  ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0003-000000000004', '2025-12-15 20:00:00+00', 'pending'),
  ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0003-000000000005', '2025-12-15 17:30:00+00', 'pending')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - PATTERN TEMPLATES
-- ============================================================================

INSERT INTO public.pattern_templates (id, name, description, category, base_confidence_boost, is_active)
VALUES
  ('00000000-0000-0000-0005-000000000001', 'Home Advantage', 'Statistical edge for home teams', 'team_form', 2.5, true),
  ('00000000-0000-0000-0005-000000000002', 'Recent Form', 'Recent performance indicator', 'form_based', 3.2, true),
  ('00000000-0000-0000-0005-000000000003', 'Head-to-Head', 'Historical matchup patterns', 'historical', 1.8, true),
  ('00000000-0000-0000-0005-000000000004', 'Injury Crisis', 'Impact of key player absences', 'tactical', 4.1, true),
  ('00000000-0000-0000-0005-000000000005', 'Set Piece Strength', 'Strength in set pieces', 'tactical', 2.0, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - PATTERN DEFINITIONS
-- ============================================================================

INSERT INTO public.pattern_definitions (id, pattern_name, detection_function, min_sample_size, min_confidence_threshold, priority, is_active)
VALUES
  ('00000000-0000-0000-0006-000000000001', 'Home Win Pattern', 'detect_home_win_pattern', 5, 0.55, 1, true),
  ('00000000-0000-0000-0006-000000000002', 'BTTS Pattern', 'detect_btts_pattern', 8, 0.60, 2, true),
  ('00000000-0000-0000-0006-000000000003', 'Over/Under Pattern', 'detect_over_under_pattern', 10, 0.58, 3, true),
  ('00000000-0000-0000-0006-000000000004', 'Comeback Pattern', 'detect_comeback_pattern', 6, 0.62, 2, true),
  ('00000000-0000-0000-0006-000000000005', 'Possession Impact', 'detect_possession_impact', 7, 0.54, 4, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - MODEL REGISTRY
-- ============================================================================

INSERT INTO public.model_registry (id, model_name, model_version, status, model_type, description, git_commit_hash, trained_at)
VALUES
  ('00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'active', 'neural_net', 'Main prediction model', 'abc123def456', '2025-11-01 10:00:00+00'),
  ('00000000-0000-0000-0007-000000000002', 'Premier Model', 'v0.9.5', 'inactive', 'neural_net', 'Previous version', 'abc123def455', '2025-10-15 09:00:00+00'),
  ('00000000-0000-0000-0007-000000000003', 'Ensemble Model', 'v1.0.0', 'shadow', 'ensemble', 'Shadow ensemble model', 'abc123def457', '2025-11-05 14:00:00+00'),
  ('00000000-0000-0000-0007-000000000004', 'Conservative Model', 'v1.0.2', 'inactive', 'xgboost', 'Risk-averse variant', 'abc123def458', '2025-11-10 11:00:00+00')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - PREDICTIONS
-- ============================================================================

INSERT INTO public.predictions (id, match_id, predicted_outcome, confidence_score, predicted_home_score, predicted_away_score, btts_prediction, actual_outcome, was_correct, model_id, model_name, model_version, prediction_status)
VALUES
  -- Completed predictions
  ('00000000-0000-0000-0008-000000000001', '00000000-0000-0000-0003-000000000001', 'home_win', 72.5, 2, 1, true, 'home_win', true, '00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'normal'),
  ('00000000-0000-0000-0008-000000000002', '00000000-0000-0000-0003-000000000002', 'draw', 58.3, 1, 1, true, 'draw', true, '00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'normal'),
  ('00000000-0000-0000-0008-000000000003', '00000000-0000-0000-0003-000000000003', 'home_win', 61.2, 1, 2, false, 'away_win', false, '00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'normal'),
  -- Upcoming predictions
  ('00000000-0000-0000-0008-000000000004', '00000000-0000-0000-0003-000000000004', 'home_win', 65.8, 2, 0, false, NULL, NULL, '00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'normal'),
  ('00000000-0000-0000-0008-000000000005', '00000000-0000-0000-0003-000000000005', 'draw', 52.1, 1, 1, true, NULL, NULL, '00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'normal'),
  ('00000000-0000-0000-0008-000000000006', '00000000-0000-0000-0003-000000000006', 'away_win', 58.9, 1, 2, true, NULL, NULL, '00000000-0000-0000-0007-000000000001', 'Premier Model', 'v1.0.0', 'normal')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - EVALUATION LOG
-- ============================================================================

INSERT INTO public.evaluation_log (id, prediction_id, timestamp, model_version, team_a_id, team_b_id, predicted_result, actual_result, confidence, was_correct)
VALUES
  ('00000000-0000-0000-0009-000000000001', '00000000-0000-0000-0008-000000000001', '2025-12-01 15:00:00+00', 'v1.0.0', '00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0002-000000000002', 'home_win', 'home_win', 72.5, true),
  ('00000000-0000-0000-0009-000000000002', '00000000-0000-0000-0008-000000000002', '2025-12-01 17:30:00+00', 'v1.0.0', '00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0002-000000000004', 'draw', 'draw', 58.3, true),
  ('00000000-0000-0000-0009-000000000003', '00000000-0000-0000-0008-000000000003', '2025-12-02 15:00:00+00', 'v1.0.0', '00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0002-000000000001', 'home_win', 'away_win', 61.2, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - JOBS
-- ============================================================================

INSERT INTO public.jobs (id, name, description, job_type, schedule_cron, is_enabled)
VALUES
  ('00000000-0000-0000-000a-000000000001', 'Daily Data Sync', 'Synchronize match and team data daily', 'data_sync', '0 2 * * *', true),
  ('00000000-0000-0000-000a-000000000002', 'Model Evaluation', 'Evaluate model performance hourly', 'model_evaluation', '0 * * * *', true),
  ('00000000-0000-0000-000a-000000000003', 'Pattern Detection', 'Detect new patterns in matches', 'pattern_detection', '0 3 * * *', true),
  ('00000000-0000-0000-000a-000000000004', 'Weekly Report', 'Generate weekly analytics report', 'reporting', '0 9 * * 1', true),
  ('00000000-0000-0000-000a-000000000005', 'Database Maintenance', 'Clean up old logs and cache', 'maintenance', '0 4 * * 0', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - ANALYTICS SNAPSHOTS
-- ============================================================================

INSERT INTO public.analytics_snapshots (id, snapshot_date, total_predictions, successful_predictions, average_confidence, model_count, active_model_count, league_stats)
VALUES
  ('00000000-0000-0000-000b-000000000001', '2025-12-01 00:00:00+00', 150, 105, 64.3, 4, 1, '{"premier_league": 45, "la_liga": 35, "serie_a": 40, "bundesliga": 30}'),
  ('00000000-0000-0000-000b-000000000002', '2025-11-30 00:00:00+00', 142, 98, 63.8, 4, 1, '{"premier_league": 42, "la_liga": 33, "serie_a": 38, "bundesliga": 29}'),
  ('00000000-0000-0000-000b-000000000003', '2025-11-29 00:00:00+00', 138, 94, 63.1, 4, 1, '{"premier_league": 40, "la_liga": 32, "serie_a": 36, "bundesliga": 30}')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - MODEL METRICS
-- ============================================================================

INSERT INTO public.model_metrics (id, model_id, period_start, period_end, total_predictions, accuracy_overall, accuracy_winner, accuracy_btts, precision, recall, f1_score, confidence_calibration_score)
VALUES
  ('00000000-0000-0000-000c-000000000001', '00000000-0000-0000-0007-000000000001', '2025-11-01 00:00:00+00', '2025-11-30 23:59:59+00', 150, 0.68, 0.71, 0.64, 0.69, 0.67, 0.68, 0.85),
  ('00000000-0000-0000-000c-000000000002', '00000000-0000-0000-0007-000000000001', '2025-10-01 00:00:00+00', '2025-10-31 23:59:59+00', 140, 0.66, 0.69, 0.62, 0.67, 0.65, 0.66, 0.83),
  ('00000000-0000-0000-000c-000000000003', '00000000-0000-0000-0007-000000000002', '2025-10-01 00:00:00+00', '2025-10-31 23:59:59+00', 135, 0.64, 0.66, 0.60, 0.65, 0.63, 0.64, 0.81)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - MONITORING METRICS
-- ============================================================================

INSERT INTO public.monitoring_metrics (id, timestamp, db_response_time, api_response_time, error_rate, active_users, jobs_queued, jobs_running, memory_usage, cpu_usage)
VALUES
  ('00000000-0000-0000-000d-000000000001', '2025-12-04 23:00:00+00', 45.2, 120.5, 0.002, 8, 2, 1, 62.3, 35.1),
  ('00000000-0000-0000-000d-000000000002', '2025-12-04 22:00:00+00', 42.8, 118.3, 0.001, 6, 1, 0, 58.9, 32.4),
  ('00000000-0000-0000-000d-000000000003', '2025-12-04 21:00:00+00', 48.1, 125.7, 0.003, 10, 3, 2, 68.2, 41.2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - SYSTEM HEALTH
-- ============================================================================

INSERT INTO public.system_health (id, check_timestamp, database_status, api_status, job_processor_status, last_data_sync, last_model_update, error_count, warning_count)
VALUES
  ('00000000-0000-0000-000e-000000000001', '2025-12-04 23:30:00+00', 'healthy', 'healthy', 'healthy', '2025-12-04 02:15:00+00', '2025-12-03 14:30:00+00', 0, 2)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DEMO DATA - PATTERN ACCURACY
-- ============================================================================

INSERT INTO public.pattern_accuracy (id, template_id, accuracy_rate, correct_predictions, total_predictions)
VALUES
  ('00000000-0000-0000-000f-000000000001', '00000000-0000-0000-0005-000000000001', 0.72, 36, 50),
  ('00000000-0000-0000-000f-000000000002', '00000000-0000-0000-0005-000000000002', 0.68, 34, 50),
  ('00000000-0000-0000-000f-000000000003', '00000000-0000-0000-0005-000000000003', 0.65, 32, 50),
  ('00000000-0000-0000-000f-000000000004', '00000000-0000-0000-0005-000000000004', 0.71, 35, 49),
  ('00000000-0000-0000-000f-000000000005', '00000000-0000-0000-0005-000000000005', 0.66, 33, 50)
ON CONFLICT DO NOTHING;
