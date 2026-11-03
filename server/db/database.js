import { config } from "dotenv";
import { Pool } from "pg";

config();

const isRemoteDb = process.env.DATABASE_URL &&
    !process.env.DATABASE_URL.includes("localhost") &&
    !process.env.DATABASE_URL.includes("127.0.0.1");

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined
});

pool.on('error', (err, client) => {
    // Log dropped idle client without crashing the entire Node.js server.
    // node-postgres will automatically discard the dead socket and allocate a fresh one on demand.
    console.warn('[PostgreSQL Pool Warning] Unexpected idle client error:', err.message);
});

export default pool;
