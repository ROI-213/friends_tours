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

// Multer memory storage - eliminates all ENOENT / EROFS disk write issues in Serverless & VPS
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB

// POST /api/upload - upload image (protected)
router.post('/', requireAuth, upload.single('image'), async (req, res) => {
  try {
    const { category, title, caption, save_to_gallery } = req.body;
    let imageUrl = '';
    let filePath = '';
    let filename = '';

    if (req.file) {
      const ext = path.extname(req.file.originalname) || '.jpg';
      filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
      const isVercel = !!process.env.VERCEL;

      // On VPS / cPanel / Local: try saving to disk if writable
      if (!isVercel) {
        try {
          const uploadDir = path.join(__dirname, '../../public/uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          filePath = path.join(uploadDir, filename);
          fs.writeFileSync(filePath, req.file.buffer);

          const distUploads = path.join(__dirname, '../../dist/uploads');
          if (fs.existsSync(distUploads)) {
            try {
              fs.writeFileSync(path.join(distUploads, filename), req.file.buffer);
            } catch (_) {}
          }
          imageUrl = `/uploads/${filename}`;
        } catch (diskErr) {
          console.warn('Notice: Local disk write skipped, using database Data URL:', diskErr.message);
        }
      }

      // If on Vercel or disk write failed, use Data URL stored directly in PostgreSQL
      if (!imageUrl) {
        const mime = req.file.mimetype || 'image/jpeg';
        imageUrl = `data:${mime};base64,${req.file.buffer.toString('base64')}`;
        filePath = 'database-storage';
      }
    } else if (req.body.image_url) {
      imageUrl = req.body.image_url;
      filePath = 'external-url';
      filename = 'url-image';
    } else {
      return res.status(400).json({ error: 'No image file or image_url provided' });
    }

    // Optionally save to gallery table
    if (save_to_gallery === 'true' || save_to_gallery === true) {
      const gResult = await query(
        'INSERT INTO gallery (title, caption, image_url, image_path, category) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [title || (req.file ? req.file.originalname : 'Gallery Image'), caption || '', imageUrl, filePath, category || 'general']
      );
      syncManager.notifyDataChange('gallery', 'create', { id: gResult.rows[0]?.id, url: imageUrl });
    }

    res.json({ success: true, url: imageUrl, filename });
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
