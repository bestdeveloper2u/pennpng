const express = require('express');
const router = express.Router();
const { authenticateToken, requireContributor } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getContributorDashboard,
  getContributorImages,
  updateContributorImage,
  deleteContributorImage
} = require('../controllers/contributorController');
const { uploadImage } = require('../controllers/imageController');

router.use(authenticateToken, requireContributor);

router.get('/dashboard', getContributorDashboard);
router.get('/images', getContributorImages);
router.post('/upload', upload.single('image'), uploadImage);
router.put('/images/:id', updateContributorImage);
router.delete('/images/:id', deleteContributorImage);

module.exports = router;
