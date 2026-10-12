import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from '../db.js';
import { requireAuth } from './admin.js';
import { syncManager } from '../events.js';

import os from 'os';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Multer configuration: store uploaded files in public/uploads/ or /tmp fallback
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = path.join(__dirname, '../../public/uploads');
    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      fs.accessSync(uploadDir, fs.constants.W_OK);
    } catch {
      uploadDir = path.join(os.tmpdir(), 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// POST /api/upload - upload image (protected)
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const imageUrl = `/uploads/${req.file.filename}`;
    const { category, title, caption } = req.body;

    // Mirror to dist/uploads if production dist directory exists
    const distUploads = path.join(__dirname, '../../dist/uploads');
    if (fs.existsSync(distUploads)) {
      try {
        fs.copyFileSync(req.file.path, path.join(distUploads, req.file.filename));
      } catch (copyErr) {
        console.warn('Notice: Could not mirror upload to dist/uploads:', copyErr.message);
      }
    }

    // Optionally save to gallery table
    if (req.body.save_to_gallery === 'true') {
      const gResult = await query(
        'INSERT INTO gallery (title, caption, image_url, image_path, category) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [title || req.file.originalname, caption, imageUrl, req.file.path, category || 'general']
      );
      syncManager.notifyDataChange('gallery', 'create', { id: gResult.rows[0]?.id, url: imageUrl });
    }

    res.json({ success: true, url: imageUrl, filename: req.file.filename });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

// GET /api/gallery and GET /api/upload/gallery - public gallery
const getGalleryHandler = async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    const { category } = req.query;
    let q = 'SELECT * FROM gallery WHERE is_active = true';
    const params = [];
    if (category && category !== 'all' && category !== 'ALL') {
      q += ` AND LOWER(category) = $1`;
      params.push(category.toLowerCase());
    }
    q += ' ORDER BY sort_order ASC, created_at DESC';
    const result = await query(q, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

router.get('/', getGalleryHandler);
router.get('/gallery', getGalleryHandler);

export default router;
