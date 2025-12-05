import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/env';
import { AlertCircle, Download, TrendingUp, Target, Zap } from 'lucide-react';
import { mockAnalyticsData, getAnalyticsSummary } from '@/lib/mock-data';

export default function Analytics() {
  const [dateRange] = useState({ from: '2025-11-25', to: '2025-12-01' });
  const summary = getAnalyticsSummary();

  if (!featureFlags.phase6) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>Phase 4 analytics feature is not enabled in your environment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const maxAccuracy = Math.max(...mockAnalyticsData.map((d) => d.accuracy)) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Phase 4: Model evaluation and feedback loops</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Target className="mr-2 h-4 w-4" />
              Current Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{(summary.accuracy * 100).toFixed(1)}%</div>
            <p className="mt-2 text-xs text-emerald-400">↑ {((summary.accuracy - 0.85) * 100).toFixed(1)}% vs baseline</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <TrendingUp className="mr-2 h-4 w-4" />
              Win Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{(summary.winRate * 100).toFixed(1)}%</div>
            <p className="mt-2 text-xs text-muted-foreground">Last 7 days average</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Zap className="mr-2 h-4 w-4" />
              Calibration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{(summary.calibration * 100).toFixed(1)}%</div>
            <p className="mt-2 text-xs text-amber-400">Lower is better</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{summary.totalPredictions}</div>
            <p className="mt-2 text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Chart */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>Model accuracy, calibration, and feedback analysis</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Accuracy Chart */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Accuracy Trend</h3>
                <span className="text-xs text-muted-foreground">
                  {dateRange.from} to {dateRange.to}
                </span>
              </div>
              <div className="flex h-48 items-end gap-1">
                {mockAnalyticsData.map((data, i) => {
                  const height = (data.accuracy / maxAccuracy) * 100;
                  return (
                    <div
                      key={i}
                      className="flex flex-1 flex-col items-center gap-2"
                      title={`${data.date}: ${(data.accuracy * 100).toFixed(1)}%`}
                    >
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-emerald-500/50 to-emerald-400 transition-all hover:from-emerald-500 hover:to-emerald-400"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      />
                      <span className="text-xs text-muted-foreground">{data.date.slice(-2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Win Rate */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Win Rate</h3>
              </div>
              <div className="flex h-32 items-end gap-1">
                {mockAnalyticsData.map((data, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                    title={`${data.date}: ${(data.winRate * 100).toFixed(1)}%`}
                  >
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-500/50 to-blue-400"
                      style={{ height: `${data.winRate * 100}%`, minHeight: '4px' }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Calibration Error */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Calibration Error</h3>
              </div>
              <div className="flex h-32 items-end gap-1">
                {mockAnalyticsData.map((data, i) => (
                  <div
                    key={i}
                    className="flex flex-1 flex-col items-center gap-2"
                    title={`${data.date}: ${(data.calibrationError * 100).toFixed(2)}%`}
                  >
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-amber-500/50 to-amber-400"
                      style={{ height: `${Math.min(data.calibrationError * 10, 100)}%`, minHeight: '4px' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Submission */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>Feedback Submission</CardTitle>
          <CardDescription>Submit feedback on prediction accuracy and model behavior</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { title: 'Accuracy Feedback', count: 24, icon: '✓' },
              { title: 'Model Issues', count: 8, icon: '⚠' },
              { title: 'Pending Review', count: 5, icon: '⏳' },
            ].map((item, i) => (
              <Card key={i} className="border-border/50 bg-muted/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{item.count}</p>
                    </div>
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evaluation Reconciliation */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Evaluation Reconciliation Timeline</CardTitle>
          <CardDescription>Historical record of model evaluations and retraining events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                date: '2025-12-04',
                event: 'Daily Retraining',
                status: 'completed',
                detail: 'Accuracy: 89.1% → 89.3%',
              },
              {
                date: '2025-12-03',
                event: 'Model Evaluation',
                status: 'completed',
                detail: 'Calibration improved by 0.8%',
              },
              {
                date: '2025-12-02',
                event: 'Feedback Integration',
                status: 'completed',
                detail: '142 feedback entries processed',
              },
              {
                date: '2025-12-01',
                event: 'Weekly Reconciliation',
                status: 'completed',
                detail: 'All metrics within bounds',
              },
            ].map((entry, i) => (
              <div key={i} className="flex items-start gap-4 border-l-2 border-primary/30 pb-4 pl-4">
                <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{entry.event}</p>
                    <Badge variant="secondary" className="text-xs">
                      {entry.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{entry.detail}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{entry.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
