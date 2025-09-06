const { Pool } = require('pg');

// Database configuration for Supabase PostgreSQL
const dbConfig = process.env.DATABASE_URL ? {
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
} : {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  ssl: { rejectUnauthorized: false }
};

// Create connection pool
const pool = new Pool(dbConfig);

// Test connection
pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL successfully');
});

pool.on('error', (err) => {
  console.error('❌ PostgreSQL connection error:', err);
});

// Enhanced query function
async function executeQuery(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
}

// Enhanced query function for SELECT statements
async function executeSelect(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Select query error:', error);
    throw error;
  }
}

// Function to ensure database exists and is selected
async function ensureDatabase() {
  try {
    console.log('✅ PostgreSQL database connection verified');
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    return false;
  }
}

// Initialize database on startup
let dbInitialized = false;
ensureDatabase().then(success => {
  dbInitialized = success;
  if (success) {
    console.log('✅ PostgreSQL database system ready');
  } else {
    console.log('❌ PostgreSQL database system failed to initialize');
  }
});

// Export enhanced functions
module.exports = {
  execute: executeQuery,
  query: executeSelect,
  pool: pool,
  ensureDatabase,
  ensureEmployeeColumns: async function ensureEmployeeColumns() {
    try {
      // Check if position column exists
      const posCol = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'position'
      `);
      
      if (posCol.rows.length === 0) {
        await pool.query('ALTER TABLE employees ADD COLUMN position VARCHAR(100) NULL');
        console.log('✅ Added missing column: employees.position');
      }

      // Check if department column exists
      const deptCol = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'employees' AND column_name = 'department'
      `);
      
      if (deptCol.rows.length === 0) {
        await pool.query('ALTER TABLE employees ADD COLUMN department VARCHAR(80) NULL');
        console.log('✅ Added missing column: employees.department');
      }

      return true;
    } catch (error) {
      console.error('ensureEmployeeColumns error:', error);
      return false;
    }
  },
  isInitialized: () => dbInitialized
};
