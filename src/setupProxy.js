const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    // '/api',
    // createProxyMiddleware({
    //   target: 'http://localhost:3333',
    //   changeOrigin: true,
    // }),
    '/api',
    createProxyMiddleware({
      target: 'https://chub.laizn.com',
      changeOrigin: true,
      auth: 'chathubuser:chathub.123',
    }),
  );
};
