// setupProxy.js

import { createProxyMiddleware } from 'http-proxy-middleware';

module.exports = function (app) {
  app.use(
    '/admin', // Specify the path for Django admin
    createProxyMiddleware({
      target: 'http://localhost:8000', // Specify the URL of your Django backend
      changeOrigin: true,
    })
  );
};
