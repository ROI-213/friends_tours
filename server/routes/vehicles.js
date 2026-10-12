import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Strict no-cache headers so public vehicles are always read fresh from PostgreSQL
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const { type, featured } = req.query;
    let q = 'SELECT * FROM vehicles WHERE enabled = true';
    const params = [];
    if (type) { q += ` AND type_category = $${params.length + 1}`; params.push(type.toUpperCase()); }
    if (featured === 'true') { q += ` AND featured = true`; }
    q += ' ORDER BY sort_order ASC, created_at ASC';
    const result = await query(q, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/vehicles/:slug
router.get('/:slug', async (req, res) => {
  try {
    const result = await query('SELECT * FROM vehicles WHERE (slug = $1 OR id = $1) AND enabled = true', [req.params.slug]);
    if (!result.rows[0]) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
