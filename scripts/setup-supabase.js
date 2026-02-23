const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("❌ SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing. Please add them to .env.local.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTable() {
    console.log("Setting up the database...");

    // Since Supabase data API doesn't support DDL (CREATE TABLE) easily without RPC, 
    // It's generally recommended to create the table via Supabase Dashboard UI or SQL Editor.
    // However, we can try using the Postgres connection if pg is available, or guide the user.

    // Instructing user for best practice in Supabase
    console.log(`
  Please run the following SQL command in your Supabase SQL Editor:
  
  CREATE TABLE IF NOT EXISTS aq_history (
      id SERIAL PRIMARY KEY,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      pm25 REAL,
      pm10 REAL,
      temperature REAL,
      humidity REAL,
      wind_speed REAL,
      wind_direction REAL
  );
  `);

    console.log("Once created, the API will be able to insert data into it.");
}

createTable();
