#!/bin/bash

# Color codes for outputs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting database setup...${NC}"

# Check if .env file exists
if [ ! -f .env ]; then
  echo -e "${RED}Error: .env file not found.${NC}"
  echo -e "Please create an .env file with your database credentials."
  echo -e "You can use .env.example as a template."
  exit 1
fi

# Extract DATABASE_URL from .env
DATABASE_URL=$(grep DATABASE_URL .env | cut -d '=' -f2)

if [ -z "$DATABASE_URL" ]; then
  echo -e "${RED}Error: DATABASE_URL not found in .env file.${NC}"
  exit 1
fi

echo -e "${YELLOW}Pushing database schema...${NC}"
# Push the database schema
npm run db:push

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to push database schema.${NC}"
  exit 1
fi

echo -e "${GREEN}Database schema pushed successfully.${NC}"

echo -e "${YELLOW}Seeding database with initial data...${NC}"
# Run the seed script
npx tsx server/seed.ts

if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to seed database.${NC}"
  exit 1
fi

echo -e "${GREEN}Database seeded successfully.${NC}"
echo -e "${GREEN}Database setup complete!${NC}"
echo -e "You can now start the application with: ${YELLOW}npm run dev${NC}"