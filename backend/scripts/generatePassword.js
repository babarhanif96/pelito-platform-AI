const bcrypt = require('bcrypt');

async function generatePassword() {
  const password = '12345';
  const saltRounds = 10;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('🔐 Password Hash Generated:');
    console.log('==========================');
    console.log(`Original Password: ${password}`);
    console.log(`Hashed Password: ${hashedPassword}`);
    console.log('');
    console.log('💡 Copy the hashed password above and use it in your database update.');
    
  } catch (error) {
    console.error('❌ Error generating password hash:', error);
  }
}

generatePassword();
