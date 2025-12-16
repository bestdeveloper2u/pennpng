const { pool } = require('../config/db');

// Expects a `files` table with these columns and a default timestamp on `created_at`.
const FILE_COLUMNS = ['id', 'filename', 'original_name', 'mimetype', 'size', 'url', 'created_at'];

async function createFile({ filename, originalName, mimetype, size, url }) {
  const query = `
    INSERT INTO files (filename, original_name, mimetype, size, url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING ${FILE_COLUMNS.join(', ')};
  `;

  const values = [filename, originalName, mimetype, size, url];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getFiles() {
  const { rows } = await pool.query(
    `SELECT ${FILE_COLUMNS.join(', ')} FROM files ORDER BY created_at DESC;`
  );
  return rows;
}

module.exports = { createFile, getFiles };
