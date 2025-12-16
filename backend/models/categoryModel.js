const { pool } = require('../config/db');

const CATEGORY_COLUMNS = ['id', 'name', 'slug', 'description', 'icon', 'is_active', 'created_at', 'updated_at'];
const SUBCATEGORY_COLUMNS = ['id', 'category_id', 'name', 'slug', 'description', 'is_active', 'created_at', 'updated_at'];

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function getAllCategories() {
  const query = `
    SELECT c.${CATEGORY_COLUMNS.join(', c.')},
           COUNT(s.id) AS subcategory_count
    FROM categories c
    LEFT JOIN subcategories s ON s.category_id = c.id AND s.is_active = true
    WHERE c.is_active = true
    GROUP BY c.id
    ORDER BY c.name ASC;
  `;
  
  const { rows } = await pool.query(query);
  return rows;
}

async function getCategoryBySlug(slug) {
  const query = `
    SELECT ${CATEGORY_COLUMNS.join(', ')}
    FROM categories
    WHERE slug = $1 AND is_active = true;
  `;
  
  const { rows } = await pool.query(query, [slug]);
  return rows[0] || null;
}

async function getCategoryById(id) {
  const query = `
    SELECT ${CATEGORY_COLUMNS.join(', ')}
    FROM categories
    WHERE id = $1;
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function createCategory(data) {
  const { name, description, icon } = data;
  const slug = generateSlug(name);
  
  const query = `
    INSERT INTO categories (name, slug, description, icon)
    VALUES ($1, $2, $3, $4)
    RETURNING ${CATEGORY_COLUMNS.join(', ')};
  `;
  
  const values = [name, slug, description || null, icon || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateCategory(id, data) {
  const allowedFields = ['name', 'description', 'icon', 'is_active'];
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
  
  if (data.name) {
    updates.push(`slug = $${paramCount}`);
    values.push(generateSlug(data.name));
    paramCount++;
  }
  
  if (updates.length === 0) {
    return getCategoryById(id);
  }
  
  updates.push(`updated_at = NOW()`);
  values.push(id);
  
  const query = `
    UPDATE categories
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING ${CATEGORY_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteCategory(id) {
  const query = `
    UPDATE categories
    SET is_active = false, updated_at = NOW()
    WHERE id = $1
    RETURNING ${CATEGORY_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function getSubcategoriesByCategoryId(categoryId) {
  const query = `
    SELECT ${SUBCATEGORY_COLUMNS.join(', ')}
    FROM subcategories
    WHERE category_id = $1 AND is_active = true
    ORDER BY name ASC;
  `;
  
  const { rows } = await pool.query(query, [categoryId]);
  return rows;
}

async function getSubcategoryById(id) {
  const query = `
    SELECT ${SUBCATEGORY_COLUMNS.join(', ')}
    FROM subcategories
    WHERE id = $1;
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function createSubcategory(data) {
  const { category_id, name, description } = data;
  const slug = generateSlug(name);
  
  const query = `
    INSERT INTO subcategories (category_id, name, slug, description)
    VALUES ($1, $2, $3, $4)
    RETURNING ${SUBCATEGORY_COLUMNS.join(', ')};
  `;
  
  const values = [category_id, name, slug, description || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function updateSubcategory(id, data) {
  const allowedFields = ['name', 'description', 'category_id', 'is_active'];
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
  
  if (data.name) {
    updates.push(`slug = $${paramCount}`);
    values.push(generateSlug(data.name));
    paramCount++;
  }
  
  if (updates.length === 0) {
    return getSubcategoryById(id);
  }
  
  updates.push(`updated_at = NOW()`);
  values.push(id);
  
  const query = `
    UPDATE subcategories
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING ${SUBCATEGORY_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteSubcategory(id) {
  const query = `
    UPDATE subcategories
    SET is_active = false, updated_at = NOW()
    WHERE id = $1
    RETURNING ${SUBCATEGORY_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  getAllCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategoryId,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
  generateSlug
};
