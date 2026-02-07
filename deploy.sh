#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create .env file with the following variables:"
    echo ""
    echo "NODE_ENV=production"
    echo "PORT=3333"
    echo "JWT_SECRET=your-secret-key-here"
    echo "DB_PASSWORD=docker"
    echo "DATABASE_URL=postgresql://docker:docker@db:5432/apisolid?schema=public"
    echo ""
    exit 1
fi

# Build and start containers
echo "🐳 Building and starting Docker containers..."
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database..."
sleep 10

# Run migrations
echo "📊 Running database migrations..."
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

echo "✅ Deployment completed!"
echo "📍 API: http://localhost"
echo "📚 Docs: http://localhost/docs"
