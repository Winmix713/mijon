/**
 * Supabase Database Types
 * Auto-generated types for all tables and functions
 * Generated from: supabase gen types typescript
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      leagues: {
        Row: {
          id: string;
          name: string;
          country: string;
          season: string;
          home_win_percentage: number | null;
          avg_goals_per_match: number | null;
          btts_percentage: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          country: string;
          season: string;
          home_win_percentage?: number | null;
          avg_goals_per_match?: number | null;
          btts_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          country?: string;
          season?: string;
          home_win_percentage?: number | null;
          avg_goals_per_match?: number | null;
          btts_percentage?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          league_id: string;
          name: string;
          abbreviation: string | null;
          founded_year: number | null;
          city: string | null;
          stadium: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          name: string;
          abbreviation?: string | null;
          founded_year?: number | null;
          city?: string | null;
          stadium?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string;
          name?: string;
          abbreviation?: string | null;
          founded_year?: number | null;
          city?: string | null;
          stadium?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      matches: {
        Row: {
          id: string;
          league_id: string;
          home_team_id: string;
          away_team_id: string;
          match_date: string;
          status: string;
          home_score: number | null;
          away_score: number | null;
          halftime_home_score: number | null;
          halftime_away_score: number | null;
          possession_home: number | null;
          possession_away: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          league_id: string;
          home_team_id: string;
          away_team_id: string;
          match_date: string;
          status?: string;
          home_score?: number | null;
          away_score?: number | null;
          halftime_home_score?: number | null;
          halftime_away_score?: number | null;
          possession_home?: number | null;
          possession_away?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          league_id?: string;
          home_team_id?: string;
          away_team_id?: string;
          match_date?: string;
          status?: string;
          home_score?: number | null;
          away_score?: number | null;
          halftime_home_score?: number | null;
          halftime_away_score?: number | null;
          possession_home?: number | null;
          possession_away?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      predictions: {
        Row: {
          id: string;
          match_id: string;
          predicted_outcome: string;
          confidence_score: number;
          predicted_home_score: number | null;
          predicted_away_score: number | null;
          btts_prediction: boolean | null;
          over_under_prediction: string | null;
          actual_outcome: string | null;
          was_correct: boolean | null;
          calibration_error: number | null;
          css_score: number | null;
          prediction_factors: Json | null;
          model_id: string | null;
          model_name: string | null;
          model_version: string | null;
          is_shadow_mode: boolean;
          overconfidence_flag: boolean;
          downgraded_from_confidence: number | null;
          prediction_status: string;
          blocked_reason: string | null;
          alternate_outcome: string | null;
          blocked_at: string | null;
          reviewed_by: string | null;
          created_at: string;
          evaluated_at: string | null;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          match_id: string;
          predicted_outcome: string;
          confidence_score: number;
          predicted_home_score?: number | null;
          predicted_away_score?: number | null;
          btts_prediction?: boolean | null;
          over_under_prediction?: string | null;
          actual_outcome?: string | null;
          was_correct?: boolean | null;
          calibration_error?: number | null;
          css_score?: number | null;
          prediction_factors?: Json | null;
          model_id?: string | null;
          model_name?: string | null;
          model_version?: string | null;
          is_shadow_mode?: boolean;
          overconfidence_flag?: boolean;
          downgraded_from_confidence?: number | null;
          prediction_status?: string;
          blocked_reason?: string | null;
          alternate_outcome?: string | null;
          blocked_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          evaluated_at?: string | null;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          match_id?: string;
          predicted_outcome?: string;
          confidence_score?: number;
          predicted_home_score?: number | null;
          predicted_away_score?: number | null;
          btts_prediction?: boolean | null;
          over_under_prediction?: string | null;
          actual_outcome?: string | null;
          was_correct?: boolean | null;
          calibration_error?: number | null;
          css_score?: number | null;
          prediction_factors?: Json | null;
          model_id?: string | null;
          model_name?: string | null;
          model_version?: string | null;
          is_shadow_mode?: boolean;
          overconfidence_flag?: boolean;
          downgraded_from_confidence?: number | null;
          prediction_status?: string;
          blocked_reason?: string | null;
          alternate_outcome?: string | null;
          blocked_at?: string | null;
          reviewed_by?: string | null;
          created_at?: string;
          evaluated_at?: string | null;
          created_by?: string | null;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      jobs: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          job_type: string;
          schedule_cron: string;
          is_enabled: boolean;
          last_run_at: string | null;
          next_run_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          job_type: string;
          schedule_cron: string;
          is_enabled?: boolean;
          last_run_at?: string | null;
          next_run_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          job_type?: string;
          schedule_cron?: string;
          is_enabled?: boolean;
          last_run_at?: string | null;
          next_run_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      job_logs: {
        Row: {
          id: string;
          job_id: string;
          status: string;
          started_at: string | null;
          completed_at: string | null;
          error_message: string | null;
          execution_ms: number | null;
          output_summary: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          job_id: string;
          status: string;
          started_at?: string | null;
          completed_at?: string | null;
          error_message?: string | null;
          execution_ms?: number | null;
          output_summary?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          job_id?: string;
          status?: string;
          started_at?: string | null;
          completed_at?: string | null;
          error_message?: string | null;
          execution_ms?: number | null;
          output_summary?: Json | null;
          created_at?: string;
        };
      };
      model_registry: {
        Row: {
          id: string;
          model_name: string;
          model_version: string;
          status: string;
          model_type: string;
          description: string | null;
          git_commit_hash: string | null;
          trained_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          model_name: string;
          model_version: string;
          status?: string;
          model_type: string;
          description?: string | null;
          git_commit_hash?: string | null;
          trained_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          model_name?: string;
          model_version?: string;
          status?: string;
          model_type?: string;
          description?: string | null;
          git_commit_hash?: string | null;
          trained_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      model_metrics: {
        Row: {
          id: string;
          model_id: string;
          period_start: string;
          period_end: string;
          total_predictions: number;
          accuracy_overall: number | null;
          accuracy_winner: number | null;
          accuracy_btts: number | null;
          precision: number | null;
          recall: number | null;
          f1_score: number | null;
          confidence_calibration_score: number | null;
          league_breakdown: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          model_id: string;
          period_start: string;
          period_end: string;
          total_predictions?: number;
          accuracy_overall?: number | null;
          accuracy_winner?: number | null;
          accuracy_btts?: number | null;
          precision?: number | null;
          recall?: number | null;
          f1_score?: number | null;
          confidence_calibration_score?: number | null;
          league_breakdown?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          model_id?: string;
          period_start?: string;
          period_end?: string;
          total_predictions?: number;
          accuracy_overall?: number | null;
          accuracy_winner?: number | null;
          accuracy_btts?: number | null;
          precision?: number | null;
          recall?: number | null;
          f1_score?: number | null;
          confidence_calibration_score?: number | null;
          league_breakdown?: Json | null;
          created_at?: string;
        };
      };
      admin_audit_log: {
        Row: {
          id: string;
          user_id: string;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          details: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      system_logs: {
        Row: {
          id: string;
          component: string;
          level: string;
          message: string;
          details: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          component: string;
          level: string;
          message: string;
          details?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          component?: string;
          level?: string;
          message?: string;
          details?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_app_role: {
        Args: Record<PropertyKey, never>;
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_analyst: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_authenticated_user: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      log_audit_action: {
        Args: {
          p_user_id: string;
          p_action: string;
          p_resource_type: string;
          p_resource_id: string;
          p_details: Json;
          p_ip_address?: string;
          p_user_agent?: string;
        };
        Returns: string;
      };
      log_system_event: {
        Args: {
          p_component: string;
          p_level: string;
          p_message: string;
          p_details?: Json;
        };
        Returns: string;
      };
    };
    Enums: Record<PropertyKey, never>;
    CompositeTypes: Record<PropertyKey, never>;
  };
}
