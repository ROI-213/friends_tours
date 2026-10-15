/**
 * Public Data Routes — no auth required
 * Serves live PostgreSQL data to the public frontend with zero caching lag.
 * Includes SSE event stream for real-time live synchronization.
 */
import express from 'express';
import { query } from '../db.js';
import { syncManager } from '../events.js';

const router = express.Router();

// Strict no-cache headers for all public dynamic data routes
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// SSE Real-time Synchronization Stream
router.get('/events', (req, res) => {
  syncManager.handleSSE(req, res);
});

// Polling Version / Timestamp endpoint (hybrid in-memory + PostgreSQL for Vercel lambdas)
router.get('/version', async (req, res) => {
  try {
    const dbRes = await query("SELECT value FROM site_settings WHERE key = 'data_version'");
    if (dbRes.rows[0]?.value) {
      const dbVersion = parseInt(dbRes.rows[0].value, 10);
      if (dbVersion && dbVersion > syncManager.version) {
        syncManager.version = dbVersion;
      }
    }
  } catch (_) {}
  res.json(syncManager.getVersion());
});

// GET /api/public/tariffs/local
router.get('/tariffs/local', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tariff_local WHERE enabled = true ORDER BY sort_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/public/tariffs/outstation
router.get('/tariffs/outstation', async (req, res) => {
  try {
    const result = await query('SELECT * FROM tariff_outstation WHERE enabled = true ORDER BY sort_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/public/services
router.get('/services', async (req, res) => {
  try {
    const result = await query('SELECT * FROM services WHERE enabled = true ORDER BY sort_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/public/airport-areas
router.get('/airport-areas', async (req, res) => {
  try {
    const result = await query('SELECT * FROM airport_areas WHERE active = true ORDER BY sort_order ASC, name ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/public/outstation-destinations
router.get('/outstation-destinations', async (req, res) => {
  try {
    const result = await query('SELECT * FROM outstation_destinations WHERE active = true ORDER BY sort_order ASC, id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/public/settings — returns key/value map for site settings
router.get('/settings', async (req, res) => {
  try {
    const result = await query('SELECT key, value FROM site_settings');
    const map = {};
    result.rows.forEach((r) => {
      map[r.key] = r.value;
    });
    res.json(map);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
