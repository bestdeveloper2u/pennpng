require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const imageRoutes = require('./routes/imageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contributorRoutes = require('./routes/contributorRoutes');
const publicRoutes = require('./routes/publicRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { pool } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { startImageWorker } = require('./config/queue');
const { log, logError } = require('./utils/logger');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res) => {
    res.set('Cache-Control', 'public, max-age=31536000');
  }
}));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contributor', contributorRoutes);
app.use('/api/public', publicRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    const client = await pool.connect();
    client.release();
    log('Connected to PostgreSQL database');
    
    await connectRedis();
    await startImageWorker();
    
    app.listen(port, '0.0.0.0', () => log(`Server listening on port ${port}`));
  } catch (err) {
    logError('Failed to start server', err);
    process.exit(1);
  }
}

startServer();

