const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 5432,
  database: process.env.DB_NAME     || 'eventhive',
  user:     process.env.DB_USER     || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err.message);
});

pool.connect()
  .then(client => {
    console.log('\x1b[32m✔ Connected to PostgreSQL\x1b[0m');
    client.release();
  })
  .catch(err => console.error('\x1b[33m⚠ PostgreSQL connection failed:', err.message, '\x1b[0m'));

module.exports = pool;
