-- WinMix TipsterHub - Row Level Security Policies
-- Implements RBAC as defined in security documentation
-- Last updated: 2025-12-05

-- ============================================================================
-- LEAGUES TABLE - Public Read, Admin Modify
-- ============================================================================

CREATE POLICY "leagues_anon_read" ON public.leagues
  FOR SELECT USING (true);

CREATE POLICY "leagues_admin_all" ON public.leagues
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- TEAMS TABLE - Public Read, Admin Modify
-- ============================================================================

CREATE POLICY "teams_anon_read" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "teams_admin_all" ON public.teams
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- MATCHES TABLE - Public Read, Admin Modify
-- ============================================================================

CREATE POLICY "matches_anon_read" ON public.matches
  FOR SELECT USING (true);

CREATE POLICY "matches_admin_all" ON public.matches
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- SCHEDULES TABLE - Public Read, Admin Modify
-- ============================================================================

CREATE POLICY "schedules_anon_read" ON public.schedules
  FOR SELECT USING (true);

CREATE POLICY "schedules_admin_all" ON public.schedules
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PATTERN_TEMPLATES TABLE - Public Read, Admin Modify
-- ============================================================================

CREATE POLICY "pattern_templates_anon_read" ON public.pattern_templates
  FOR SELECT USING (is_active = true);

CREATE POLICY "pattern_templates_admin_all" ON public.pattern_templates
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PATTERN_DEFINITIONS TABLE - Analyst Read, Admin Modify
-- ============================================================================

CREATE POLICY "pattern_definitions_analyst_read" ON public.pattern_definitions
  FOR SELECT USING (public.is_analyst() AND is_active = true);

CREATE POLICY "pattern_definitions_admin_all" ON public.pattern_definitions
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- USER_PROFILES TABLE - Self Read, Admin Full
-- ============================================================================

CREATE POLICY "user_profiles_self_read" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "user_profiles_self_update" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    (auth.uid() = id AND role = (SELECT role FROM public.user_profiles WHERE id = auth.uid())) OR
    public.is_admin()
  );

CREATE POLICY "user_profiles_admin_all" ON public.user_profiles
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PREDICTIONS TABLE - Public Read, Role-based Modify
-- ============================================================================

CREATE POLICY "predictions_anon_read" ON public.predictions
  FOR SELECT USING (prediction_status != 'blocked' OR public.is_admin());

CREATE POLICY "predictions_authenticated_read" ON public.predictions
  FOR SELECT USING (
    public.is_authenticated_user() OR prediction_status != 'blocked'
  );

CREATE POLICY "predictions_analyst_create" ON public.predictions
  FOR INSERT WITH CHECK (
    public.is_analyst() OR (created_by = auth.uid() AND public.is_authenticated_user())
  );

CREATE POLICY "predictions_analyst_modify" ON public.predictions
  FOR UPDATE USING (public.is_analyst() OR created_by = auth.uid())
  WITH CHECK (public.is_analyst() OR created_by = auth.uid());

CREATE POLICY "predictions_admin_all" ON public.predictions
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "predictions_service_insert" ON public.predictions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "predictions_service_update" ON public.predictions
  FOR UPDATE USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PREDICTION_FEEDBACK TABLE - User Feedback
-- ============================================================================

CREATE POLICY "prediction_feedback_user_create" ON public.prediction_feedback
  FOR INSERT WITH CHECK (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "prediction_feedback_user_read" ON public.prediction_feedback
  FOR SELECT USING (
    user_id = auth.uid() OR
    public.is_analyst() OR
    public.is_admin()
  );

CREATE POLICY "prediction_feedback_analyst_read_all" ON public.prediction_feedback
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "prediction_feedback_admin_all" ON public.prediction_feedback
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- EVALUATION_LOG TABLE - Service and Analyst Access
-- ============================================================================

CREATE POLICY "evaluation_log_service_all" ON public.evaluation_log
  FOR ALL USING (true)
  WITH CHECK (true);

CREATE POLICY "evaluation_log_analyst_read" ON public.evaluation_log
  FOR SELECT USING (public.is_analyst());

-- ============================================================================
-- DETECTED_PATTERNS TABLE - User-owned Data
-- ============================================================================

CREATE POLICY "detected_patterns_user_read" ON public.detected_patterns
  FOR SELECT USING (
    created_by = auth.uid() OR
    public.is_analyst() OR
    public.is_admin()
  );

CREATE POLICY "detected_patterns_user_create" ON public.detected_patterns
  FOR INSERT WITH CHECK (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "detected_patterns_user_modify" ON public.detected_patterns
  FOR UPDATE USING (created_by = auth.uid() OR public.is_admin())
  WITH CHECK (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "detected_patterns_admin_all" ON public.detected_patterns
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- TEAM_PATTERNS TABLE - User-owned Data
-- ============================================================================

CREATE POLICY "team_patterns_user_read" ON public.team_patterns
  FOR SELECT USING (
    created_by = auth.uid() OR
    public.is_analyst() OR
    public.is_admin()
  );

CREATE POLICY "team_patterns_user_create" ON public.team_patterns
  FOR INSERT WITH CHECK (created_by = auth.uid() OR public.is_admin());

CREATE POLICY "team_patterns_analyst_modify" ON public.team_patterns
  FOR UPDATE USING (public.is_analyst() OR public.is_admin())
  WITH CHECK (public.is_analyst() OR public.is_admin());

CREATE POLICY "team_patterns_admin_all" ON public.team_patterns
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- PATTERN_ACCURACY TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "pattern_accuracy_analyst_read" ON public.pattern_accuracy
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "pattern_accuracy_service_all" ON public.pattern_accuracy
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- JOBS TABLE - Analyst Access
-- ============================================================================

CREATE POLICY "jobs_analyst_read" ON public.jobs
  FOR SELECT USING (public.is_analyst());

CREATE POLICY "jobs_analyst_create" ON public.jobs
  FOR INSERT WITH CHECK (public.is_analyst());

CREATE POLICY "jobs_analyst_modify" ON public.jobs
  FOR UPDATE USING (public.is_analyst())
  WITH CHECK (public.is_analyst());

CREATE POLICY "jobs_admin_all" ON public.jobs
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "jobs_service_all" ON public.jobs
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- JOB_LOGS TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "job_logs_analyst_read" ON public.job_logs
  FOR SELECT USING (public.is_analyst());

CREATE POLICY "job_logs_admin_all" ON public.job_logs
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "job_logs_service_all" ON public.job_logs
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- MODEL_REGISTRY TABLE - Analyst Read, Admin Modify
-- ============================================================================

CREATE POLICY "model_registry_analyst_read" ON public.model_registry
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "model_registry_authenticated_read" ON public.model_registry
  FOR SELECT USING (public.is_authenticated_user());

CREATE POLICY "model_registry_admin_all" ON public.model_registry
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "model_registry_service_all" ON public.model_registry
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- MODEL_METRICS TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "model_metrics_analyst_read" ON public.model_metrics
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "model_metrics_authenticated_read" ON public.model_metrics
  FOR SELECT USING (public.is_authenticated_user());

CREATE POLICY "model_metrics_admin_all" ON public.model_metrics
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "model_metrics_service_all" ON public.model_metrics
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- ANALYTICS_SNAPSHOTS TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "analytics_snapshots_analyst_read" ON public.analytics_snapshots
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "analytics_snapshots_admin_all" ON public.analytics_snapshots
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "analytics_snapshots_service_all" ON public.analytics_snapshots
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CROSS_LEAGUE_INSIGHTS TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "cross_league_insights_analyst_read" ON public.cross_league_insights
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "cross_league_insights_admin_all" ON public.cross_league_insights
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "cross_league_insights_service_all" ON public.cross_league_insights
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- META_PATTERNS TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "meta_patterns_analyst_read" ON public.meta_patterns
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "meta_patterns_admin_all" ON public.meta_patterns
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "meta_patterns_service_all" ON public.meta_patterns
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- MONITORING_METRICS TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "monitoring_metrics_analyst_read" ON public.monitoring_metrics
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "monitoring_metrics_admin_all" ON public.monitoring_metrics
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "monitoring_metrics_service_all" ON public.monitoring_metrics
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- SYSTEM_HEALTH TABLE - Analyst Read, Service Modify
-- ============================================================================

CREATE POLICY "system_health_analyst_read" ON public.system_health
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "system_health_admin_all" ON public.system_health
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "system_health_service_all" ON public.system_health
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PHASE9_SESSIONS TABLE - Analyst Access
-- ============================================================================

CREATE POLICY "phase9_sessions_analyst_read" ON public.phase9_sessions
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "phase9_sessions_analyst_create" ON public.phase9_sessions
  FOR INSERT WITH CHECK (public.is_analyst());

CREATE POLICY "phase9_sessions_analyst_modify" ON public.phase9_sessions
  FOR UPDATE USING (public.is_analyst() OR created_by = auth.uid())
  WITH CHECK (public.is_analyst());

CREATE POLICY "phase9_sessions_admin_all" ON public.phase9_sessions
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ============================================================================
-- ADMIN_AUDIT_LOG TABLE - Admin Access
-- ============================================================================

CREATE POLICY "admin_audit_log_admin_read" ON public.admin_audit_log
  FOR SELECT USING (public.is_admin());

CREATE POLICY "admin_audit_log_analyst_read" ON public.admin_audit_log
  FOR SELECT USING (public.is_analyst());

CREATE POLICY "admin_audit_log_service_all" ON public.admin_audit_log
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- SYSTEM_LOGS TABLE - Service Write, Admin/Analyst Read
-- ============================================================================

CREATE POLICY "system_logs_service_insert" ON public.system_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "system_logs_admin_read" ON public.system_logs
  FOR SELECT USING (public.is_admin());

CREATE POLICY "system_logs_analyst_read" ON public.system_logs
  FOR SELECT USING (public.is_analyst());

-- ============================================================================
-- PREDICTION_REVIEW_LOG TABLE
-- ============================================================================

CREATE POLICY "prediction_review_log_admin_all" ON public.prediction_review_log
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "prediction_review_log_analyst_read" ON public.prediction_review_log
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "prediction_review_log_service_all" ON public.prediction_review_log
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- RETRAIN_SUGGESTION_LOG TABLE
-- ============================================================================

CREATE POLICY "retrain_suggestion_log_admin_all" ON public.retrain_suggestion_log
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "retrain_suggestion_log_analyst_read" ON public.retrain_suggestion_log
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

CREATE POLICY "retrain_suggestion_log_service_all" ON public.retrain_suggestion_log
  FOR ALL USING (true)
  WITH CHECK (true);

-- ============================================================================
-- FEEDBACK TABLE - User Feedback Management
-- ============================================================================

CREATE POLICY "feedback_user_create" ON public.feedback
  FOR INSERT WITH CHECK (submitted_by = auth.uid() OR public.is_admin());

CREATE POLICY "feedback_user_read_own" ON public.feedback
  FOR SELECT USING (submitted_by = auth.uid());

CREATE POLICY "feedback_admin_all" ON public.feedback
  FOR ALL USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "feedback_analyst_read" ON public.feedback
  FOR SELECT USING (public.is_analyst() OR public.is_admin());

-- ============================================================================
-- FORCE ROW LEVEL SECURITY - Prevent bypass by superuser
-- ============================================================================

ALTER TABLE public.leagues FORCE ROW LEVEL SECURITY;
ALTER TABLE public.teams FORCE ROW LEVEL SECURITY;
ALTER TABLE public.matches FORCE ROW LEVEL SECURITY;
ALTER TABLE public.schedules FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_templates FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_definitions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.predictions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_feedback FORCE ROW LEVEL SECURITY;
ALTER TABLE public.evaluation_log FORCE ROW LEVEL SECURITY;
ALTER TABLE public.detected_patterns FORCE ROW LEVEL SECURITY;
ALTER TABLE public.team_patterns FORCE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_accuracy FORCE ROW LEVEL SECURITY;
ALTER TABLE public.jobs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.model_registry FORCE ROW LEVEL SECURITY;
ALTER TABLE public.model_metrics FORCE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_snapshots FORCE ROW LEVEL SECURITY;
ALTER TABLE public.cross_league_insights FORCE ROW LEVEL SECURITY;
ALTER TABLE public.meta_patterns FORCE ROW LEVEL SECURITY;
ALTER TABLE public.monitoring_metrics FORCE ROW LEVEL SECURITY;
ALTER TABLE public.system_health FORCE ROW LEVEL SECURITY;
ALTER TABLE public.phase9_sessions FORCE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_log FORCE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs FORCE ROW LEVEL SECURITY;
ALTER TABLE public.prediction_review_log FORCE ROW LEVEL SECURITY;
ALTER TABLE public.retrain_suggestion_log FORCE ROW LEVEL SECURITY;
ALTER TABLE public.feedback FORCE ROW LEVEL SECURITY;
