import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from './shared/schema';
import ws from 'ws';

// Configure NeonDB to use the WebSocket constructor
neonConfig.webSocketConstructor = ws;

async function setup() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  console.log('Setting up database...');
  
  // Connect to database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });
  
  try {
    // Check if tables exist
    const tablesQuery = await pool.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);
    
    // If tables exist, drop them all to start fresh
    if (tablesQuery.rows.length > 0) {
      console.log('Dropping existing tables...');
      // Drop all existing tables in reverse order to handle foreign keys
      await pool.query(`
        DROP SCHEMA public CASCADE;
        CREATE SCHEMA public;
        GRANT ALL ON SCHEMA public TO public;
      `);
    }
    
    console.log('Creating schema...');
    
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" SERIAL PRIMARY KEY,
        "username" VARCHAR(50) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "full_name" VARCHAR(100) NOT NULL,
        "email" VARCHAR(100) NOT NULL,
        "role" VARCHAR(50) DEFAULT 'user' NOT NULL,
        "avatar_url" TEXT,
        "team_id" INTEGER,
        "position" TEXT,
        "bio" TEXT,
        "language" VARCHAR(10) DEFAULT 'en' NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        CONSTRAINT "users_username_unique" UNIQUE("username"),
        CONSTRAINT "users_email_unique" UNIQUE("email")
      );
      CREATE INDEX IF NOT EXISTS "users_team_id_idx" ON "users" ("team_id");
    `);
    console.log('Created users table');
    
    // Create teams table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "teams" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "description" TEXT,
        "leader_id" INTEGER REFERENCES "users" ("id"),
        "parent_team_id" INTEGER REFERENCES "teams" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "teams_leader_id_idx" ON "teams" ("leader_id");
      CREATE INDEX IF NOT EXISTS "teams_parent_team_id_idx" ON "teams" ("parent_team_id");
      
      -- Add foreign key from users to teams after teams table is created
      ALTER TABLE "users" ADD CONSTRAINT "users_team_id_teams_id_fk" 
        FOREIGN KEY ("team_id") REFERENCES "teams" ("id");
    `);
    console.log('Created teams table');
    
    // Create cycles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "cycles" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "description" TEXT,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "status" VARCHAR(20) DEFAULT 'upcoming',
        "type" VARCHAR(20) NOT NULL,
        "created_by_id" INTEGER REFERENCES "users" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        "is_default" BOOLEAN DEFAULT false NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "cycles_created_by_id_idx" ON "cycles" ("created_by_id");
      CREATE INDEX IF NOT EXISTS "cycles_date_idx" ON "cycles" ("start_date", "end_date");
    `);
    console.log('Created cycles table');
    
    // Create user_cycles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_cycles" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "cycle_id" INTEGER NOT NULL REFERENCES "cycles" ("id"),
        "objective_count" INTEGER DEFAULT 0,
        "completed_objectives" INTEGER DEFAULT 0,
        "performance" REAL DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "user_cycles_user_id_idx" ON "user_cycles" ("user_id");
      CREATE INDEX IF NOT EXISTS "user_cycles_cycle_id_idx" ON "user_cycles" ("cycle_id");
      CREATE UNIQUE INDEX IF NOT EXISTS "user_cycle_unique_idx" ON "user_cycles" ("user_id", "cycle_id");
    `);
    console.log('Created user_cycles table');
    
    // Create team_cycles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "team_cycles" (
        "id" SERIAL PRIMARY KEY,
        "team_id" INTEGER NOT NULL REFERENCES "teams" ("id"),
        "cycle_id" INTEGER NOT NULL REFERENCES "cycles" ("id"),
        "objective_count" INTEGER DEFAULT 0,
        "completed_objectives" INTEGER DEFAULT 0,
        "performance" REAL DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "team_cycles_team_id_idx" ON "team_cycles" ("team_id");
      CREATE INDEX IF NOT EXISTS "team_cycles_cycle_id_idx" ON "team_cycles" ("cycle_id");
      CREATE UNIQUE INDEX IF NOT EXISTS "team_cycle_unique_idx" ON "team_cycles" ("team_id", "cycle_id");
    `);
    console.log('Created team_cycles table');
    
    // Create objectives table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "objectives" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "progress" REAL DEFAULT 0,
        "team_id" INTEGER REFERENCES "teams" ("id"),
        "owner_id" INTEGER REFERENCES "users" ("id"),
        "is_company_objective" BOOLEAN DEFAULT false,
        "start_date" TIMESTAMP NOT NULL,
        "end_date" TIMESTAMP NOT NULL,
        "cycle_id" INTEGER REFERENCES "cycles" ("id"),
        "status" VARCHAR(20) DEFAULT 'active',
        "priority" VARCHAR(20) DEFAULT 'medium',
        "parent_objective_id" INTEGER REFERENCES "objectives" ("id"),
        "created_by_id" INTEGER REFERENCES "users" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL,
        "ai_generated" BOOLEAN DEFAULT false,
        "confidence_score" INTEGER DEFAULT 5
      );
      CREATE INDEX IF NOT EXISTS "objectives_team_id_idx" ON "objectives" ("team_id");
      CREATE INDEX IF NOT EXISTS "objectives_owner_id_idx" ON "objectives" ("owner_id");
      CREATE INDEX IF NOT EXISTS "objectives_cycle_id_idx" ON "objectives" ("cycle_id");
      CREATE INDEX IF NOT EXISTS "objectives_parent_objective_id_idx" ON "objectives" ("parent_objective_id");
      CREATE INDEX IF NOT EXISTS "objectives_created_by_id_idx" ON "objectives" ("created_by_id");
      CREATE INDEX IF NOT EXISTS "objectives_date_idx" ON "objectives" ("start_date", "end_date");
    `);
    console.log('Created objectives table');
    
    // Create key_results table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "key_results" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "progress" REAL DEFAULT 0,
        "objective_id" INTEGER NOT NULL REFERENCES "objectives" ("id"),
        "owner_id" INTEGER REFERENCES "users" ("id"),
        "start_value" REAL DEFAULT 0,
        "target_value" REAL,
        "current_value" REAL,
        "is_completed" BOOLEAN DEFAULT false,
        "unit" VARCHAR(50),
        "format" VARCHAR(20) DEFAULT 'number',
        "direction" VARCHAR(10) DEFAULT 'increasing',
        "confidence_score" INTEGER DEFAULT 5,
        "last_updated" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "key_results_objective_id_idx" ON "key_results" ("objective_id");
      CREATE INDEX IF NOT EXISTS "key_results_owner_id_idx" ON "key_results" ("owner_id");
    `);
    console.log('Created key_results table');
    
    // Create check_ins table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "check_ins" (
        "id" SERIAL PRIMARY KEY,
        "objective_id" INTEGER REFERENCES "objectives" ("id"),
        "key_result_id" INTEGER REFERENCES "key_results" ("id"),
        "author_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "new_value" REAL,
        "previous_value" REAL,
        "progress_delta" REAL,
        "note" TEXT,
        "confidence_score" INTEGER,
        "check_in_date" TIMESTAMP DEFAULT now() NOT NULL,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "check_ins_objective_id_idx" ON "check_ins" ("objective_id");
      CREATE INDEX IF NOT EXISTS "check_ins_key_result_id_idx" ON "check_ins" ("key_result_id");
      CREATE INDEX IF NOT EXISTS "check_ins_author_id_idx" ON "check_ins" ("author_id");
      CREATE INDEX IF NOT EXISTS "check_ins_date_idx" ON "check_ins" ("check_in_date");
    `);
    console.log('Created check_ins table');
    
    // Create comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "comments" (
        "id" SERIAL PRIMARY KEY,
        "author_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "content" TEXT NOT NULL,
        "objective_id" INTEGER REFERENCES "objectives" ("id"),
        "key_result_id" INTEGER REFERENCES "key_results" ("id"),
        "parent_comment_id" INTEGER REFERENCES "comments" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "comments_author_id_idx" ON "comments" ("author_id");
      CREATE INDEX IF NOT EXISTS "comments_objective_id_idx" ON "comments" ("objective_id");
      CREATE INDEX IF NOT EXISTS "comments_key_result_id_idx" ON "comments" ("key_result_id");
      CREATE INDEX IF NOT EXISTS "comments_parent_comment_id_idx" ON "comments" ("parent_comment_id");
    `);
    console.log('Created comments table');
    
    // Create meetings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "meetings" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "start_time" TIMESTAMP NOT NULL,
        "end_time" TIMESTAMP NOT NULL,
        "user_id_1" INTEGER NOT NULL REFERENCES "users" ("id"),
        "user_id_2" INTEGER NOT NULL REFERENCES "users" ("id"),
        "status" VARCHAR(20) DEFAULT 'scheduled',
        "meeting_type" VARCHAR(50) DEFAULT '1on1',
        "location" VARCHAR(255),
        "notes" TEXT,
        "recording_url" TEXT,
        "recurrence" VARCHAR(50),
        "objective_id" INTEGER REFERENCES "objectives" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "meetings_user_id_1_idx" ON "meetings" ("user_id_1");
      CREATE INDEX IF NOT EXISTS "meetings_user_id_2_idx" ON "meetings" ("user_id_2");
      CREATE INDEX IF NOT EXISTS "meetings_objective_id_idx" ON "meetings" ("objective_id");
      CREATE INDEX IF NOT EXISTS "meetings_time_idx" ON "meetings" ("start_time", "end_time");
    `);
    console.log('Created meetings table');
    
    // Create meeting_agenda_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "meeting_agenda_items" (
        "id" SERIAL PRIMARY KEY,
        "meeting_id" INTEGER NOT NULL REFERENCES "meetings" ("id"),
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "order_index" INTEGER DEFAULT 0,
        "status" VARCHAR(20) DEFAULT 'pending',
        "assignee_id" INTEGER REFERENCES "users" ("id"),
        "due_date" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "meeting_agenda_items_meeting_id_idx" ON "meeting_agenda_items" ("meeting_id");
      CREATE INDEX IF NOT EXISTS "meeting_agenda_items_assignee_id_idx" ON "meeting_agenda_items" ("assignee_id");
    `);
    console.log('Created meeting_agenda_items table');
    
    // Create resources table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "resources" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "description" TEXT,
        "type" VARCHAR(50) NOT NULL,
        "url" TEXT,
        "category" VARCHAR(100),
        "tags" TEXT[],
        "author_id" INTEGER REFERENCES "users" ("id"),
        "is_public" BOOLEAN DEFAULT true,
        "download_count" INTEGER DEFAULT 0,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "resources_type_idx" ON "resources" ("type");
      CREATE INDEX IF NOT EXISTS "resources_category_idx" ON "resources" ("category");
      CREATE INDEX IF NOT EXISTS "resources_author_id_idx" ON "resources" ("author_id");
    `);
    console.log('Created resources table');
    
    // Create financial_data table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "financial_data" (
        "id" SERIAL PRIMARY KEY,
        "date" DATE NOT NULL,
        "revenue" REAL,
        "cost" REAL,
        "ebitda" REAL,
        "profit_after_tax_margin" REAL,
        "cumulative_audience" INTEGER,
        "notes" TEXT,
        "objective_id" INTEGER REFERENCES "objectives" ("id"),
        "uploaded_by_id" INTEGER REFERENCES "users" ("id"),
        "team_id" INTEGER REFERENCES "teams" ("id"),
        "quarter" VARCHAR(10),
        "year" INTEGER,
        "source" VARCHAR(100),
        "uploaded_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "financial_data_objective_id_idx" ON "financial_data" ("objective_id");
      CREATE INDEX IF NOT EXISTS "financial_data_uploaded_by_id_idx" ON "financial_data" ("uploaded_by_id");
      CREATE INDEX IF NOT EXISTS "financial_data_team_id_idx" ON "financial_data" ("team_id");
      CREATE INDEX IF NOT EXISTS "financial_data_date_idx" ON "financial_data" ("date");
      CREATE INDEX IF NOT EXISTS "financial_data_quarter_year_idx" ON "financial_data" ("quarter", "year");
    `);
    console.log('Created financial_data table');
    
    // Create notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "notifications" (
        "id" SERIAL PRIMARY KEY,
        "recipient_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "title" VARCHAR(255) NOT NULL,
        "content" TEXT NOT NULL,
        "type" VARCHAR(50) NOT NULL,
        "is_read" BOOLEAN DEFAULT false,
        "entity_type" VARCHAR(50),
        "entity_id" INTEGER,
        "priority" VARCHAR(20) DEFAULT 'normal',
        "additional_data" JSONB,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "notifications_recipient_id_idx" ON "notifications" ("recipient_id");
      CREATE INDEX IF NOT EXISTS "notifications_entity_type_id_idx" ON "notifications" ("entity_type", "entity_id");
      CREATE INDEX IF NOT EXISTS "notifications_is_read_idx" ON "notifications" ("is_read");
    `);
    console.log('Created notifications table');
    
    // Create user_settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_settings" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL UNIQUE REFERENCES "users" ("id"),
        "email_notifications" BOOLEAN DEFAULT true,
        "push_notifications" BOOLEAN DEFAULT true,
        "theme" VARCHAR(20) DEFAULT 'light',
        "dashboard_layout" JSONB,
        "weekly_digest" BOOLEAN DEFAULT true,
        "reminder_frequency" VARCHAR(20) DEFAULT 'daily',
        "timezone" VARCHAR(50) DEFAULT 'UTC',
        "language" VARCHAR(10) DEFAULT 'en',
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
    `);
    console.log('Created user_settings table');
    
    // Create system_settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "system_settings" (
        "id" SERIAL PRIMARY KEY,
        "key" VARCHAR(100) NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "description" TEXT,
        "category" VARCHAR(100) NOT NULL,
        "is_public" BOOLEAN DEFAULT false,
        "last_modified_by_id" INTEGER REFERENCES "users" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "system_settings_category_idx" ON "system_settings" ("category");
      CREATE UNIQUE INDEX IF NOT EXISTS "system_settings_key_idx" ON "system_settings" ("key");
    `);
    console.log('Created system_settings table');
    
    // Create activity_logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "activity_logs" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users" ("id"),
        "action" VARCHAR(100) NOT NULL,
        "entity_type" VARCHAR(50) NOT NULL,
        "entity_id" INTEGER,
        "details" JSONB,
        "ip" VARCHAR(50),
        "user_agent" TEXT,
        "created_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "activity_logs_user_id_idx" ON "activity_logs" ("user_id");
      CREATE INDEX IF NOT EXISTS "activity_logs_action_idx" ON "activity_logs" ("action");
      CREATE INDEX IF NOT EXISTS "activity_logs_entity_type_id_idx" ON "activity_logs" ("entity_type", "entity_id");
      CREATE INDEX IF NOT EXISTS "activity_logs_created_at_idx" ON "activity_logs" ("created_at");
    `);
    console.log('Created activity_logs table');
    
    // Create integrations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "integrations" (
        "id" SERIAL PRIMARY KEY,
        "name" VARCHAR(100) NOT NULL,
        "provider" VARCHAR(100) NOT NULL,
        "status" VARCHAR(20) DEFAULT 'inactive',
        "config" JSONB,
        "metadata" JSONB,
        "last_synced_at" TIMESTAMP,
        "created_by_id" INTEGER REFERENCES "users" ("id"),
        "created_at" TIMESTAMP DEFAULT now() NOT NULL,
        "updated_at" TIMESTAMP DEFAULT now() NOT NULL
      );
      CREATE INDEX IF NOT EXISTS "integrations_provider_idx" ON "integrations" ("provider");
      CREATE INDEX IF NOT EXISTS "integrations_status_idx" ON "integrations" ("status");
      CREATE INDEX IF NOT EXISTS "integrations_created_by_id_idx" ON "integrations" ("created_by_id");
    `);
    console.log('Created integrations table');
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Execute the setup function
setup();