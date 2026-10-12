import express from 'express';
import { query } from '../db.js';

const router = express.Router();

// Strict no-cache headers so approved testimonials are always read fresh from PostgreSQL
router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

// GET /api/testimonials
router.get('/', async (req, res) => {
  try {
    const { featured } = req.query;
    let q = 'SELECT * FROM testimonials WHERE is_approved = true';
    if (featured === 'true') q += ' AND is_featured = true';
    q += ' ORDER BY sort_order ASC, created_at DESC';
    const result = await query(q);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/testimonials (public submit for review)
router.post('/', async (req, res) => {
  try {
    const { customer_name, designation, location, rating, review, trip_type, vehicle_used, travel_date } = req.body;
    if (!customer_name || !review) return res.status(400).json({ error: 'Name and review are required' });
    // Public submissions are pending approval (is_approved=false)
    await query(`
      INSERT INTO testimonials (customer_name, designation, location, rating, review, trip_type, vehicle_used, travel_date, is_approved, is_featured)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false,false)
    `, [customer_name, designation, location, rating || 5, review, trip_type, vehicle_used, travel_date]);
// DELETE /api/testimonials/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM testimonials WHERE id::text = $1', [id]);
    res.json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Delete testimonial error:', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

export default router;
