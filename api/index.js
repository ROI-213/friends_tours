import app from '../server/index.js';

export default function handler(req, res) {
  // Normalize URL so Express routes match correctly regardless of Vercel path prefix
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
}
