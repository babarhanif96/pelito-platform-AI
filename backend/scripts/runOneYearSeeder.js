#!/usr/bin/env node

/**
 * Runner script for One Year Data Seeder
 * Usage: node runOneYearSeeder.js
 */

const OneYearDataSeeder = require('./seedOneYearData');

console.log('🚀 Pelito Platform - One Year Data Seeder');
console.log('==========================================');
console.log('This script will generate comprehensive test data for the entire platform');
console.log('including 365 days of bookings, payments (crypto + card), and analytics data.');
console.log('');

// Check if user wants to proceed
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('⚠️  This will generate a large amount of test data. Are you sure you want to continue? (yes/no): ', async (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('');
    console.log('✅ Proceeding with data generation...');
    console.log('');
    
    try {
      const startTime = Date.now();
      const seeder = new OneYearDataSeeder();
      await seeder.run();
      
      const endTime = Date.now();
      const duration = ((endTime - startTime) / 1000).toFixed(2);
      
      console.log('');
      console.log(`⏱️  Total execution time: ${duration} seconds`);
      console.log('');
      console.log('🎉 Data generation completed successfully!');
      console.log('');
      console.log('📋 Next steps:');
      console.log('   1. Start your backend server');
      console.log('   2. Start your frontend application');
      console.log('   3. Navigate to the AI Insights page');
      console.log('   4. Test all the AI algorithms with real data');
      console.log('');
      console.log('🔗 AI Insights page: /professional/ai-insights');
      console.log('🔗 Admin Analytics: /admin/team-shop-analysis');
      
    } catch (error) {
      console.error('');
      console.error('❌ Data generation failed:', error.message);
      console.error('');
      console.error('🔧 Troubleshooting tips:');
      console.error('   1. Check your MongoDB connection');
      console.error('   2. Ensure all required models exist');
      console.error('   3. Check database permissions');
      console.error('   4. Review the error logs above');
      process.exit(1);
    }
  } else {
    console.log('');
    console.log('❌ Data generation cancelled by user');
    console.log('');
    console.log('💡 To run the seeder later, use:');
    console.log('   node scripts/runOneYearSeeder.js');
  }
  
  rl.close();
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('');
  console.log('⚠️  Process interrupted by user');
  console.log('🔄 Cleaning up...');
  rl.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('');
  console.log('⚠️  Process terminated');
  console.log('🔄 Cleaning up...');
  rl.close();
  process.exit(0);
});



