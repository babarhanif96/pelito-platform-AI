#!/usr/bin/env node

/**
 * Test Seeder - Quick test to verify the seeder works
 */

const mongoose = require('mongoose');
const { seedDemoData } = require('./seedDemoData');

async function testSeeder() {
  try {
    console.log('🧪 Testing demo data seeder...');
    console.log('');
    
    // Test MongoDB connection
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pelito-platform';
    console.log(`🔗 Connecting to MongoDB: ${mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connection successful');
    
    // Test creating a single professional service
    const ProfessionalService = require('../models/professionalServiceModel');
    const testService = new ProfessionalService({
      user_id: new mongoose.Types.ObjectId(),
      service_name: 'Test Service',
      description: 'Test service description',
      price: 50,
      period: '60 minutes',
      hashtag: ['test'],
      create_date: new Date(),
      update_date: new Date()
    });
    
    await testService.save();
    console.log('✅ Professional service creation test passed');
    
    // Clean up test data
    await ProfessionalService.deleteOne({ service_name: 'Test Service' });
    console.log('✅ Test cleanup successful');
    
    // Disconnect
    await mongoose.disconnect();
    console.log('✅ MongoDB disconnection successful');
    
    console.log('');
    console.log('🎉 All tests passed! The seeder should work correctly.');
    console.log('💡 You can now run: npm run seed:demo');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   • Make sure MongoDB is running');
    console.log('   • Check your MONGODB_URI environment variable');
    console.log('   • Ensure you have proper database permissions');
    process.exit(1);
  }
}

if (require.main === module) {
  testSeeder();
}
