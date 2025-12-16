const express = require('express');
const router = express.Router();
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const {
  getDashboardStats,
  getAdminImages,
  updateImageStatus,
  updateImageKeywords,
  bulkUpdateStatus,
  deleteImage,
  getUsers,
  updateUserRole
} = require('../controllers/adminController');

router.use(authenticateToken, requireAdmin);

router.get('/stats', getDashboardStats);
router.get('/images', getAdminImages);
router.put('/images/:id/status', updateImageStatus);
router.put('/images/:id/keywords', updateImageKeywords);
router.post('/images/bulk-update', bulkUpdateStatus);
router.delete('/images/:id', deleteImage);
router.get('/users', getUsers);
router.put('/users/:id', updateUserRole);

module.exports = router;
