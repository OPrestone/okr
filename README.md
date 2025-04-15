# OKR Management System

A comprehensive OKR (Objectives and Key Results) management platform that empowers global teams to strategically set, track, and visualize goal progress through advanced collaboration and analytics tools.

## Features

- 📊 Track and manage OKRs with customizable timeframes and cadences
- 🎯 Status labels with color-coding for objectives and key results
- 📅 Timeframe management for different planning cycles (quarterly, monthly, etc.)
- 📈 Progress visualization and reporting tools
- 👥 Team and user management
- 🔄 Regular check-ins and progress updates
- 📑 Resource management

## Tech Stack

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **Routing**: wouter
- **Form Handling**: react-hook-form with zod validation
- **UI/UX**: Responsive design with dark/light theme support
- **Charts & Visualization**: Recharts

## Prerequisites

- Node.js (v18+)
- PostgreSQL database
- npm or yarn

## System Requirements

- **Node.js**: v18.0.0 or higher
- **PostgreSQL**: v14.0 or higher
- **Memory**: At least 2GB RAM
- **Disk Space**: At least 500MB free space

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd okr-management-system
```

### 2. Install dependencies

```bash
npm install
```

### 3. Database Setup

1. Create a PostgreSQL database for the project.
2. Create a `.env` file in the root directory using the `.env.example` as a template:

```
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>
SESSION_SECRET=your-secret-session-key
PORT=5000
NODE_ENV=development
```

3. Run the database setup script to create tables and seed initial data:

```bash
# Make the script executable
chmod +x setup-db.sh

# Run the setup script
./setup-db.sh
```

This will:
- Push the schema to your database (creating all tables)
- Seed the database with initial data:
  - Default status labels for objectives and key results
  - Sample cadences (Quarterly, Monthly, Annual, Custom)
  - Sample timeframes for 2025
  - Basic team structure
  - Demo user account

### 4. Running the Application

To start the development server:

```bash
npm run dev
```

This will start both the backend server and the frontend development server concurrently. The application will be available at http://localhost:5000.

### 5. Mock Data vs. Real API

The application can run in two modes:
- With mock data (for development without a database)
- With real API calls to the database

To toggle between these modes, use the provided script:

```bash
# Make the script executable
chmod +x toggle-mock-data.sh

# Run the toggle script
./toggle-mock-data.sh
```

When using mock data mode, you'll see a yellow banner in the console indicating that mock data is being used.

### 5. Building for Production

To build the application for production:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

### 6. Version Control and GitHub

To push this project to GitHub, follow the detailed instructions in the [GitHub Setup Guide](GITHUB_SETUP.md). This guide includes:

- Creating a GitHub repository
- Initializing Git in your local project
- Pushing your code to GitHub
- Best practices for Git workflow

## Project Structure

- `/client` - Frontend React application
  - `/src/components` - UI components
  - `/src/hooks` - Custom React hooks
  - `/src/lib` - Utility functions and configurations
  - `/src/pages` - Application pages
- `/server` - Backend Express application
  - `/routes.ts` - API route definitions
  - `/storage.ts` - Data storage interface
  - `/database-storage.ts` - Database storage implementation
  - `/index.ts` - Server entry point
- `/shared` - Shared code between client and server
  - `/schema.ts` - Database schema definitions using Drizzle ORM
- `/migrations` - Database migration files

## Key Components

### Status Labels

The system uses color-coded status labels to track the progress of objectives and key results. Default statuses include:

- **Objectives**: Not Started, In Progress, At Risk, On Track, Completed
- **Key Results**: Not Started, Behind, At Risk, On Track, Achieved

### Cadences & Timeframes

- **Cadences**: Define the rhythm for OKR planning (quarterly, monthly, etc.)
- **Timeframes**: Specific time periods within cadences (e.g., Q1 2025, January 2025)

## API Endpoints

The system provides RESTful API endpoints for managing all aspects of OKRs:

- `/api/status-labels` - Manage status labels
- `/api/cadences` - Manage cadences
- `/api/timeframes` - Manage timeframes
- `/api/objectives` - Manage objectives
- `/api/key-results` - Manage key results
- `/api/teams` - Manage teams
- `/api/users` - Manage users
- `/api/check-ins` - Manage check-ins

## Development Guidelines

- Follow the TypeScript type definitions in `shared/schema.ts`
- Use the storage interface for database operations
- Validate API requests using Zod schemas
- Use TanStack Query for data fetching and mutations
- Follow the component library patterns for consistent UI

## Troubleshooting

### Database Connection Issues

If you encounter database connection issues:

1. Verify that your PostgreSQL server is running
2. Check your `.env` file for correct database credentials
3. Ensure your database exists and is accessible
4. Try running `npm run db:push` manually to check for specific errors

### Script Permission Issues

If you have trouble running the shell scripts:

**On Unix/Linux/macOS:**
```bash
chmod +x *.sh
```

**On Windows:**
- You can run the scripts using Git Bash or WSL
- Alternatively, you can manually execute the commands in the scripts:
  - For database setup: `npm run db:push && npx tsx server/seed.ts`
  - For toggling mock data: Edit `USE_MOCK_DATA` in `client/src/lib/config.ts`

### Mock Data Mode

If you see the yellow banner indicating "USING MOCK DATA MODE":

1. This is expected when `USE_MOCK_DATA` is set to `true` in `client/src/lib/config.ts`
2. The application is using client-side mock data instead of connecting to the database
3. Run `./toggle-mock-data.sh` to switch to real API mode

### Port Conflicts

If port 5000 is already in use:

1. Change the `PORT` value in your `.env` file
2. Restart the application

### NPM Dependency Issues

If you encounter dependency-related errors:

1. Delete the `node_modules` folder
2. Delete the `package-lock.json` file
3. Run `npm install` again