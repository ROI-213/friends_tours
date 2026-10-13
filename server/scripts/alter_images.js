import pool from '../db.js';

async function fixCols() {
  console.log('Altering image columns to TEXT...');
  await pool.query('ALTER TABLE vehicles ALTER COLUMN image TYPE TEXT;');
  await pool.query('ALTER TABLE packages ALTER COLUMN hero_image TYPE TEXT;');
  await pool.query('ALTER TABLE services ALTER COLUMN image TYPE TEXT;');
  await pool.query('ALTER TABLE outstation_destinations ALTER COLUMN image TYPE TEXT;');
  console.log('✅ Altered columns successfully!');

  const res = await pool.query(
    "SELECT table_name, column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name IN ('vehicles', 'packages', 'services', 'outstation_destinations') AND column_name IN ('image', 'hero_image')"
  );
  console.log('Verified columns:', res.rows);
  await pool.end();
}

fixCols().catch(console.error);
