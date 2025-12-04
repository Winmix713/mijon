import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { featureFlags } from '@/lib/env';
import { AlertCircle } from 'lucide-react';

export default function CrossLeague() {
  if (!featureFlags.phase7) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>
              Phase 7 cross-league intelligence is not enabled in your environment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Cross-League Intelligence</h1>
        <p className="text-muted-foreground">Phase 7: Multi-league pattern analysis and insights</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>League Comparison</CardTitle>
          <CardDescription>Correlation heatmaps and cross-league patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            Cross-league analysis dashboard will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
