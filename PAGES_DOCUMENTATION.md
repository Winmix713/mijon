# WinMix TipsterHub - Pages Documentation

## Overview

This comprehensive documentation covers all pages in the `src/pages/` directory of the WinMix TipsterHub application. Each page is documented with its purpose, main functions, components, state management, API integrations, and user flow.

---

## Table of Contents

1. [Public Pages](#public-pages)
2. [Prediction Pages](#prediction-pages)
3. [Data Explorer Pages](#data-explorer-pages)
4. [Analytics & Monitoring](#analytics--monitoring)
5. [Admin Pages](#admin-pages)
6. [WinmixPro Pages](#winmixpro-pages)
7. [Authentication Pages](#authentication-pages)
8. [Error Pages](#error-pages)

---

## Public Pages

### Index.tsx

**Page Name & Purpose:**
- Landing/home page for WinMix TipsterHub
- Serves as the entry point for the application
- Displays hero section with call-to-action for creating new predictions

**Key Features & Responsibilities:**
- Display branded hero section with welcome message
- Show value proposition of AI predictions
- Provide navigation to core features
- Responsive layout with sidebar and topbar

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `HeroSection`, `Footer`, `Button`
- Hooks: `useDocumentTitle`, `useNavigate`

**State Management:**
- No Zustand stores used; simple routing state via React Router

**API Integrations & Services:**
- None (purely UI/navigation)

**Important Logic & User Flow:**
1. User lands on home page
2. Hero section displays with CTA button
3. User clicks "Új predikciók készítése" (Create new predictions) button
4. Navigation to `/predictions/new` flow

---

## Prediction Pages

### NewPredictions.tsx

**Page Name & Purpose:**
- Wrapper page for the match selection and prediction creation flow
- Entry point for creating new AI predictions on 8 matches

**Key Features & Responsibilities:**
- Render `MatchSelection` component
- Provide layout with sidebar and topbar
- Serve as container for prediction workflow

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `MatchSelection`, `Footer`
- Hooks: None

**State Management:**
- None at page level; `MatchSelection` component manages internal state

**API Integrations & Services:**
- Delegated to `MatchSelection` component

**Important Logic & User Flow:**
1. User navigates to `/predictions/new`
2. Page displays match selection interface
3. User selects 8 matches
4. Predictions are generated via `MatchSelection` component

---

### PredictionsView.tsx

**Page Name & Purpose:**
- Display list of recent predictions (up to 25)
- Allow users to browse and refresh predictions
- Provide navigation to create new predictions

**Key Features & Responsibilities:**
- Fetch recent predictions from Supabase
- Format prediction data with match details
- Display recent predictions using `RecentPredictions` component
- Support manual refresh of prediction list
- Show error states appropriately

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `Footer`, `RecentPredictions`, `Button`, `Alert`
- Hooks: `useEffect`, `useState`, `useNavigate`

**State Management:**
- Local state: `loading`, `predictions`, `error`
- No Zustand stores

**API Integrations & Services:**
- Supabase query: `predictions` table with joined match and team data
- Fetches: `id`, `predicted_outcome`, `confidence_score`, `actual_outcome`, `was_correct`
- Includes nested relations: `matches` → `teams`, `leagues`

**Important Logic & User Flow:**
1. Component mounts → fetch predictions on `/predictions` route
2. Data is transformed from database format to UI format
3. User can click refresh button to reload list
4. User can navigate to create new predictions
5. Error states are displayed to user

---

### MatchDetail.tsx

**Page Name & Purpose:**
- Show detailed information about a specific match
- Display existing predictions or allow analysis
- Show pattern matching results
- Collect feedback on prediction accuracy

**Key Features & Responsibilities:**
- Fetch match details by ID from route params
- Display match information (teams, league, date, score)
- Invoke AI analysis via edge function
- Display prediction with confidence score
- Show pattern matching templates used
- Collect actual outcome feedback for model evaluation

**Used Components & Hooks:**
- Components: `Button`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `Badge`, `Alert`, `PredictionDisplay`, `FeedbackForm`
- Hooks: `useParams`, `useNavigate`, `useState`, `useEffect`, `useCallback`

**State Management:**
- Local state: `match`, `prediction`, `patterns`, `formScores`, `loading`, `analyzing`, `error`
- No Zustand stores

**API Integrations & Services:**
- Supabase: Fetch match details with joined relationships
- Supabase Edge Function: `analyze-match` (returns prediction, patterns, form scores)
- Handles match status: `scheduled` vs `finished`

**Important Logic & User Flow:**
1. User navigates to `/matches/:id`
2. Match data is fetched with team and league info
3. If prediction exists, display it with patterns
4. If no prediction for scheduled match, show "Analyze" button
5. User clicks "Analyze" to trigger AI pattern detection
6. For finished matches, show feedback form to collect actual outcome
7. Display prediction accuracy badge (correct/incorrect)

---

### MatchesPage.tsx

**Page Name & Purpose:**
- Admin/analyst interface for match management (CRUD)
- Import/export matches in bulk
- View all matches with filtering
- Create, edit, delete match records

**Key Features & Responsibilities:**
- List all matches with pagination and filtering
- Create new match records via dialog form
- Edit existing match details
- Delete matches with confirmation
- Import matches from CSV
- Export matches to CSV
- Filter by league, team, status, date range
- Manage match scores and metadata

**Used Components & Hooks:**
- Components: `AuthGate`, `Button`, `Card`, `Input`, `Select`, `Badge`, `Dialog`, `Table`, `Textarea`, `PageLayout`, `PageHeader`
- Hooks: `useState`, `useMemo`, `useQuery`, `useMutation`, `useQueryClient`, `useDocumentTitle`

**State Management:**
- Local state: `isCreateDialogOpen`, `isEditDialogOpen`, `isImportDialogOpen`, `selectedMatch`, `searchTerm`, `selectedLeague`, `showInactive`
- Query state: `useQuery` for fetches, `useMutation` for operations
- No Zustand stores

**API Integrations & Services:**
- Supabase: CRUD operations on `matches` table
- Related data: `leagues`, `teams` (joined relations)
- Functions: `fetchMatches`, `fetchLeagues`, `fetchTeams`, `createMatch`, `updateMatch`, `deleteMatch`, `importMatchesFromCSV`, `exportMatchesToCSV`

**Important Logic & User Flow:**
1. Page loads and displays all matches in table
2. User can filter by league, team, status, dates
3. User can create new match via "+" button
4. User can edit match details by clicking row
5. User can delete match with confirmation
6. User can import matches from CSV file
7. User can export current filtered matches as CSV
8. Search functionality filters by team names

---

## Data Explorer Pages

### Leagues.tsx

**Page Name & Purpose:**
- View league standings and information
- Browse multiple leagues (English, Spanish currently)
- Display league tables with team statistics

**Key Features & Responsibilities:**
- Display league standings table
- Allow selection between different leagues
- Show team statistics: position, matches, wins, draws, losses, points
- Responsive table layout

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `Trophy` icon
- Hooks: `useState`

**State Management:**
- Local state: `league` (selected league: "angol" or "spanyol")
- No Zustand stores; mock data (hardcoded standings)

**API Integrations & Services:**
- None; uses mock data hardcoded in component

**Important Logic & User Flow:**
1. User navigates to `/leagues`
2. Default league (English) is shown
3. User can toggle between English and Spanish leagues
4. Table displays standings with detailed statistics

---

### Teams.tsx

**Page Name & Purpose:**
- Browse teams and their statistics
- Filter teams by league
- View team performance metrics and recent form

**Key Features & Responsibilities:**
- Generate mock team statistics
- Allow league selection
- Display team statistics table
- Show form history (W/D/L)
- Calculate form score based on recent matches

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `TeamStatisticsTable`, `Users` icon
- Hooks: `useState`

**State Management:**
- Local state: `league` (selected league)
- No Zustand stores; mock data generation

**API Integrations & Services:**
- None; generates mock data per league

**Important Logic & User Flow:**
1. User navigates to `/teams`
2. Default English league shown
3. User can switch leagues via toggle buttons
4. Team statistics displayed with form scores calculated

---

### TeamDetail.tsx

**Page Name & Purpose:**
- Display comprehensive team analysis and statistics
- Show team performance across multiple dimensions
- Display head-to-head statistics
- Show pattern analysis and transition matrices

**Key Features & Responsibilities:**
- Render team information: league, form, detailed stats
- Display attack, defense, midfield performance
- Show detailed statistics by category
- Display narrative analysis sections
- Show pattern matching templates
- Render streak analysis and transition matrix
- Calculate Poisson distribution for goals

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `Button`, `StatCard`, `CSSBadge`, `NarrativeSection`, `TeamPatternsSection`, `StreakAnalysis`, `TransitionMatrixHeatmap`
- Hooks: `useParams`, `useNavigate`

**State Management:**
- No Zustand stores; mock team data in component

**API Integrations & Services:**
- Local library functions: `getMatchHistory`, `generateTeamStatistics`, `calculateHeadToHeadStats`, `predictWinner`, `calculatePoissonGoals`
- No database calls

**Important Logic & User Flow:**
1. User navigates to `/teams/:teamname`
2. Team data is loaded from mock data
3. All statistics and patterns are calculated/displayed
4. Narrative sections provide insights
5. User can explore patterns and form

---

### CrossLeague.tsx

**Page Name & Purpose:**
- Analyze cross-league patterns and correlations
- Display league comparison metrics
- Show meta-patterns discovered across leagues
- Compare league characteristics via radar charts and heatmaps

**Key Features & Responsibilities:**
- Allow selection of multiple leagues for comparison
- Fetch metrics for selected leagues (goals, home advantage, balance, predictability, physicality)
- Display league comparison radar chart
- Show correlation heatmap between leagues
- List discovered meta-patterns with evidence strength
- Support copying of league selections and data

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `Badge`, `Button`, `Card`, `CopyButton`, `LeagueComparisonRadarChart`, `CorrelationHeatmap`
- Hooks: `useEffect`, `useMemo`, `useState`, `useQuery`

**State Management:**
- Local state: `selected` (selected league IDs)
- Query state: `analyzeQuery`, `heatmapQuery`, `metaPatternsQuery` via TanStack Query
- No Zustand stores

**API Integrations & Services:**
- Supabase Edge Functions:
  - `cross-league-analyze`: Returns metrics for leagues (goals, home_adv, balance, predictability, physicality)
  - `cross-league-correlations`: Returns correlation matrix between leagues
  - `meta-patterns-discover`: Returns discovered meta-patterns with evidence

**Important Logic & User Flow:**
1. User navigates to `/cross-league`
2. Page loads available leagues
3. Default: first 2 leagues selected
4. User can toggle league selection via badges
5. Radar chart and heatmap auto-update
6. Meta-patterns displayed below
7. User can copy selections or export correlations data

---

## Analytics & Monitoring

### Dashboard.tsx

**Page Name & Purpose:**
- Main user dashboard showing prediction performance overview
- Display key metrics and recent predictions
- Show pattern performance trends
- Track winning streaks and accuracy

**Key Features & Responsibilities:**
- Fetch and display prediction statistics
- Calculate accuracy percentage
- Identify winning streaks
- Analyze pattern performance
- Display top patterns by accuracy
- Show recent 10 predictions
- Calculate pattern accuracy rates

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `StatisticsCards`, `RecentPredictions`, `PatternPerformanceChart`, `Skeleton`
- Hooks: `useEffect`, `useState`

**State Management:**
- Local state: `loading`, `predictions`, `patternData`, `stats` (totalPredictions, accuracy, topPattern, winningStreak)
- No Zustand stores

**API Integrations & Services:**
- Supabase queries:
  - Fetch recent predictions with match details
  - Calculate all predictions statistics
  - Fetch pattern accuracy data
  - Compute accuracy rate, winning streaks

**Important Logic & User Flow:**
1. User navigates to `/dashboard`
2. Page loads all prediction and pattern data
3. Statistics are calculated (accuracy, streaks)
4. Dashboard displays cards with key metrics
5. Recent predictions shown in grid
6. Pattern performance chart displayed

---

### Analytics.tsx

**Page Name & Purpose:**
- Long-term model performance analytics
- Display prediction accuracy over time
- Show calibration errors
- Analyze performance by prediction type

**Key Features & Responsibilities:**
- Fetch 30-day prediction history
- Group predictions by date
- Calculate daily accuracy rates
- Analyze performance by outcome type (home_win, draw, away_win)
- Calculate calibration error (|p - y|)
- Display performance chart with date range
- Export summary and JSON data

**Used Components & Hooks:**
- Components: `PageLayout`, `PageHeader`, `Card`, `ModelPerformanceChart`, `CopyButton`, `Skeleton`
- Hooks: `useEffect`, `useState`, `useMemo`, `useDocumentTitle`

**State Management:**
- Local state: `loading`, `points` (performance data), `summary` (total, accuracy, avgCalibrationError), `cssScoreCount`
- No Zustand stores

**API Integrations & Services:**
- Supabase: Fetch predictions with `css_score` from last 30 days
- Data processed: `created_at`, `predicted_outcome`, `confidence_score`, `css_score`, `was_correct`

**Important Logic & User Flow:**
1. User navigates to `/analytics`
2. Fetches last 30 days of predictions
3. Groups by date and calculates performance metrics
4. Displays summary cards with totals
5. Shows performance chart over time
6. User can copy summary or export JSON
7. Calibration metrics displayed for model evaluation

---

### MonitoringPage.tsx

**Page Name & Purpose:**
- Real-time system health and performance monitoring
- Display computation graph and system metrics
- Show alerts and system warnings
- Monitor retraining status and suggestions

**Key Features & Responsibilities:**
- Display system health status for all components
- Show performance metrics (latency p50, p95, p99)
- Render computation map (node graph)
- Display active alerts and warnings
- Show latest retraining run status
- Display pending retrain suggestions
- Support filtering by component

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `AuthGate`, `Button`, `Card`, `Select`, `Badge`, `Progress`, `Table`, `SystemHealthCard`, `PerformanceMetricsChart`, `ComputationMapDashboard`, `PredictionDecayCard`, `PredictionConfidenceChart`, `Skeleton`
- Hooks: `useEffect`, `useMemo`, `useState`, `useQuery`, `useMutation`

**State Management:**
- Query state: `useHealth`, `useGraph`, `useAlerts`, `useMetrics`, `useLatestRetrainingRun`, `useLatestRetrainSuggestion` via TanStack Query
- Local state: `None significant`
- No Zustand stores

**API Integrations & Services:**
- Supabase Edge Functions:
  - `monitoring-health`: System health status
  - `monitoring-computation-graph`: Computation graph/DAG
  - `monitoring-alerts`: Active system alerts
  - `monitoring-metrics`: Performance metrics (latency, throughput)
- Supabase tables: `model_retraining_runs`, `retrain_suggestion_log`

**Important Logic & User Flow:**
1. User navigates to `/monitoring`
2. Auto-refresh queries at intervals (15-60s)
3. System health cards displayed in grid
4. Performance metrics chart with component filter
5. Computation map rendered below
6. Latest retraining status shown
7. Pending retrain suggestions displayed

---

## Admin Pages

### admin/AdminDashboard.tsx

**Page Name & Purpose:**
- High-level admin overview dashboard
- Quick access to admin features and system status
- Display key system metrics and status indicators

**Key Features & Responsibilities:**
- Display category cards for admin sections
- Show key metrics: users count, models count, matches count
- Display running jobs count
- Show Phase 9 settings status
- Filter cards by user role
- Provide quick links to admin pages

**Used Components & Hooks:**
- Components: `AdminLayout`, `CategoryCard`
- Hooks: `useMemo`, `useQueries`, `useJobs`, `usePhase9Settings`, `useAuth`

**State Management:**
- Query state: `useQueries` for counts, `useJobs`, `usePhase9Settings`
- Local state: None
- No Zustand stores

**API Integrations & Services:**
- Supabase: Count queries on tables (`user_profiles`, `models`, `matches`)
- Custom hooks: `useJobs`, `usePhase9Settings`, `useAuth`

**Important Logic & User Flow:**
1. Admin navigates to `/admin`
2. Page queries system metrics
3. Displays category cards with counts
4. Cards are role-filtered
5. User can click cards to navigate to admin sections

---

### admin/HealthDashboard.tsx

**Page Name & Purpose:**
- Detailed system health monitoring dashboard
- Display component status and performance metrics
- Filter metrics by specific components

**Key Features & Responsibilities:**
- Display health status cards for each component
- Show performance metrics (latency percentiles)
- Allow filtering by component
- Refresh metrics manually
- Display trend indicators

**Used Components & Hooks:**
- Components: `AdminLayout`, `RoleGate`, `Button`, `Card`, `Select`, `SystemHealthCard`, `PerformanceMetricsChart`
- Hooks: `useMemo`, `useState`, `useQuery`

**State Management:**
- Query state: `useHealth`, `useMetrics`
- Local state: `selectedComponent`
- No Zustand stores

**API Integrations & Services:**
- Supabase Edge Functions: `monitoring-health`, `monitoring-metrics`

**Important Logic & User Flow:**
1. Admin navigates to `/admin/health`
2. Queries system health and metrics
3. Displays component health cards
4. User can select component to filter metrics
5. Performance chart updates on selection
6. Manual refresh button available

---

### admin/IntegrationsPage.tsx

**Page Name & Purpose:**
- Configuration and status management for external integrations
- Display integration requirements and setup status
- Test integrations (e.g., Sentry error reporting)

**Key Features & Responsibilities:**
- List all configured integrations (GitHub, Slack, Linear, etc.)
- Show integration status (configured, partial, missing)
- Display required environment variables
- Show frontend environment keys
- Provide documentation links
- Allow testing of integrations (e.g., Sentry test error)

**Used Components & Hooks:**
- Components: `AdminLayout`, `Badge`, `Card`, `Button`, `Alert`, `Badge`
- Hooks: `useMemo`, `useQuery`

**State Management:**
- Query state: `useQuery` for environment variables
- No Zustand stores

**API Integrations & Services:**
- Supabase: `environment_variables_safe` table
- Helper functions: `isSentryEnabled()`, `isCloudflareBeaconEnabled()`
- Sentry integration test

**Important Logic & User Flow:**
1. Admin navigates to `/admin/integrations`
2. Page loads environment variables
3. Checks status of each integration
4. Displays configuration cards with required keys
5. User can click docs link or test button
6. Sentry can send test error if enabled

---

### admin/ModelStatusDashboard.tsx

**Page Name & Purpose:**
- ML model management and control center
- Display active models and training status
- Manage model promotion (challenger → champion)
- View analytics and data configuration

**Key Features & Responsibilities:**
- Display active model status card
- Show model registry with all models
- Trigger model retraining
- Promote models from challenger to champion
- View system logs and analytics
- Configure data sources
- Display system status overview

**Used Components & Hooks:**
- Components: `Card`, `Tabs`, `Button`, `Loader2`, `Alert`, `ModelStatusCard`, `SystemLogTable`, `ModelRegistryTable`, `AnalyticsPanel`, `DataConfigurationPanel`
- Hooks: `useMemo`, `useState`, `useQuery`, `useMutation`, `useQueryClient`, `useToast`

**State Management:**
- Query state: `useModelRegistry`, `useQuery` for system status and analytics
- Mutation state: `promoteModelMutation`, `triggerTrainingMutation`
- Local state: `isTraining`, `promotingModelId`
- No Zustand stores

**API Integrations & Services:**
- Supabase: Model registry queries
- Edge Functions: `getSystemStatus`, `getAnalytics`, `promoteModel`, `triggerTraining`

**Important Logic & User Flow:**
1. Admin navigates to `/admin/model-status`
2. Queries system status and models
3. Displays active model card
4. Shows models tab with registry
5. User can promote challenger models
6. User can trigger retraining
7. Analytics tab shows performance
8. Config tab for data management

---

### admin/StatsPage.tsx

**Page Name & Purpose:**
- Data quality assessment and statistical analysis
- Display match statistics and distribution analysis
- Identify data quality issues
- Analyze scoreline frequencies

**Key Features & Responsibilities:**
- Fetch and filter matches by team, location, date range
- Calculate outcome distributions
- Generate goal histograms
- Find top scorelined (most frequent scores)
- Identify data quality issues
- Display data integrity warnings

**Used Components & Hooks:**
- Components: `AdminLayout`, `Card`, `Select`, `Input`, `Badge`, `Table`, `Alert`, `BarChart`
- Hooks: `useMemo`, `useState`, `useQuery`

**State Management:**
- Query state: `useQuery` for matches and teams
- Local state: `selectedTeam`, `location`, `dateFrom`, `dateTo`
- No Zustand stores

**API Integrations & Services:**
- Supabase: Fetch matches and teams with filtering

**Important Logic & User Flow:**
1. Admin navigates to `/admin/stats`
2. Page loads all matches
3. User can apply filters (team, location, dates)
4. Statistics calculated and displayed:
   - Outcome distribution (home/draw/away %)
   - Average goals per match
   - Goal histograms
   - Top scorelined
5. Data quality issues flagged (negative scores, invalid dates, etc.)

---

### admin/HealthDashboard.tsx (see above)

---

### admin/users/UsersPage.tsx

**Page Name & Purpose:**
- User management interface for administrators
- Invite new users with role assignment
- Revoke user access
- View user list and roles
- Manage user permissions

**Key Features & Responsibilities:**
- List all users with pagination
- Search users by email
- Invite new users with email and role selection
- Revoke user access (delete from system)
- Confirm destructive actions
- Display user metadata (email, role, created_at, full_name)
- Show pagination controls

**Used Components & Hooks:**
- Components: `AdminLayout`, `ConfirmDialog`, `Button`, `Dialog`, `Input`, `Select`, `Table`, `Skeleton`
- Hooks: `useDeferredValue`, `useMemo`, `useState`, `useMutation`, `useQuery`, `useQueryClient`, `useAuth`, `useAuditLog`

**State Management:**
- Query state: `useQuery` for users
- Mutation state: `upsertInviteMutation`, `revokeUserMutation`
- Local state: `isInviteDialogOpen`, `isConfirmOpen`, `selectedUser`, `searchTerm`, `currentPage`, `inviteEmail`, `inviteRole`
- No Zustand stores

**API Integrations & Services:**
- Supabase: `user_profiles` table, `admin_invites` table
- Functions: `fetchUsers`, `upsertInvite`, `revokeUser`
- Audit logging via `useAuditLog`

**Important Logic & User Flow:**
1. Admin navigates to `/admin/users`
2. Page loads paginated user list
3. User can search by email
4. User can invite new user via dialog
5. User can revoke access with confirmation
6. Audit log records all actions

---

### admin/jobs/RunningJobsPage.tsx

**Page Name & Purpose:**
- Monitor and control running scheduled jobs
- Display job status and success rates
- Start/stop jobs manually
- View job logs

**Key Features & Responsibilities:**
- Display all jobs as cards
- Show job status: Running, Scheduled, Stopped
- Display success rate progress
- Show job statistics: total runs, avg duration
- Support starting/stopping jobs
- Provide access to job logs
- Confirm stop actions

**Used Components & Hooks:**
- Components: `AdminLayout`, `ConfirmDialog`, `Badge`, `Button`, `Card`, `Progress`, `Skeleton`
- Hooks: `useMemo`, `useState`, `useJobs`

**State Management:**
- Hook state: `useJobs` for job data and mutations
- Local state: `jobToStop`, `startingJobName`, `stoppingJobId`
- No Zustand stores

**API Integrations & Services:**
- Custom hook: `useJobs` with refetch interval
- Functions: `startJob`, `stopJob`

**Important Logic & User Flow:**
1. Admin navigates to `/admin/jobs`
2. Page queries and displays running jobs
3. User can click "Start" to run job
4. User can click "Stop" to halt job (with confirmation)
5. User can click "Logs" to view job history
6. Success rates and durations displayed

---

### admin/phase9/Phase9SettingsPage.tsx

**Page Name & Purpose:**
- Configure Phase 9 collaborative intelligence features
- Manage temporal decay, freshness checks, market integration
- Control cross-league analysis parameters

**Key Features & Responsibilities:**
- Toggle collaborative intelligence
- Configure temporal decay settings
- Set freshness check intervals
- Configure staleness thresholds
- Set market integration mode
- Manage API key for market data
- Configure cross-league analysis depth
- Save and persist settings

**Used Components & Hooks:**
- Components: `AdminLayout`, `SliderSetting`, `ToggleSetting`, `Badge`, `Button`, `Card`, `Input`, `Select`, `Skeleton`
- Hooks: `useCallback`, `useEffect`, `useMemo`, `useState`, `usePhase9Settings`

**State Management:**
- Hook state: `usePhase9Settings` for load/save
- Local state: `form` (Phase9FormState), `showApiKey`, `isDirty`
- No Zustand stores

**API Integrations & Services:**
- Custom hook: `usePhase9Settings` for loading and saving settings

**Important Logic & User Flow:**
1. Admin navigates to `/admin/phase9`
2. Settings load from backend
3. User can modify settings via form
4. "Save" button enabled only when dirty
5. Save triggers mutation to persist
6. Success/error toast displayed
7. Form resets to pristine state

---

### admin/FeedbackInboxPage.tsx

**Page Name & Purpose:**
- Review and manage user feedback on predictions
- Triage feedback items
- Improve model based on user input

**Key Features & Responsibilities:**
- Display feedback from users
- Organize feedback by status (new, reviewed, archived)
- Allow marking feedback as reviewed
- Archive feedback items
- Search feedback

**Used Components & Hooks:**
- Components: `AdminLayout`, `FeedbackInboxPanel`
- Hooks: None (delegated to component)

**State Management:**
- Managed by `FeedbackInboxPanel` component

**API Integrations & Services:**
- Delegated to `FeedbackInboxPanel`

**Important Logic & User Flow:**
1. Admin navigates to `/admin/feedback`
2. Loads feedback from users
3. Displays in triage interface
4. User can review and archive items

---

### admin/PredictionReviewPage.tsx

**Page Name & Purpose:**
- Review predictions blocked due to overconfidence
- Triage interface for prediction quality control
- Accept or reject flagged predictions

**Key Features & Responsibilities:**
- Display predictions blocked by system
- Show reason for blocking (overconfidence)
- Allow acceptance (keep blocked) or rejection (restore to active)
- Information card explaining workflow
- Auto-refresh capability

**Used Components & Hooks:**
- Components: `Card`, `CardHeader`, `CardTitle`, `AlertCircle`, `PredictionReviewPanel`
- Hooks: None

**State Management:**
- Managed by `PredictionReviewPanel` component

**API Integrations & Services:**
- Delegated to `PredictionReviewPanel`

**Important Logic & User Flow:**
1. Admin navigates to `/admin/predictions/review`
2. Displays information about review process
3. Shows prediction review panel
4. User reviews blocked predictions
5. Can accept or reject each prediction

---

## WinmixPro Pages

### winmixpro/AdminDashboard.tsx

**Page Name & Purpose:**
- WinmixPro-specific admin dashboard
- Display system stats and activity log
- Monitor system health and performance

**Key Features & Responsibilities:**
- Display 6 stat tiles (active users, performance, API calls, security, data processing, response time)
- Show activity log with status indicators
- Display system status for each component
- Show trends in metrics
- Mock data loading simulation

**Used Components & Hooks:**
- Components: `AdminLayout`, `Card`, `StatTile`, `ActivityLog`, `SystemStatusCard`
- Hooks: `useMemo`, `useEffect`, `useState`

**State Management:**
- Local state: `stats`, `activityItems`, `systemStatus`, `isLoading`
- No Zustand stores; mock data only

**API Integrations & Services:**
- None; mock data loaded

**Important Logic & User Flow:**
1. Admin navigates to `/winmixpro/admin`
2. Mock data loads with 500ms delay
3. Stats tiles, activity log, and system status displayed
4. Animation effects applied on render

---

### winmixpro/AdminComponents.tsx

**Page Name & Purpose:**
- Component library and dependency management
- Display component categories and health
- Show component load times and metrics

**Key Features & Responsibilities:**
- List component categories with health status
- Show dependencies for each category
- Display component load metrics
- Show memory usage and re-render counts
- Provide dependency status indicators
- Display category-level analytics

**Used Components & Hooks:**
- Components: `AdminLayout`, `Card`, `Badge`, `Tabs`, `Button`, `AlertCircle`, `CheckCircle`, `Zap`, `Loader`
- Hooks: `useState`, `useMemo`

**State Management:**
- Local state: `selectedCategory`
- No Zustand stores; mock data

**API Integrations & Services:**
- None; mock component data

**Important Logic & User Flow:**
1. Admin navigates to `/winmixpro/admin/components`
2. Component categories displayed
3. User can filter by category
4. Dependencies and metrics shown for selected category
5. Health status indicated by color

---

### winmixpro/AdminDesign.tsx

**Page Name & Purpose:**
- Theme and design system management
- Configure color palettes and typography
- Preview theme changes

**Key Features & Responsibilities:**
- Display theme presets (emerald, azure, violet)
- Allow custom color selection
- Configure typography settings
- Preview theme colors
- Export/import theme configurations
- Persist theme to localStorage

**Used Components & Hooks:**
- Components: `AdminLayout`, `Card`, `Button`, `Input`, `Label`, `ColorPicker`, `Tabs`
- Hooks: `useState`, `useEffect`, `useCallback`, `useToast`

**State Management:**
- Local state: `currentTheme`, `customColors`, `typography`, `previewMode`
- localStorage: Theme persistence
- No Zustand stores

**API Integrations & Services:**
- None; localStorage persistence

**Important Logic & User Flow:**
1. Admin navigates to `/winmixpro/admin/design`
2. Current theme displayed
3. User can select preset or create custom
4. Color picker for each theme property
5. Typography adjustable
6. Preview updates in real-time
7. Save button persists to localStorage

---

### winmixpro/AdminFeatures.tsx

**Page Name & Purpose:**
- Feature flag management and rollout control
- Enable/disable features with gradual rollout
- Manage feature categories

**Key Features & Responsibilities:**
- List all features with enable/disable toggle
- Show rollout percentage slider (0-100%)
- Categorize features
- Search and filter features
- Export/import feature configuration
- Show feature descriptions
- Track feature status

**Used Components & Hooks:**
- Components: `AdminLayout`, `Card`, `Button`, `Switch`, `Slider`, `Input`, `Tabs`
- Hooks: `useState`, `useEffect`, `useCallback`, `useToast`

**State Management:**
- Local state: `features`, `selectedCategory`, `searchTerm`
- localStorage: Feature configuration persistence
- No Zustand stores

**API Integrations & Services:**
- None; localStorage persistence

**Important Logic & User Flow:**
1. Admin navigates to `/winmixpro/admin/features`
2. Feature list displayed with toggles
3. User can enable/disable features
4. User can set rollout percentage
5. Can filter by category or search
6. Changes saved to localStorage
7. Can export config as JSON

---

## Authentication Pages

### Auth/Login.tsx

**Page Name & Purpose:**
- User authentication entry point
- Allow users to sign in with email and password
- Route authenticated users to dashboard

**Key Features & Responsibilities:**
- Email and password form validation (Zod schema)
- Handle authentication via `useAuth` hook
- Display error messages on failure
- Show loading state during sign-in
- Navigation to dashboard on success
- Links to signup and home pages

**Used Components & Hooks:**
- Components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Input`, `Label`, `Button`, `Alert`, `Loader2`, `AlertCircle`, `Link`
- Hooks: `useState`, `useForm`, `useAuth`, `useNavigate`

**State Management:**
- Local state: `isLoading`, `error`
- Form state via `react-hook-form`
- Auth state via `useAuth` hook
- No Zustand stores

**API Integrations & Services:**
- `useAuth().signIn()`: Supabase authentication

**Important Logic & User Flow:**
1. User navigates to `/login`
2. User enters email and password
3. Form validates via Zod schema
4. On submit, calls `signIn()` from `useAuth`
5. Success: navigate to `/dashboard`
6. Error: display error message
7. User can navigate to signup or home

---

### Auth/Signup.tsx

**Page Name & Purpose:**
- User registration page
- Allow new users to create accounts
- Email verification flow

**Key Features & Responsibilities:**
- Full name, email, password form validation
- Password confirmation matching
- Handle account creation via `useAuth`
- Display success state with redirect
- Show error messages on failure
- Loading state during signup
- Links to login and home

**Used Components & Hooks:**
- Components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`, `Input`, `Label`, `Button`, `Alert`, `Loader2`, `AlertCircle`, `CheckCircle2`, `Link`
- Hooks: `useState`, `useForm`, `useAuth`, `useNavigate`

**State Management:**
- Local state: `isLoading`, `error`, `success`
- Form state via `react-hook-form`
- Auth state via `useAuth` hook
- No Zustand stores

**API Integrations & Services:**
- `useAuth().signUp()`: Supabase authentication

**Important Logic & User Flow:**
1. User navigates to `/signup`
2. User enters full name, email, password
3. Form validates password match and requirements
4. On submit, calls `signUp()` with email, password, name
5. Success: display confirmation message
6. Auto-redirect to `/login` after 3 seconds
7. Error: display error message
8. Can navigate to login or home

---

## Error Pages

### NotFound.tsx

**Page Name & Purpose:**
- 404 error page for non-existent routes
- Inform user that page doesn't exist
- Provide navigation options

**Key Features & Responsibilities:**
- Display 404 error message
- Show attempted route
- Provide "Go Back" button
- Provide "Go Home" button
- Log error to console
- Use document title hook

**Used Components & Hooks:**
- Components: `PageLayout`, `PageHeader`, `Button`
- Hooks: `useLocation`, `useNavigate`, `useEffect`, `useDocumentTitle`

**State Management:**
- None

**API Integrations & Services:**
- None

**Important Logic & User Flow:**
1. User accesses non-existent route
2. 404 page rendered
3. Current route displayed in message
4. User can click "Go Back" or "Go Home"
5. Error logged to console

---

### Unauthorized.tsx

**Page Name & Purpose:**
- Access denied error page
- Display when user lacks required permissions
- Inform about role-based access restrictions

**Key Features & Responsibilities:**
- Display "Access Denied" message
- Explain permission issue
- Provide "Back to Home" button
- Show admin contact information
- Professional error card layout

**Used Components & Hooks:**
- Components: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `Button`, `AlertTriangle`, `Home`
- Hooks: `useNavigate`

**State Management:**
- None

**API Integrations & Services:**
- None

**Important Logic & User Flow:**
1. User attempts to access restricted page
2. Unauthorized page rendered
3. User clicks "Back to Home" to return to home
4. Message encourages contacting administrator

---

## Other Pages

### FeatureFlagsDemo.tsx

**Page Name & Purpose:**
- Demo page for feature flag system
- Display status of all phase features
- Show environment variable configuration

**Key Features & Responsibilities:**
- Display all phase flags (Phase 5-9)
- Show enabled/disabled status with visual indicators
- Display environment variable names
- Provide configuration instructions
- Simple grid layout for status display

**Used Components & Hooks:**
- Components: Various styled divs with Tailwind CSS
- Hooks: `usePhaseFlags`

**State Management:**
- Hook state: `usePhaseFlags` for feature flags
- No Zustand stores

**API Integrations & Services:**
- `usePhaseFlags`: Reads environment variables for feature flags

**Important Logic & User Flow:**
1. Developer navigates to `/features-demo`
2. Page displays all 5 phases with current status
3. Green = enabled, Red = disabled
4. Instructions shown for enabling features
5. Used for development/testing purposes

---

### ScheduledJobsPage.tsx

**Page Name & Purpose:**
- Schedule and manage background jobs
- Create, edit, delete scheduled jobs
- Monitor job execution
- Manage CRON expressions for scheduling

**Key Features & Responsibilities:**
- List all scheduled jobs
- Create new jobs with CRON scheduling
- Edit existing job configuration
- Delete jobs with confirmation
- Validate CRON expressions
- Show job status and execution history
- Provide CRON presets for common schedules
- Filter jobs by type and status

**Used Components & Hooks:**
- Components: `AuthGate`, `Button`, `Card`, `Input`, `Select`, `Badge`, `Dialog`, `Table`, `Textarea`, `Switch`, `Skeleton`, `PageLayout`, `PageHeader`, `JobStatusCard`, `JobLogsDialog`
- Hooks: `useMemo`, `useState`, `useQuery`, `useMutation`, `useQueryClient`, `useDocumentTitle`

**State Management:**
- Query state: `useQuery` for jobs list
- Mutation state: `useMutation` for create/update/delete
- Local state: `selectedJob`, `isCreateDialogOpen`, `isEditDialogOpen`, `selectedJobForEdit`, `searchTerm`, `selectedType`, `showInactive`
- No Zustand stores

**API Integrations & Services:**
- Supabase Edge Functions:
  - `jobs-list`: Fetch all jobs
  - `jobs-create`: Create new job
  - `jobs-update`: Update job
  - `jobs-delete`: Delete job
  - `jobs-validate-cron`: Validate CRON expression
- Custom hook: `useJobs` for job management

**Important Logic & User Flow:**
1. Admin navigates to `/jobs`
2. Page loads all scheduled jobs
3. User can create job: click "+", select type, enter CRON, save
4. User can edit job: click row, modify settings, save
5. User can delete job: click trash, confirm deletion
6. Can view job logs via "Logs" button
7. CRON validation happens on save
8. Search and filter by type/status

---

### ModelsPage.tsx

**Page Name & Purpose:**
- Machine learning model registry and management
- Register models with champion/challenger states
- Manage model lifecycle and traffic allocation
- Create experiments and manage A/B testing

**Key Features & Responsibilities:**
- Display model registry with filtering
- Create new models via dialog form
- Edit model details (name, version, hyperparameters)
- Delete models with confirmation
- Promote challenger to champion
- Manage traffic allocation (pie chart)
- Create experiments
- Evaluate experiments
- Deactivate/activate models
- Search and filter by type, name, algorithm

**Used Components & Hooks:**
- Components: `AuthGate`, `ModelCard`, `Button`, `Card`, `Alert`, `Input`, `Select`, `Badge`, `Dialog`, `Textarea`, `Switch`, `Table`, `PageLayout`, `PageHeader`, `PieChart`
- Hooks: `useMemo`, `useState`, `useQuery`, `useMutation`, `useQueryClient`, `useDocumentTitle`

**State Management:**
- Query state: `useQuery` for models and experiments
- Mutation state: Multiple mutations for model operations
- Local state: `isCreateDialogOpen`, `isEditDialogOpen`, `selectedModel`, `searchTerm`, `selectedType`, `showInactive`, `form`
- No Zustand stores

**API Integrations & Services:**
- Service functions: `listModels`, `registerModel`, `promoteChallenger`, `createExperiment`, `evaluateExperiment`, `epsilonGreedySelect`, `updateModel`, `deleteModel`
- Supabase: `model_experiments` table queries

**Important Logic & User Flow:**
1. Analyst navigates to `/models`
2. Page loads model registry
3. Can create model: click "+", fill form, register
4. Can edit model: click edit icon, modify, save
5. Can promote challenger: click promote button
6. Can deactivate/activate models
7. Traffic distribution visualized in pie chart
8. Can create experiments for A/B testing
9. Search and filter models

---

### TeamDetail.tsx (see Data Explorer section)

---

### EnvVariables.tsx

**Page Name & Purpose:**
- Environment variables management interface
- Create, read, update, delete environment variables
- Import/export environment configuration
- Manage secret and non-secret variables

**Key Features & Responsibilities:**
- List all environment variables with pagination
- Create new variables via dialog form
- Edit existing variables
- Delete variables with confirmation
- Toggle secret visibility (eye icon)
- Import from .env file (CSV)
- Export current variables as CSV
- Search and filter by category
- Categorize variables (general, database, API, email, security, etc.)
- Validate variable names

**Used Components & Hooks:**
- Components: `Sidebar`, `TopBar`, `AuthGate`, `Button`, `Card`, `Input`, `Select`, `Badge`, `Alert`, `Dialog`, `Table`, `Textarea`, `Switch`, `Plus`, `Download`, `Upload`, `Eye`, `EyeOff`, `Edit`, `Trash2`
- Hooks: `useState`, `useMemo`, `useQuery`, `useMutation`, `useQueryClient`

**State Management:**
- Query state: `useQuery` for variables list
- Mutation state: `useMutation` for create/update/delete/import
- Local state: `isCreateDialogOpen`, `isEditDialogOpen`, `isImportDialogOpen`, `selectedVariable`, `showSecrets`, `envFileContent`, `searchTerm`, `selectedCategory`, `form`
- No Zustand stores

**API Integrations & Services:**
- Supabase: CRUD operations on `environment_variables` table
- Edge Function: `admin-import-env` for importing from .env file
- Functions: `fetchEnvironmentVariables`, `createEnvironmentVariable`, `updateEnvironmentVariable`, `deleteEnvironmentVariable`, `importFromEnvFile`

**Important Logic & User Flow:**
1. Admin navigates to `/env-variables`
2. Page loads all variables
3. User can create: click "+", enter key/value/category, save
4. User can edit: click edit, modify, save
5. User can delete: click trash, confirm
6. Can toggle secret visibility for each variable
7. Can import from .env file: click upload, paste content, import
8. Can export current list as CSV
9. Search and filter by category

---

## Summary of State Management Patterns

### No Zustand Stores
Most pages use local React state (`useState`) or TanStack Query for managing server state. The application follows this pattern:

- **Local UI State**: `useState` for form state, dialog open/close, loading states
- **Server State**: TanStack Query (`useQuery`, `useMutation`) for data fetching and mutations
- **Form State**: `react-hook-form` with Zod validation for form management
- **Auth State**: `useAuth()` custom hook for authentication context

### Custom Hooks Used
- `useDocumentTitle`: Set page title in browser tab
- `useAuth`: Authentication context and methods
- `usePhaseFlags`: Feature flag status checks
- `useJobs`: Job management operations
- `usePhase9Settings`: Phase 9 configuration
- `usePhoneFlags`: Phase feature flags
- `useModelRegistry`: Model registry queries
- `useAuditLog`: Audit logging
- `useToast`: Toast notifications

---

## API Integration Patterns

### Supabase
- Direct table queries with `.select()`, `.insert()`, `.update()`, `.delete()`
- Joined relations for loading related data
- Edge Functions via `supabase.functions.invoke()`
- Authentication via `supabase.auth.*`

### Edge Functions
- `analyze-match`: AI match analysis
- `cross-league-analyze`: League comparison
- `cross-league-correlations`: Correlation analysis
- `meta-patterns-discover`: Pattern discovery
- `monitoring-*`: System monitoring functions
- `jobs-*`: Job management functions
- `admin-*`: Admin operation functions

---

## Key Layout Components

All pages use a consistent layout structure:
- **Sidebar**: Navigation menu (left side)
- **TopBar**: User info and notifications (top)
- **PageLayout**: Container for page content
- **AdminLayout**: Special layout for admin pages with breadcrumbs
- **Footer**: Footer section (on some pages)

---

## Responsive Design

Pages are built with Tailwind CSS and are fully responsive:
- Mobile-first approach
- Grid layouts that adjust column counts at breakpoints
- Collapsible navigation on smaller screens
- Touch-friendly button sizes

