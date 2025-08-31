const mongoose = require('mongoose');
const BookingService = require('../models/bookingServiceModel');
const Payment = require('../models/paymentModel');
const User = require('../models/usersModel');
const Member = require('../models/memberModel');
const ProfessionalService = require('../models/professionalServiceModel');
const Slot = require('../models/slotModel');

/**
 * Demo Data Seeder for Analytics Testing
 * Generates realistic test data for the business analytics system
 */

// Configuration
const CONFIG = {
  // Professional user details
  PROFESSIONAL: {
    first_name: 'Sarah',
    last_name: 'Johnson',
    email: 'sarah.johnson@demo.com',
    phone_number: '+1-555-0123',
    user_type: 'professional',
    salon_name: 'Sarah\'s Beauty Salon',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip_code: '10001',
    country: 'USA',
    description: 'Professional beauty salon offering hair, makeup, and spa services',
    experience: 8,
    rating: 4.8,
    account_status: 'active',
    email_verify: true
  },
  
  // Demo services
  SERVICES: [
    { service_name: 'Haircut & Style', price: 45, duration: 60, category: 'Hair' },
    { service_name: 'Hair Coloring', price: 120, duration: 120, category: 'Hair' },
    { service_name: 'Hair Extensions', price: 200, duration: 180, category: 'Hair' },
    { service_name: 'Facial Treatment', price: 80, duration: 90, category: 'Skincare' },
    { service_name: 'Manicure', price: 35, duration: 45, category: 'Nails' },
    { service_name: 'Pedicure', price: 45, duration: 60, category: 'Nails' },
    { service_name: 'Makeup Application', price: 75, duration: 90, category: 'Makeup' },
    { service_name: 'Eyebrow Shaping', price: 25, duration: 30, category: 'Beauty' },
    { service_name: 'Hair Treatment', price: 65, duration: 75, category: 'Hair' },
    { service_name: 'Spa Massage', price: 95, duration: 60, category: 'Spa' }
  ],
  
  // Demo customers
  CUSTOMERS: [
    { first_name: 'Emma', last_name: 'Wilson', email: 'emma.wilson@email.com', phone: '+1-555-0001' },
    { first_name: 'Michael', last_name: 'Brown', email: 'michael.brown@email.com', phone: '+1-555-0002' },
    { first_name: 'Sophia', last_name: 'Davis', email: 'sophia.davis@email.com', phone: '+1-555-0003' },
    { first_name: 'James', last_name: 'Miller', email: 'james.miller@email.com', phone: '+1-555-0004' },
    { first_name: 'Olivia', last_name: 'Garcia', email: 'olivia.garcia@email.com', phone: '+1-555-0005' },
    { first_name: 'William', last_name: 'Rodriguez', email: 'william.rodriguez@email.com', phone: '+1-555-0006' },
    { first_name: 'Ava', last_name: 'Martinez', email: 'ava.martinez@email.com', phone: '+1-555-0007' },
    { first_name: 'David', last_name: 'Anderson', email: 'david.anderson@email.com', phone: '+1-555-0008' },
    { first_name: 'Isabella', last_name: 'Taylor', email: 'isabella.taylor@email.com', phone: '+1-555-0009' },
    { first_name: 'John', last_name: 'Thomas', email: 'john.thomas@email.com', phone: '+1-555-0010' },
    { first_name: 'Mia', last_name: 'Hernandez', email: 'mia.hernandez@email.com', phone: '+1-555-0011' },
    { first_name: 'Robert', last_name: 'Moore', email: 'robert.moore@email.com', phone: '+1-555-0012' },
    { first_name: 'Charlotte', last_name: 'Martin', email: 'charlotte.martin@email.com', phone: '+1-555-0013' },
    { first_name: 'Christopher', last_name: 'Jackson', email: 'christopher.jackson@email.com', phone: '+1-555-0014' },
    { first_name: 'Amelia', last_name: 'Thompson', email: 'amelia.thompson@email.com', phone: '+1-555-0015' }
  ],
  
  // Demo members (staff)
  MEMBERS: [
    { first_name: 'Jessica', last_name: 'Smith', job_title: 'Senior Stylist', contact_no: '+1-555-0101' },
    { first_name: 'Alex', last_name: 'Johnson', job_title: 'Color Specialist', contact_no: '+1-555-0102' },
    { first_name: 'Maria', last_name: 'Garcia', job_title: 'Nail Technician', contact_no: '+1-555-0103' },
    { first_name: 'Kevin', last_name: 'Chen', job_title: 'Spa Therapist', contact_no: '+1-555-0104' }
  ],
  
  // Time slots
  TIME_SLOTS: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ],
  
  // Booking statuses
  BOOKING_STATUSES: ['completed', 'confirmed', 'pending', 'cancelled'],
  
  // Payment types
  PAYMENT_TYPES: ['online', 'offline'],
  
  // Data generation settings
  SETTINGS: {
    daysToGenerate: 90, // Generate data for last 90 days
    maxBookingsPerDay: 15,
    minBookingsPerDay: 3,
    tipPercentage: { min: 5, max: 20 }, // 5-20% tip
    cancellationRate: 0.1, // 10% cancellation rate
    noShowRate: 0.05 // 5% no-show rate
  }
};

/**
 * Generate random number between min and max
 */
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate random decimal between min and max
 */
function getRandomDecimal(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

/**
 * Get random item from array
 */
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generate random date within range
 */
function getRandomDate(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate random time slot
 */
function getRandomTimeSlot() {
  return getRandomItem(CONFIG.TIME_SLOTS);
}

/**
 * Calculate tip amount
 */
function calculateTip(servicePrice) {
  if (!servicePrice || isNaN(servicePrice)) return 0;
  const tipPercentage = getRandomDecimal(CONFIG.SETTINGS.tipPercentage.min, CONFIG.SETTINGS.tipPercentage.max);
  return parseFloat((servicePrice * tipPercentage / 100).toFixed(2));
}

/**
 * Calculate tax amount
 */
function calculateTax(servicePrice) {
  if (!servicePrice || isNaN(servicePrice)) return 0;
  const taxRate = 0.08; // 8% tax
  return parseFloat((servicePrice * taxRate).toFixed(2));
}

/**
 * Calculate total amount
 */
function calculateTotalAmount(servicePrice, tip, tax) {
  if (!servicePrice || isNaN(servicePrice)) return 0;
  if (!tip || isNaN(tip)) tip = 0;
  if (!tax || isNaN(tax)) tax = 0;
  return parseFloat((servicePrice + tip + tax).toFixed(2));
}

/**
 * Create professional user
 */
async function createProfessionalUser() {
  console.log('Creating professional user...');
  
  const professional = new User({
    ...CONFIG.PROFESSIONAL,
    password: '$2b$10$demo.hash.for.testing.purposes.only',
    created: new Date(),
    updated: new Date()
  });
  
  const savedProfessional = await professional.save();
  console.log(`✅ Professional user created: ${savedProfessional._id}`);
  return savedProfessional;
}

/**
 * Create customer users
 */
async function createCustomerUsers() {
  console.log('Creating customer users...');
  
  const customers = [];
  for (const customerData of CONFIG.CUSTOMERS) {
    const customer = new User({
      ...customerData,
      user_type: 'enthusiastic',
      password: '$2b$10$demo.hash.for.testing.purposes.only',
      account_status: 'active',
      email_verify: true,
      created: new Date(),
      updated: new Date()
    });
    
    const savedCustomer = await customer.save();
    customers.push(savedCustomer);
  }
  
  console.log(`✅ Created ${customers.length} customer users`);
  return customers;
}

/**
 * Create member users
 */
async function createMemberUsers(professionalId) {
  console.log('Creating member users...');
  
  const members = [];
  for (const memberData of CONFIG.MEMBERS) {
    const member = new Member({
      ...memberData,
      salon_id: professionalId,
      capacity: getRandomNumber(5, 10),
      created: new Date(),
      updated: new Date()
    });
    
    const savedMember = await member.save();
    members.push(savedMember);
  }
  
  console.log(`✅ Created ${members.length} member users`);
  return members;
}

/**
 * Create professional services
 */
async function createProfessionalServices(professionalId) {
  console.log('Creating professional services...');
  
  const services = [];
  for (const serviceData of CONFIG.SERVICES) {
    const service = new ProfessionalService({
      user_id: professionalId,
      service_name: serviceData.service_name,
      description: `${serviceData.service_name} - Professional service with high quality products`,
      price: serviceData.price,
      period: `${serviceData.duration} minutes`,
      hashtag: [serviceData.category.toLowerCase()],
      create_date: new Date(),
      update_date: new Date()
    });
    
    const savedService = await service.save();
    services.push(savedService);
  }
  
  console.log(`✅ Created ${services.length} professional services`);
  return services;
}

/**
 * Create time slots
 */
async function createTimeSlots(professionalId) {
  console.log('Creating time slots...');
  
  const slots = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - CONFIG.SETTINGS.daysToGenerate);
  
  for (let day = 0; day < CONFIG.SETTINGS.daysToGenerate + 30; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Skip Sundays (day 0)
    if (currentDate.getDay() === 0) continue;
    
    // Create slots for each time period
    for (let i = 0; i < CONFIG.TIME_SLOTS.length - 1; i++) {
      const startTime = CONFIG.TIME_SLOTS[i];
      const endTime = CONFIG.TIME_SLOTS[i + 1];
      
      const slot = new Slot({
        salon_id: professionalId,
        slot_day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
        start_time: startTime,
        end_time: endTime,
        slot_Date: currentDate,
        on_off: 'on',
        created: new Date(),
        updated: new Date()
      });
      
      slots.push(slot);
    }
  }
  
  // Save slots in batches
  const batchSize = 100;
  for (let i = 0; i < slots.length; i += batchSize) {
    const batch = slots.slice(i, i + batchSize);
    await Slot.insertMany(batch);
  }
  
  console.log(`✅ Created ${slots.length} time slots`);
  return slots;
}

/**
 * Generate bookings and payments
 */
async function generateBookingsAndPayments(professionalId, customers, services, members) {
  console.log('Generating bookings and payments...');
  
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - CONFIG.SETTINGS.daysToGenerate);
  
  const bookings = [];
  const payments = [];
  
  for (let day = 0; day < CONFIG.SETTINGS.daysToGenerate; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Skip Sundays
    if (currentDate.getDay() === 0) continue;
    
    // Generate random number of bookings for this day
    const bookingsToday = getRandomNumber(CONFIG.SETTINGS.minBookingsPerDay, CONFIG.SETTINGS.maxBookingsPerDay);
    
    for (let booking = 0; booking < bookingsToday; booking++) {
      const customer = getRandomItem(customers);
      const service = getRandomItem(services);
      const member = getRandomItem(members);
      const timeSlot = getRandomTimeSlot();
      
      // Determine booking status
      let status = getRandomItem(CONFIG.BOOKING_STATUSES);
      let canceledBy = null;
      
      // Apply cancellation and no-show logic
      if (Math.random() < CONFIG.SETTINGS.cancellationRate) {
        status = 'cancelled';
        canceledBy = Math.random() < 0.5 ? 'customer' : 'professional';
      } else if (Math.random() < CONFIG.SETTINGS.noShowRate && status === 'confirmed') {
        status = 'cancelled';
        canceledBy = 'customer';
      }
      
      // Calculate amounts with proper validation
      const servicePrice = service.price || 0;
      const tip = calculateTip(servicePrice);
      const tax = calculateTax(servicePrice);
      const totalAmount = calculateTotalAmount(servicePrice, tip, tax);
      
      // Validate all amounts are valid numbers
      if (isNaN(servicePrice) || isNaN(tip) || isNaN(tax) || isNaN(totalAmount)) {
        console.warn(`⚠️ Skipping booking due to invalid amounts: servicePrice=${servicePrice}, tip=${tip}, tax=${tax}, total=${totalAmount}`);
        continue;
      }
      
      // Create booking
      const bookingData = {
        booking_id: `BK${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        customer_user_id: customer._id,
        seller_user_id: professionalId,
        service_id: service._id,
        member_id: member._id,
        orignal_price: servicePrice,
        total_amount: totalAmount,
        tax: tax,
        other_charges: tip,
        day: currentDate,
        time: timeSlot,
        status: status,
        slot_date: currentDate,
        payment_mode: getRandomItem(CONFIG.PAYMENT_TYPES),
        canceled_by: canceledBy,
        created: getRandomDate(currentDate, new Date()),
        updated: new Date()
      };
      
      try {
        const newBooking = new BookingService(bookingData);
        const savedBooking = await newBooking.save();
        bookings.push(savedBooking);
        
        // Create payment for completed bookings
        if (status === 'completed') {
          const paymentData = {
            payment_id: `PAY${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            booking_id: savedBooking._id,
            price: totalAmount,
            type: 'booking',
            created: savedBooking.created,
            updated: new Date()
          };
          
          const newPayment = new Payment(paymentData);
          const savedPayment = await newPayment.save();
          payments.push(savedPayment);
        }
      } catch (error) {
        console.error(`❌ Error creating booking:`, error.message);
        console.error(`Booking data:`, bookingData);
      }
    }
  }
  
  console.log(`✅ Generated ${bookings.length} bookings`);
  console.log(`✅ Generated ${payments.length} payments`);
  
  return { bookings, payments };
}

/**
 * Generate additional historical data for better analytics
 */
async function generateHistoricalData(professionalId, customers, services, members) {
  console.log('Generating historical data for better analytics...');
  
  // Generate data for the past 6 months
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);
  
  const historicalBookings = [];
  const historicalPayments = [];
  
  for (let day = 0; day < 180; day++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + day);
    
    // Skip Sundays
    if (currentDate.getDay() === 0) continue;
    
    // Fewer bookings in historical data
    const bookingsToday = getRandomNumber(1, 8);
    
    for (let booking = 0; booking < bookingsToday; booking++) {
      const customer = getRandomItem(customers);
      const service = getRandomItem(services);
      const member = getRandomItem(members);
      const timeSlot = getRandomTimeSlot();
      
      // Most historical bookings should be completed
      const status = Math.random() < 0.9 ? 'completed' : getRandomItem(['confirmed', 'cancelled']);
      
      // Calculate amounts with proper validation
      const servicePrice = service.price || 0;
      const tip = calculateTip(servicePrice);
      const tax = calculateTax(servicePrice);
      const totalAmount = calculateTotalAmount(servicePrice, tip, tax);
      
      // Validate all amounts are valid numbers
      if (isNaN(servicePrice) || isNaN(tip) || isNaN(tax) || isNaN(totalAmount)) {
        console.warn(`⚠️ Skipping historical booking due to invalid amounts`);
        continue;
      }
      
      const bookingData = {
        booking_id: `HIST${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        customer_user_id: customer._id,
        seller_user_id: professionalId,
        service_id: service._id,
        member_id: member._id,
        orignal_price: servicePrice,
        total_amount: totalAmount,
        tax: tax,
        other_charges: tip,
        day: currentDate,
        time: timeSlot,
        status: status,
        slot_date: currentDate,
        payment_mode: getRandomItem(CONFIG.PAYMENT_TYPES),
        created: currentDate,
        updated: currentDate
      };
      
      try {
        const newBooking = new BookingService(bookingData);
        const savedBooking = await newBooking.save();
        historicalBookings.push(savedBooking);
        
        if (status === 'completed') {
          const paymentData = {
            payment_id: `HISTPAY${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
            booking_id: savedBooking._id,
            price: totalAmount,
            type: 'booking',
            created: currentDate,
            updated: currentDate
          };
          
          const newPayment = new Payment(paymentData);
          const savedPayment = await newPayment.save();
          historicalPayments.push(savedPayment);
        }
      } catch (error) {
        console.error(`❌ Error creating historical booking:`, error.message);
      }
    }
  }
  
  console.log(`✅ Generated ${historicalBookings.length} historical bookings`);
  console.log(`✅ Generated ${historicalPayments.length} historical payments`);
  
  return { historicalBookings, historicalPayments };
}

/**
 * Main seeding function
 */
async function seedDemoData() {
  try {
    console.log('🚀 Starting demo data seeding...');
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pelito-platform';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing demo data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing demo data...');
    await User.deleteMany({ email: { $regex: /@demo\.com|@email\.com/ } });
    await ProfessionalService.deleteMany({ service_name: { $in: CONFIG.SERVICES.map(s => s.service_name) } });
    await BookingService.deleteMany({ booking_id: { $regex: /^(BK|HIST)/ } });
    await Payment.deleteMany({ payment_id: { $regex: /^(PAY|HISTPAY)/ } });
    await Slot.deleteMany({});
    await Member.deleteMany({});
    console.log('✅ Cleared existing demo data');
    
    // Create professional user
    const professional = await createProfessionalUser();
    
    // Create customer users
    const customers = await createCustomerUsers();
    
    // Create member users
    const members = await createMemberUsers(professional._id);
    
    // Create professional services
    const services = await createProfessionalServices(professional._id);
    
    // Create time slots
    await createTimeSlots(professional._id);
    
    // Generate recent bookings and payments
    const { bookings, payments } = await generateBookingsAndPayments(
      professional._id, 
      customers, 
      services, 
      members
    );
    
    // Generate historical data
    const { historicalBookings, historicalPayments } = await generateHistoricalData(
      professional._id,
      customers,
      services,
      members
    );
    
    // Print summary
    console.log('\n📊 Demo Data Summary:');
    console.log('=====================');
    console.log(`👤 Professional User: ${professional.first_name} ${professional.last_name}`);
    console.log(`👥 Customers: ${customers.length}`);
    console.log(`👨‍💼 Staff Members: ${members.length}`);
    console.log(`💇‍♀️ Services: ${services.length}`);
    console.log(`📅 Recent Bookings: ${bookings.length}`);
    console.log(`💰 Recent Payments: ${payments.length}`);
    console.log(`📅 Historical Bookings: ${historicalBookings.length}`);
    console.log(`💰 Historical Payments: ${historicalPayments.length}`);
    console.log(`📊 Total Bookings: ${bookings.length + historicalBookings.length}`);
    console.log(`💳 Total Payments: ${payments.length + historicalPayments.length}`);
    
    console.log('\n🎯 Analytics Testing Ready!');
    console.log('========================');
    console.log(`🔑 Professional ID: ${professional._id}`);
    console.log(`📧 Professional Email: ${professional.email}`);
    console.log(`🏪 Salon Name: ${professional.salon_name}`);
    console.log('\n💡 You can now test the analytics dashboard with this data!');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n✅ Demo data seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

/**
 * Run the seeder
 */
if (require.main === module) {
  seedDemoData();
}

module.exports = { seedDemoData, CONFIG };
