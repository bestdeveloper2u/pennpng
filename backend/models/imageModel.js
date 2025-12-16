const { pool } = require('../config/db');

const IMAGE_COLUMNS = [
  'id', 'title', 'slug', 'description', 'filename', 'original_name',
  'file_path', 'file_size', 'mimetype', 'width', 'height',
  'thumbnail_path', 'category_id', 'subcategory_id', 'contributor_id',
  'status', 'download_count', 'approved_by', 'approved_at',
  'created_at', 'updated_at'
];

function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function createImage(data) {
  const {
    title, description, filename, original_name, file_path, file_size,
    mimetype, width, height, thumbnail_path, category_id, subcategory_id,
    contributor_id
  } = data;
  
  const slug = generateSlug(title) + '-' + Date.now();
  
  const query = `
    INSERT INTO images (
      title, slug, description, filename, original_name, file_path,
      file_size, mimetype, width, height, thumbnail_path,
      category_id, subcategory_id, contributor_id, status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 'pending')
    RETURNING ${IMAGE_COLUMNS.join(', ')};
  `;
  
  const values = [
    title, slug, description || null, filename, original_name, file_path,
    file_size, mimetype, width || null, height || null, thumbnail_path || null,
    category_id || null, subcategory_id || null, contributor_id
  ];
  
  const { rows } = await pool.query(query, values);
  return rows[0];
}

async function getImageById(id) {
  const query = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name, c.slug AS category_slug,
           s.name AS subcategory_name, s.slug AS subcategory_slug,
           u.username AS contributor_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    LEFT JOIN subcategories s ON s.id = i.subcategory_id
    LEFT JOIN users u ON u.id = i.contributor_id
    WHERE i.id = $1;
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function getImageBySlug(slug) {
  const query = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name, c.slug AS category_slug,
           s.name AS subcategory_name, s.slug AS subcategory_slug,
           u.username AS contributor_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    LEFT JOIN subcategories s ON s.id = i.subcategory_id
    LEFT JOIN users u ON u.id = i.contributor_id
    WHERE i.slug = $1;
  `;
  
  const { rows } = await pool.query(query, [slug]);
  return rows[0] || null;
}

async function updateImage(id, data) {
  const allowedFields = [
    'title', 'description', 'category_id', 'subcategory_id',
    'thumbnail_path', 'width', 'height'
  ];
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
  
  if (data.title) {
    updates.push(`slug = $${paramCount}`);
    values.push(generateSlug(data.title) + '-' + Date.now());
    paramCount++;
  }
  
  if (updates.length === 0) {
    return getImageById(id);
  }
  
  updates.push(`updated_at = NOW()`);
  values.push(id);
  
  const query = `
    UPDATE images
    SET ${updates.join(', ')}
    WHERE id = $${paramCount}
    RETURNING ${IMAGE_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, values);
  return rows[0] || null;
}

async function deleteImage(id) {
  const query = `
    DELETE FROM images
    WHERE id = $1
    RETURNING ${IMAGE_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function getImagesByStatus(status, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name,
           u.username AS contributor_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    LEFT JOIN users u ON u.id = i.contributor_id
    WHERE i.status = $1
    ORDER BY i.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  
  const countQuery = `SELECT COUNT(*) FROM images WHERE status = $1;`;
  
  const [dataResult, countResult] = await Promise.all([
    pool.query(query, [status, limit, offset]),
    pool.query(countQuery, [status])
  ]);
  
  return {
    images: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
}

async function getImagesByContributor(contributorId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    WHERE i.contributor_id = $1
    ORDER BY i.created_at DESC
    LIMIT $2 OFFSET $3;
  `;
  
  const countQuery = `SELECT COUNT(*) FROM images WHERE contributor_id = $1;`;
  
  const [dataResult, countResult] = await Promise.all([
    pool.query(query, [contributorId, limit, offset]),
    pool.query(countQuery, [contributorId])
  ]);
  
  return {
    images: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
}

async function getApprovedImages(page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  
  const query = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name, c.slug AS category_slug,
           u.username AS contributor_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    LEFT JOIN users u ON u.id = i.contributor_id
    WHERE i.status = 'approved'
    ORDER BY i.created_at DESC
    LIMIT $1 OFFSET $2;
  `;
  
  const countQuery = `SELECT COUNT(*) FROM images WHERE status = 'approved';`;
  
  const [dataResult, countResult] = await Promise.all([
    pool.query(query, [limit, offset]),
    pool.query(countQuery)
  ]);
  
  return {
    images: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
}

async function getTrendingImages(limit = 10) {
  const query = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name, c.slug AS category_slug,
           u.username AS contributor_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    LEFT JOIN users u ON u.id = i.contributor_id
    WHERE i.status = 'approved'
    ORDER BY i.download_count DESC, i.created_at DESC
    LIMIT $1;
  `;
  
  const { rows } = await pool.query(query, [limit]);
  return rows;
}

async function searchImages(query, categoryId, page = 1, limit = 20) {
  const offset = (page - 1) * limit;
  const values = [];
  let paramCount = 1;
  
  let whereClause = `WHERE i.status = 'approved'`;
  
  if (query) {
    whereClause += ` AND (
      i.title ILIKE $${paramCount} OR 
      i.description ILIKE $${paramCount} OR
      EXISTS (
        SELECT 1 FROM image_keywords ik
        JOIN keywords k ON k.id = ik.keyword_id
        WHERE ik.image_id = i.id AND k.keyword ILIKE $${paramCount}
      )
    )`;
    values.push(`%${query}%`);
    paramCount++;
  }
  
  if (categoryId) {
    whereClause += ` AND i.category_id = $${paramCount}`;
    values.push(categoryId);
    paramCount++;
  }
  
  const dataQuery = `
    SELECT i.${IMAGE_COLUMNS.map(c => 'i.' + c).join(', ')},
           c.name AS category_name, c.slug AS category_slug,
           u.username AS contributor_name
    FROM images i
    LEFT JOIN categories c ON c.id = i.category_id
    LEFT JOIN users u ON u.id = i.contributor_id
    ${whereClause}
    ORDER BY i.download_count DESC, i.created_at DESC
    LIMIT $${paramCount} OFFSET $${paramCount + 1};
  `;
  
  values.push(limit, offset);
  
  const countValues = values.slice(0, -2);
  const countQuery = `
    SELECT COUNT(*) FROM images i
    ${whereClause};
  `;
  
  const [dataResult, countResult] = await Promise.all([
    pool.query(dataQuery, values),
    pool.query(countQuery, countValues)
  ]);
  
  return {
    images: dataResult.rows,
    total: parseInt(countResult.rows[0].count),
    page,
    limit,
    totalPages: Math.ceil(countResult.rows[0].count / limit)
  };
}

async function updateImageStatus(id, status, approvedBy = null) {
  const query = `
    UPDATE images
    SET status = $1, 
        approved_by = $2, 
        approved_at = ${status === 'approved' ? 'NOW()' : 'NULL'},
        updated_at = NOW()
    WHERE id = $3
    RETURNING ${IMAGE_COLUMNS.join(', ')};
  `;
  
  const { rows } = await pool.query(query, [status, approvedBy, id]);
  return rows[0] || null;
}

async function incrementDownloadCount(id) {
  const query = `
    UPDATE images
    SET download_count = download_count + 1
    WHERE id = $1
    RETURNING id, download_count;
  `;
  
  const { rows } = await pool.query(query, [id]);
  return rows[0] || null;
}

async function addKeywords(imageId, keywords) {
  if (!keywords || keywords.length === 0) return [];
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const insertedKeywords = [];
    
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (!normalizedKeyword) continue;
      
      const keywordResult = await client.query(`
        INSERT INTO keywords (keyword)
        VALUES ($1)
        ON CONFLICT (keyword) DO UPDATE SET keyword = EXCLUDED.keyword
        RETURNING id, keyword;
      `, [normalizedKeyword]);
      
      const keywordId = keywordResult.rows[0].id;
      
      await client.query(`
        INSERT INTO image_keywords (image_id, keyword_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING;
      `, [imageId, keywordId]);
      
      insertedKeywords.push(keywordResult.rows[0]);
    }
    
    await client.query('COMMIT');
    return insertedKeywords;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

async function getImageKeywords(imageId) {
  const query = `
    SELECT k.id, k.keyword
    FROM keywords k
    JOIN image_keywords ik ON ik.keyword_id = k.id
    WHERE ik.image_id = $1
    ORDER BY k.keyword ASC;
  `;
  
  const { rows } = await pool.query(query, [imageId]);
  return rows;
}

async function updateImageKeywords(imageId, keywords) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    await client.query(`
      DELETE FROM image_keywords WHERE image_id = $1;
    `, [imageId]);
    
    if (!keywords || keywords.length === 0) {
      await client.query('COMMIT');
      return [];
    }
    
    const insertedKeywords = [];
    
    for (const keyword of keywords) {
      const normalizedKeyword = keyword.toLowerCase().trim();
      if (!normalizedKeyword) continue;
      
      const keywordResult = await client.query(`
        INSERT INTO keywords (keyword)
        VALUES ($1)
        ON CONFLICT (keyword) DO UPDATE SET keyword = EXCLUDED.keyword
        RETURNING id, keyword;
      `, [normalizedKeyword]);
      
      const keywordId = keywordResult.rows[0].id;
      
      await client.query(`
        INSERT INTO image_keywords (image_id, keyword_id)
        VALUES ($1, $2);
      `, [imageId, keywordId]);
      
      insertedKeywords.push(keywordResult.rows[0]);
    }
    
    await client.query('COMMIT');
    return insertedKeywords;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  createImage,
  getImageById,
  getImageBySlug,
  updateImage,
  deleteImage,
  getImagesByStatus,
  getImagesByContributor,
  getApprovedImages,
  getTrendingImages,
  searchImages,
  updateImageStatus,
  incrementDownloadCount,
  addKeywords,
  getImageKeywords,
  updateImageKeywords,
  generateSlug
};
