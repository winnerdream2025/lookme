#!/bin/bash

# LookMe Platform Stop Script
# Stops all running services

echo "🛑 Stopping LookMe Platform..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Kill all tsx processes (backend services)
echo -e "${YELLOW}Stopping backend services...${NC}"
pkill -f "tsx src/index.ts"
sleep 2
echo -e "${GREEN}✅ Backend services stopped${NC}"

# Kill Next.js frontend
echo -e "${YELLOW}Stopping frontend...${NC}"
pkill -f "next dev"
sleep 1
echo -e "${GREEN}✅ Frontend stopped${NC}"

# Stop Docker containers
echo -e "${YELLOW}Stopping Docker containers...${NC}"
docker compose down
echo -e "${GREEN}✅ Docker containers stopped${NC}"

echo ""
echo -e "${GREEN}✅ All services stopped successfully${NC}"
echo ""
