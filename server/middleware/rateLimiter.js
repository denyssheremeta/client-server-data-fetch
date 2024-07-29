const requestCounts = new Map();
const REQUEST_LIMIT = parseInt(process.env.REQUEST_LIMIT, 10) || 50;
const CLEANUP_INTERVAL = parseInt(process.env.CLEANUP_INTERVAL, 10) || 60000;

// Function to clean up old records
const cleanupOldCounts = () => {
  const currentSecond = Math.floor(Date.now() / 1000);
  for (const [second, count] of requestCounts) {
    if (second < currentSecond) {
      requestCounts.delete(second);
    }
  }
};

// Clean up old records every minute
setInterval(cleanupOldCounts, CLEANUP_INTERVAL);

const rateLimiter = (req, res, next) => {
  const currentSecond = Math.floor(Date.now() / 1000);

  if (!requestCounts.has(currentSecond)) {
    requestCounts.set(currentSecond, 0);
  }

  if (requestCounts.get(currentSecond) >= REQUEST_LIMIT) {
    console.log(`Request limit exceeded for second: ${currentSecond}`);
    return res.status(429).send('Too Many Requests');
  }

  requestCounts.set(currentSecond, requestCounts.get(currentSecond) + 1);
  next();
};

module.exports = rateLimiter;
