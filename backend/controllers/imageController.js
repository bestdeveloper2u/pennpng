const { pool } = require('../config/db');
const { getCache, setCache, deleteCache } = require('../config/redis');
const { addImageToQueue } = require('../config/queue');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }
    
    const { title, description, keywords, categoryId, subcategoryId } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const slug = `${slugify(title)}-${uuidv4().slice(0, 8)}`;
    const filePath = `/uploads/${req.file.filename}`;
    
    const result = await pool.query(`
      INSERT INTO images (user_id, title, slug, description, file_path, category_id, subcategory_id, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
      RETURNING *
    `, [
      req.user.userId,
      title,
      slug,
      description || null,
      filePath,
      categoryId || null,
      subcategoryId || null
    ]);
    
    const image = result.rows[0];
    
    if (keywords) {
      const keywordList = keywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k);
      for (const keyword of keywordList) {
        await pool.query(
          'INSERT INTO image_keywords (image_id, keyword) VALUES ($1, $2)',
          [image.id, keyword]
        );
      }
    }
    
    const imagePath = path.join(__dirname, '..', 'uploads', req.file.filename);
    await addImageToQueue(imagePath, image.id);
    
    await deleteCache('images:*');
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      image: {
        id: image.id,
        title: image.title,
        slug: image.slug,
        status: image.status,
        filePath: image.file_path
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}

async function getImages(req, res) {
  try {
    const { page = 1, limit = 20, category, subcategory, search, status = 'approved' } = req.query;
    const offset = (page - 1) * limit;
    
    const cacheKey = `images:${JSON.stringify(req.query)}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    let query = `
      SELECT i.*, c.name as category_name, c.slug as category_slug,
             sc.name as subcategory_name, u.username as contributor_username,
             array_agg(DISTINCT ik.keyword) FILTER (WHERE ik.keyword IS NOT NULL) as keywords
      FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories sc ON i.subcategory_id = sc.id
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE i.status = $1
    `;
    
    const params = [status];
    let paramIndex = 2;
    
    if (category) {
      query += ` AND c.slug = $${paramIndex}`;
      params.push(category);
      paramIndex++;
    }
    
    if (subcategory) {
      query += ` AND sc.slug = $${paramIndex}`;
      params.push(subcategory);
      paramIndex++;
    }
    
    if (search) {
      query += ` AND (i.title ILIKE $${paramIndex} OR i.description ILIKE $${paramIndex} OR EXISTS (SELECT 1 FROM image_keywords k WHERE k.image_id = i.id AND k.keyword ILIKE $${paramIndex}))`;
      params.push(`%${search}%`);
      paramIndex++;
    }
    
    query += ` GROUP BY i.id, c.name, c.slug, sc.name, u.username ORDER BY i.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(limit, offset);
    
    const result = await pool.query(query, params);
    
    const countQuery = `
      SELECT COUNT(DISTINCT i.id) as total FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories sc ON i.subcategory_id = sc.id
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE i.status = $1
      ${category ? 'AND c.slug = $2' : ''}
      ${subcategory ? `AND sc.slug = $${category ? 3 : 2}` : ''}
      ${search ? `AND (i.title ILIKE $${(category ? 1 : 0) + (subcategory ? 1 : 0) + 2} OR EXISTS (SELECT 1 FROM image_keywords k WHERE k.image_id = i.id AND k.keyword ILIKE $${(category ? 1 : 0) + (subcategory ? 1 : 0) + 2}))` : ''}
    `;
    
    const countResult = await pool.query(
      'SELECT COUNT(*) as total FROM images WHERE status = $1',
      [status]
    );
    
    const response = {
      images: result.rows.map(img => ({
        id: img.id,
        title: img.title,
        slug: img.slug,
        description: img.description,
        filePath: img.file_path,
        thumbnailPath: img.thumbnail_path,
        category: img.category_name,
        categorySlug: img.category_slug,
        subcategory: img.subcategory_name,
        contributor: img.contributor_username,
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
    };
    
    await setCache(cacheKey, response);
    res.json(response);
  } catch (error) {
    console.error('Get images error:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
}

async function getImageBySlug(req, res) {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(`
      SELECT i.*, c.name as category_name, c.slug as category_slug,
             sc.name as subcategory_name, u.username as contributor_username,
             u.first_name as contributor_first_name, u.last_name as contributor_last_name,
             array_agg(DISTINCT ik.keyword) FILTER (WHERE ik.keyword IS NOT NULL) as keywords
      FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN subcategories sc ON i.subcategory_id = sc.id
      LEFT JOIN users u ON i.user_id = u.id
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE i.slug = $1 AND i.status = 'approved'
      GROUP BY i.id, c.name, c.slug, sc.name, u.username, u.first_name, u.last_name
    `, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    await pool.query('UPDATE images SET view_count = view_count + 1 WHERE slug = $1', [slug]);
    
    const img = result.rows[0];
    
    const relatedResult = await pool.query(`
      SELECT id, title, slug, thumbnail_path, file_path FROM images
      WHERE category_id = $1 AND id != $2 AND status = 'approved'
      ORDER BY RANDOM() LIMIT 8
    `, [img.category_id, img.id]);
    
    res.json({
      image: {
        id: img.id,
        title: img.title,
        slug: img.slug,
        description: img.description,
        filePath: img.file_path,
        thumbnailPath: img.thumbnail_path,
        width: img.width,
        height: img.height,
        fileSize: img.file_size,
        format: img.format,
        category: img.category_name,
        categorySlug: img.category_slug,
        subcategory: img.subcategory_name,
        contributor: img.contributor_username,
        contributorName: `${img.contributor_first_name || ''} ${img.contributor_last_name || ''}`.trim(),
        downloadCount: img.download_count,
        viewCount: img.view_count + 1,
        keywords: img.keywords || [],
        createdAt: img.created_at
      },
      relatedImages: relatedResult.rows.map(r => ({
        id: r.id,
        title: r.title,
        slug: r.slug,
        thumbnailPath: r.thumbnail_path || r.file_path
      }))
    });
  } catch (error) {
    console.error('Get image error:', error);
    res.status(500).json({ error: 'Failed to get image' });
  }
}

async function downloadImage(req, res) {
  try {
    const { slug } = req.params;
    
    const result = await pool.query(
      'SELECT * FROM images WHERE slug = $1 AND status = $2',
      [slug, 'approved']
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const image = result.rows[0];
    
    await pool.query('UPDATE images SET download_count = download_count + 1 WHERE id = $1', [image.id]);
    
    await pool.query(`
      INSERT INTO downloads (image_id, user_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
    `, [
      image.id,
      req.user?.userId || null,
      req.ip,
      req.get('User-Agent')
    ]);
    
    const filePath = path.join(__dirname, '..', image.file_path);
    res.download(filePath, `${image.title}.png`);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to download image' });
  }
}

async function getTrendingTags(req, res) {
  try {
    const cached = await getCache('trending-tags');
    if (cached) {
      return res.json(cached);
    }
    
    const result = await pool.query(`
      SELECT keyword, COUNT(*) as count
      FROM image_keywords ik
      JOIN images i ON ik.image_id = i.id
      WHERE i.status = 'approved'
      GROUP BY keyword
      ORDER BY count DESC
      LIMIT 20
    `);
    
    const tags = result.rows.map(r => r.keyword);
    await setCache('trending-tags', tags, 600);
    
    res.json(tags);
  } catch (error) {
    console.error('Get trending tags error:', error);
    res.status(500).json({ error: 'Failed to get trending tags' });
  }
}

async function searchImages(req, res) {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const cacheKey = `search:${q}:${page}:${limit}`;
    const cached = await getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }
    
    const offset = (page - 1) * limit;
    const searchTerms = q.toLowerCase().split(' ').filter(t => t.length > 1);
    
    const result = await pool.query(`
      SELECT DISTINCT i.*, c.name as category_name, c.slug as category_slug,
             ts_rank(to_tsvector('english', i.title || ' ' || COALESCE(i.description, '')), plainto_tsquery('english', $1)) as rank
      FROM images i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE i.status = 'approved' AND (
        to_tsvector('english', i.title || ' ' || COALESCE(i.description, '')) @@ plainto_tsquery('english', $1)
        OR i.title ILIKE $2
        OR ik.keyword ILIKE $2
      )
      ORDER BY rank DESC, i.download_count DESC
      LIMIT $3 OFFSET $4
    `, [q, `%${q}%`, limit, offset]);
    
    const countResult = await pool.query(`
      SELECT COUNT(DISTINCT i.id) as total
      FROM images i
      LEFT JOIN image_keywords ik ON i.id = ik.image_id
      WHERE i.status = 'approved' AND (
        to_tsvector('english', i.title || ' ' || COALESCE(i.description, '')) @@ plainto_tsquery('english', $1)
        OR i.title ILIKE $2
        OR ik.keyword ILIKE $2
      )
    `, [q, `%${q}%`]);
    
    const response = {
      images: result.rows.map(img => ({
        id: img.id,
        title: img.title,
        slug: img.slug,
        filePath: img.file_path,
        thumbnailPath: img.thumbnail_path,
        category: img.category_name,
        categorySlug: img.category_slug,
        downloadCount: img.download_count
      })),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(countResult.rows[0].total),
        totalPages: Math.ceil(countResult.rows[0].total / limit)
      },
      query: q
    };
    
    await setCache(cacheKey, response, 180);
    res.json(response);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
}

module.exports = {
  uploadImage,
  getImages,
  getImageBySlug,
  downloadImage,
  getTrendingTags,
  searchImages
};
