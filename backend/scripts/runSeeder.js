#!/usr/bin/env node

/**
 * Demo Data Seeder Runner
 * Simple script to run the demo data seeder
 */

const { seedDemoData } = require('./seedDemoData');

console.log('🎯 Demo Data Seeder for Analytics Testing');
console.log('==========================================');
console.log('');

// Check if MongoDB connection string is provided
if (!process.env.MONGODB_URI) {
  console.log('⚠️  No MONGODB_URI environment variable found.');
  console.log('   Using default: mongodb://localhost:27017/pelito-platform');
  console.log('');
}

console.log('🚀 Starting demo data generation...');
console.log('   This will create:');
console.log('   • 1 Professional user (Sarah Johnson)');
console.log('   • 15 Customer users');
console.log('   • 4 Staff members');
console.log('   • 10 Professional services');
console.log('   • 90 days of recent bookings');
console.log('   • 6 months of historical data');
console.log('   • Realistic payments and tips');
console.log('');

// Add a small delay to let user read the info
setTimeout(async () => {
  try {
    await seedDemoData();
    
    console.log('');
    console.log('🎉 Demo data seeding completed successfully!');
    console.log('');
    console.log('📋 Next Steps:');
    console.log('   1. Start your backend server: npm start');
    console.log('   2. Start your frontend: cd ../frontend && npm run dev');
    console.log('   3. Navigate to the analytics dashboard');
    console.log('   4. Use the professional ID shown above for testing');
    console.log('');
    console.log('💡 The analytics dashboard will now show realistic data!');
    
  } catch (error) {
    console.error('❌ Failed to seed demo data:', error.message);
    console.log('');
    console.log('🔧 Troubleshooting:');
    console.log('   • Make sure MongoDB is running');
    console.log('   • Check your MONGODB_URI environment variable');
    console.log('   • Ensure you have proper database permissions');
    process.exit(1);
  }
}, 2000);
