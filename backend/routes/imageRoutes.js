const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
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
  updateImageKeywords
} = require('../models/imageModel');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await getApprovedImages(page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/trending', async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const images = await getTrendingImages(limit);
    res.json({ images });
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  try {
    const { q, category_id } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await searchImages(q, category_id, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/pending', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await getImagesByStatus('pending', page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/contributor/my-images', authenticateToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const result = await getImagesByContributor(req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const { slug } = req.params;
    const image = await getImageBySlug(slug);
    
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const keywords = await getImageKeywords(image.id);
    
    res.json({
      image,
      keywords
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Image file is required' });
    }
    
    const { title, description, category_id, subcategory_id, keywords } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }
    
    const imageData = {
      title,
      description,
      filename: req.file.filename,
      original_name: req.file.originalname,
      file_path: `/uploads/${req.file.filename}`,
      file_size: req.file.size,
      mimetype: req.file.mimetype,
      category_id: category_id || null,
      subcategory_id: subcategory_id || null,
      contributor_id: req.user.id
    };
    
    const image = await createImage(imageData);
    
    if (keywords) {
      const keywordArray = Array.isArray(keywords) 
        ? keywords 
        : keywords.split(',').map(k => k.trim());
      await addKeywords(image.id, keywordArray);
    }
    
    const savedKeywords = await getImageKeywords(image.id);
    
    res.status(201).json({
      message: 'Image uploaded successfully',
      image,
      keywords: savedKeywords
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, category_id, subcategory_id } = req.body;
    
    const existingImage = await getImageById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (existingImage.contributor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this image' });
    }
    
    const image = await updateImage(id, { title, description, category_id, subcategory_id });
    
    res.json({
      message: 'Image updated successfully',
      image
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingImage = await getImageById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (existingImage.contributor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this image' });
    }
    
    await deleteImage(id);
    
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/keywords', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { keywords } = req.body;
    
    const existingImage = await getImageById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (existingImage.contributor_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update keywords' });
    }
    
    if (!keywords || !Array.isArray(keywords)) {
      return res.status(400).json({ message: 'Keywords array is required' });
    }
    
    const updatedKeywords = await updateImageKeywords(id, keywords);
    
    res.json({
      message: 'Keywords updated successfully',
      keywords: updatedKeywords
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/download', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const existingImage = await getImageById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    if (existingImage.status !== 'approved') {
      return res.status(403).json({ message: 'Image is not available for download' });
    }
    
    const result = await incrementDownloadCount(id);
    
    res.json({
      message: 'Download tracked',
      download_count: result.download_count
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (pending, approved, rejected)' });
    }
    
    const existingImage = await getImageById(id);
    if (!existingImage) {
      return res.status(404).json({ message: 'Image not found' });
    }
    
    const approvedBy = status === 'approved' ? req.user.id : null;
    const image = await updateImageStatus(id, status, approvedBy);
    
    res.json({
      message: `Image ${status} successfully`,
      image
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
