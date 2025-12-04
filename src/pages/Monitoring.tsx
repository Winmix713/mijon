import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { featureFlags } from '@/lib/env';
import { AlertCircle, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockHealthIndicators } from '@/lib/mock-data';

export default function Monitoring() {
  if (!featureFlags.phase8) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>Phase 8 monitoring feature is not enabled in your environment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="h-5 w-5 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-400" />;
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'warning':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/50';
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const healthyCount = mockHealthIndicators.filter((h) => h.status === 'healthy').length;
  const warningCount = mockHealthIndicators.filter((h) => h.status === 'warning').length;
  const criticalCount = mockHealthIndicators.filter((h) => h.status === 'critical').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">System Monitoring</h1>
        <p className="text-muted-foreground">Phase 8: Real-time system health and observability</p>
      </div>

      {/* System Status Overview */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <CheckCircle className="mr-2 h-4 w-4 text-emerald-400" />
              Healthy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{healthyCount}</div>
            <p className="mt-2 text-xs text-muted-foreground">Systems operational</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <AlertTriangle className="mr-2 h-4 w-4 text-amber-400" />
              Warning
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{warningCount}</div>
            <p className="mt-2 text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <AlertCircle className="mr-2 h-4 w-4 text-red-400" />
              Critical
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{criticalCount}</div>
            <p className="mt-2 text-xs text-muted-foreground">Action required</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              {((healthyCount / mockHealthIndicators.length) * 100).toFixed(0)}%
            </div>
            <p className="mt-2 text-xs text-muted-foreground">System uptime</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Grid */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Component Health Grid</CardTitle>
              <CardDescription>Real-time status of all system components</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockHealthIndicators.map((indicator) => (
              <div
                key={indicator.component}
                className="flex items-center gap-4 rounded-lg border border-border/50 bg-muted/10 p-4"
              >
                <div className="flex items-center gap-2">
                  {getStatusIcon(indicator.status)}
                  <Badge className={getStatusColor(indicator.status)}>{indicator.status}</Badge>
                </div>

                <div className="flex-1">
                  <p className="font-medium text-foreground">{indicator.component}</p>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-muted-foreground">Latency</p>
                    <p className="font-semibold text-foreground">{indicator.latency}ms</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Error Rate</p>
                    <p className={`font-semibold ${indicator.errorRate > 0.05 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {(indicator.errorRate * 100).toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-semibold text-emerald-400">{indicator.uptime.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Anomaly Watchlist */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <CardTitle>Anomaly Watchlist</CardTitle>
          <CardDescription>Detected anomalies and unusual patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                component: 'Database',
                anomaly: 'High query latency spike',
                detected: '2 minutes ago',
                severity: 'critical',
              },
              {
                component: 'ML Models',
                anomaly: 'Increased prediction variance',
                detected: '15 minutes ago',
                severity: 'warning',
              },
              {
                component: 'API Gateway',
                anomaly: 'Unusual traffic pattern',
                detected: '45 minutes ago',
                severity: 'info',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/10 p-4"
              >
                <div>
                  <p className="font-medium text-foreground">{item.component}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.anomaly}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.detected}</p>
                </div>
                <Badge
                  className={
                    item.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border-red-500/50'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  }
                >
                  {item.severity}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SLO Spark Lines */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>SLO Compliance</CardTitle>
            <CardDescription>Service level objectives tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { metric: 'Availability', target: 99.9, current: 99.95, status: 'excellent' },
                { metric: 'P95 Latency', target: 200, current: 156, status: 'excellent' },
                { metric: 'Error Rate', target: 0.1, current: 0.025, status: 'excellent' },
                { metric: 'Throughput', target: 10000, current: 12500, status: 'excellent' },
              ].map((slo, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{slo.metric}</span>
                    <span className="text-emerald-400">
                      {slo.current} / {slo.target}
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-muted/30">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{
                        width: `${Math.min((slo.current / slo.target) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* External Services Status */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>External Services</CardTitle>
            <CardDescription>Third-party service status indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Supabase', status: 'operational', latency: '23ms' },
                { name: 'Sentry', status: 'operational', latency: '45ms' },
                { name: 'Cloudflare', status: 'operational', latency: '12ms' },
                { name: 'SendGrid', status: 'degraded', latency: '234ms' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.latency}</p>
                  </div>
                  <Badge
                    className={
                      service.status === 'operational'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    }
                  >
                    {service.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="glass-card mt-8">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
          <CardDescription>24-hour performance history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { metric: 'Request Latency', color: 'from-blue-500 to-blue-400' },
              { metric: 'Error Rate', color: 'from-red-500 to-red-400' },
              { metric: 'CPU Usage', color: 'from-amber-500 to-amber-400' },
              { metric: 'Memory Usage', color: 'from-purple-500 to-purple-400' },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-sm font-medium text-foreground">{item.metric}</p>
                <div className="mt-2 flex h-12 items-end gap-1">
                  {Array.from({ length: 24 }).map((_, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 rounded-t-sm bg-gradient-to-t ${item.color}`}
                      style={{
                        height: `${Math.floor(Math.random() * 100)}%`,
                        opacity: 0.6 + Math.random() * 0.4,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
