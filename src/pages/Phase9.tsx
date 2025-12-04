import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/env';
import { AlertCircle, MessageSquare, Settings, Zap, TrendingUp } from 'lucide-react';
import { mockCollaborativeInsights } from '@/lib/mock-data';

export default function Phase9() {
  const [decayValue, setDecayValue] = useState(0.92);
  const [marketBlendWeight, setMarketBlendWeight] = useState(0.65);
  const [autoReinforcement, setAutoReinforcement] = useState(true);

  if (!featureFlags.phase9) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>Phase 9 collaborative intelligence is not enabled in your environment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Collaborative Market Intelligence</h1>
        <p className="text-muted-foreground">
          Phase 9: Advanced collaborative analysis and self-improving loops
        </p>
      </div>

      {/* Control Panels */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Temporal Decay Control */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-5 w-5 text-amber-400" />
              Temporal Decay Control
            </CardTitle>
            <CardDescription>Data recency weighting for model predictions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Decay Parameter</label>
                <span className="text-lg font-bold text-amber-400">{decayValue.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.0"
                step="0.01"
                value={decayValue}
                onChange={(e) => setDecayValue(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {decayValue > 0.9
                  ? 'Recent data heavily weighted'
                  : decayValue > 0.7
                    ? 'Moderate recent data emphasis'
                    : 'Historical data emphasized'}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase">Quick Presets</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  size="sm"
                  variant={decayValue === 0.99 ? 'default' : 'outline'}
                  onClick={() => setDecayValue(0.99)}
                  className="text-xs"
                >
                  Recent
                </Button>
                <Button
                  size="sm"
                  variant={decayValue === 0.92 ? 'default' : 'outline'}
                  onClick={() => setDecayValue(0.92)}
                  className="text-xs"
                >
                  Balanced
                </Button>
                <Button
                  size="sm"
                  variant={decayValue === 0.8 ? 'default' : 'outline'}
                  onClick={() => setDecayValue(0.8)}
                  className="text-xs"
                >
                  History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Blend Control */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-emerald-400" />
              Market Blend Weights
            </CardTitle>
            <CardDescription>Integration of external market data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">Market Signal Weight</label>
                <span className="text-lg font-bold text-emerald-400">{(marketBlendWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={marketBlendWeight}
                onChange={(e) => setMarketBlendWeight(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Model weight: {((1 - marketBlendWeight) * 100).toFixed(0)}% | Market weight: {(marketBlendWeight * 100).toFixed(0)}%
              </p>
            </div>

            <div className="rounded-lg bg-muted/20 p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Active Sources</p>
              <div className="space-y-1">
                {['Betting Odds', 'News Sentiment', 'Team Form', 'Player Injuries'].map((source, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{source}</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Reinforcement */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5 text-violet-400" />
                Auto-Reinforcement Configuration
              </CardTitle>
              <CardDescription>Automated feedback loop and model adjustment</CardDescription>
            </div>
            <Button
              size="sm"
              variant={autoReinforcement ? 'default' : 'outline'}
              onClick={() => setAutoReinforcement(!autoReinforcement)}
            >
              {autoReinforcement ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                name: 'Feedback Integration',
                status: 'active',
                icon: '📝',
                description: 'Collecting analyst feedback',
              },
              {
                name: 'Model Adjustment',
                status: 'pending',
                icon: '🔧',
                description: 'Recalibrating weights',
              },
              {
                name: 'Validation',
                status: 'active',
                icon: '✓',
                description: 'Cross-league validation',
              },
            ].map((task, i) => (
              <Card key={i} className="border-border/50 bg-muted/10">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-foreground">{task.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                    </div>
                    <span className="text-2xl">{task.icon}</span>
                  </div>
                  <Badge
                    className={`mt-3 ${
                      task.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    }`}
                  >
                    {task.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Collaborative Insights Feed */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2 h-5 w-5 text-blue-400" />
            Analyst Collaboration Feed
          </CardTitle>
          <CardDescription>Real-time collaborative intelligence and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCollaborativeInsights.map((insight) => (
              <div
                key={insight.id}
                className="border-l-4 border-primary/30 bg-muted/10 p-4 rounded-r-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          insight.type === 'market_intelligence'
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                            : insight.type === 'temporal_decay'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        }
                      >
                        {insight.type.replace('_', ' ')}
                      </Badge>
                      <Badge
                        className={
                          insight.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                            : 'bg-gray-500/20 text-gray-300 border-gray-500/50'
                        }
                      >
                        {insight.status}
                      </Badge>
                    </div>

                    <h4 className="mt-2 font-semibold text-foreground">{insight.title}</h4>
                    <p className="mt-2 text-sm text-muted-foreground">{insight.content}</p>

                    <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                      <span>By {insight.analyst}</span>
                      <span>{new Date(insight.timestamp).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="ml-4 text-right">
                    <div className="text-2xl font-bold text-emerald-400">
                      {(insight.confidence * 100).toFixed(0)}%
                    </div>
                    <p className="text-xs text-muted-foreground">Confidence</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Performance with Collaborative Impact */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Collaborative Impact Analytics</CardTitle>
          <CardDescription>Model performance improvements from collaboration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              {
                metric: 'Accuracy Improvement',
                baseline: 85.2,
                current: 89.1,
                source: 'Analyst feedback integration',
              },
              {
                metric: 'Market Signal Accuracy',
                baseline: 72.0,
                current: 81.5,
                source: 'Cross-league correlation',
              },
              {
                metric: 'Temporal Decay Efficiency',
                baseline: 0.88,
                current: 0.94,
                source: 'Dynamic parameter tuning',
              },
            ].map((perf, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{perf.metric}</p>
                    <p className="text-xs text-muted-foreground">{perf.source}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">{perf.current.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">
                      ↑ {(perf.current - perf.baseline).toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="flex items-end gap-1 h-6">
                      <div className="flex-1 h-full bg-muted/50 rounded-sm" style={{ height: `${Math.min(perf.baseline, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Baseline: {perf.baseline.toFixed(1)}</p>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-end gap-1 h-6">
                      <div className="flex-1 h-full bg-emerald-500 rounded-sm" style={{ height: `${Math.min(perf.current, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Current: {perf.current.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
