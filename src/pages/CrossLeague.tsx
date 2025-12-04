import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/env';
import { AlertCircle, Filter, RefreshCw } from 'lucide-react';
import { mockLeagueCorrelations } from '@/lib/mock-data';

export default function CrossLeague() {
  const [selectedLeague, setSelectedLeague] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  if (!featureFlags.phase7) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>Phase 7 cross-league intelligence is not enabled in your environment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const leagues = ['Premier League', 'La Liga', 'Serie A', 'Bundesliga'];

  const getCorrelationColor = (value: number) => {
    if (value > 0.8) return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (value > 0.7) return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    if (value > 0.6) return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  const getCorrelationLabel = (value: number) => {
    if (value > 0.8) return 'Very High';
    if (value > 0.7) return 'High';
    if (value > 0.6) return 'Moderate';
    return 'Low';
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Cross-League Intelligence</h1>
        <p className="text-muted-foreground">Phase 7: Multi-league pattern analysis and insights</p>
      </div>

      {/* Filters and Controls */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <h3 className="text-lg font-semibold">League Filters</h3>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={autoRefresh ? 'default' : 'outline'}
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Auto Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {leagues.map((league) => (
              <Button
                key={league}
                size="sm"
                variant={selectedLeague === league ? 'default' : 'outline'}
                onClick={() => setSelectedLeague(selectedLeague === league ? '' : league)}
              >
                {league}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Correlation Heatmap */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>League Correlation Heatmap</CardTitle>
          <CardDescription>Statistical correlations between league patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="mb-4 min-w-max">
              {/* Header */}
              <div className="mb-2 flex">
                <div className="w-40" />
                {leagues.map((league) => (
                  <div key={league} className="w-32 text-center text-xs font-semibold text-muted-foreground">
                    {league.split(' ')[0]}
                  </div>
                ))}
              </div>

              {/* Rows */}
              {leagues.map((league1) => (
                <div key={league1} className="flex">
                  <div className="w-40 overflow-hidden text-ellipsis text-xs font-semibold text-muted-foreground">
                    {league1.split(' ')[0]}
                  </div>
                  {leagues.map((league2) => {
                    const corr =
                      mockLeagueCorrelations.find(
                        (c) =>
                          (c.league1.includes(league1.split(' ')[0]) &&
                            c.league2.includes(league2.split(' ')[0])) ||
                          (c.league2.includes(league1.split(' ')[0]) &&
                            c.league1.includes(league2.split(' ')[0]))
                      )?.correlation || (league1 === league2 ? 1.0 : 0);

                    return (
                      <div
                        key={`${league1}-${league2}`}
                        className={`w-32 p-2 text-center text-sm font-semibold rounded ${
                          league1 === league2
                            ? 'bg-primary/30 text-primary'
                            : getCorrelationColor(corr)
                        }`}
                      >
                        {(corr * 100).toFixed(0)}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Radar Charts and Storyline */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Radar Chart Simulation */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>League Pattern Analysis</CardTitle>
            <CardDescription>Key performance indicators by league</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leagues.map((league) => (
                <div key={league}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{league}</span>
                    <span className="text-muted-foreground">{Math.floor(Math.random() * 30) + 70}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted/30">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400"
                      style={{ width: `${Math.floor(Math.random() * 30) + 70}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Market Insights Feed */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Market Intelligence Feed</CardTitle>
            <CardDescription>Real-time cross-league insights and patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  league: 'Premier League',
                  insight: 'Form regression detected in top 6 teams',
                  timestamp: '5 mins ago',
                  confidence: 0.92,
                },
                {
                  league: 'La Liga',
                  insight: 'Injury updates affecting defensive cohesion',
                  timestamp: '15 mins ago',
                  confidence: 0.78,
                },
                {
                  league: 'Serie A',
                  insight: 'Weather conditions favoring home teams',
                  timestamp: '32 mins ago',
                  confidence: 0.85,
                },
                {
                  league: 'Bundesliga',
                  insight: 'Tactical shifts detected post-winter break',
                  timestamp: '1 hour ago',
                  confidence: 0.88,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="border-l-2 border-primary/30 pl-4 py-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">
                        {item.league}
                      </Badge>
                      <p className="text-sm font-medium text-foreground">{item.insight}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.timestamp}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400">
                      {(item.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Correlation Details */}
      <Card className="glass-card mt-8">
        <CardHeader>
          <CardTitle>Detailed Correlations</CardTitle>
          <CardDescription>Pairwise league correlation analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockLeagueCorrelations.map((corr, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-muted/10 p-4"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {corr.league1} ↔ {corr.league2}
                  </p>
                </div>
                <Badge className={getCorrelationColor(corr.correlation)}>
                  {getCorrelationLabel(corr.correlation)}: {(corr.correlation * 100).toFixed(1)}%
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Auto-Refresh Status */}
      {autoRefresh && (
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted/20 px-3 py-1">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Auto-refreshing every 30 seconds
          </div>
        </div>
      )}
    </div>
  );
}
