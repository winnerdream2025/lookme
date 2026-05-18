#!/bin/bash

# LookMe Platform Status Check
# Checks if all services are running

echo "🔍 Checking LookMe Platform Status..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

check_service() {
    local name=$1
    local port=$2
    
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name${NC} (port $port) - Running"
        return 0
    else
        echo -e "${RED}❌ $name${NC} (port $port) - Not running"
        return 1
    fi
}

check_process() {
    local name=$1
    local pattern=$2
    
    if pgrep -f "$pattern" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name${NC} - Running"
        return 0
    else
        echo -e "${RED}❌ $name${NC} - Not running"
        return 1
    fi
}

echo -e "${BLUE}Backend Services:${NC}"
check_service "API Gateway" 4000
check_service "Auth Service" 5001
check_service "Catalog Service" 5002
check_service "Order Service" 5003
check_service "Task Service" 5004
check_service "Wallet Service" 5005
check_service "Campaign Service" 5006

echo ""
echo -e "${BLUE}Frontend:${NC}"
check_process "Next.js Frontend" "next dev"

echo ""
echo -e "${BLUE}Docker Containers:${NC}"
if docker ps | grep -q lookme-postgres; then
    echo -e "${GREEN}✅ PostgreSQL${NC} - Running"
else
    echo -e "${RED}❌ PostgreSQL${NC} - Not running"
fi

if docker ps | grep -q redis; then
    echo -e "${GREEN}✅ Redis${NC} - Running"
else
    echo -e "${RED}❌ Redis${NC} - Not running"
fi

echo ""
echo -e "${BLUE}Quick Actions:${NC}"
echo -e "  Start all:      ${YELLOW}./start-project.sh${NC}"
echo -e "  Stop all:       ${YELLOW}./stop-project.sh${NC}"
echo -e "  View logs:      ${YELLOW}tail -f logs/*.log${NC}"
echo ""
