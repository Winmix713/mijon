import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { featureFlags } from '@/lib/env';
import { AlertCircle } from 'lucide-react';

export default function Analytics() {
  if (!featureFlags.phase6) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>
              Phase 4 analytics feature is not enabled in your environment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Phase 4: Model evaluation and feedback loops</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>Model accuracy, calibration, and feedback analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            Analytics dashboard will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
