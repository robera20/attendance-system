const bcrypt = require('bcryptjs');
const db = require('./db-postgres');

async function createAdminAccount() {
  try {
    console.log('🔍 Checking if admin account exists...');
    
    // Check if admin already exists
    const existingAdmins = await db.query('SELECT admin_id FROM admins WHERE username = $1', ['admin']);
    
    if (existingAdmins.length > 0) {
      console.log('✅ Admin account already exists');
      return;
    }
    
    console.log('👤 Creating admin account...');
    
    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const hashedAnswer = await bcrypt.hash('admin123', 10);
    
    // Insert admin into PostgreSQL database
    await db.execute(`
      INSERT INTO admins (name, email, phone, organization, username, password, security_question, security_answer) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      'Admin User', 
      'admin@company.com', 
      '+1234567890', 
      'Company Inc', 
      'admin', 
      hashedPassword, 
      'What is your password?', 
      hashedAnswer
    ]);
    
    console.log('✅ Admin account created successfully!');
    console.log('📋 Login credentials:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    
  } catch (error) {
    console.error('❌ Error creating admin account:', error);
  }
}

createAdminAccount();
