#!/bin/bash
set -e

# WinMix TipsterHub - Bootstrap Development Environment
# Sets up everything needed for local development including Docker, ML stack, and frontend

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "🚀 WinMix TipsterHub - Bootstrap Development Environment"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  docker-compose not found, trying 'docker compose' instead"
fi

if ! command -v python3 &> /dev/null; then
    echo "⚠️  Python 3 not found in PATH, skipping Python environment setup"
else
    if python3 -c "import sys; exit(0 if sys.version_info >= (3, 9) else 1)" 2>/dev/null; then
        echo -e "${GREEN}✓ Python 3.9+ found${NC}"
    else
        echo "⚠️  Python version < 3.9, may have compatibility issues"
    fi
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"
echo ""

# Step 2: Install Node dependencies
echo -e "${BLUE}[2/6] Installing Node dependencies...${NC}"
cd "$PROJECT_ROOT"
npm ci
echo -e "${GREEN}✓ Node dependencies installed${NC}"
echo ""

# Step 3: Setup environment files
echo -e "${BLUE}[3/6] Setting up environment files...${NC}"

if [ ! -f .env ]; then
    if [ -f .env.example ]; then
        cp .env.example .env
        echo -e "${YELLOW}⚠️  Created .env from .env.example - please update with your credentials${NC}"
    fi
fi

if [ ! -f .env.local ]; then
    if [ -f .env.local.example ]; then
        cp .env.local.example .env.local
        echo -e "${YELLOW}⚠️  Created .env.local from .env.local.example${NC}"
    fi
fi

echo -e "${GREEN}✓ Environment files setup${NC}"
echo ""

# Step 4: Setup Python environment
echo -e "${BLUE}[4/6] Setting up Python ML environment...${NC}"

if command -v python3 &> /dev/null; then
    # Check if venv exists
    if [ ! -d venv ]; then
        python3 -m venv venv
        echo "✓ Virtual environment created"
    fi
    
    # Activate venv and install dependencies
    source venv/bin/activate || true
    pip install --upgrade pip setuptools wheel > /dev/null 2>&1
    if [ -f ml_pipeline/requirements.txt ]; then
        pip install -q -r ml_pipeline/requirements.txt
        echo -e "${GREEN}✓ Python dependencies installed${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Python 3 not available, skipping Python setup${NC}"
fi

echo ""

# Step 5: Start Docker services
echo -e "${BLUE}[5/6] Starting Docker services...${NC}"

if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
elif docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
else
    echo "❌ docker-compose not found"
    exit 1
fi

$COMPOSE_CMD down -v 2>/dev/null || true
$COMPOSE_CMD up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 5

# Check database connection
if $COMPOSE_CMD logs postgres 2>/dev/null | grep -q "ready to accept connections"; then
    echo -e "${GREEN}✓ Database is ready${NC}"
else
    echo -e "${YELLOW}⚠️  Database may still be starting${NC}"
fi

echo ""

# Step 6: Summary and next steps
echo -e "${BLUE}[6/6] Bootstrap complete!${NC}"
echo ""
echo -e "${GREEN}✅ Setup complete! Here's what to do next:${NC}"
echo ""
echo "1. Frontend development server:"
echo "   npm run dev"
echo ""
echo "2. ML training:"
echo "   python ml_pipeline/train_model.py"
echo ""
echo "3. ML predictions:"
echo "   python ml_pipeline/prediction_engine.py --predict 7.5 6.2 8.0 7.5 0.5 --match-id match_001"
echo ""
echo "4. Run tests:"
echo "   npm run test"
echo "   npm run test:e2e"
echo "   python -m pytest ml_pipeline/tests/"
echo ""
echo "5. View services status:"
echo "   $COMPOSE_CMD ps"
echo ""
echo "6. View logs:"
echo "   $COMPOSE_CMD logs -f"
echo ""
echo "Available services:"
echo "  - Frontend: http://localhost:5173"
echo "  - Database: localhost:54322"
echo "  - pgAdmin: http://localhost:5050"
echo "  - Redis: localhost:6379"
echo ""
