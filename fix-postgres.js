const fs = require('fs');
const path = require('path');

// Files to fix
const files = [
  'routes/employee.js',
  'routes/attendance.js', 
  'routes/dashboard.js',
  'routes/reports.js'
];

function convertMySQLToPostgreSQL(content) {
  // Convert ? placeholders to $1, $2, etc.
  let placeholderCount = 0;
  
  return content.replace(/\?/g, () => {
    placeholderCount++;
    return `$${placeholderCount}`;
  });
}

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (fs.existsSync(filePath)) {
    console.log(`Fixing ${file}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Reset placeholder count for each file
    let placeholderCount = 0;
    
    // Convert all ? to $1, $2, etc.
    content = content.replace(/\?/g, () => {
      placeholderCount++;
      return `$${placeholderCount}`;
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed ${placeholderCount} placeholders in ${file}`);
  } else {
    console.log(`❌ File not found: ${file}`);
  }
});

console.log('🎉 All files converted to PostgreSQL!');
