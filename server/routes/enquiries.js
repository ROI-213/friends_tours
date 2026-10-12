import express from 'express';
import { query } from '../db.js';

const router = express.Router();

function generateBookingRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'FT';
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

// POST /api/enquiries
router.post('/', async (req, res) => {
  try {
    const {
      name, email, phone, trip_type, pickup_location, drop_location,
      travel_date, return_date, passengers, vehicle_preference,
      package_name, special_requests, message, source,
    } = req.body;

    if (!name || !phone) return res.status(400).json({ error: 'Name and phone are required' });

    let booking_ref;
    let unique = false;
    while (!unique) {
      booking_ref = generateBookingRef();
      const check = await query('SELECT id FROM enquiries WHERE booking_ref = $1', [booking_ref]);
      if (check.rows.length === 0) unique = true;
    }

    const result = await query(`
      INSERT INTO enquiries (
        booking_ref, name, email, phone, trip_type, pickup_location, drop_location,
        travel_date, return_date, passengers, vehicle_preference, package_name,
        special_requests, message, source
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING *
    `, [
      booking_ref, name, email, phone, trip_type, pickup_location, drop_location,
      travel_date || null, return_date || null, passengers, vehicle_preference,
      package_name, special_requests, message, source || 'website',
    ]);

    res.status(201).json({
      success: true,
      booking_ref,
      message: 'Enquiry received! We will contact you within 30 minutes.',
      enquiry: result.rows[0],
    });
  } catch (err) {
    console.error('Enquiry error:', err);
    res.status(500).json({ error: 'Failed to submit enquiry. Please try again.' });
  }
});

// GET /api/enquiries/status/:ref (check booking status)
router.get('/status/:ref', async (req, res) => {
  try {
    const result = await query(
      'SELECT booking_ref, name, status, trip_type, travel_date, vehicle_preference, created_at FROM enquiries WHERE booking_ref = $1',
      [req.params.ref.toUpperCase()]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Booking not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
