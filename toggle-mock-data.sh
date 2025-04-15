#!/bin/bash

# Color codes for outputs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

CONFIG_FILE="client/src/lib/config.ts"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo -e "${RED}Error: Config file not found at $CONFIG_FILE${NC}"
  exit 1
fi

# Get the current mock data setting
current_value=$(grep -o "USE_MOCK_DATA: [^,]*" "$CONFIG_FILE" | cut -d ' ' -f2)

if [ "$current_value" == "true" ]; then
  # Switch to real API
  sed -i 's/USE_MOCK_DATA: true/USE_MOCK_DATA: false/g' "$CONFIG_FILE"
  echo -e "${GREEN}Switched to REAL API mode${NC}"
  echo -e "The application will now connect to the real API endpoints."
  echo -e "${YELLOW}Note: Make sure your database is properly set up and accessible.${NC}"
else
  # Switch to mock data
  sed -i 's/USE_MOCK_DATA: false/USE_MOCK_DATA: true/g' "$CONFIG_FILE"
  echo -e "${GREEN}Switched to MOCK DATA mode${NC}"
  echo -e "The application will now use client-side mock data instead of connecting to the API."
  echo -e "${YELLOW}Note: This is useful for development and testing without a database.${NC}"
fi

echo -e "Restart the application with ${YELLOW}npm run dev${NC} for the changes to take effect."