const express = require('express');
const upload = require('../middleware/upload');
const { uploadFile, listFiles } = require('../controllers/fileController');

const router = express.Router();

router.get('/', listFiles);
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
