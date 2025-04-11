import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { exec } from 'child_process';
import * as util from 'util';

// Required for Neon serverless
neonConfig.webSocketConstructor = ws;

// Promisify exec
const execPromise = util.promisify(exec);

// Check for database URL
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Generate schema and apply directly to database
async function generateAndPushSchema() {
  try {
    console.log('Generating schema SQL...');
    
    // Generate SQL migration (similar to drizzle-kit push)
    await execPromise('npx drizzle-kit generate:pg');
    console.log('Schema SQL generated successfully');
    
    // Push the schema to the database
    console.log('Pushing schema to database...');
    await execPromise('npx drizzle-kit push:pg');
    console.log('Schema push completed!');
    
    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Schema generation or push failed:', error);
  }
}

generateAndPushSchema().catch(console.error);