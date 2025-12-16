const { Pool } = require('pg');

const connectionOptions = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT) || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'pern_uploads',
    };

const pool = new Pool(connectionOptions);

pool.on('error', (err) => {
  console.error('Unexpected Postgres error', err);
});

module.exports = { pool };
