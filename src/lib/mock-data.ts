// Mock data for all phase dashboards

export interface Job {
  id: string;
  name: string;
  type: 'prediction' | 'retraining' | 'data-pipeline' | 'validation';
  status: 'running' | 'scheduled' | 'completed' | 'failed';
  schedule: string;
  nextRun: string;
  lastRun: string;
  duration?: string;
  successRate?: number;
  enabled: boolean;
}

export interface AnalyticsMetric {
  date: string;
  accuracy: number;
  winRate: number;
  calibrationError: number;
  predictionsCount: number;
}

export interface Model {
  id: string;
  name: string;
  version: string;
  type: 'champion' | 'challenger' | 'shadow';
  accuracy: number;
  winRate: number;
  calibration: number;
  trafficPercentage: number;
  status: 'active' | 'inactive' | 'training';
  deployedDate: string;
  metric: number;
}

export interface HealthIndicator {
  component: string;
  status: 'healthy' | 'warning' | 'critical';
  latency: number;
  errorRate: number;
  uptime: number;
}

export interface LeagueCorrelation {
  league1: string;
  league2: string;
  correlation: number;
}

export interface CollaborativeInsight {
  id: string;
  type: 'market_intelligence' | 'temporal_decay' | 'analyst_note';
  title: string;
  content: string;
  analyst: string;
  timestamp: string;
  confidence: number;
  status: 'active' | 'archived';
}

// Phase 3 - Jobs Mock Data
export const mockJobs: Job[] = [
  {
    id: 'job-1',
    name: 'Daily Model Retraining',
    type: 'retraining',
    status: 'completed',
    schedule: '0 2 * * *',
    nextRun: '2025-12-05T02:00:00Z',
    lastRun: '2025-12-04T02:15:00Z',
    duration: '45 minutes',
    successRate: 95,
    enabled: true,
  },
  {
    id: 'job-2',
    name: 'Prediction Generation',
    type: 'prediction',
    status: 'running',
    schedule: '*/15 * * * *',
    nextRun: '2025-12-04T23:15:00Z',
    lastRun: '2025-12-04T23:00:00Z',
    duration: '5 minutes',
    successRate: 100,
    enabled: true,
  },
  {
    id: 'job-3',
    name: 'Data Pipeline - Leagues',
    type: 'data-pipeline',
    status: 'scheduled',
    schedule: '0 */6 * * *',
    nextRun: '2025-12-05T06:00:00Z',
    lastRun: '2025-12-04T18:00:00Z',
    duration: '20 minutes',
    successRate: 92,
    enabled: true,
  },
  {
    id: 'job-4',
    name: 'Model Validation',
    type: 'validation',
    status: 'failed',
    schedule: '0 1 * * *',
    nextRun: '2025-12-05T01:00:00Z',
    lastRun: '2025-12-04T01:05:00Z',
    duration: '15 minutes',
    successRate: 87,
    enabled: false,
  },
  {
    id: 'job-5',
    name: 'Analytics Aggregation',
    type: 'data-pipeline',
    status: 'completed',
    schedule: '0 0 * * *',
    nextRun: '2025-12-05T00:00:00Z',
    lastRun: '2025-12-04T00:30:00Z',
    duration: '25 minutes',
    successRate: 98,
    enabled: true,
  },
];

// Phase 4 - Analytics Mock Data
export const mockAnalyticsData: AnalyticsMetric[] = [
  { date: '2025-11-25', accuracy: 0.87, winRate: 0.62, calibrationError: 0.08, predictionsCount: 156 },
  { date: '2025-11-26', accuracy: 0.89, winRate: 0.64, calibrationError: 0.07, predictionsCount: 168 },
  { date: '2025-11-27', accuracy: 0.85, winRate: 0.59, calibrationError: 0.09, predictionsCount: 145 },
  { date: '2025-11-28', accuracy: 0.91, winRate: 0.67, calibrationError: 0.06, predictionsCount: 172 },
  { date: '2025-11-29', accuracy: 0.88, winRate: 0.63, calibrationError: 0.08, predictionsCount: 164 },
  { date: '2025-11-30', accuracy: 0.90, winRate: 0.65, calibrationError: 0.07, predictionsCount: 175 },
  { date: '2025-12-01', accuracy: 0.86, winRate: 0.61, calibrationError: 0.08, predictionsCount: 158 },
];

// Phase 6 - Models Mock Data
export const mockModels: Model[] = [
  {
    id: 'model-1',
    name: 'Neural Net v2.4',
    version: '2.4.1',
    type: 'champion',
    accuracy: 0.891,
    winRate: 0.658,
    calibration: 0.068,
    trafficPercentage: 80,
    status: 'active',
    deployedDate: '2025-11-15',
    metric: 87.3,
  },
  {
    id: 'model-2',
    name: 'Ensemble v1.8',
    version: '1.8.5',
    type: 'challenger',
    accuracy: 0.876,
    winRate: 0.642,
    calibration: 0.082,
    trafficPercentage: 20,
    status: 'active',
    deployedDate: '2025-11-28',
    metric: 85.1,
  },
  {
    id: 'model-3',
    name: 'XGBoost v3.0',
    version: '3.0.0',
    type: 'shadow',
    accuracy: 0.845,
    winRate: 0.618,
    calibration: 0.095,
    trafficPercentage: 0,
    status: 'training',
    deployedDate: '2025-12-01',
    metric: 82.5,
  },
];

// Phase 7 - Cross-League Mock Data
export const mockLeagueCorrelations: LeagueCorrelation[] = [
  { league1: 'Premier League', league2: 'La Liga', correlation: 0.82 },
  { league1: 'Premier League', league2: 'Serie A', correlation: 0.75 },
  { league1: 'Premier League', league2: 'Bundesliga', correlation: 0.78 },
  { league1: 'La Liga', league2: 'Serie A', correlation: 0.81 },
  { league1: 'La Liga', league2: 'Bundesliga', correlation: 0.76 },
  { league1: 'Serie A', league2: 'Bundesliga', correlation: 0.79 },
];

// Phase 8 - Monitoring Mock Data
export const mockHealthIndicators: HealthIndicator[] = [
  { component: 'Prediction Engine', status: 'healthy', latency: 45, errorRate: 0.01, uptime: 99.95 },
  { component: 'Data Pipeline', status: 'healthy', latency: 123, errorRate: 0.02, uptime: 99.88 },
  { component: 'ML Models', status: 'warning', latency: 234, errorRate: 0.05, uptime: 99.72 },
  { component: 'Cache Layer', status: 'healthy', latency: 12, errorRate: 0, uptime: 100 },
  { component: 'API Gateway', status: 'healthy', latency: 34, errorRate: 0.01, uptime: 99.99 },
  { component: 'Database', status: 'critical', latency: 456, errorRate: 0.08, uptime: 98.5 },
];

// Phase 9 - Collaborative Intelligence Mock Data
export const mockCollaborativeInsights: CollaborativeInsight[] = [
  {
    id: 'insight-1',
    type: 'market_intelligence',
    title: 'European Market Shift - Late Season Form Analysis',
    content:
      'Detected significant correlation increase between Premier League relegation form and market odds for European matches. Current model weight: 0.72 (was 0.65). Auto-reinforcement scheduled.',
    analyst: 'Sarah Chen',
    timestamp: '2025-12-04T18:30:00Z',
    confidence: 0.92,
    status: 'active',
  },
  {
    id: 'insight-2',
    type: 'temporal_decay',
    title: 'Decay Parameter Update - Winter Season',
    content:
      'Winter break period requires decay parameter adjustment. Current: 0.95 → Recommended: 0.88. Applying temporal decay weights for matches post-break.',
    analyst: 'Mike Johnson',
    timestamp: '2025-12-03T14:15:00Z',
    confidence: 0.88,
    status: 'active',
  },
  {
    id: 'insight-3',
    type: 'analyst_note',
    title: 'Team Dynamics - Post-Transfer Window',
    content:
      'Three key teams completed roster changes. Market model shows initial instability. Recommend increasing volatility weighting for next 8 matches.',
    analyst: 'Elena Rodriguez',
    timestamp: '2025-12-02T10:45:00Z',
    confidence: 0.85,
    status: 'active',
  },
];

// Helper functions
export function getJobStats() {
  return {
    total: mockJobs.length,
    running: mockJobs.filter((j) => j.status === 'running').length,
    failed: mockJobs.filter((j) => j.status === 'failed').length,
    successRate: (mockJobs.reduce((sum, j) => sum + (j.successRate || 0), 0) / mockJobs.length).toFixed(1),
  };
}

export function getAnalyticsSummary() {
  const latest = mockAnalyticsData[mockAnalyticsData.length - 1];
  const avgAccuracy =
    mockAnalyticsData.reduce((sum, m) => sum + m.accuracy, 0) / mockAnalyticsData.length;
  const avgWinRate = mockAnalyticsData.reduce((sum, m) => sum + m.winRate, 0) / mockAnalyticsData.length;

  return {
    accuracy: latest.accuracy,
    avgAccuracy,
    winRate: latest.winRate,
    avgWinRate,
    calibration: latest.calibrationError,
    totalPredictions: mockAnalyticsData.reduce((sum, m) => sum + m.predictionsCount, 0),
  };
}

export function getModelStats() {
  const champion = mockModels.find((m) => m.type === 'champion');
  const challenger = mockModels.find((m) => m.type === 'challenger');
  const totalAccuracy = mockModels.reduce((sum, m) => sum + m.accuracy, 0) / mockModels.length;

  return {
    champion: champion?.name || 'N/A',
    challenger: challenger?.name || 'N/A',
    avgAccuracy: totalAccuracy.toFixed(3),
    deployed: mockModels.filter((m) => m.status === 'active').length,
  };
}
