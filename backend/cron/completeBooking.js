const mongoose = require('mongoose');
const BookingService = require('../models/bookingServiceModel'); // Update the path
const cron = require('node-cron');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = require('../utils/db');
connectDB();

async function updateBookingServices() {
  try {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set to start of the day

    // Update only records where status is NOT already 'completed'
    const result = await BookingService.updateMany(
      { day: { $lt: currentDate }, status: { $ne: 'completed' } },
      { $set: { status: 'completed' } }
    );

    console.log(result)

    console.log(`Updated ${result.modifiedCount} BookingService records.`);
  } catch (error) {
    console.error("Error updating BookingService records:", error);
  } finally {
    mongoose.disconnect();
  }
}

cron.schedule('0 * * * *', () => {
  console.log('Task running every hour');
  updateBookingServices();
});



