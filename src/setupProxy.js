const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
// dotenv.config(['.env.local', '.env.development', '.env']);
module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.SERVER_URL || 'http://localhost:3000',
      changeOrigin: true,
      auth: process.env.SERVER_AUTH,
    }),
  );
};
