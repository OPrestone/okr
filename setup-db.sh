#!/bin/bash

# Setup database script for OKR Management System
echo "🔄 Setting up database for OKR Management System..."

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "❌ Error: .env file not found!"
  echo "Please create a .env file with your database configuration using .env.example as a template."
  exit 1
fi

# Push the database schema
echo "📦 Pushing schema to database..."
npm run db:push

# Run the seed script
echo "🌱 Seeding database with initial data..."
npx tsx server/seed.ts

echo "✅ Database setup completed successfully!"
echo "You can now run the application with: npm run dev"