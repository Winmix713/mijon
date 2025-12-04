# Supabase Auth Schema - Setup Guide

## Overview

This guide walks you through setting up the WinMix TipsterHub with Supabase authentication, role-based access control (RBAC), and the complete database schema for Phases 3-9.

## Prerequisites

- Node.js 18+ and npm/yarn
- Supabase CLI: `npm install -g supabase`
- Docker (for local Supabase development)
- Git

## Quick Start - Local Development

### 1. Initialize Supabase Locally

```bash
# Start local Supabase instance
supabase start

# This will start:
# - PostgreSQL database on localhost:54322
# - Supabase API on localhost:54321
# - Studio dashboard on localhost:54323
```

After starting, you'll see output with:
- Anonymous Key
- Service Role Key
- Database URL

### 2. Copy Environment Variables

```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with values from supabase start output
# VITE_SUPABASE_URL=http://localhost:54321
# VITE_SUPABASE_ANON_KEY=<copy from supabase start output>
# DATABASE_URL=<copy from supabase start output>
```

### 3. Apply Migrations

```bash
# The migrations will be applied automatically when supabase starts
# But you can manually apply them if needed:
supabase migration list    # See all migrations
supabase db pull           # Pull schema from local instance
```

### 4. Seed Demo Data

```bash
# Load demo data
psql $DATABASE_URL < supabase/seed.sql

# Or through Supabase CLI:
supabase db push
```

### 5. Start Development Server

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# App will be available at http://localhost:5173
```

## Production Setup

### 1. Create Supabase Project

```bash
# Create a new project at https://supabase.com/dashboard
# Note your Project URL and Anon Key
```

### 2. Configure Environment

```bash
# Copy production environment template
cp .env.example .env.production

# Edit with your Supabase credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

### 3. Link to Production

```bash
# Link local project to production
supabase link --project-ref your-project-ref

# Push migrations to production
supabase db push --linked
```

### 4. Create Demo Data (Optional)

```bash
# Apply seed data to production (be careful!)
psql $PRODUCTION_DATABASE_URL < supabase/seed.sql
```

## Database Schema

### Core Tables

The schema includes:

- **Reference Data**: `leagues`, `teams`, `matches`, `schedules`
- **Authentication**: `user_profiles` (extends auth.users)
- **Predictions**: `predictions`, `prediction_feedback`, `evaluation_log`
- **Patterns**: `pattern_templates`, `pattern_definitions`, `detected_patterns`, `team_patterns`
- **Jobs**: `jobs`, `job_logs`
- **Models**: `model_registry`, `model_metrics`
- **Analytics**: `analytics_snapshots`, `cross_league_insights`, `meta_patterns`
- **Monitoring**: `monitoring_metrics`, `system_health`
- **Phase 9**: `phase9_sessions`
- **Logging**: `admin_audit_log`, `system_logs`, `prediction_review_log`, `retrain_suggestion_log`, `feedback`

### RLS Policies

Row Level Security is enabled on all tables with role-based access control:

- **Public Read**: `leagues`, `teams`, `matches`, `pattern_templates`
- **Analyst Read**: `jobs`, `model_registry`, `analytics_snapshots`
- **Admin Full**: All tables
- **User-owned**: `predictions`, `detected_patterns`, `team_patterns`
- **Service Role**: All administrative operations

### Security Functions

Helper functions for RLS policies:

```sql
-- Get current user's role
SELECT public.current_app_role();

-- Check if admin
SELECT public.is_admin();

-- Check if analyst or admin
SELECT public.is_analyst();

-- Check if authenticated
SELECT public.is_authenticated_user();
```

## Frontend Integration

### 1. Auth Provider

Wrap your app with `AuthProvider`:

```tsx
import { AuthProvider } from './providers/AuthProvider';
import App from './App';

export default function Root() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
```

### 2. Use Auth Hook

Access auth state in components:

```tsx
import { useAuth } from './hooks/useAuth';

export function UserMenu() {
  const { user, userRole, signOut } = useAuth();

  if (!user) return <div>Not logged in</div>;

  return (
    <div>
      <p>Welcome {user.email} ({userRole})</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### 3. Protected Routes

Protect routes with `AuthGate`:

```tsx
import { AuthGate } from './components/auth/AuthGate';

<Route path="/" element={<AuthGate requireAuth={false}><HomePage /></AuthGate>} />
<Route path="/dashboard" element={<AuthGate><Dashboard /></AuthGate>} />
<Route path="/admin" element={<AuthGate allowedRoles={['admin']}><Admin /></AuthGate>} />
<Route path="/jobs" element={<AuthGate allowedRoles={['admin', 'analyst']}><Jobs /></AuthGate>} />
```

## User Roles

### Role Hierarchy

1. **Admin** - Full system access
2. **Analyst** - Read/write predictions, analytics access
3. **User** - Read-only access to predictions and data
4. **Viewer** - Limited read-only access
5. **Demo** - Limited access for demonstrations

### Changing User Roles

Admin only - update directly in database:

```sql
UPDATE public.user_profiles
SET role = 'analyst'
WHERE email = 'user@example.com';
```

Or via the admin interface (when implemented).

## Testing

### Test Authentication

```bash
# Test sign up
npm run test:auth:signup

# Test sign in
npm run test:auth:signin

# Test role-based access
npm run test:rbac
```

### Test RLS Policies

```bash
# Run RLS tests
npm run test:rls

# Check specific table
npm run test:rls -- --table predictions
```

## Troubleshooting

### Connection Issues

If you get `FATAL: connection refused`:

```bash
# Check if Supabase is running
supabase status

# Start or restart
supabase stop
supabase start
```

### Auth Token Issues

If you get `JWT invalid`:

```bash
# Reset Supabase completely
supabase stop
supabase reset

# This will delete all local data and regenerate keys
supabase start
```

### Missing Environment Variables

```bash
# Ensure all required vars are set
echo $VITE_SUPABASE_URL
echo $VITE_SUPABASE_ANON_KEY
echo $DATABASE_URL
```

### Database Migration Errors

```bash
# Check migration status
supabase migration list

# View specific migration
supabase migration show <migration_name>

# Rollback if needed (local only)
supabase db reset
```

## Security Best Practices

1. **Never commit `.env` files** - Use `.env.example` template
2. **Keep service role key private** - Only use in backend
3. **Enable email verification** - In Supabase dashboard
4. **Use strong passwords** - Minimum 8 characters
5. **Enable 2FA** - For admin accounts
6. **Rotate keys regularly** - In production
7. **Monitor audit logs** - Check `admin_audit_log` table
8. **Test RLS policies** - Before deploying

## Feature Flags

Control feature availability with environment variables:

```bash
VITE_PHASE3_ENABLED=true    # Jobs & Automation
VITE_PHASE4_ENABLED=true    # Feedback Loop & Analytics
VITE_PHASE5_ENABLED=true    # Pattern Detection
VITE_PHASE6_ENABLED=true    # Champion/Challenger
VITE_PHASE7_ENABLED=true    # Cross-League Intelligence
VITE_PHASE8_ENABLED=true    # Monitoring
VITE_PHASE9_ENABLED=true    # Collaborative Intelligence
```

## Next Steps

1. **Set up authentication pages** - Login, signup, password reset
2. **Implement dashboard** - User role-based dashboard
3. **Add prediction creation** - With role-based restrictions
4. **Set up jobs system** - Background job scheduling
5. **Implement admin panel** - User and role management
6. **Add monitoring** - System health and metrics

## Documentation

- [Supabase Docs](https://supabase.com/docs)
- [Authentication Guide](./07-security/AUTHENTICATION.md)
- [RBAC Implementation](./07-security/RBAC_IMPLEMENTATION.md)
- [Database Schema](./06-database/supabase_allapot_2026_hu.md)

## Support

For issues or questions:

1. Check the [Supabase documentation](https://supabase.com/docs)
2. Review [security documentation](./07-security/)
3. Check database schema in [06-database/](./06-database/)
4. Review example implementations in `src/components` and `src/hooks`
