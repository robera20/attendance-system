const db = require('./db-postgres');

async function testDB() {
  try {
    console.log('Testing database connection...');
    const result = await db.query('SELECT 1 as test');
    console.log('✅ DB Test successful:', result);
  } catch (error) {
    console.error('❌ DB Test failed:', error.message);
  }
}

testDB();
