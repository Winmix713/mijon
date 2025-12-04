import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { featureFlags } from '@/lib/env';
import { AlertCircle } from 'lucide-react';

export default function Monitoring() {
  if (!featureFlags.phase8) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>
              Phase 8 monitoring feature is not enabled in your environment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">System Monitoring</h1>
        <p className="text-muted-foreground">Phase 8: Real-time system health and observability</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Monitor system status, alerts, and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            Monitoring dashboard will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
