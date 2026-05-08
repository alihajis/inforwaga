#!/bin/bash

# Script untuk import database ke Railway
# Usage: ./import-to-railway.sh "postgresql://user:pass@host:port/dbname"

if [ -z "$1" ]; then
  echo "❌ Error: Database URL required"
  echo "Usage: ./import-to-railway.sh \"postgresql://user:pass@host:port/dbname\""
  exit 1
fi

DATABASE_URL="$1"

echo "📦 Importing database schema to Railway..."
echo ""

psql "$DATABASE_URL" -f database/init.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Database import successful!"
  echo ""
  echo "🔐 Default admin login:"
  echo "   Email: admin@rt.local"
  echo "   Password: admin123"
else
  echo ""
  echo "❌ Database import failed!"
  exit 1
fi
