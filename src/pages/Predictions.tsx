import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

export default function Predictions() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-4xl font-bold text-foreground">Predictions</h1>
          <p className="text-muted-foreground">View and manage your football match predictions</p>
        </div>
        <Link to="/predictions/new">
          <Button>
            <Plus className="h-5 w-5" />
            New Prediction
          </Button>
        </Link>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Predictions</CardTitle>
          <CardDescription>Your latest match predictions and results</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="py-12 text-center text-muted-foreground">
            No predictions yet. Create your first prediction to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
