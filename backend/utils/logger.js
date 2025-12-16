function log(message, meta = {}) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, Object.keys(meta).length ? meta : '');
}

function logError(error, meta = {}) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}]`, error, Object.keys(meta).length ? meta : '');
}

module.exports = { log, logError };
