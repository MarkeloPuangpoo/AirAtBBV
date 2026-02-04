// src/lib/db.ts
import { Pool } from 'pg';

if (!process.env.DATABASE_URL) {
    throw new Error("❌ DATABASE_URL is missing. Please add it to Vercel Environment Variables.");
}

// Fix for "SECURITY WARNING: The SSL modes 'prefer', 'require', and 'verify-ca' are treated as aliases for 'verify-full'"
// We append uselibpqcompat=true to opt-in to the standard libpq behavior (which preserves our current ability to skip verification via sslmode=require or rejectUnauthorized: false)
let connectionString = process.env.DATABASE_URL;
if (connectionString && !connectionString.includes('uselibpqcompat')) {
    connectionString += connectionString.includes('?') ? '&' : '?';
    connectionString += 'sslmode=require&uselibpqcompat=true';
}

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

export default pool;
