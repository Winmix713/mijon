-- WinMix TipsterHub - Initial Schema Migration
-- Creates core entities for Phases 3-9 integrated platform
-- Last updated: 2025-12-05

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. CORE REFERENCE DATA TABLES
-- ============================================================================

-- Leagues table - stores football league information
CREATE TABLE IF NOT EXISTS public.leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  season TEXT NOT NULL,
  home_win_percentage NUMERIC,
  avg_goals_per_match NUMERIC,
  btts_percentage NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_season CHECK (season ~ '^\d{4}-\d{4}$')
);

-- Teams table - stores team information within leagues
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  abbreviation TEXT,
  founded_year INT,
  city TEXT,
  stadium TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(league_id, name)
);

-- Matches table - stores match schedule and results
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  home_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  match_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'live', 'completed', 'cancelled')),
  home_score INT,
  away_score INT,
  halftime_home_score INT,
  halftime_away_score INT,
  possession_home NUMERIC,
  possession_away NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT valid_scores CHECK (
    (status IN ('pending', 'live') AND home_score IS NULL AND away_score IS NULL) OR
    (status IN ('completed') AND home_score IS NOT NULL AND away_score IS NOT NULL)
  )
);

-- Schedules table - tracks match scheduling and planning
CREATE TABLE IF NOT EXISTS public.schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'error')),
  sync_error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Pattern templates - predefined pattern configurations
CREATE TABLE IF NOT EXISTS public.pattern_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  category TEXT NOT NULL,
  base_confidence_boost NUMERIC DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pattern definitions - pattern detection configuration
CREATE TABLE IF NOT EXISTS public.pattern_definitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL UNIQUE,
  detection_function TEXT NOT NULL,
  min_sample_size INT DEFAULT 5,
  min_confidence_threshold NUMERIC DEFAULT 0.5,
  priority INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 2. AUTHENTICATION & USER MANAGEMENT
-- ============================================================================

-- User profiles - extends Supabase auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'analyst', 'user', 'viewer', 'demo')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 3. PREDICTION MANAGEMENT
-- ============================================================================

-- Predictions table - stores prediction data and metadata
CREATE TABLE IF NOT EXISTS public.predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  predicted_outcome TEXT NOT NULL CHECK (predicted_outcome IN ('home_win', 'draw', 'away_win')),
  confidence_score NUMERIC NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 100),
  predicted_home_score INT,
  predicted_away_score INT,
  btts_prediction BOOLEAN,
  over_under_prediction TEXT CHECK (over_under_prediction IN ('over', 'under') OR over_under_prediction IS NULL),
  actual_outcome TEXT CHECK (actual_outcome IN ('home_win', 'draw', 'away_win') OR actual_outcome IS NULL),
  was_correct BOOLEAN,
  calibration_error NUMERIC,
  css_score NUMERIC,
  prediction_factors JSONB,
  model_id UUID,
  model_name TEXT,
  model_version TEXT,
  is_shadow_mode BOOLEAN DEFAULT false,
  overconfidence_flag BOOLEAN DEFAULT false,
  downgraded_from_confidence NUMERIC,
  prediction_status TEXT DEFAULT 'normal' CHECK (prediction_status IN ('normal', 'uncertain', 'blocked')),
  blocked_reason TEXT,
  alternate_outcome TEXT,
  blocked_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  evaluated_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL
);

-- Prediction feedback - tracks user feedback on predictions
CREATE TABLE IF NOT EXISTS public.prediction_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('improvement', 'issue', 'compliment', 'data_error')),
  comment TEXT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Evaluation log - tracks prediction evaluation history for ML pipeline
CREATE TABLE IF NOT EXISTS public.evaluation_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT now(),
  model_version TEXT NOT NULL,
  team_a_id UUID REFERENCES public.teams(id),
  team_b_id UUID REFERENCES public.teams(id),
  predicted_result TEXT NOT NULL,
  actual_result TEXT,
  confidence NUMERIC NOT NULL,
  was_correct BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(prediction_id, timestamp)
);

-- ============================================================================
-- 4. PATTERN & DETECTION TRACKING
-- ============================================================================

-- Detected patterns - user-specific pattern detections
CREATE TABLE IF NOT EXISTS public.detected_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.pattern_templates(id) ON DELETE CASCADE,
  pattern_data JSONB,
  confidence_contribution NUMERIC DEFAULT 0,
  detected_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Team patterns - team-specific pattern information
CREATE TABLE IF NOT EXISTS public.team_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  pattern_name TEXT NOT NULL,
  pattern_type TEXT NOT NULL,
  confidence NUMERIC CHECK (confidence >= 0 AND confidence <= 1),
  strength NUMERIC,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  prediction_impact NUMERIC,
  historical_accuracy NUMERIC,
  pattern_metadata JSONB,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Pattern accuracy - tracks accuracy of pattern templates
CREATE TABLE IF NOT EXISTS public.pattern_accuracy (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.pattern_templates(id) ON DELETE CASCADE,
  accuracy_rate NUMERIC CHECK (accuracy_rate >= 0 AND accuracy_rate <= 1),
  correct_predictions INT DEFAULT 0,
  total_predictions INT DEFAULT 0,
  last_updated TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(template_id)
);

-- ============================================================================
-- 5. SCHEDULED JOBS & EXECUTION TRACKING
-- ============================================================================

-- Jobs table - background job configuration
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  job_type TEXT NOT NULL CHECK (job_type IN ('data_sync', 'model_evaluation', 'pattern_detection', 'reporting', 'maintenance')),
  schedule_cron TEXT NOT NULL,
  is_enabled BOOLEAN DEFAULT true,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Job logs - execution logs for background jobs
CREATE TABLE IF NOT EXISTS public.job_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'running', 'success', 'failed')),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  execution_ms INT,
  output_summary JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 6. MODEL MANAGEMENT & REGISTRY
-- ============================================================================

-- Model registry - tracks model versions and metadata
CREATE TABLE IF NOT EXISTS public.model_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_name TEXT NOT NULL,
  model_version TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'deprecated', 'shadow')),
  model_type TEXT NOT NULL,
  description TEXT,
  git_commit_hash TEXT,
  trained_at TIMESTAMPTZ,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(model_name, model_version)
);

-- Model metrics - performance metrics for models
CREATE TABLE IF NOT EXISTS public.model_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  model_id UUID NOT NULL REFERENCES public.model_registry(id) ON DELETE CASCADE,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  total_predictions INT DEFAULT 0,
  accuracy_overall NUMERIC CHECK (accuracy_overall >= 0 AND accuracy_overall <= 1),
  accuracy_winner NUMERIC CHECK (accuracy_winner >= 0 AND accuracy_winner <= 1),
  accuracy_btts NUMERIC CHECK (accuracy_btts >= 0 AND accuracy_btts <= 1),
  precision NUMERIC,
  recall NUMERIC,
  f1_score NUMERIC,
  confidence_calibration_score NUMERIC,
  league_breakdown JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(model_id, period_start, period_end)
);

-- ============================================================================
-- 7. ANALYTICS & INTELLIGENCE
-- ============================================================================

-- Analytics snapshots - periodic snapshots of system metrics
CREATE TABLE IF NOT EXISTS public.analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  total_predictions INT DEFAULT 0,
  successful_predictions INT DEFAULT 0,
  average_confidence NUMERIC,
  model_count INT DEFAULT 0,
  active_model_count INT DEFAULT 0,
  league_stats JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(snapshot_date)
);

-- Cross-league insights - cross-league analysis data
CREATE TABLE IF NOT EXISTS public.cross_league_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_a_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  league_b_id UUID NOT NULL REFERENCES public.leagues(id) ON DELETE CASCADE,
  correlation_coefficient NUMERIC CHECK (correlation_coefficient >= -1 AND correlation_coefficient <= 1),
  insight_type TEXT NOT NULL,
  insight_data JSONB,
  confidence NUMERIC,
  calculated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(league_a_id, league_b_id, insight_type)
);

-- Meta patterns - cross-league meta pattern data
CREATE TABLE IF NOT EXISTS public.meta_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_name TEXT NOT NULL,
  description TEXT,
  pattern_definition JSONB,
  effectiveness_score NUMERIC,
  discovered_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 8. MONITORING & SYSTEM HEALTH
-- ============================================================================

-- Monitoring metrics - system health and performance tracking
CREATE TABLE IF NOT EXISTS public.monitoring_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT now(),
  db_response_time NUMERIC,
  api_response_time NUMERIC,
  error_rate NUMERIC CHECK (error_rate >= 0 AND error_rate <= 1),
  active_users INT DEFAULT 0,
  jobs_queued INT DEFAULT 0,
  jobs_running INT DEFAULT 0,
  memory_usage NUMERIC,
  cpu_usage NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- System health - comprehensive system status tracking
CREATE TABLE IF NOT EXISTS public.system_health (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_timestamp TIMESTAMPTZ DEFAULT now(),
  database_status TEXT CHECK (database_status IN ('healthy', 'degraded', 'down')),
  api_status TEXT CHECK (api_status IN ('healthy', 'degraded', 'down')),
  job_processor_status TEXT CHECK (job_processor_status IN ('healthy', 'degraded', 'down')),
  last_data_sync TIMESTAMPTZ,
  last_model_update TIMESTAMPTZ,
  error_count INT DEFAULT 0,
  warning_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 9. PHASE 9 - COLLABORATIVE MARKET INTELLIGENCE
-- ============================================================================

-- Phase 9 sessions - collaborative intelligence sessions
CREATE TABLE IF NOT EXISTS public.phase9_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_name TEXT NOT NULL,
  session_type TEXT NOT NULL CHECK (session_type IN ('collaborative', 'market_integration', 'temporal_decay', 'self_improvement')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
  start_time TIMESTAMPTZ DEFAULT now(),
  end_time TIMESTAMPTZ,
  participants JSONB,
  session_data JSONB,
  results JSONB,
  created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 10. AUDIT & LOGGING TABLES
-- ============================================================================

-- Admin audit log - tracks administrative actions
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- System logs - comprehensive system logging
CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  component TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Prediction review log - tracks prediction reviews and approvals
CREATE TABLE IF NOT EXISTS public.prediction_review_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID NOT NULL REFERENCES public.predictions(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('accepted', 'rejected', 'flagged_for_review')),
  reviewer_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  previous_status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Retrain suggestion log - tracks auto-retraining suggestions
CREATE TABLE IF NOT EXISTS public.retrain_suggestion_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  window_days INT NOT NULL,
  accuracy NUMERIC,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed')),
  suggested_at TIMESTAMPTZ DEFAULT now(),
  acknowledged_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Feedback inbox - user feedback and suggestions
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_id UUID REFERENCES public.predictions(id) ON DELETE SET NULL,
  user_suggestion TEXT NOT NULL,
  submitted_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  metadata JSONB,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================================
-- 11. INDEXES
-- ============================================================================

-- Teams indexes
CREATE INDEX IF NOT EXISTS idx_teams_league_id ON public.teams(league_id);

-- Matches indexes
CREATE INDEX IF NOT EXISTS idx_matches_league_id ON public.matches(league_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON public.matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON public.matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON public.matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON public.matches(match_date DESC);

-- Schedules indexes
CREATE INDEX IF NOT EXISTS idx_schedules_match_id ON public.schedules(match_id);
CREATE INDEX IF NOT EXISTS idx_schedules_sync_status ON public.schedules(sync_status);

-- Predictions indexes
CREATE INDEX IF NOT EXISTS idx_predictions_match_id ON public.predictions(match_id);
CREATE INDEX IF NOT EXISTS idx_predictions_model_id ON public.predictions(model_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_by ON public.predictions(created_by);
CREATE INDEX IF NOT EXISTS idx_predictions_status ON public.predictions(prediction_status);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON public.predictions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_confidence ON public.predictions(confidence_score);

-- Prediction feedback indexes
CREATE INDEX IF NOT EXISTS idx_prediction_feedback_prediction_id ON public.prediction_feedback(prediction_id);
CREATE INDEX IF NOT EXISTS idx_prediction_feedback_user_id ON public.prediction_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_prediction_feedback_created_at ON public.prediction_feedback(created_at DESC);

-- Evaluation log indexes
CREATE INDEX IF NOT EXISTS idx_evaluation_log_prediction_id ON public.evaluation_log(prediction_id);
CREATE INDEX IF NOT EXISTS idx_evaluation_log_timestamp ON public.evaluation_log(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_evaluation_log_model_version ON public.evaluation_log(model_version);

-- Detected patterns indexes
CREATE INDEX IF NOT EXISTS idx_detected_patterns_match_id ON public.detected_patterns(match_id);
CREATE INDEX IF NOT EXISTS idx_detected_patterns_template_id ON public.detected_patterns(template_id);
CREATE INDEX IF NOT EXISTS idx_detected_patterns_created_by ON public.detected_patterns(created_by);

-- Team patterns indexes
CREATE INDEX IF NOT EXISTS idx_team_patterns_team_id ON public.team_patterns(team_id);
CREATE INDEX IF NOT EXISTS idx_team_patterns_created_by ON public.team_patterns(created_by);

-- Jobs indexes
CREATE INDEX IF NOT EXISTS idx_jobs_is_enabled ON public.jobs(is_enabled);
CREATE INDEX IF NOT EXISTS idx_jobs_next_run_at ON public.jobs(next_run_at);

-- Job logs indexes
CREATE INDEX IF NOT EXISTS idx_job_logs_job_id ON public.job_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_job_logs_status ON public.job_logs(status);
CREATE INDEX IF NOT EXISTS idx_job_logs_created_at ON public.job_logs(created_at DESC);

-- Model registry indexes
CREATE INDEX IF NOT EXISTS idx_model_registry_status ON public.model_registry(status);
CREATE INDEX IF NOT EXISTS idx_model_registry_model_name ON public.model_registry(model_name);

-- Model metrics indexes
CREATE INDEX IF NOT EXISTS idx_model_metrics_model_id ON public.model_metrics(model_id);
CREATE INDEX IF NOT EXISTS idx_model_metrics_period ON public.model_metrics(period_start, period_end);

-- Analytics snapshots indexes
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_snapshot_date ON public.analytics_snapshots(snapshot_date DESC);

-- Cross-league insights indexes
CREATE INDEX IF NOT EXISTS idx_cross_league_insights_leagues ON public.cross_league_insights(league_a_id, league_b_id);
CREATE INDEX IF NOT EXISTS idx_cross_league_insights_type ON public.cross_league_insights(insight_type);

-- Monitoring metrics indexes
CREATE INDEX IF NOT EXISTS idx_monitoring_metrics_timestamp ON public.monitoring_metrics(timestamp DESC);

-- Admin audit log indexes
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id ON public.admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created_at ON public.admin_audit_log(created_at DESC);

-- System logs indexes
CREATE INDEX IF NOT EXISTS idx_system_logs_component ON public.system_logs(component);
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- Prediction review log indexes
CREATE INDEX IF NOT EXISTS idx_prediction_review_log_prediction_id ON public.prediction_review_log(prediction_id);
CREATE INDEX IF NOT EXISTS idx_prediction_review_log_reviewer_id ON public.prediction_review_log(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_prediction_review_log_created_at ON public.prediction_review_log(created_at DESC);

-- Feedback indexes
CREATE INDEX IF NOT EXISTS idx_feedback_prediction_id ON public.feedback(prediction_id);
CREATE INDEX IF NOT EXISTS idx_feedback_submitted_by ON public.feedback(submitted_by);
CREATE INDEX IF NOT EXISTS idx_feedback_resolved ON public.feedback(resolved);

-- ============================================================================
-- 12. MATERIALIZED VIEWS
-- ============================================================================

-- Blocked predictions for review
CREATE OR REPLACE VIEW public.blocked_predictions_for_review AS
SELECT
  p.id as prediction_id,
  p.predicted_outcome,
  p.confidence_score,
  p.blocked_reason,
  ht.name as home_team,
  at.name as away_team,
  m.match_date,
  m.status as match_status,
  p.created_at
FROM public.predictions p
JOIN public.matches m ON p.match_id = m.id
JOIN public.teams ht ON m.home_team_id = ht.id
JOIN public.teams at ON m.away_team_id = at.id
WHERE p.overconfidence_flag = true
  AND p.prediction_status IN ('uncertain', 'blocked')
ORDER BY p.created_at DESC;

-- Model performance summary
CREATE OR REPLACE VIEW public.model_performance_summary AS
SELECT
  mr.id as model_id,
  mr.model_name,
  mr.model_version,
  mr.status,
  COUNT(p.id) as total_predictions,
  SUM(CASE WHEN p.was_correct = true THEN 1 ELSE 0 END) as correct_predictions,
  ROUND(100.0 * SUM(CASE WHEN p.was_correct = true THEN 1 ELSE 0 END) / NULLIF(COUNT(p.id), 0), 2) as accuracy_percentage,
  AVG(p.confidence_score) as avg_confidence,
  mr.created_at,
  mr.updated_at
FROM public.model_registry mr
LEFT JOIN public.predictions p ON mr.id = p.model_id
GROUP BY mr.id, mr.model_name, mr.model_version, mr.status, mr.created_at, mr.updated_at;

-- ============================================================================
-- 13. SECURITY & RBAC SETUP
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detected_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_accuracy ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_league_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meta_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phase9_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_review_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retrain_suggestion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create helper functions for security
CREATE OR REPLACE FUNCTION public.current_app_role() RETURNS TEXT AS $$
BEGIN
  RETURN current_setting('request.jwt.claims', true)::jsonb->>'role';
EXCEPTION WHEN OTHERS THEN
  RETURN 'anonymous';
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_app_role() = 'admin';
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_analyst() RETURNS BOOLEAN AS $$
BEGIN
  RETURN public.current_app_role() IN ('analyst', 'admin');
END;
$$ LANGUAGE plpgsql STABLE;

CREATE OR REPLACE FUNCTION public.is_authenticated_user() RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant default permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;
