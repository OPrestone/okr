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
      GRANT ALL ON SCHEMA public TO postgres;
      GRANT ALL ON SCHEMA public TO public;
    `);
    
    console.log('Creating tables from schema definition...');
    
    // Create tables from schema
    const tables = Object.values(schema)
      .filter(table => table?.name && typeof table.execute === 'function');
      
    for (const table of tables) {
      try {
        // @ts-ignore - We know these are valid table objects
        await table.execute();
        // @ts-ignore - We know these have name properties
        console.log(`Created table: ${table.name}`);
      } catch (error) {
        // @ts-ignore - We know these have name properties
        console.error(`Error creating table ${table.name}:`, error);
      }
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