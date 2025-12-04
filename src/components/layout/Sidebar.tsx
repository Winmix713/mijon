import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Target,
  LayoutDashboard,
  TrendingUp,
  Clock,
  Box,
  Layers,
  Activity,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { featureFlags } from '@/lib/env';

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  requiresFeature?: boolean;
  featureFlag?: keyof typeof featureFlags;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Predictions', href: '/predictions', icon: Target },
  { name: 'Jobs', href: '/jobs', icon: Clock, requiresFeature: true, featureFlag: 'phase6' },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: TrendingUp,
    requiresFeature: true,
    featureFlag: 'phase6',
  },
  { name: 'Models', href: '/models', icon: Box, requiresFeature: true, featureFlag: 'phase6' },
  {
    name: 'Cross-League',
    href: '/crossleague',
    icon: Layers,
    requiresFeature: true,
    featureFlag: 'phase7',
  },
  {
    name: 'Monitoring',
    href: '/monitoring',
    icon: Activity,
    requiresFeature: true,
    featureFlag: 'phase8',
  },
  {
    name: 'Phase 9',
    href: '/phase9',
    icon: Sparkles,
    requiresFeature: true,
    featureFlag: 'phase9',
  },
];

export default function Sidebar() {
  const location = useLocation();

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiresFeature) return true;
    if (item.featureFlag) {
      return featureFlags[item.featureFlag];
    }
    return true;
  });

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 border-r border-border bg-card/50 backdrop-blur-xl lg:block">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/50">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">WinMix</h1>
            <p className="text-xs text-muted-foreground">TipsterHub</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="glass-card rounded-lg p-4">
            <p className="mb-1 text-xs font-semibold text-foreground">Environment</p>
            <p className="text-xs text-muted-foreground">Development</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
