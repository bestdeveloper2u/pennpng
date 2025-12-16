const { pool } = require('../config/db');

async function getContributorDashboard(req, res) {
  try {
    const userId = req.user.userId;
    
    const stats = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM images WHERE user_id = $1) as total_images,
        (SELECT COUNT(*) FROM images WHERE user_id = $1 AND status = 'pending') as pending_images,
        (SELECT COUNT(*) FROM images WHERE user_id = $1 AND status = 'approved') as approved_images,
        (SELECT COUNT(*) FROM images WHERE user_id = $1 AND status = 'rejected') as rejected_images,
        (SELECT COALESCE(SUM(download_count), 0) FROM images WHERE user_id = $1) as total_downloads
    `, [userId]);
    
    res.json(stats.rows[0]);
  } catch (error) {
    console.error('Contributor dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard stats' });
  }
}

async function getContributorImages(req, res) {
  try {
    const userId = req.user.userId;
    const { status = 'all', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT i.*, c.name as category_name, sc.name as subcategory_name,
             array_agg(DISTINCT ik.keyword) FILTER (WHERE ik.keyword IS NOT NULL) as keywords
      FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories sc ON i.subcategory_id = sc.id
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE i.user_id = $1
    `;
    
    const params = [userId];
    let paramIndex = 2;
    
    if (status !== 'all') {
      query += ` AND i.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }
    
    query += ` GROUP BY i.id, c.name, sc.name ORDER BY i.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    let countQuery = 'SELECT COUNT(*) as total FROM images WHERE user_id = $1';
    const countParams = [userId];
    
    if (status !== 'all') {
      countQuery += ' AND status = $2';
      countParams.push(status);
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
    console.error('Get contributor images error:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
}

async function updateContributorImage(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { title, description, keywords, categoryId, subcategoryId } = req.body;
    
    const imageCheck = await pool.query(
      'SELECT * FROM images WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    
    if (imageCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found or you do not have permission' });
    }
    
    const image = imageCheck.rows[0];
    
    if (image.status === 'approved') {
      return res.status(400).json({ error: 'Cannot edit approved images' });
    }
    
    const updates = [];
    const params = [];
    let paramIndex = 1;
    
    if (title) {
      updates.push(`title = $${paramIndex}`);
      params.push(title);
      paramIndex++;
    }
    
    if (description !== undefined) {
      updates.push(`description = $${paramIndex}`);
      params.push(description);
      paramIndex++;
    }
    
    if (categoryId !== undefined) {
      updates.push(`category_id = $${paramIndex}`);
      params.push(categoryId || null);
      paramIndex++;
    }
    
    if (subcategoryId !== undefined) {
      updates.push(`subcategory_id = $${paramIndex}`);
      params.push(subcategoryId || null);
      paramIndex++;
    }
    
    if (updates.length > 0) {
      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      params.push(id);
      await pool.query(
        `UPDATE images SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
        params
      );
    }
    
    if (keywords !== undefined) {
      await pool.query('DELETE FROM image_keywords WHERE image_id = $1', [id]);
      
      if (keywords && keywords.length > 0) {
        for (const keyword of keywords) {
          await pool.query(
            'INSERT INTO image_keywords (image_id, keyword) VALUES ($1, $2)',
            [id, keyword.toLowerCase().trim()]
          );
        }
      }
    }
    
    res.json({ message: 'Image updated successfully' });
  } catch (error) {
    console.error('Update contributor image error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
}

async function deleteContributorImage(req, res) {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM images WHERE id = $1 AND user_id = $2 AND status != $3 RETURNING *',
      [id, userId, 'approved']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found, you do not have permission, or the image is already approved' });
    }
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete contributor image error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}

module.exports = {
  getContributorDashboard,
  getContributorImages,
  updateContributorImage,
  deleteContributorImage
};
