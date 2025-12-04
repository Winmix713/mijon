import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Animated Background */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_20%_30%,rgba(34,197,94,0.15),transparent_60%),radial-gradient(70%_60%_at_80%_70%,rgba(168,85,247,0.15),transparent_55%),linear-gradient(to-b,#050505,#0a0a0a)]" />
          <div className="absolute -left-20 -top-40 h-80 w-80 animate-float rounded-full bg-emerald-500/10 blur-3xl" />
          <div
            className="absolute -bottom-40 right-10 h-80 w-80 animate-float rounded-full bg-violet-500/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          />
        </div>

        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 animate-fade-in text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-gradient-emerald">AI-Powered</span>
              <br />
              <span className="text-foreground">Football Predictions</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl animate-slide-in-bottom text-lg text-muted-foreground sm:text-xl">
              Real-time match intelligence for smarter betting decisions. Powered by advanced
              pattern recognition and collaborative market insights.
            </p>
            <div className="flex animate-scale-in flex-col justify-center gap-4 sm:flex-row">
              <Link to="/predictions/new">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Predicting
                  <Sparkles className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="mx-auto mt-20 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: 'Pattern Recognition',
                description:
                  'Advanced AI detects subtle patterns in team performance and historical data.',
              },
              {
                icon: TrendingUp,
                title: 'Real-Time Analytics',
                description:
                  'Live monitoring of system health, predictions, and model performance.',
              },
              {
                icon: Shield,
                title: 'Collaborative Intelligence',
                description: 'Community-driven market insights enhance prediction accuracy.',
              },
            ].map((feature, index) => (
              <Card key={index} className="glass-card-hover">
                <CardHeader>
                  <feature.icon className="mb-3 h-10 w-10 text-primary" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
