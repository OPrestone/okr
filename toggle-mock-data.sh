#!/bin/bash

# Toggle between mock data and real API for OKR Management System
CONFIG_FILE="client/src/lib/config.ts"

# Check if the config file exists
if [ ! -f "$CONFIG_FILE" ]; then
  echo "❌ Error: Config file not found at $CONFIG_FILE"
  exit 1
fi

# Check the current mock data setting
CURRENT_SETTING=$(grep "USE_MOCK_DATA:" "$CONFIG_FILE" | grep -o "true\|false")

if [ "$CURRENT_SETTING" == "true" ]; then
  # Change to false (use real API)
  sed -i 's/USE_MOCK_DATA: true/USE_MOCK_DATA: false/g' "$CONFIG_FILE"
  echo "✅ Changed to use real API calls"
  echo "Make sure your database is set up and the server is running"
else
  # Change to true (use mock data)
  sed -i 's/USE_MOCK_DATA: false/USE_MOCK_DATA: true/g' "$CONFIG_FILE"
  echo "✅ Changed to use mock data"
  echo "The application will now use mock data instead of real API calls"
fi

echo "Restart the application for changes to take effect"