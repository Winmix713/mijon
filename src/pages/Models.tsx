import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { featureFlags } from '@/lib/env';
import { AlertCircle, Trophy, Zap, ArrowUp } from 'lucide-react';
import { mockModels, getModelStats } from '@/lib/mock-data';
import type { Model } from '@/lib/mock-data';

export default function Models() {
  const [models, setModels] = useState<Model[]>(mockModels);
  const [selectedModel, setSelectedModel] = useState<Model | null>(models[0]);
  const stats = getModelStats();

  if (!featureFlags.phase6) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>Phase 6 models feature is not enabled in your environment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const promoteChallenger = () => {
    setModels((prevModels) =>
      prevModels.map((model) => {
        if (model.type === 'champion') {
          return { ...model, type: 'shadow' as const, status: 'inactive' as const };
        }
        if (model.type === 'challenger') {
          return { ...model, type: 'champion' as const, trafficPercentage: 100, status: 'active' as const };
        }
        return model;
      })
    );
  };

  const getModelBadgeColor = (type: Model['type']) => {
    switch (type) {
      case 'champion':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'challenger':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'shadow':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Model Management</h1>
        <p className="text-muted-foreground">Phase 6: Champion/Challenger framework and model governance</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Trophy className="mr-2 h-4 w-4 text-emerald-400" />
              Champion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.champion}</div>
            <p className="mt-2 text-xs text-muted-foreground">80% traffic allocation</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-sm font-medium text-muted-foreground">
              <Zap className="mr-2 h-4 w-4 text-blue-400" />
              Challenger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.challenger}</div>
            <p className="mt-2 text-xs text-muted-foreground">20% traffic allocation</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Accuracy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{(parseFloat(stats.avgAccuracy) * 100).toFixed(1)}%</div>
            <p className="mt-2 text-xs text-muted-foreground">Across all models</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Models</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.deployed}</div>
            <p className="mt-2 text-xs text-muted-foreground">In production</p>
          </CardContent>
        </Card>
      </div>

      {/* Model Registry Table */}
      <Card className="glass-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Model Registry</CardTitle>
              <CardDescription>Manage model versions, experiments, and deployments</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              + New Model
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Model Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Accuracy</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead>Calibration</TableHead>
                  <TableHead>Traffic %</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deployed</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow
                    key={model.id}
                    className={selectedModel?.id === model.id ? 'bg-muted/50' : ''}
                  >
                    <TableCell
                      className="font-medium cursor-pointer hover:text-primary"
                      onClick={() => setSelectedModel(model)}
                    >
                      {model.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getModelBadgeColor(model.type)} text-xs`}>
                        {model.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{model.version}</TableCell>
                    <TableCell>
                      <span className="text-emerald-400">{(model.accuracy * 100).toFixed(2)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-blue-400">{(model.winRate * 100).toFixed(2)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-amber-400">{(model.calibration * 100).toFixed(2)}%</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{model.trafficPercentage}%</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {model.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(model.deployedDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {model.type === 'challenger' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={promoteChallenger}
                            title="Promote to champion"
                          >
                            <ArrowUp className="h-4 w-4 text-emerald-400" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Traffic Allocation */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Traffic Allocation</CardTitle>
            <CardDescription>Current production traffic distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {models
                .filter((m) => m.status === 'active')
                .map((model) => (
                  <div key={model.id} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{model.name}</p>
                      <div className="mt-2 h-2 w-full rounded-full bg-muted/30">
                        <div
                          className={`h-full rounded-full transition-all ${
                            model.type === 'champion'
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                          }`}
                          style={{ width: `${model.trafficPercentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-bold text-foreground">{model.trafficPercentage}%</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Model Comparison */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Champion vs Challenger</CardTitle>
            <CardDescription>Performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {selectedModel && (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Model</span>
                    <span className="text-sm font-bold text-foreground">{selectedModel.name}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Accuracy</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {(selectedModel.accuracy * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Win Rate</span>
                    <span className="text-sm font-bold text-blue-400">
                      {(selectedModel.winRate * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Calibration Error</span>
                    <span className="text-sm font-bold text-amber-400">
                      {(selectedModel.calibration * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
                    <span className="text-sm font-medium text-foreground">Overall Score</span>
                    <span className="text-2xl font-bold text-primary">{selectedModel.metric.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature Experiment Cards */}
      <Card className="glass-card mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Feature Experiments</CardTitle>
              <CardDescription>Active A/B tests and model experiments</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              + New Experiment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              {
                name: 'Temporal Decay V2',
                variant_a: 'Current',
                variant_b: 'V2 Beta',
                traffic: 20,
                status: 'running',
              },
              {
                name: 'Feature Engineering',
                variant_a: 'Baseline',
                variant_b: 'Extended',
                traffic: 15,
                status: 'running',
              },
              {
                name: 'Market Integration',
                variant_a: 'Without',
                variant_b: 'With',
                traffic: 10,
                status: 'scheduled',
              },
            ].map((exp, i) => (
              <Card key={i} className="border-border/50 bg-muted/20">
                <CardContent className="pt-6">
                  <p className="font-medium text-foreground">{exp.name}</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>A:</span>
                      <span className="font-medium text-foreground">{exp.variant_a}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>B:</span>
                      <span className="font-medium text-foreground">{exp.variant_b}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border/30">
                      <span>Traffic:</span>
                      <span className="font-medium text-primary">{exp.traffic}%</span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="mt-4 text-xs">
                    {exp.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
