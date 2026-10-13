import app from '../server/index.js';
import { query } from '../server/db.js';

let schemaChecked = false;
async function ensureSchema() {
  if (schemaChecked) return;
  schemaChecked = true;
  try {
    await query(`
      ALTER TABLE vehicles ALTER COLUMN image TYPE TEXT;
      ALTER TABLE packages ALTER COLUMN hero_image TYPE TEXT;
      ALTER TABLE services ALTER COLUMN image TYPE TEXT;
      ALTER TABLE outstation_destinations ALTER COLUMN image TYPE TEXT;
    `);
  } catch (_) {}
}

export default function handler(req, res) {
  // Ensure schema has TEXT image columns (non-blocking)
  ensureSchema().catch(() => {});

  // Normalize URL so Express routes match correctly regardless of Vercel path prefix
  if (req.url && !req.url.startsWith('/api') && !req.url.startsWith('/health')) {
    req.url = '/api' + req.url;
  }
  return app(req, res);
}
