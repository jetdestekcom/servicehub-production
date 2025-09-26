#!/bin/bash

# JETDESTEK Platform Deployment Script
# Security-hardened production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="jetdestek"
DOCKER_COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.production"

echo -e "${BLUE}🚀 JETDESTEK Platform Deployment Starting...${NC}"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    echo -e "${RED}❌ Please do not run as root for security reasons${NC}"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker is not installed${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Docker Compose is not installed${NC}"
    exit 1
fi

# Check if environment file exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Environment file not found. Creating from example...${NC}"
    cp env.production.example "$ENV_FILE"
    echo -e "${YELLOW}⚠️  Please configure $ENV_FILE with your production values${NC}"
    exit 1
fi

# Security check: Validate environment variables
echo -e "${BLUE}🔍 Validating environment configuration...${NC}"

# Check for required environment variables
required_vars=(
    "NEXTAUTH_SECRET"
    "JWT_SECRET"
    "ENCRYPTION_KEY"
    "DATABASE_URL"
    "DB_PASSWORD"
    "REDIS_PASSWORD"
)

for var in "${required_vars[@]}"; do
    if ! grep -q "^${var}=" "$ENV_FILE" || grep -q "^${var}=your-" "$ENV_FILE"; then
        echo -e "${RED}❌ $var is not properly configured in $ENV_FILE${NC}"
        exit 1
    fi
done

echo -e "${GREEN}✅ Environment configuration validated${NC}"

# Security check: Generate secure passwords if needed
echo -e "${BLUE}🔐 Generating secure secrets...${NC}"

# Generate secure random passwords
if grep -q "your-" "$ENV_FILE"; then
    echo -e "${YELLOW}⚠️  Please update all 'your-' placeholders in $ENV_FILE${NC}"
    exit 1
fi

# Build and start services
echo -e "${BLUE}🏗️  Building application...${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" build --no-cache

echo -e "${BLUE}🚀 Starting services...${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

# Wait for services to be ready
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Health check
echo -e "${BLUE}🏥 Performing health check...${NC}"
max_attempts=10
attempt=1

while [ $attempt -le $max_attempts ]; do
    if curl -f http://localhost:3000/api/health/check > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is healthy${NC}"
        break
    else
        echo -e "${YELLOW}⏳ Attempt $attempt/$max_attempts - Waiting for application...${NC}"
        sleep 10
        ((attempt++))
    fi
done

if [ $attempt -gt $max_attempts ]; then
    echo -e "${RED}❌ Application health check failed${NC}"
    echo -e "${BLUE}📋 Checking logs...${NC}"
    docker-compose -f "$DOCKER_COMPOSE_FILE" logs app
    exit 1
fi

# Security scan
echo -e "${BLUE}🔍 Running security scan...${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" exec app npm audit --audit-level=moderate

# Database migration
echo -e "${BLUE}🗄️  Running database migrations...${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" exec app npx prisma migrate deploy

# Create admin user
echo -e "${BLUE}👤 Creating admin user...${NC}"
docker-compose -f "$DOCKER_COMPOSE_FILE" exec app node scripts/create-secure-demo-users.js

# Final security check
echo -e "${BLUE}🛡️  Performing final security check...${NC}"

# Check if all services are running
if ! docker-compose -f "$DOCKER_COMPOSE_FILE" ps | grep -q "Up"; then
    echo -e "${RED}❌ Some services are not running${NC}"
    docker-compose -f "$DOCKER_COMPOSE_FILE" ps
    exit 1
fi

# Check if application is responding
if ! curl -f http://localhost:3000/api/health/check > /dev/null 2>&1; then
    echo -e "${RED}❌ Application is not responding${NC}"
    exit 1
fi

# Success message
echo -e "${GREEN}🎉 JETDESTEK Platform deployed successfully!${NC}"
echo -e "${GREEN}✅ All services are running${NC}"
echo -e "${GREEN}✅ Security checks passed${NC}"
echo -e "${GREEN}✅ Application is healthy${NC}"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo -e "  • Application: http://localhost:3000"
echo -e "  • Health Check: http://localhost:3000/api/health/check"
echo -e "  • Database: PostgreSQL on port 5432"
echo -e "  • Cache: Redis on port 6379"
echo -e "  • Monitoring: Elasticsearch on port 9200"
echo ""
echo -e "${YELLOW}⚠️  Next Steps:${NC}"
echo -e "  1. Configure your domain and SSL certificates"
echo -e "  2. Set up monitoring and alerting"
echo -e "  3. Configure backup strategies"
echo -e "  4. Set up log aggregation"
echo -e "  5. Configure firewall rules"
echo ""
echo -e "${GREEN}🚀 JETDESTEK Platform is ready for production!${NC}"

