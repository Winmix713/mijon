import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function NewPrediction() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Create New Prediction</h1>
        <p className="text-muted-foreground">Select 8 matches to generate AI-powered predictions</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Match Selection Wizard</CardTitle>
          <CardDescription>Step 1 of 3: Choose matches from upcoming fixtures</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="py-12 text-center">
            <Sparkles className="mx-auto mb-4 h-16 w-16 text-primary" />
            <p className="mb-6 text-muted-foreground">
              Match selection wizard will be implemented here
            </p>
            <Button>
              <Sparkles className="h-5 w-5" />
              Start Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
