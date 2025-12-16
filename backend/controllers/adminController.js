const { pool } = require('../config/db');
const { deleteCache } = require('../config/redis');

async function getDashboardStats(req, res) {
  try {
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM images) as total_images,
        (SELECT COUNT(*) FROM images WHERE status = 'pending') as pending_images,
        (SELECT COUNT(*) FROM images WHERE status = 'approved') as approved_images,
        (SELECT COUNT(*) FROM images WHERE status = 'rejected') as rejected_images,
        (SELECT COALESCE(SUM(download_count), 0) FROM images) as total_downloads,
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM categories) as total_categories
    `);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
}

async function getAdminImages(req, res) {
  try {
    const { status = 'all', page = 1, limit = 20, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT i.*, c.name as category_name, sc.name as subcategory_name,
             u.username, u.email, u.first_name, u.last_name,
             array_agg(DISTINCT ik.keyword) FILTER (WHERE ik.keyword IS NOT NULL) as keywords
      FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories sc ON i.subcategory_id = sc.id
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE 1=1
    `;
    
    const params = [];
    let paramIndex = 1;
    
    if (status !== 'all') {
      query += ` AND i.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND i.title ILIKE $${paramIndex}`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` GROUP BY i.id, c.name, sc.name, u.username, u.email, u.first_name, u.last_name`;
    query += ` ORDER BY i.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM images WHERE 1=1';
    const countParams = [];
    let countParamIndex = 1;
    
    if (status !== 'all') {
      countQuery += ` AND status = $${countParamIndex}`;
      countParams.push(status);
      countParamIndex++;
    }
    
    if (search) {
      countQuery += ` AND title ILIKE $${countParamIndex}`;
      countParams.push(`%${search}%`);
    }
    
    const countResult = await pool.query(countQuery, countParams);
    
    res.json({
      images: result.rows.map(img => ({
        id: img.id,
        title: img.title,
        slug: img.slug,
        description: img.description,
        filePath: img.file_path,
        thumbnailPath: img.thumbnail_path,
        status: img.status,
        category: img.category_name,
        subcategory: img.subcategory_name,
        downloadCount: img.download_count,
        viewCount: img.view_count,
        keywords: img.keywords || [],
        contributor: {
          username: img.username,
          email: img.email,
          firstName: img.first_name,
          lastName: img.last_name
        },
        createdAt: img.created_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get admin images error:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
}

async function updateImageStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, categoryId, subcategoryId, title, description } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    let updateQuery = `
      UPDATE images SET status = $1, updated_at = CURRENT_TIMESTAMP
    `;
    const params = [status];
    let paramIndex = 2;
    
    if (status === 'approved') {
      updateQuery += `, approved_at = CURRENT_TIMESTAMP, approved_by = $${paramIndex}`;
      params.push(req.user.userId);
      paramIndex++;
    }
    
    if (categoryId !== undefined) {
      updateQuery += `, category_id = $${paramIndex}`;
      params.push(categoryId || null);
      paramIndex++;
    }
    
    if (subcategoryId !== undefined) {
      updateQuery += `, subcategory_id = $${paramIndex}`;
      params.push(subcategoryId || null);
      paramIndex++;
    }
    
    if (title !== undefined) {
      updateQuery += `, title = $${paramIndex}`;
      params.push(title);
      paramIndex++;
    }
    
    if (description !== undefined) {
      updateQuery += `, description = $${paramIndex}`;
      params.push(description);
      paramIndex++;
    }
    
    updateQuery += ` WHERE id = $${paramIndex} RETURNING *`;
    params.push(id);
    
    const result = await pool.query(updateQuery, params);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    await deleteCache('images:*');
    await deleteCache('search:*');
    
    res.json({
      message: 'Image updated successfully',
      image: result.rows[0]
    });
  } catch (error) {
    console.error('Update image status error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
}

async function updateImageKeywords(req, res) {
  try {
    const { id } = req.params;
    const { keywords } = req.body;
    
    await pool.query('DELETE FROM image_keywords WHERE image_id = $1', [id]);
    
    if (keywords && keywords.length > 0) {
      for (const keyword of keywords) {
        await pool.query(
          'INSERT INTO image_keywords (image_id, keyword) VALUES ($1, $2)',
          [id, keyword.toLowerCase().trim()]
        );
      }
    }
    
    await deleteCache('images:*');
    await deleteCache('search:*');
    await deleteCache('trending-tags');
    
    res.json({ message: 'Keywords updated successfully' });
  } catch (error) {
    console.error('Update keywords error:', error);
    res.status(500).json({ error: 'Failed to update keywords' });
  }
}

async function bulkUpdateStatus(req, res) {
  try {
    const { imageIds, status } = req.body;
    
    if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
      return res.status(400).json({ error: 'Image IDs are required' });
    }
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    await pool.query(`
      UPDATE images SET status = $1, updated_at = CURRENT_TIMESTAMP,
      approved_at = CASE WHEN $1 = 'approved' THEN CURRENT_TIMESTAMP ELSE approved_at END,
      approved_by = CASE WHEN $1 = 'approved' THEN $2 ELSE approved_by END
      WHERE id = ANY($3::int[])
    `, [status, req.user.userId, imageIds]);
    
    await deleteCache('images:*');
    await deleteCache('search:*');
    
    res.json({ message: `${imageIds.length} images updated to ${status}` });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ error: 'Failed to update images' });
  }
}

async function deleteImage(req, res) {
  try {
    const { id } = req.params;
    
    const result = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    await deleteCache('images:*');
    await deleteCache('search:*');
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}

async function getUsers(req, res) {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT u.*, 
             (SELECT COUNT(*) FROM images WHERE user_id = u.id) as image_count,
             (SELECT COALESCE(SUM(download_count), 0) FROM images WHERE user_id = u.id) as total_downloads
      FROM users u WHERE 1=1
    `;
    const params = [];
    let paramIndex = 1;
    
    if (role) {
      query += ` AND role = $${paramIndex}`;
      params.push(role);
      paramIndex++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM users WHERE 1=1';
    if (role) {
      countQuery += ' AND role = $1';
    }
    const countResult = await pool.query(countQuery, role ? [role] : []);
    
    res.json({
      users: result.rows.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        firstName: u.first_name,
        lastName: u.last_name,
        role: u.role,
        isActive: u.is_active,
        imageCount: parseInt(u.image_count),
        totalDownloads: parseInt(u.total_downloads),
        createdAt: u.created_at
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
}

async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (role) {
      updates.push(`role = $${paramIndex}`);
      params.push(role);
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
      `UPDATE users SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${paramIndex} RETURNING *`,
      params
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}

module.exports = {
  getDashboardStats,
  getAdminImages,
  updateImageStatus,
  updateImageKeywords,
  bulkUpdateStatus,
  deleteImage,
  getUsers,
  updateUserRole
};
