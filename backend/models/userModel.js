const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

const USER_COLUMNS = ['id', 'email', 'username', 'role', 'first_name', 'last_name', 'phone', 'avatar_url', 'is_active', 'created_at', 'updated_at'];
const USER_COLUMNS_WITH_PASSWORD = [...USER_COLUMNS, 'password_hash as password'];

async function createUser({ email, username, password, role = 'contributor' }) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  
  const query = `
    INSERT INTO users (email, username, password_hash, role, is_active)
    VALUES ($1, $2, $3, $4, true)
    RETURNING ${USER_COLUMNS.join(', ')};
  `;
  
  const values = [email, username, hashedPassword, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function findByEmail(email) {
  const query = `
    SELECT ${USER_COLUMNS_WITH_PASSWORD.join(', ')}
    FROM users
    WHERE email = $1;
  `;
  
  const { rows } = await pool.query(query, [email]);
  return rows[0] || null;
}

async function findById(id) {
  const query = `
    SELECT ${USER_COLUMNS.join(', ')}
    FROM users
    WHERE id = $1;
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function findByUsername(username) {
  const query = `
    SELECT ${USER_COLUMNS_WITH_PASSWORD.join(', ')}
    FROM users
    WHERE username = $1;
  `;
  
  const { rows } = await pool.query(query, [username]);
  return rows[0] || null;
}

async function updateUser(id, data) {
  const allowedFields = ['email', 'username', 'role'];
  const updates = [];
  const values = [];
  let paramCount = 1;
  
  for (const [key, value] of Object.entries(data)) {
    if (allowedFields.includes(key) && value !== undefined) {
      updates.push(`${key} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }
  
  if (updates.length === 0) {
    return findById(id);
  }
  
  updates.push(`updated_at = NOW()`);
  values.push(id);
  
  const query = `
    UPDATE users
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING ${USER_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function updatePassword(id, newPassword) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  
  const query = `
    UPDATE users
    SET password_hash = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING ${USER_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, [hashedPassword, id]);
  return rows[0] || null;
}

async function getContributors() {
  const query = `
    SELECT ${USER_COLUMNS.join(', ')}
    FROM users
    WHERE role = 'contributor'
    ORDER BY created_at DESC;
  `;
  
  const { rows } = await pool.query(query);
  return rows;
}

async function getAllUsers() {
  const query = `
    SELECT ${USER_COLUMNS.join(', ')}
    FROM users
    ORDER BY created_at DESC;
  `;
  
  const { rows } = await pool.query(query);
  return rows;
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findByUsername,
  updateUser,
  updatePassword,
  getContributors,
  getAllUsers,
  comparePassword
};
