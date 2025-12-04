import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { featureFlags } from '@/lib/env';
import { AlertCircle } from 'lucide-react';

export default function Models() {
  if (!featureFlags.phase6) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>
              Phase 6 models feature is not enabled in your environment
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Model Management</h1>
        <p className="text-muted-foreground">
          Phase 6: Champion/Challenger framework and model governance
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Model Registry</CardTitle>
          <CardDescription>Manage model versions, experiments, and deployments</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            Model management interface will be implemented here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
