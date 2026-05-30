const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-ap-northeast-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.ddtuyvbiarewobajwlfu',
  password: 'Buildtrack@2025',
  ssl: {
    rejectUnauthorized: false
  },
  family: 4
});

pool.connect()
  .then(() => console.log('Connected to Supabase successfully!'))
  .catch(err => console.log('Database connection failed:', err));

module.exports = pool;