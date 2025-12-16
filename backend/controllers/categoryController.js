const { pool } = require('../config/db');
const { getCache, setCache, deleteCache } = require('../config/redis');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function getCategories(req, res) {
  try {
    const cached = await getCache('categories');
    if (cached) {
      return res.json(cached);
    }
    
    const result = await pool.query(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM images WHERE category_id = c.id AND status = 'approved') as image_count
      FROM categories c
      WHERE c.is_active = true
      ORDER BY c.name
    `);
    
    const categories = result.rows.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      imageUrl: c.image_url,
      imageCount: parseInt(c.image_count)
    }));
    
    await setCache('categories', categories, 600);
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
}

async function getCategoryBySlug(req, res) {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(`
      SELECT c.*, 
             (SELECT COUNT(*) FROM images WHERE category_id = c.id AND status = 'approved') as image_count
      FROM categories c
      WHERE c.slug = $1 AND c.is_active = true
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const subcategoriesResult = await pool.query(`
      SELECT sc.*, 
             (SELECT COUNT(*) FROM images WHERE subcategory_id = sc.id AND status = 'approved') as image_count
      FROM subcategories sc
      WHERE sc.category_id = $1 AND sc.is_active = true
      ORDER BY sc.name
    `, [result.rows[0].id]);
    
    const category = result.rows[0];
    res.json({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageUrl: category.image_url,
      imageCount: parseInt(category.image_count),
      subcategories: subcategoriesResult.rows.map(sc => ({
        id: sc.id,
        name: sc.name,
        slug: sc.slug,
        imageCount: parseInt(sc.image_count)
      }))
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to get category' });
  }
}

async function getSubcategories(req, res) {
  try {
    const { categoryId } = req.query;
    
    let query = `
      SELECT sc.*, c.name as category_name, c.slug as category_slug,
             (SELECT COUNT(*) FROM images WHERE subcategory_id = sc.id AND status = 'approved') as image_count
      FROM subcategories sc
      JOIN categories c ON sc.category_id = c.id
      WHERE sc.is_active = true
    `;
    const params = [];
    
    if (categoryId) {
      query += ' AND sc.category_id = $1';
      params.push(categoryId);
    }
    
    query += ' ORDER BY sc.name';
    
    const result = await pool.query(query, params);
    
    res.json(result.rows.map(sc => ({
      id: sc.id,
      name: sc.name,
      slug: sc.slug,
      categoryId: sc.category_id,
      categoryName: sc.category_name,
      categorySlug: sc.category_slug,
      imageCount: parseInt(sc.image_count)
    })));
  } catch (error) {
    console.error('Get subcategories error:', error);
    res.status(500).json({ error: 'Failed to get subcategories' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, description, imageUrl } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    
    const slug = slugify(name);
    
    const result = await pool.query(`
      INSERT INTO categories (name, slug, description, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [name, slug, description || null, imageUrl || null]);
    
    await deleteCache('categories');
    
    res.status(201).json({
      message: 'Category created successfully',
      category: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Category with this name already exists' });
    }
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
}

async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, imageUrl, isActive } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (name) {
      updates.push(`name = $${paramIndex}`, `slug = $${paramIndex + 1}`);
      params.push(name, slugify(name));
      paramIndex += 2;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }
    
    if (imageUrl !== undefined) {
      updates.push(`image_url = $${paramIndex}`);
      params.push(imageUrl);
      paramIndex++;
    }
    
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      params.push(isActive);
      paramIndex++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    params.push(id);
    const result = await pool.query(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await deleteCache('categories');
    
    res.json({
      message: 'Category updated successfully',
      category: result.rows[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
}

async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await deleteCache('categories');
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
}

async function createSubcategory(req, res) {
  try {
    const { categoryId, name, description } = req.body;
    
    if (!categoryId || !name) {
      return res.status(400).json({ error: 'Category ID and name are required' });
    }
    
    const slug = slugify(name);
    
    const result = await pool.query(`
      INSERT INTO subcategories (category_id, name, slug, description)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [categoryId, name, slug, description || null]);
    
    await deleteCache('categories');
    
    res.status(201).json({
      message: 'Subcategory created successfully',
      subcategory: result.rows[0]
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Subcategory with this name already exists in this category' });
    }
    console.error('Create subcategory error:', error);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
}

async function updateSubcategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, isActive } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (name) {
      updates.push(`name = $${paramIndex}`, `slug = $${paramIndex + 1}`);
      params.push(name, slugify(name));
      paramIndex += 2;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }
    
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramIndex}`);
      params.push(isActive);
      paramIndex++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No updates provided' });
    }
    
    params.push(id);
    const result = await pool.query(
      `UPDATE subcategories SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    res.json({
      message: 'Subcategory updated successfully',
      subcategory: result.rows[0]
    });
  } catch (error) {
    console.error('Update subcategory error:', error);
    res.status(500).json({ error: 'Failed to update subcategory' });
  }
}

async function deleteSubcategory(req, res) {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM subcategories WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }
    
    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.error('Delete subcategory error:', error);
    res.status(500).json({ error: 'Failed to delete subcategory' });
  }
}

module.exports = {
  getCategories,
  getCategoryBySlug,
  getSubcategories,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};
