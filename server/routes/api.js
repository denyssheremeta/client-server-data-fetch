const express = require('express');
const router = express.Router();

const rateLimiter = require('../middleware/rateLimiter');

router.get('/api', rateLimiter, (req, res) => {
  const index = parseInt(req.query.index, 10);

  // Check for the presence of an index and its format
  if (isNaN(index)) {
    return res.status(400).send('Invalid index parameter');
  }

  const currentSecond = Math.floor(Date.now() / 1000);
  console.log(
    `Received request with index: ${index} at second: ${currentSecond}`
  );

  const delay = Math.floor(Math.random() * 1000) + 1;

  setTimeout(() => {
    console.log(`Sending response for index: ${index} after delay: ${delay}`);
    res.setHeader('Content-Type', 'application/json');
    res.json({ index });
  }, delay);
});

module.exports = router;
