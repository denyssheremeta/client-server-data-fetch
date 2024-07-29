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

module.exports = corsOptions;
