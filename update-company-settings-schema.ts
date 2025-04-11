import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './shared/schema';
import ws from 'ws';

// Configure neon to use the ws package for WebSocket
neonConfig.webSocketConstructor = ws;

async function updateCompanySettingsSchema() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  // Connect to the database
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log('Connected to database, creating company_settings table...');

  try {
    // Create the company_settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_settings (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL DEFAULT 'My Company',
        logo_url TEXT,
        primary_color TEXT DEFAULT '#4f46e5',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if we need to insert the default record
    const result = await pool.query('SELECT COUNT(*) FROM company_settings');
    const count = parseInt(result.rows[0].count);
    
    if (count === 0) {
      // Insert default settings
      await pool.query(`
        INSERT INTO company_settings (name, primary_color)
        VALUES ('My Company', '#4f46e5');
      `);
      console.log('Inserted default company settings');
    }

    console.log('Successfully created company_settings table!');
  } catch (error) {
    console.error('Error creating company_settings table:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

updateCompanySettingsSchema()
  .then(() => {
    console.log('Schema update completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Schema update failed:', error);
    process.exit(1);
  });