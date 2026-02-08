const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'website_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

pool.on('error', (err) => {
  console.error('PostgreSQL Connection Error:', err.message);
  console.error('\nMake sure:');
  console.error('1. PostgreSQL is installed and running');
  console.error('2. Database "website_db" exists');
  console.error('3. Credentials in .env match your PostgreSQL setup');
  console.error('4. Run: node scripts/seed.js to initialize tables\n');
});

module.exports = pool;
