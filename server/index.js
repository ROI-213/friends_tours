import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

import vehiclesRouter from './routes/vehicles.js';
import packagesRouter from './routes/packages.js';
import enquiriesRouter from './routes/enquiries.js';
import testimonialsRouter from './routes/testimonials.js';
import uploadRouter from './routes/upload.js';
import adminRouter from './routes/admin.js';
import publicDataRouter from './routes/publicData.js';
import { runMigrations } from './scripts/migrate.js';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Ensure uploads directories exist ─────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../public/uploads');
const distUploadsDir = path.join(__dirname, '../dist/uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created /public/uploads directory');
  }
  if (!fs.existsSync(distUploadsDir)) {
    fs.mkdirSync(distUploadsDir, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in serverless environments
}

// ── Dynamic CORS for Live & Local Production ─────────────────────────────────
const corsOptions = {
  origin: (origin, callback) => callback(null, true),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Cache-Control',
    'Pragma',
    'Expires',
    'cache-control',
    'pragma',
    'expires',
    'content-type',
    'authorization'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
};
app.use(cors(corsOptions));

// Explicit preflight middleware to ensure Firefox never blocks any headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Cache-Control, Pragma, Expires, cache-control, pragma, expires, content-type, authorization, *');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// ── Rate limiting ─────────────────────────────────────────────────────────────
// Generous rate limit (2000 req/15min) so active admin management never gets throttled
const apiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 2000, message: { error: 'Too many requests. Please try again later.' } });
const enquiryLimiter = rateLimit({ windowMs: 60 * 60 * 1000, max: 60, message: { error: 'Too many enquiries submitted. Please try again later.' } });

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Serve static uploads ───────────────────────────────────────────────────────
app.use('/uploads', express.static(uploadsDir));
if (fs.existsSync(distUploadsDir)) {
  app.use('/uploads', express.static(distUploadsDir));
}

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', async (req, res) => {
  try {
    const dbStatus = await pool.testDatabaseConnection();
    res.json({ status: 'ok', database: dbStatus.database, time: new Date().toISOString() });
  } catch (err) {
    res.status(503).json({ status: 'error', database: 'disconnected', error: err.message });
  }
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api', apiLimiter);
app.use('/api/vehicles', vehiclesRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/enquiries', enquiryLimiter, enquiriesRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/gallery', uploadRouter); // gallery is also in upload router
app.use('/api/admin', adminRouter);
app.use('/api/public', publicDataRouter); // live data for frontend (no auth)
// Public aliases so /api/services, /api/tariffs, /api/settings, /api/outstation-destinations work directly without /public prefix
app.use('/api/services', (req, res, next) => { req.url = '/services' + (req.url === '/' ? '' : req.url); publicDataRouter(req, res, next); });
app.use('/api/tariffs', (req, res, next) => { req.url = '/tariffs' + (req.url === '/' ? '' : req.url); publicDataRouter(req, res, next); });
app.use('/api/settings', (req, res, next) => { req.url = '/settings' + (req.url === '/' ? '' : req.url); publicDataRouter(req, res, next); });
app.use('/api/outstation-destinations', (req, res, next) => { req.url = '/outstation-destinations' + (req.url === '/' ? '' : req.url); publicDataRouter(req, res, next); });
app.use('/api/destinations', (req, res, next) => { req.url = '/outstation-destinations' + (req.url === '/' ? '' : req.url); publicDataRouter(req, res, next); });

// ── Serve static frontend build if dist exists ───────────────────────────────
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads') || req.path.startsWith('/health')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// ── Start server ──────────────────────────────────────────────────────────────
async function start() {
  let isDbConnected = false;
  try {
    console.log('🔌 Connecting to PostgreSQL...');
    await pool.query('SELECT NOW()');
    console.log('✅ PostgreSQL connected:', process.env.DB_HOST, 'DB:', process.env.DB_NAME);
    isDbConnected = true;

    // Run migrations on startup
    await runMigrations();

    // Ensure default admin user is initialized
    try {
      const adminCheck = await pool.query('SELECT count(*) FROM admin_users');
      if (parseInt(adminCheck.rows[0].count, 10) === 0) {
        const bcrypt = (await import('bcryptjs')).default;
        const defaultEmail = process.env.ADMIN_EMAIL || 'admin@friendstours.in';
        const defaultPass = process.env.ADMIN_PASSWORD || 'admin@FT2026!';
        const hash = await bcrypt.hash(defaultPass, 12);
        await pool.query(
          'INSERT INTO admin_users (email, password_hash, name, role) VALUES ($1, $2, $3, $4)',
          [defaultEmail, hash, 'Admin', 'superadmin']
        );
        console.log(`✅ Default admin account created: ${defaultEmail} / ${defaultPass}`);
      }
    } catch (adminInitErr) {
      console.warn('⚠️ Admin check notice:', adminInitErr.message);
    }
  } catch (err) {
    console.warn('⚠️ PostgreSQL offline or unreachable at startup:', err.message);
    console.warn('⚡ API Server is starting in resilient mode. Connecting to PostgreSQL in the background...');
  }

  // Always bind and listen on PORT so frontend never encounters NetworkError
  app.listen(PORT, () => {
    console.log(`\n🚀 Friends Tours API running on http://localhost:${PORT}`);
    console.log(`   Health: http://localhost:${PORT}/health`);
    console.log(`   Admin login: POST http://localhost:${PORT}/api/admin/login`);
    console.log(`   DB Status: ${isDbConnected ? 'CONNECTED' : 'CONNECTING IN BACKGROUND'}\n`);
  });

  // Background reconnect worker if PostgreSQL was offline during initial boot
  if (!isDbConnected) {
    const reconnectTimer = setInterval(async () => {
      try {
        await pool.query('SELECT NOW()');
        console.log('✅ PostgreSQL connected successfully in background!');
        clearInterval(reconnectTimer);
        await runMigrations();
      } catch (retryErr) {
        // Silent background retry
      }
    }, 15000);
  }
}

if (process.env.VERCEL !== '1' && !process.env.AWS_LAMBDA_FUNCTION_NAME) {
  start();
}

export { app, start };
export default app;
