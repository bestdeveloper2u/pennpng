const Redis = require('ioredis');

let redis = null;
let redisAvailable = false;
let errorLogged = false;

const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
  redis = new Redis(redisUrl, {
    maxRetriesPerRequest: 3,
    enableReadyCheck: false,
    retryStrategy: (times) => {
      if (times > 3) return null;
      return Math.min(times * 200, 2000);
    },
    lazyConnect: true
  });

  redis.on('error', (err) => {
    if (!errorLogged) {
      console.warn('Redis not available, caching disabled');
      errorLogged = true;
    }
    redisAvailable = false;
  });

  redis.on('connect', () => {
    console.log('Connected to Redis');
    redisAvailable = true;
  });
} else {
  console.log('Redis URL not configured, caching disabled');
}

const CACHE_TTL = 300;

async function getCache(key) {
  if (!redis || !redisAvailable) return null;
  try {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function setCache(key, value, ttl = CACHE_TTL) {
  if (!redis || !redisAvailable) return;
  try {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
  } catch {}
}

async function deleteCache(pattern) {
  if (!redis || !redisAvailable) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch {}
}

async function connectRedis() {
  if (!redis) {
    console.log('Running without Redis cache');
    return false;
  }
  try {
    await redis.connect();
    redisAvailable = true;
    return true;
  } catch (err) {
    console.log('Running without Redis cache');
    return false;
  }
}

module.exports = { redis, getCache, setCache, deleteCache, connectRedis };
