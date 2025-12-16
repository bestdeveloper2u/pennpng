require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fileRoutes = require('./routes/fileRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { pool } = require('./config/db');
const { log, logError } = require('./utils/logger');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/files', fileRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;

pool
  .connect()
  .then((client) => {
    client.release();
    app.listen(port, () => log(`Server listening on port ${port}`));
  })
  .catch((err) => {
    logError('Failed to connect to Postgres', err);
    process.exit(1);
  });

