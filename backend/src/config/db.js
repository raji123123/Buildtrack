const { Pool } = require('pg');

const pool = new Pool({
  host: 'db.ddtuyvbiarewobajwlfu.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Buildtrack@2025',
  ssl: {
    rejectUnauthorized: false
  }
});

pool.connect()
  .then(() => console.log('Connected to Supabase successfully!'))
  .catch(err => console.log('Database connection failed:', err));

module.exports = pool;