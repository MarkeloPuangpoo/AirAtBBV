// src/lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true, // Neon ต้องการ SSL
});

export default pool;
