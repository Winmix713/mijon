#!/bin/bash
# Verify Supabase Schema Setup
# Checks that all tables, indexes, RLS policies, and functions are properly configured

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== WinMix TipsterHub Schema Verification ===${NC}\n"

# Check if database URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}ERROR: DATABASE_URL environment variable not set${NC}"
    echo "Set it with: export DATABASE_URL=postgresql://..."
    exit 1
fi

# Function to count objects
count_sql() {
    local query=$1
    psql "$DATABASE_URL" -t -c "$query" 2>/dev/null || echo "0"
}

# Function to check if table exists
table_exists() {
    local table=$1
    psql "$DATABASE_URL" -t -c "SELECT EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name='$table' AND table_schema='public')" | grep -q 't'
}

# Test database connection
echo -e "${BLUE}1. Testing Database Connection...${NC}"
if psql "$DATABASE_URL" -c "SELECT 1" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Database connection successful${NC}\n"
else
    echo -e "${RED}✗ Database connection failed${NC}"
    exit 1
fi

# Check tables
echo -e "${BLUE}2. Checking Core Tables...${NC}"
tables=("leagues" "teams" "matches" "predictions" "user_profiles" "jobs" "job_logs" "model_registry" "model_metrics" "admin_audit_log" "system_logs")
table_count=0
for table in "${tables[@]}"; do
    if table_exists "$table"; then
        echo -e "${GREEN}✓${NC} $table"
        ((table_count++))
    else
        echo -e "${YELLOW}✗${NC} $table (missing)"
    fi
done
echo -e "Found ${GREEN}$table_count${NC}/${#tables[@]} core tables\n"

# Check indexes
echo -e "${BLUE}3. Checking Database Indexes...${NC}"
index_count=$(count_sql "SELECT COUNT(*) FROM pg_indexes WHERE schemaname='public'")
if [ "$index_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $index_count indexes${NC}\n"
else
    echo -e "${YELLOW}⚠ No indexes found${NC}\n"
fi

# Check RLS enabled
echo -e "${BLUE}4. Checking Row Level Security (RLS)...${NC}"
rls_count=$(count_sql "SELECT COUNT(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity=true")
echo -e "${GREEN}✓ RLS enabled on $rls_count tables${NC}\n"

# Check RLS policies
echo -e "${BLUE}5. Checking RLS Policies...${NC}"
policies_count=$(count_sql "SELECT COUNT(*) FROM pg_policies WHERE schemaname='public'")
if [ "$policies_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $policies_count RLS policies${NC}\n"
else
    echo -e "${YELLOW}⚠ No RLS policies found${NC}\n"
fi

# Check functions
echo -e "${BLUE}6. Checking Security Functions...${NC}"
functions=("current_app_role" "is_admin" "is_analyst" "is_authenticated_user" "log_audit_action" "log_system_event")
func_count=0
for func in "${functions[@]}"; do
    if psql "$DATABASE_URL" -t -c "SELECT EXISTS(SELECT 1 FROM pg_proc WHERE proname='$func' AND pronamespace=(SELECT oid FROM pg_namespace WHERE nspname='public'))" | grep -q 't'; then
        echo -e "${GREEN}✓${NC} $func()"
        ((func_count++))
    else
        echo -e "${YELLOW}✗${NC} $func() (missing)"
    fi
done
echo -e "Found ${GREEN}$func_count${NC}/${#functions[@]} security functions\n"

# Check triggers
echo -e "${BLUE}7. Checking Triggers...${NC}"
triggers_count=$(count_sql "SELECT COUNT(*) FROM pg_trigger WHERE NOT tgisinternal AND tgrelid IN (SELECT oid FROM pg_class WHERE relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public'))")
if [ "$triggers_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $triggers_count triggers${NC}\n"
else
    echo -e "${YELLOW}⚠ No triggers found${NC}\n"
fi

# Check materialized views
echo -e "${BLUE}8. Checking Views...${NC}"
views_count=$(count_sql "SELECT COUNT(*) FROM information_schema.views WHERE table_schema='public'")
if [ "$views_count" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $views_count views${NC}\n"
else
    echo -e "${YELLOW}⚠ No views found${NC}\n"
fi

# Summary
echo -e "${BLUE}=== Verification Summary ===${NC}"
echo -e "${GREEN}✓ Schema verification completed${NC}"
echo ""
echo "Next steps:"
echo "1. Verify your Supabase project is properly configured"
echo "2. Test authentication with: npm run test:auth"
echo "3. Test RLS policies with: npm run test:rls"
echo "4. Check audit logs in admin_audit_log table"
echo ""
