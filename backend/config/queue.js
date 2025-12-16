const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const { pool } = require('./db');

let imageQueue = null;
let worker = null;
let queueAvailable = false;

const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  try {
    const { Queue } = require('bullmq');
    const redisConnection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null
    };

    imageQueue = new Queue('image-processing', {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000
        }
      }
    });
    queueAvailable = true;
  } catch (err) {
    console.log('BullMQ not available, using synchronous image processing');
  }
}

async function processImageData(imagePath, imageId) {
  try {
    const uploadsDir = path.join(__dirname, '..', 'uploads');
    const thumbnailsDir = path.join(uploadsDir, 'thumbnails');
    
    await fs.mkdir(thumbnailsDir, { recursive: true });
    
    const filename = path.basename(imagePath);
    const thumbnailPath = path.join(thumbnailsDir, `thumb_${filename}`);
    
    const metadata = await sharp(imagePath).metadata();
    
    await sharp(imagePath)
      .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
      .png({ quality: 80 })
      .toFile(thumbnailPath);
    
    const stats = await fs.stat(imagePath);
    
    await pool.query(`
      UPDATE images 
      SET thumbnail_path = $1, width = $2, height = $3, file_size = $4, format = $5, updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
    `, [
      `/uploads/thumbnails/thumb_${filename}`,
      metadata.width,
      metadata.height,
      stats.size,
      metadata.format,
      imageId
    ]);
    
    console.log(`Processed image ${imageId}: ${filename}`);
    return { success: true, imageId };
  } catch (error) {
    console.error(`Error processing image ${imageId}:`, error);
    return { success: false, error: error.message };
  }
}

async function startImageWorker() {
  if (!queueAvailable || !redisUrl) {
    console.log('Image processing will run synchronously (no Redis)');
    return;
  }
  
  try {
    const { Worker } = require('bullmq');
    const redisConnection = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: null
    };
    
    worker = new Worker('image-processing', async (job) => {
      return await processImageData(job.data.imagePath, job.data.imageId);
    }, {
      connection: redisConnection,
      concurrency: 3
    });
    
    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`);
    });
    
    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err.message);
    });
    
    console.log('Image processing worker started');
  } catch (err) {
    console.log('Image processing will run synchronously');
  }
}

async function addImageToQueue(imagePath, imageId) {
  if (queueAvailable && imageQueue) {
    try {
      await imageQueue.add('process-image', { imagePath, imageId });
      return true;
    } catch (err) {
      console.log('Processing image synchronously');
    }
  }
  
  await processImageData(imagePath, imageId);
  return true;
}

module.exports = { imageQueue, startImageWorker, addImageToQueue };
