const { createFile, getFiles } = require('../models/fileModel');

async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const publicPath = `/uploads/${req.file.filename}`;
    const fileRecord = await createFile({
      filename: req.file.filename,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: publicPath,
    });

    res.status(201).json(fileRecord);
  } catch (err) {
    next(err);
  }
}

async function listFiles(_req, res, next) {
  try {
    const files = await getFiles();
    res.json(files);
  } catch (err) {
    next(err);
  }
}

module.exports = { uploadFile, listFiles };
