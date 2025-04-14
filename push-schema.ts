import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import ws from 'ws';
import * as schema from './shared/schema';

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

// Check for database URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a Postgres connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

// Push schema directly
async function pushSchema() {
  console.log('Pushing schema to database...');
  
  try {
    // Drop all existing tables (dangerous but needed for a clean slate)
    console.log('Dropping existing tables...');
    await db.execute(sql`
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    console.log('Creating tables from schema definition...');
    
    // Directly push all tables from schema using drizzle-kit's migrate
    try {
      // First create the users table since many other tables reference it
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "users" (
          "id" SERIAL PRIMARY KEY,
          "username" VARCHAR(50) NOT NULL UNIQUE,
          "password" VARCHAR(255) NOT NULL,
          "full_name" VARCHAR(100) NOT NULL,
          "email" VARCHAR(100) NOT NULL UNIQUE,
          "role" VARCHAR(50) NOT NULL DEFAULT 'user',
          "team_id" INTEGER,
          "position" TEXT,
          "bio" TEXT,
          "language" VARCHAR(10) DEFAULT 'en',
          "avatar_url" TEXT,
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      // Create the teams table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "teams" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(100) NOT NULL,
          "leader_id" INTEGER REFERENCES "users"("id"),
          "description" TEXT,
          "parent_team_id" INTEGER,
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      // Add foreign key constraint for teams table
      await db.execute(sql`
        ALTER TABLE "teams" 
        ADD CONSTRAINT IF NOT EXISTS "teams_parent_team_id_fkey" 
        FOREIGN KEY ("parent_team_id") REFERENCES "teams"("id")
      `);
      
      // Add foreign key constraint for users table
      await db.execute(sql`
        ALTER TABLE "users" 
        ADD CONSTRAINT IF NOT EXISTS "users_team_id_fkey" 
        FOREIGN KEY ("team_id") REFERENCES "teams"("id")
      `);
      
      // Create cadences table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "cadences" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(100) NOT NULL UNIQUE,
          "description" TEXT,
          "color" VARCHAR(7) DEFAULT '#4f46e5',
          "created_by_id" INTEGER REFERENCES "users"("id"),
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      // Create timeframes table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "timeframes" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR(100) NOT NULL,
          "cadence_id" INTEGER NOT NULL REFERENCES "cadences"("id"),
          "start_date" TIMESTAMP NOT NULL,
          "end_date" TIMESTAMP NOT NULL,
          "is_active" BOOLEAN DEFAULT FALSE,
          "created_by_id" INTEGER REFERENCES "users"("id"),
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW()
        )
      `);
      
      console.log('Created core tables successfully!');
    } catch (error) {
      console.error('Error creating tables:', error);
    }
    
    console.log('Schema push completed!');
  } catch (error) {
    console.error('Schema push failed:', error);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

pushSchema().catch(console.error);