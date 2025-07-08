const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // This is REQUIRED for Render's managed PostgreSQL
  },
});

module.exports = pool;



