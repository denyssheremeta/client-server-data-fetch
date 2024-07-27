require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Request limits
let requestCounts = {};
const REQUEST_LIMIT = parseInt(process.env.REQUEST_LIMIT, 10) || 50;
const CLEANUP_INTERVAL = parseInt(process.env.CLEANUP_INTERVAL, 10) || 60000;

// Function to clean up old records
const cleanupOldCounts = () => {
  const currentSecond = Math.floor(Date.now() / 1000);
  for (const second in requestCounts) {
    if (second < currentSecond) {
      delete requestCounts[second];
    }
  }
};

// Clean up old records every minute
setInterval(cleanupOldCounts, CLEANUP_INTERVAL);

// Route for handling API requests
app.get('/api', (req, res) => {
  const index = parseInt(req.query.index, 10);
  const currentSecond = Math.floor(Date.now() / 1000);

  console.log(
    `Received request with index: ${index} at second: ${currentSecond}`
  );

  if (!requestCounts[currentSecond]) {
    requestCounts[currentSecond] = 0;
  }

  if (requestCounts[currentSecond] >= REQUEST_LIMIT) {
    console.log(`Request limit exceeded for second: ${currentSecond}`);
    res.status(429).send('Too Many Requests');
    return;
  }

  requestCounts[currentSecond] += 1;

  const delay = Math.floor(Math.random() * 1000) + 1;

  setTimeout(() => {
    console.log(`Sending response for index: ${index} after delay: ${delay}`);
    res.setHeader('Content-Type', 'application/json');
    res.json({ index });
  }, delay);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
