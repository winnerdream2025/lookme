#!/bin/bash

# LookMe Platform Startup Script
# Starts all backend services and frontend

set -e  # Exit on error

echo "🚀 Starting LookMe Platform..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check if Docker is running
echo -e "${BLUE}Step 1: Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker Desktop first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Docker is running${NC}"
echo ""

# Step 2: Start Docker containers (PostgreSQL + Redis)
echo -e "${BLUE}Step 2: Starting Docker containers...${NC}"
docker compose up -d
sleep 3
echo -e "${GREEN}✅ PostgreSQL and Redis started${NC}"
echo ""

# Step 3: Load environment variables
echo -e "${BLUE}Step 3: Loading environment variables...${NC}"
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found. Please create it from .env.example${NC}"
    exit 1
fi
set -o allexport
source .env
set +o allexport
echo -e "${GREEN}✅ Environment variables loaded${NC}"
echo ""

# Step 4: Check if node_modules exist
echo -e "${BLUE}Step 4: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠️  node_modules not found. Installing dependencies...${NC}"
    pnpm install
fi
echo -e "${GREEN}✅ Dependencies ready${NC}"
echo ""

# Step 5: Run database migrations
echo -e "${BLUE}Step 5: Running database migrations...${NC}"
cd packages/database
npx prisma migrate deploy
npx prisma generate
cd ../..
echo -e "${GREEN}✅ Database migrations complete${NC}"
echo ""

# Step 6: Kill any existing processes on our ports
echo -e "${BLUE}Step 6: Cleaning up old processes...${NC}"
pkill -f "tsx src/index.ts" || true
sleep 2
echo -e "${GREEN}✅ Old processes cleaned${NC}"
echo ""

# Step 7: Start backend services
echo -e "${BLUE}Step 7: Starting backend services...${NC}"
echo -e "${YELLOW}Starting Auth Service (port 5001)...${NC}"
pnpm --filter @lookme/auth-service exec tsx src/index.ts > logs/auth.log 2>&1 &
sleep 2

echo -e "${YELLOW}Starting Catalog Service (port 5002)...${NC}"
pnpm --filter @lookme/catalog-service exec tsx src/index.ts > logs/catalog.log 2>&1 &
sleep 2

echo -e "${YELLOW}Starting Order Service (port 5003)...${NC}"
pnpm --filter @lookme/order-service exec tsx src/index.ts > logs/order.log 2>&1 &
sleep 2

echo -e "${YELLOW}Starting Task Service (port 5004)...${NC}"
pnpm --filter @lookme/task-service exec tsx src/index.ts > logs/task.log 2>&1 &
sleep 2

echo -e "${YELLOW}Starting Wallet Service (port 5005)...${NC}"
pnpm --filter @lookme/wallet-service exec tsx src/index.ts > logs/wallet.log 2>&1 &
sleep 2

echo -e "${YELLOW}Starting Campaign Service (port 5006)...${NC}"
pnpm --filter @lookme/campaign-service exec tsx src/index.ts > logs/campaign.log 2>&1 &
sleep 2

echo -e "${YELLOW}Starting API Gateway (port 4000)...${NC}"
pnpm --filter @lookme/api-gateway exec tsx src/index.ts > logs/gateway.log 2>&1 &
sleep 3

echo -e "${GREEN}✅ All backend services started${NC}"
echo ""

# Step 8: Check if services are responding
echo -e "${BLUE}Step 8: Verifying services...${NC}"
sleep 5

check_service() {
    local name=$1
    local port=$2
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name (port $port) - Running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name (port $port) - Not responding${NC}"
        return 1
    fi
}

check_service "API Gateway" 4000
check_service "Auth Service" 5001
check_service "Catalog Service" 5002
check_service "Order Service" 5003
check_service "Task Service" 5004
check_service "Wallet Service" 5005
check_service "Campaign Service" 5006

echo ""

# Step 9: Start frontend (optional)
echo -e "${BLUE}Step 9: Starting frontend...${NC}"
echo -e "${YELLOW}Do you want to start the frontend? (y/n)${NC}"
read -r start_frontend

if [ "$start_frontend" = "y" ] || [ "$start_frontend" = "Y" ]; then
    echo -e "${YELLOW}Starting Next.js frontend (port 3000)...${NC}"
    cd apps/web-client
    pnpm dev > ../../logs/frontend.log 2>&1 &
    cd ../..
    sleep 3
    echo -e "${GREEN}✅ Frontend started at http://localhost:3000${NC}"
else
    echo -e "${YELLOW}⏭️  Skipping frontend startup${NC}"
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}🎉 LookMe Platform is now running!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${BLUE}📊 Service URLs:${NC}"
echo -e "  API Gateway:    ${YELLOW}http://localhost:4000${NC}"
echo -e "  Auth Service:   ${YELLOW}http://localhost:5001${NC}"
echo -e "  Catalog:        ${YELLOW}http://localhost:5002${NC}"
echo -e "  Order:          ${YELLOW}http://localhost:5003${NC}"
echo -e "  Task:           ${YELLOW}http://localhost:5004${NC}"
echo -e "  Wallet:         ${YELLOW}http://localhost:5005${NC}"
echo -e "  Campaign:       ${YELLOW}http://localhost:5006${NC}"
if [ "$start_frontend" = "y" ] || [ "$start_frontend" = "Y" ]; then
    echo -e "  Frontend:       ${YELLOW}http://localhost:3000${NC}"
fi
echo ""
echo -e "${BLUE}📝 Logs:${NC}"
echo -e "  View logs:      ${YELLOW}tail -f logs/*.log${NC}"
echo -e "  Gateway logs:   ${YELLOW}tail -f logs/gateway.log${NC}"
echo -e "  Task logs:      ${YELLOW}tail -f logs/task.log${NC}"
echo ""
echo -e "${BLUE}🛑 Stop services:${NC}"
echo -e "  ${YELLOW}./stop-project.sh${NC}"
echo ""
echo -e "${BLUE}🧪 Test API:${NC}"
echo -e "  ${YELLOW}curl http://localhost:4000/health${NC}"
echo ""
