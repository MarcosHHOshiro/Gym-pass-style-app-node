#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull

# Build and start containers
echo "🐳 Building and starting Docker containers..."

# Detectar versão do Docker Compose
if command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
else
    COMPOSE_CMD="docker compose"
fi

$COMPOSE_CMD -f docker-compose.prod.yml down
$COMPOSE_CMD -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
echo "📊 Running database migrations..."
$COMPOSE_CMD -f docker-compose.prod.yml exec api npx prisma migrate deploy

echo "✅ Deployment completed!"
echo "📍 API: http://localhost"
echo "📚 Docs: http://localhost/docs"
