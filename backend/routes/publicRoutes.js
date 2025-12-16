const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');
const { getImages, getImageBySlug, downloadImage, getTrendingTags, searchImages } = require('../controllers/imageController');
const { getCategories, getCategoryBySlug, getSubcategories } = require('../controllers/categoryController');

router.get('/images', getImages);
router.get('/images/search', searchImages);
router.get('/images/trending-tags', getTrendingTags);
router.get('/images/:slug', getImageBySlug);
router.get('/images/:slug/download', optionalAuth, downloadImage);

router.get('/categories', getCategories);
router.get('/categories/:slug', getCategoryBySlug);
router.get('/subcategories', getSubcategories);

module.exports = router;
