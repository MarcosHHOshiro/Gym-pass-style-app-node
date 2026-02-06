#!/bin/sh
set -e

echo "⏳ Waiting for database..."
# espera Postgres aceitar conexão
until node -e "
  const { Client } = require('pg');
  const url = process.env.DATABASE_URL;
  const c = new Client({ connectionString: url });
  c.connect()
    .then(() => c.end())
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
"; do
  sleep 2
done

echo "✅ DB ready. Running prisma generate..."
npx prisma generate

echo "🚀 Running migrations..."
npx prisma migrate deploy

echo "▶ Starting app..."
exec "$@"
