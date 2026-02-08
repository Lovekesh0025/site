require('dotenv').config();

// Check if PostgreSQL should be used (based on env or direct fallback)
const usePostgres = process.env.USE_POSTGRESQL === 'true';

let pool;

if (usePostgres) {
  try {
    const { Pool } = require('pg');
    pool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      database: process.env.DB_NAME || 'website_db',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
    });

    pool.on('error', (err) => {
      console.error('PostgreSQL Connection Error:', err.message);
    });

    console.log('Using PostgreSQL database');
  } catch (err) {
    console.error('PostgreSQL not available, using mock database');
    pool = require('./mock-database');
  }
} else {
  console.log('Using mock database (no PostgreSQL)');
  pool = require('./mock-database');
}

module.exports = pool;
