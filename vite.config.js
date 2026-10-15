import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-dev-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && (req.url.startsWith('/api') || req.url.startsWith('/uploads') || req.url.startsWith('/health'))) {
            try {
              const { default: app } = await import('./server/index.js');
              return app(req, res, next);
            } catch (err) {
              console.error('API middleware error:', err);
              return next();
            }
          }
          next();
        });
      },
    },
  ],
  base: '/', // Absolute root pathing ensures deep routes like /services/airport-transfer resolve assets cleanly
  server: {
    host: '0.0.0.0',
    port: 5173,
    hmr: false, // Disables Vite dev WebSocket client to prevent disconnect-induced automated page reloads
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2015',
    minify: 'esbuild',
    cssCodeSplit: true,
    assetsInlineLimit: 4096, // Inline small assets under 4kb as base64
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});
