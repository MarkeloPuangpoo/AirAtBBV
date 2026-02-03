// src/lib/db.ts
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL is missing. Please add it to Vercel Environment Variables.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default pool;
