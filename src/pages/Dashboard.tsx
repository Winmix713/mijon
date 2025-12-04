import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Target, CheckCircle, Activity } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { title: 'Total Predictions', value: '0', icon: Target, color: 'text-primary' },
    { title: 'Success Rate', value: '0%', icon: CheckCircle, color: 'text-emerald-400' },
    { title: 'Active Models', value: '0', icon: Activity, color: 'text-violet-400' },
    { title: 'Confidence Avg', value: '0%', icon: TrendingUp, color: 'text-amber-400' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your prediction performance and system metrics
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="glass-card-hover">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest predictions and model updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="py-8 text-center text-muted-foreground">
              No activity yet. Start by creating your first prediction.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
