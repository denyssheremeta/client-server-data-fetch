require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

const whitelist = [
  'https://client-server-data-fetch-client-j2vv71ybb.vercel.app',
  'https://client-server-data-fetch.netlify.app',
  'http://localhost:5173',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

app.use(cors(corsOptions));

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

// Route for handling API requests
app.get('/api', (req, res) => {
  const index = parseInt(req.query.index, 10);

  // Check for the presence of an index and its format
  if (isNaN(index)) {
    return res.status(400).send('Invalid index parameter');
  }

  const currentSecond = Math.floor(Date.now() / 1000);
  console.log(
    `Received request with index: ${index} at second: ${currentSecond}`
  );

  if (!requestCounts.has(currentSecond)) {
    requestCounts.set(currentSecond, 0);
  }

  if (requestCounts.get(currentSecond) >= REQUEST_LIMIT) {
    console.log(`Request limit exceeded for second: ${currentSecond}`);
    return res.status(429).send('Too Many Requests');
  }

  requestCounts.set(currentSecond, requestCounts.get(currentSecond) + 1);

  const delay = Math.floor(Math.random() * 1000) + 1;

  setTimeout(() => {
    console.log(`Sending response for index: ${index} after delay: ${delay}`);
    res.setHeader('Content-Type', 'application/json');
    res.json({ index });
  }, delay);
});

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server is running on http://localhost:${PORT}`);
  } else {
    console.log(
      `Server is running on https://client-server-data-fetch.onrender.com:${PORT}`
    );
  }
});
