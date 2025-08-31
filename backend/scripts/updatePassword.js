const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/usersModel');

async function updatePassword() {
  try {
    console.log('🔐 Updating demo user password...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pelito-platform';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Generate hashed password
    const password = '12345';
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    console.log(`🔑 Generated hash for password: ${password}`);
    
    // Find and update the demo professional user
    const result = await User.updateOne(
      { email: 'sarah.johnson@demo.com' },
      { $set: { password: hashedPassword } }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Password updated successfully!');
      console.log('');
      console.log('🎯 Login Details:');
      console.log('================');
      console.log('Email: sarah.johnson@demo.com');
      console.log('Password: 12345');
      console.log('');
      console.log('💡 You can now login with these credentials!');
    } else {
      console.log('❌ Demo user not found. Make sure to run the seeder first:');
      console.log('   npm run seed:demo');
    }
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error updating password:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updatePassword();
}
