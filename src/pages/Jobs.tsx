import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { featureFlags } from '@/lib/env';
import { AlertCircle, Play, Pause, RefreshCw, Settings, Eye } from 'lucide-react';
import { mockJobs, getJobStats } from '@/lib/mock-data';
import type { Job } from '@/lib/mock-data';

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  if (!featureFlags.phase6) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="glass-card border-amber-500/50">
          <CardHeader>
            <AlertCircle className="mb-2 h-10 w-10 text-amber-400" />
            <CardTitle>Feature Not Enabled</CardTitle>
            <CardDescription>Phase 3 jobs feature is not enabled in your environment</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = getJobStats();

  const toggleJobEnabled = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) => (job.id === jobId ? { ...job, enabled: !job.enabled } : job))
    );
  };

  const triggerJob = (jobId: string) => {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status: 'running' as const,
              lastRun: new Date().toISOString(),
            }
          : job
      )
    );
  };

  const getStatusColor = (status: Job['status']) => {
    switch (status) {
      case 'running':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50';
      case 'scheduled':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const getTypeIcon = (type: Job['type']) => {
    switch (type) {
      case 'prediction':
        return '🎯';
      case 'retraining':
        return '🧠';
      case 'data-pipeline':
        return '📊';
      case 'validation':
        return '✓';
      default:
        return '•';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Scheduled Jobs</h1>
        <p className="text-muted-foreground">Phase 3: Manage automated tasks and data pipelines</p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Running</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">{stats.running}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Failed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-400">{stats.failed}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">{stats.successRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Job List */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Job Control Panel</CardTitle>
              <CardDescription>Monitor and control scheduled automation jobs</CardDescription>
            </div>
            <Button size="sm" variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Configure
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Success Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">
                      <span className="mr-2">{getTypeIcon(job.type)}</span>
                      {job.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {job.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(job.status)} text-xs`}>{job.status}</Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs">{job.schedule}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(job.lastRun).toLocaleString()}
                    </TableCell>
                    <TableCell>{job.duration}</TableCell>
                    <TableCell>
                      <span className={job.successRate ? 'text-emerald-400' : 'text-gray-400'}>
                        {job.successRate}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleJobEnabled(job.id)}
                          title={job.enabled ? 'Disable' : 'Enable'}
                        >
                          {job.enabled ? (
                            <Pause className="h-4 w-4 text-amber-400" />
                          ) : (
                            <Play className="h-4 w-4 text-emerald-400" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => triggerJob(job.id)}
                          title="Trigger immediately"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedJob(job);
                            setShowLogs(true);
                          }}
                          title="View logs"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Logs Drawer */}
      {showLogs && selectedJob && (
        <Card className="glass-card mt-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Job Logs - {selectedJob.name}</CardTitle>
                <CardDescription>Real-time execution logs and debug information</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setShowLogs(false)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="font-mono space-y-1 rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
              <div>[2025-12-04 23:45:12] Starting job execution...</div>
              <div>[2025-12-04 23:45:13] Loading data from source...</div>
              <div>[2025-12-04 23:45:15] Processing batch 1/5...</div>
              <div>[2025-12-04 23:45:18] Processing batch 2/5...</div>
              <div>[2025-12-04 23:45:22] Processing batch 3/5...</div>
              <div className="text-emerald-400">[2025-12-04 23:45:25] Job completed successfully</div>
              <div className="text-muted-foreground">[2025-12-04 23:45:25] Total time: 13 seconds</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
