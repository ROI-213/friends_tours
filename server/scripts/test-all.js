import { query } from '../db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

async function testAll() {
  console.log('🧪 Running comprehensive backend & PostgreSQL test suite...\n');

  const errors = [];
  const passed = [];

  // Test 1: DB Connection
  try {
    const res = await query('SELECT NOW() as current_time, current_database() as db_name, current_user as user_name');
    console.log('✅ 1. DB Connection: OK');
    console.log(`   Connected to: ${res.rows[0].db_name} as ${res.rows[0].user_name} at ${res.rows[0].current_time}`);
    passed.push('PostgreSQL Connection');
  } catch (err) {
    console.error('❌ 1. DB Connection Failed:', err.message);
    errors.push(`DB Connection: ${err.message}`);
  }

  // Test 2: Admin Auth
  try {
    const adminRes = await query('SELECT * FROM admin_users WHERE email = $1', ['admin@friendstours.in']);
    if (!adminRes.rows[0]) throw new Error('Admin user not found');
    const valid = await bcrypt.compare('admin@FT2026!', adminRes.rows[0].password_hash);
    if (!valid) throw new Error('Password mismatch');
    console.log('✅ 2. Admin Authentication: OK (admin@friendstours.in verified)');
    passed.push('Admin Authentication');
  } catch (err) {
    console.error('❌ 2. Admin Auth Failed:', err.message);
    errors.push(`Admin Auth: ${err.message}`);
  }

  // Test 3: Tables & Row counts
  const tables = ['admin_users', 'vehicles', 'packages', 'enquiries', 'testimonials', 'gallery', 'contact_messages', 'site_settings', 'tariff_local', 'tariff_outstation'];
  for (const t of tables) {
    try {
      const c = await query(`SELECT COUNT(*) FROM ${t}`);
      console.log(`✅ Table '${t}': ${c.rows[0].count} rows`);
      passed.push(`Table ${t}`);
    } catch (err) {
      console.error(`❌ Table '${t}' check failed:`, err.message);
      errors.push(`Table ${t}: ${err.message}`);
    }
  }

  // Test 4: CRUD Test on Vehicles table
  const testVehicleId = `test-car-${Date.now()}`;
  try {
    await query(`
      INSERT INTO vehicles (id, slug, name, category, enabled)
      VALUES ($1, $2, $3, $4, true)
    `, [testVehicleId, testVehicleId, 'Test Vehicle QA', 'Sedan']);
    console.log('✅ 4a. Vehicle INSERT: OK');

    await query('UPDATE vehicles SET name = $1 WHERE id = $2', ['Test Vehicle QA Updated', testVehicleId]);
    console.log('✅ 4b. Vehicle UPDATE: OK');

    const read = await query('SELECT name FROM vehicles WHERE id = $1', [testVehicleId]);
    if (read.rows[0].name !== 'Test Vehicle QA Updated') throw new Error('Update verification failed');
    console.log('✅ 4c. Vehicle READ: OK');

    await query('DELETE FROM vehicles WHERE id = $1', [testVehicleId]);
    console.log('✅ 4d. Vehicle DELETE: OK');
    passed.push('Vehicle CRUD');
  } catch (err) {
    console.error('❌ Vehicle CRUD Failed:', err.message);
    errors.push(`Vehicle CRUD: ${err.message}`);
  }

  // Test 5: Enquiry Submission & Reference Generation
  try {
    const testRef = `FTTEST${Math.floor(1000 + Math.random() * 9000)}`;
    const enq = await query(`
      INSERT INTO enquiries (booking_ref, name, phone, trip_type, pickup_location, drop_location, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'new') RETURNING *
    `, [testRef, 'Automated QA Customer', '+919999988888', 'Airport Transfer', 'Whitefield', 'Bangalore Airport']);
    
    if (!enq.rows[0]?.id) throw new Error('Enquiry insert failed');
    console.log(`✅ 5a. Enquiry INSERT with Ref [${testRef}]: OK`);

    await query('UPDATE enquiries SET status = $1, admin_notes = $2 WHERE id = $3', ['contacted', 'Customer called back', enq.rows[0].id]);
    console.log('✅ 5b. Enquiry STATUS UPDATE to contacted: OK');
    passed.push('Enquiry Pipeline');
  } catch (err) {
    console.error('❌ Enquiry Pipeline Failed:', err.message);
    errors.push(`Enquiry Pipeline: ${err.message}`);
  }

  // Test 6: Testimonials Management
  try {
    const tRes = await query(`
      INSERT INTO testimonials (customer_name, rating, review, is_approved, is_featured)
      VALUES ($1, $2, $3, true, true) RETURNING *
    `, ['Test QA Client', 5, 'Outstanding service and pristine cars! Highly recommend.']);
    console.log('✅ 6. Testimonial INSERT: OK');
    passed.push('Testimonials Insert');
  } catch (err) {
    console.error('❌ Testimonial Failed:', err.message);
    errors.push(`Testimonial: ${err.message}`);
  }

  // Test 7: Gallery / Image records
  try {
    const gRes = await query(`
      INSERT INTO gallery (title, image_url, category)
      VALUES ($1, $2, $3) RETURNING *
    `, ['Mysore Palace Tour Chauffeur', '/destinations/mysore-palace.jpg', 'outstation']);
    console.log('✅ 7. Gallery / Storage Record INSERT: OK');
    passed.push('Gallery Record Insert');
  } catch (err) {
    console.error('❌ Gallery Failed:', err.message);
    errors.push(`Gallery: ${err.message}`);
  }

  console.log('\n================ TEST SUMMARY ================');
  console.log(`Total Passed: ${passed.length}`);
  console.log(`Total Errors: ${errors.length}`);
  if (errors.length > 0) {
    console.log('\nErrors found:');
    errors.forEach(e => console.log(` - ${e}`));
  } else {
    console.log('🎉 ALL TESTS PASSED! ZERO DATABASE ERRORS!');
  }
  console.log('==============================================\n');

  process.exit(errors.length > 0 ? 1 : 0);
}

testAll().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
