-- WinMix TipsterHub - Audit Logging Triggers
-- Implements comprehensive audit trail for security and compliance
-- Last updated: 2025-12-05

-- ============================================================================
-- AUDIT LOGGING FUNCTIONS
-- ============================================================================

-- Function to log audit action
CREATE OR REPLACE FUNCTION public.log_audit_action(
  p_user_id UUID,
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT,
  p_details JSONB,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_audit_id UUID;
BEGIN
  INSERT INTO public.admin_audit_log (
    user_id,
    action,
    resource_type,
    resource_id,
    details,
    ip_address,
    user_agent,
    created_at
  ) VALUES (
    p_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_details,
    p_ip_address,
    p_user_agent,
    now()
  ) RETURNING id INTO v_audit_id;

  RETURN v_audit_id;
EXCEPTION WHEN OTHERS THEN
  -- Don't fail the main transaction if audit logging fails
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log system event
CREATE OR REPLACE FUNCTION public.log_system_event(
  p_component TEXT,
  p_level TEXT,
  p_message TEXT,
  p_details JSONB DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.system_logs (
    component,
    level,
    message,
    details,
    created_at
  ) VALUES (
    p_component,
    p_level,
    p_message,
    p_details,
    now()
  ) RETURNING id INTO v_log_id;

  RETURN v_log_id;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- AUDIT TRIGGERS FOR CRITICAL OPERATIONS
-- ============================================================================

-- Trigger for user profile changes
CREATE OR REPLACE FUNCTION public.audit_user_profile_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    -- Log role changes
    IF NEW.role != OLD.role THEN
      PERFORM public.log_audit_action(
        auth.uid(),
        'role_change',
        'user_profile',
        NEW.id::TEXT,
        jsonb_build_object(
          'old_role', OLD.role,
          'new_role', NEW.role,
          'email', NEW.email
        )
      );
    END IF;
    -- Log activation status changes
    IF NEW.is_active != OLD.is_active THEN
      PERFORM public.log_audit_action(
        auth.uid(),
        CASE WHEN NEW.is_active THEN 'user_activated' ELSE 'user_deactivated' END,
        'user_profile',
        NEW.id::TEXT,
        jsonb_build_object('email', NEW.email)
      );
    END IF;
  ELSIF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_action(
      NEW.id,
      'user_created',
      'user_profile',
      NEW.id::TEXT,
      jsonb_build_object(
        'email', NEW.email,
        'role', NEW.role
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_user_profile_changes
AFTER INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.audit_user_profile_changes();

-- Trigger for prediction review changes
CREATE OR REPLACE FUNCTION public.audit_prediction_review_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_action(
      NEW.reviewer_id,
      'prediction_reviewed',
      'prediction',
      NEW.prediction_id::TEXT,
      jsonb_build_object(
        'action', NEW.action,
        'notes', NEW.notes,
        'previous_status', NEW.previous_status
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_prediction_review_changes
AFTER INSERT ON public.prediction_review_log
FOR EACH ROW
EXECUTE FUNCTION public.audit_prediction_review_changes();

-- Trigger for job modifications
CREATE OR REPLACE FUNCTION public.audit_job_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_action(
      NEW.created_by,
      'job_created',
      'job',
      NEW.id::TEXT,
      jsonb_build_object(
        'name', NEW.name,
        'job_type', NEW.job_type,
        'schedule', NEW.schedule_cron
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.is_enabled != OLD.is_enabled THEN
      PERFORM public.log_audit_action(
        auth.uid(),
        CASE WHEN NEW.is_enabled THEN 'job_enabled' ELSE 'job_disabled' END,
        'job',
        NEW.id::TEXT,
        jsonb_build_object('name', NEW.name)
      );
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM public.log_audit_action(
      auth.uid(),
      'job_deleted',
      'job',
      OLD.id::TEXT,
      jsonb_build_object('name', OLD.name)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_job_changes
AFTER INSERT OR UPDATE OR DELETE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.audit_job_changes();

-- Trigger for model registry changes
CREATE OR REPLACE FUNCTION public.audit_model_changes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM public.log_audit_action(
      NEW.created_by,
      'model_registered',
      'model',
      NEW.id::TEXT,
      jsonb_build_object(
        'model_name', NEW.model_name,
        'model_version', NEW.model_version,
        'model_type', NEW.model_type
      )
    );
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.status != OLD.status THEN
      PERFORM public.log_audit_action(
        auth.uid(),
        'model_status_changed',
        'model',
        NEW.id::TEXT,
        jsonb_build_object(
          'model_name', NEW.model_name,
          'old_status', OLD.status,
          'new_status', NEW.status
        )
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER audit_model_changes
AFTER INSERT OR UPDATE ON public.model_registry
FOR EACH ROW
EXECUTE FUNCTION public.audit_model_changes();

-- ============================================================================
-- AUTO-POPULATION TRIGGERS
-- ============================================================================

-- Auto-populate created_by for predictions
CREATE OR REPLACE FUNCTION public.set_predictions_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER predictions_set_created_by
BEFORE INSERT ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION public.set_predictions_created_by();

-- Auto-populate created_by for detected_patterns
CREATE OR REPLACE FUNCTION public.set_detected_patterns_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER detected_patterns_set_created_by
BEFORE INSERT ON public.detected_patterns
FOR EACH ROW
EXECUTE FUNCTION public.set_detected_patterns_created_by();

-- Auto-populate created_by for team_patterns
CREATE OR REPLACE FUNCTION public.set_team_patterns_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER team_patterns_set_created_by
BEFORE INSERT ON public.team_patterns
FOR EACH ROW
EXECUTE FUNCTION public.set_team_patterns_created_by();

-- Auto-populate created_by for jobs
CREATE OR REPLACE FUNCTION public.set_jobs_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER jobs_set_created_by
BEFORE INSERT ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.set_jobs_created_by();

-- Auto-populate created_by for phase9_sessions
CREATE OR REPLACE FUNCTION public.set_phase9_sessions_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER phase9_sessions_set_created_by
BEFORE INSERT ON public.phase9_sessions
FOR EACH ROW
EXECUTE FUNCTION public.set_phase9_sessions_created_by();

-- Auto-populate created_by for model_registry
CREATE OR REPLACE FUNCTION public.set_model_registry_created_by()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER model_registry_set_created_by
BEFORE INSERT ON public.model_registry
FOR EACH ROW
EXECUTE FUNCTION public.set_model_registry_created_by();

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_leagues_updated_at
BEFORE UPDATE ON public.leagues
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
BEFORE UPDATE ON public.teams
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_matches_updated_at
BEFORE UPDATE ON public.matches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pattern_templates_updated_at
BEFORE UPDATE ON public.pattern_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pattern_definitions_updated_at
BEFORE UPDATE ON public.pattern_definitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON public.user_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predictions_updated_at
BEFORE UPDATE ON public.predictions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_prediction_feedback_updated_at
BEFORE UPDATE ON public.prediction_feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_patterns_updated_at
BEFORE UPDATE ON public.team_patterns
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
BEFORE UPDATE ON public.jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_model_registry_updated_at
BEFORE UPDATE ON public.model_registry
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_phase9_sessions_updated_at
BEFORE UPDATE ON public.phase9_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_retrain_suggestion_log_updated_at
BEFORE UPDATE ON public.retrain_suggestion_log
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- GRANTS FOR RLS FUNCTIONS
-- ============================================================================

GRANT EXECUTE ON FUNCTION public.log_audit_action TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.log_system_event TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.current_app_role TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_analyst TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_authenticated_user TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column TO authenticated, service_role;
