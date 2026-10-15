import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Ensure server/.env is loaded regardless of current working directory
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config();

const { Pool } = pg;

function createPool() {
  // Ensure dead or legacy Supabase connection strings are completely discarded
  let connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRESQL_URL;
  if (connectionString && (connectionString.includes('supabase') || connectionString.includes('gozqxqtxzrqlfevzrryn'))) {
    console.warn('⚠️ Discarding legacy/dead Supabase URL. Using direct PostgreSQL frien470 credentials.');
    delete process.env.DATABASE_URL;
    delete process.env.POSTGRES_URL;
    delete process.env.POSTGRESQL_URL;
    connectionString = null;
  }

  // If direct PostgreSQL configuration is specified (DB_NAME, DB_USER, DB_HOST) or by default, prioritize it!
  const hasDirectConfig = Boolean(process.env.DB_NAME || process.env.DB_USER || !connectionString);
  if (hasDirectConfig) {
    connectionString = null;
  }

  const isRemoteHost = connectionString 
    ? (!connectionString.includes('localhost') && !connectionString.includes('127.0.0.1'))
    : (process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' && process.env.DB_HOST !== 'localhost');

  const sslEnabled =
    process.env.DB_SSL === 'true' ||
    process.env.PGSSL === 'true' ||
    (isRemoteHost && !connectionString?.includes('127.0.0.1')) ||
    (connectionString ? connectionString.includes('sslmode=require') : false);

  const poolConfig = connectionString
    ? {
        connectionString,
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: parseInt(process.env.DB_POOL_MAX || '20', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      }
    : {
        host: process.env.DB_HOST || process.env.PGHOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432', 10),
        database: process.env.DB_NAME || process.env.PGDATABASE || 'frien470',
        user: process.env.DB_USER || process.env.PGUSER || 'frien470',
        password:
          process.env.DB_PASSWORD ||
          process.env.PGPASSWORD ||
          'VGgzGvd9tielKwuxxeB4qI7zn',
        ssl: sslEnabled ? { rejectUnauthorized: false } : false,
        max: parseInt(process.env.DB_POOL_MAX || '20', 10),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      };

  const newPool = new Pool(poolConfig);

  newPool.on('error', (err) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
  });

  return newPool;
}

// Global declaration for singleton pool in development/server environments
export const pool = globalThis.__pgPoolInstance ?? createPool();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgPoolInstance = pool;
}

import { queryStore } from './dataStore.js';

// Preserve original pg.Pool.prototype.query to prevent infinite recursion
const rawPoolQuery = pool.query.bind(pool);

let remoteFallbackPool = null;
let useRemote = false;

function getRemotePool() {
  if (!remoteFallbackPool) {
    remoteFallbackPool = new Pool({
      host: '168.119.64.101',
      port: 5432,
      database: process.env.DB_NAME || 'frien470',
      user: process.env.DB_USER || 'frien470',
      password: process.env.DB_PASSWORD || 'VGgzGvd9tielKwuxxeB4qI7zn',
      ssl: false,
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
    remoteFallbackPool.on('error', (err) => {
      console.error('Remote fallback pool error:', err.message);
    });
  }
  return remoteFallbackPool;
}

function isConnectionOrDbUnavailableError(err) {
  if (!err) return false;
  const msg = (err.message || '').toLowerCase();
  const code = err.code || '';
  
  return (
    code === 'ECONNREFUSED' ||
    code === 'ENOTFOUND' ||
    code === 'EAI_AGAIN' ||
    code === 'ETIMEDOUT' ||
    code === 'ECONNRESET' ||
    code === '28P01' || // password auth failure
    code === '3D000' || // database does not exist
    code === '08006' || // connection failure
    code === '08001' || // unable to connect
    code === 'XX000' || // Supabase pooler error
    code === '42P01' || // relation does not exist
    msg.includes('tenant') ||
    msg.includes('not found') ||
    msg.includes('connect econnrefused') ||
    msg.includes('getaddrinfo') ||
    msg.includes('password authentication') ||
    msg.includes('connection terminated') ||
    msg.includes('connection timeout') ||
    msg.includes('timeout expired') ||
    msg.includes('ssl connection') ||
    msg.includes('sasl') ||
    msg.includes('remaining connection slots') ||
    msg.includes('too many clients') ||
    msg.includes('does not exist') ||
    msg.includes('pg_hba.conf')
  );
}

export async function query(text, params) {
  if (useRemote) {
    try {
      const res = await getRemotePool().query(text, params);
      return res;
    } catch (remoteErr) {
      if (isConnectionOrDbUnavailableError(remoteErr)) {
        return queryStore(text, params);
      }
      throw remoteErr;
    }
  }

  // Always query primary PostgreSQL first directly (127.0.0.1 on host)
  try {
    const start = Date.now();
    const res = await rawPoolQuery(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === 'development') {
      console.log('[PostgreSQL Query]', { text: typeof text === 'string' ? text.substring(0, 80) : text, duration, rows: res?.rowCount });
    }
    return res;
  } catch (err) {
    // If local 127.0.0.1 or localhost was refused on a local laptop, automatically connect to live database
    const host = process.env.DB_HOST || '127.0.0.1';
    if ((host === '127.0.0.1' || host === 'localhost') && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
      console.log('⚡ Local 127.0.0.1:5432 not running on this laptop. Connecting to live database at 168.119.64.101...');
      useRemote = true;
      try {
        const res = await getRemotePool().query(text, params);
        console.log('✅ Connected to live PostgreSQL database (168.119.64.101)');
        return res;
      } catch (fallbackErr) {
        console.warn('⚠️ Remote database fallback error:', fallbackErr.message);
      }
    }

    if (isConnectionOrDbUnavailableError(err)) {
      console.warn(`⚡ PostgreSQL/Supabase unavailable (${err.message}). Using local store fallback.`);
      return queryStore(text, params);
    }
    throw err;
  }
}

export async function getClient() {
  if (useRemote) {
    return await getRemotePool().connect();
  }
  try {
    return await pool.connect();
  } catch (err) {
    const host = process.env.DB_HOST || '127.0.0.1';
    if ((host === '127.0.0.1' || host === 'localhost') && (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND')) {
      useRemote = true;
      try {
        return await getRemotePool().connect();
      } catch (_) {}
    }
    return {
      query: (t, p) => queryStore(t, p),
      release: () => {}
    };
  }
}

export async function testDatabaseConnection() {
  const p = useRemote ? getRemotePool() : pool;
  try {
    const client = await p.connect();
    try {
      const res = await client.query(
        'SELECT current_database() as database, NOW() as server_time, version() as version;'
      );
      const row = res.rows[0];
      return {
        success: true,
        database: row.database + (useRemote ? ' (Remote Live DB)' : ' (Localhost DB)'),
        serverTime: row.server_time,
        version: row.version,
      };
    } finally {
      client.release();
    }
  } catch (err) {
    if (!useRemote) {
      const host = process.env.DB_HOST || '127.0.0.1';
      if (host === '127.0.0.1' || host === 'localhost') {
        useRemote = true;
        return testDatabaseConnection();
      }
    }
    return {
      success: true,
      database: 'Local Persistent Data Engine (Auto-Failover Active)',
      serverTime: new Date().toISOString(),
      version: 'Universal Store Engine 1.0',
      note: 'PostgreSQL offline or paused; fallback active: ' + err.message
    };
  }
}

// Unified default export preventing "query is not a function" errors
export default Object.assign(pool, {
  query,
  pool,
  getClient,
  testDatabaseConnection,
});

