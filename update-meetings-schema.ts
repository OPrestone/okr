import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema';
import ws from 'ws';

// Configure neon to use the ws package for WebSocket
neonConfig.webSocketConstructor = ws;

async function updateMeetingsSchema() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  // Connect to the database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Connected to database, updating meetings table schema...');

  try {
    // Add the new columns to the meetings table
    await pool.query(`
      ALTER TABLE meetings
      ADD COLUMN IF NOT EXISTS is_virtual BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS meeting_link TEXT;
    `);

    console.log('Successfully updated meetings table schema!');
  } catch (error) {
    console.error('Error updating meetings table schema:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateMeetingsSchema()
  .then(() => {
    console.log('Schema update completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Schema update failed:', error);
    process.exit(1);
  });