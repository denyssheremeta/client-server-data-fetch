require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/cors');
const apiRoutes = require('./routes/api');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(express.json());
app.use(apiRoutes);

app.listen(PORT, () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Server is running on http://localhost:${PORT}`);
  } else {
    console.log(
      `Server is running on https://client-server-data-fetch.onrender.com:${PORT}`
    );
  }
});
