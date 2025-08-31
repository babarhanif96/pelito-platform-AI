const mongoose = require('mongoose');
const BookingService = require('../models/bookingServiceModel');
const Payment = require('../models/paymentModel');
const User = require('../models/usersModel');
const Member = require('../models/memberModel');
const ProfessionalService = require('../models/professionalServiceModel');
const Slot = require('../models/slotModel');
const Product = require('../models/productModel');
const Rating = require('../models/ratingModel');
const Cart = require('../models/cartModel');
const config = require('../config');

/**
 * One Year Comprehensive Demo Data Seeder
 * Generates realistic test data for the entire platform including:
 * - 365 days of data (including today)
 * - Crypto and card payments
 * - Realistic business patterns
 * - Seasonal variations
 * - Multiple payment methods
 * - Comprehensive analytics data
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
  
  // Demo services with realistic pricing
  SERVICES: [
    { service_name: 'Haircut & Style', price: 45, duration: 60, category: 'Hair', popularity: 0.9 },
    { service_name: 'Hair Coloring', price: 120, duration: 120, category: 'Hair', popularity: 0.8 },
    { service_name: 'Hair Extensions', price: 200, duration: 180, category: 'Hair', popularity: 0.6 },
    { service_name: 'Facial Treatment', price: 80, duration: 90, category: 'Skincare', popularity: 0.7 },
    { service_name: 'Manicure', price: 35, duration: 45, category: 'Nails', popularity: 0.8 },
    { service_name: 'Pedicure', price: 45, duration: 60, category: 'Nails', popularity: 0.7 },
    { service_name: 'Makeup Application', price: 75, duration: 90, category: 'Makeup', popularity: 0.6 },
    { service_name: 'Eyebrow Shaping', price: 25, duration: 30, category: 'Beauty', popularity: 0.9 },
    { service_name: 'Hair Treatment', price: 65, duration: 75, category: 'Hair', popularity: 0.7 },
    { service_name: 'Spa Massage', price: 95, duration: 60, category: 'Spa', popularity: 0.8 },
    { service_name: 'Keratin Treatment', price: 150, duration: 150, category: 'Hair', popularity: 0.5 },
    { service_name: 'Hair Highlights', price: 90, duration: 90, category: 'Hair', popularity: 0.7 },
    { service_name: 'Gel Nails', price: 55, duration: 60, category: 'Nails', popularity: 0.6 },
    { service_name: 'Acrylic Nails', price: 65, duration: 75, category: 'Nails', popularity: 0.5 },
    { service_name: 'Deep Conditioning', price: 40, duration: 45, category: 'Hair', popularity: 0.8 }
  ],
  
  // Demo customers with realistic profiles
  CUSTOMERS: [
    { first_name: 'Emma', last_name: 'Wilson', email: 'emma.wilson@email.com', phone: '+1-555-0001', loyalty: 0.9, avg_spend: 120 },
    { first_name: 'Michael', last_name: 'Brown', email: 'michael.brown@email.com', phone: '+1-555-0002', loyalty: 0.7, avg_spend: 85 },
    { first_name: 'Sophia', last_name: 'Davis', email: 'sophia.davis@email.com', phone: '+1-555-0003', loyalty: 0.8, avg_spend: 95 },
    { first_name: 'James', last_name: 'Miller', email: 'james.miller@email.com', phone: '+1-555-0004', loyalty: 0.6, avg_spend: 75 },
    { first_name: 'Olivia', last_name: 'Garcia', email: 'olivia.garcia@email.com', phone: '+1-555-0005', loyalty: 0.9, avg_spend: 150 },
    { first_name: 'William', last_name: 'Rodriguez', email: 'william.rodriguez@email.com', phone: '+1-555-0006', loyalty: 0.8, avg_spend: 110 },
    { first_name: 'Ava', last_name: 'Martinez', email: 'ava.martinez@email.com', phone: '+1-555-0007', loyalty: 0.7, avg_spend: 90 },
    { first_name: 'David', last_name: 'Anderson', email: 'david.anderson@email.com', phone: '+1-555-0008', loyalty: 0.9, avg_spend: 130 },
    { first_name: 'Isabella', last_name: 'Taylor', email: 'isabella.taylor@email.com', phone: '+1-555-0009', loyalty: 0.8, avg_spend: 100 },
    { first_name: 'John', last_name: 'Thomas', email: 'john.thomas@email.com', phone: '+1-555-0010', loyalty: 0.6, avg_spend: 80 },
    { first_name: 'Mia', last_name: 'Hernandez', email: 'mia.hernandez@email.com', phone: '+1-555-0011', loyalty: 0.7, avg_spend: 95 },
    { first_name: 'Robert', last_name: 'Moore', email: 'robert.moore@email.com', phone: '+1-555-0012', loyalty: 0.8, avg_spend: 115 },
    { first_name: 'Charlotte', last_name: 'Martin', email: 'charlotte.martin@email.com', phone: '+1-555-0013', loyalty: 0.9, avg_spend: 140 },
    { first_name: 'Christopher', last_name: 'Jackson', email: 'christopher.jackson@email.com', phone: '+1-555-0014', loyalty: 0.7, avg_spend: 88 },
    { first_name: 'Amelia', last_name: 'Thompson', email: 'amelia.thompson@email.com', phone: '+1-555-0015', loyalty: 0.8, avg_spend: 105 },
    { first_name: 'Daniel', last_name: 'White', email: 'daniel.white@email.com', phone: '+1-555-0016', loyalty: 0.6, avg_spend: 70 },
    { first_name: 'Evelyn', last_name: 'Harris', email: 'evelyn.harris@email.com', phone: '+1-555-0017', loyalty: 0.9, avg_spend: 160 },
    { first_name: 'Joseph', last_name: 'Clark', email: 'joseph.clark@email.com', phone: '+1-555-0018', loyalty: 0.7, avg_spend: 92 },
    { first_name: 'Abigail', last_name: 'Lewis', email: 'abigail.lewis@email.com', phone: '+1-555-0019', loyalty: 0.8, avg_spend: 108 },
    { first_name: 'Matthew', last_name: 'Robinson', email: 'matthew.robinson@email.com', phone: '+1-555-0020', loyalty: 0.6, avg_spend: 78 }
  ],
  
  // Demo members (staff) with realistic roles
  MEMBERS: [
    { first_name: 'Jessica', last_name: 'Smith', job_title: 'Senior Stylist', contact_no: '+1-555-0101', performance: 0.9, hourly_rate: 25 },
    { first_name: 'Alex', last_name: 'Johnson', job_title: 'Color Specialist', contact_no: '+1-555-0102', performance: 0.8, hourly_rate: 28 },
    { first_name: 'Maria', last_name: 'Garcia', job_title: 'Nail Technician', contact_no: '+1-555-0103', performance: 0.7, hourly_rate: 22 },
    { first_name: 'Kevin', last_name: 'Chen', job_title: 'Spa Therapist', contact_no: '+1-555-0104', performance: 0.8, hourly_rate: 26 },
    { first_name: 'Lisa', last_name: 'Wang', job_title: 'Makeup Artist', contact_no: '+1-555-0105', performance: 0.9, hourly_rate: 30 },
    { first_name: 'Ryan', last_name: 'O\'Connor', job_title: 'Junior Stylist', contact_no: '+1-555-0106', performance: 0.6, hourly_rate: 20 },
    { first_name: 'Sofia', last_name: 'Rodriguez', job_title: 'Esthetician', contact_no: '+1-555-0107', performance: 0.8, hourly_rate: 24 },
    { first_name: 'Marcus', last_name: 'Thompson', job_title: 'Barber', contact_no: '+1-555-0108', performance: 0.7, hourly_rate: 23 }
  ],
  
  // Demo products for retail sales
  PRODUCTS: [
    { name: 'Professional Hair Shampoo', price: 25, category: 'Hair Care', cost: 12, stock: 50 },
    { name: 'Luxury Hair Conditioner', price: 28, category: 'Hair Care', cost: 14, stock: 45 },
    { name: 'Anti-Aging Serum', price: 45, category: 'Skincare', cost: 22, stock: 30 },
    { name: 'Nail Polish Set', price: 35, category: 'Nails', cost: 18, stock: 60 },
    { name: 'Makeup Brush Set', price: 55, category: 'Makeup', cost: 28, stock: 25 },
    { name: 'Hair Styling Gel', price: 18, category: 'Hair Care', cost: 9, stock: 70 },
    { name: 'Facial Cleanser', price: 32, category: 'Skincare', cost: 16, stock: 40 },
    { name: 'Nail File Kit', price: 15, category: 'Nails', cost: 8, stock: 80 },
    { name: 'Eyeshadow Palette', price: 42, category: 'Makeup', cost: 21, stock: 35 },
    { name: 'Hair Mask Treatment', price: 38, category: 'Hair Care', cost: 19, stock: 55 }
  ],
  
  // Time slots for appointments
  TIME_SLOTS: [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
  ],
  
  // Payment methods with realistic distribution
  PAYMENT_METHODS: [
    { type: 'card', method: 'Visa', percentage: 0.35, crypto_alternative: false },
    { type: 'card', method: 'Mastercard', percentage: 0.30, crypto_alternative: false },
    { type: 'card', method: 'American Express', percentage: 0.15, crypto_alternative: false },
    { type: 'crypto', method: 'Bitcoin', percentage: 0.08, crypto_alternative: true },
    { type: 'crypto', method: 'Ethereum', percentage: 0.06, crypto_alternative: true },
    { type: 'crypto', method: 'USDC', percentage: 0.04, crypto_alternative: true },
    { type: 'crypto', method: 'Litecoin', percentage: 0.02, crypto_alternative: true }
  ],
  
  // Data generation settings
  SETTINGS: {
    daysToGenerate: 365, // Generate data for full year
    maxBookingsPerDay: 25,
    minBookingsPerDay: 5,
    tipPercentage: { min: 8, max: 25 }, // 8-25% tip
    cancellationRate: 0.08, // 8% cancellation rate
    noShowRate: 0.04, // 4% no-show rate
    cryptoAdoptionRate: 0.20, // 20% of payments are crypto
    seasonalVariation: true, // Enable seasonal patterns
    weekendBoost: true, // Weekend bookings are higher
    holidayEffect: true // Holiday season boost
  }
};

// Utility functions
const utils = {
  // Generate random number between min and max
  random: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
  
  // Generate random float between min and max
  randomFloat: (min, max) => Math.random() * (max - min) + min,
  
  // Generate random date within range
  randomDate: (start, end) => {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  },
  
  // Add days to date
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  // Format date for display
  formatDate: (date) => {
    return date.toISOString().split('T')[0];
  },
  
  // Get day of week (0 = Sunday, 6 = Saturday)
  getDayOfWeek: (date) => date.getDay(),
  
  // Check if date is weekend
  isWeekend: (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  },
  
  // Check if date is holiday season (November-December)
  isHolidaySeason: (date) => {
    const month = date.getMonth();
    return month === 10 || month === 11; // November (10) and December (11)
  },
  
  // Get seasonal multiplier
  getSeasonalMultiplier: (date) => {
    if (utils.isHolidaySeason(date)) return 1.4; // 40% boost during holidays
    if (utils.isWeekend(date)) return 1.2; // 20% boost on weekends
    return 1.0; // Normal day
  },
  
  // Generate realistic crypto payment data
  generateCryptoPayment: (amount, method) => {
    const cryptoMethods = {
      'Bitcoin': { symbol: 'BTC', exchangeRate: 45000, volatility: 0.15 },
      'Ethereum': { symbol: 'ETH', exchangeRate: 3200, volatility: 0.20 },
      'USDC': { symbol: 'USDC', exchangeRate: 1.00, volatility: 0.01 },
      'Litecoin': { symbol: 'LTC', exchangeRate: 150, volatility: 0.12 }
    };
    
    const crypto = cryptoMethods[method];
    const volatility = crypto.volatility;
    const actualRate = crypto.exchangeRate * (1 + (Math.random() - 0.5) * volatility);
    const cryptoAmount = amount / actualRate;
    
    return {
      cryptoAmount: parseFloat(cryptoAmount.toFixed(8)),
      exchangeRate: parseFloat(actualRate.toFixed(2)),
      symbol: crypto.symbol,
      transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`,
      networkFee: parseFloat((cryptoAmount * 0.001).toFixed(8))
    };
  },
  
  // Generate realistic card payment data
  generateCardPayment: (amount, method) => {
    const cardTypes = {
      'Visa': { prefix: '4', length: 16 },
      'Mastercard': { prefix: '5', length: 16 },
      'American Express': { prefix: '3', length: 15 }
    };
    
    const card = cardTypes[method];
    const cardNumber = card.prefix + Array(card.length - 1).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
    
    return {
      cardNumber: cardNumber,
      cvv: Math.floor(Math.random() * 900) + 100,
      expMonth: Math.floor(Math.random() * 12) + 1,
      expYear: new Date().getFullYear() + Math.floor(Math.random() * 5) + 1,
      transactionId: `txn_${Math.random().toString(36).substr(2, 9)}`,
      processingFee: parseFloat((amount * 0.029 + 0.30).toFixed(2))
    };
  },
  
  // Generate realistic tip amount
  generateTip: (amount) => {
    const tipPercentage = utils.randomFloat(CONFIG.SETTINGS.tipPercentage.min, CONFIG.SETTINGS.tipPercentage.max);
    return parseFloat((amount * tipPercentage / 100).toFixed(2));
  },
  
  // Generate realistic tax amount
  generateTax: (amount) => {
    const taxRate = utils.randomFloat(6.5, 9.5); // Varies by location
    return parseFloat((amount * taxRate / 100).toFixed(2));
  },
  
  // Generate realistic service fee
  generateServiceFee: (amount) => {
    const serviceFeeRate = utils.randomFloat(2.5, 4.5);
    return parseFloat((amount * serviceFeeRate / 100).toFixed(2));
  }
};

// Main data generation class
class OneYearDataSeeder {
  constructor() {
    this.professionalUser = null;
    this.customers = [];
    this.members = [];
    this.services = [];
    this.products = [];
    this.bookings = [];
    this.payments = [];
    this.ratings = [];
    this.carts = [];
  }

  // Initialize database connection
  async connect() {
    try {
      await mongoose.connect('mongodb://localhost:27017/?directConnection=true', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      process.exit(1);
    }
  }

  // Generate professional user
  async generateProfessionalUser() {
    try {
      const existingUser = await User.findOne({ email: CONFIG.PROFESSIONAL.email });
      if (existingUser) {
        this.professionalUser = existingUser;
        console.log('✅ Professional user already exists');
        return;
      }

      const professionalUser = new User(CONFIG.PROFESSIONAL);
      this.professionalUser = await professionalUser.save();
      console.log('✅ Professional user created');
    } catch (error) {
      console.error('❌ Error creating professional user:', error);
      throw error;
    }
  }

  // Generate customers
  async generateCustomers() {
    try {
      for (const customerData of CONFIG.CUSTOMERS) {
        const existingCustomer = await User.findOne({ email: customerData.email });
        if (existingCustomer) {
          this.customers.push(existingCustomer);
          continue;
        }

        const customer = new User({
          first_name: customerData.first_name,
          last_name: customerData.last_name,
          email: customerData.email,
          phone_number: customerData.phone,
          user_type: 'enthusiastic',
          account_status: 'active',
          email_verify: true,
          password: 'demo123', // Add a default password
          username: customerData.email.split('@')[0], // Generate username from email
          profile_name: `${customerData.first_name} ${customerData.last_name}`,
          interest_status: true,
          booking_user_type: 'online',
          created: new Date(),
          updated: new Date()
        });

        const savedCustomer = await customer.save();
        this.customers.push(savedCustomer);
      }
      console.log(`✅ ${this.customers.length} customers generated`);
    } catch (error) {
      console.error('❌ Error generating customers:', error);
      throw error;
    }
  }

  // Generate members (staff)
  async generateMembers() {
    try {
      for (const memberData of CONFIG.MEMBERS) {
        const existingMember = await Member.findOne({ contact_no: memberData.contact_no });
        if (existingMember) {
          this.members.push(existingMember);
          continue;
        }

        const member = new Member({
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          job_title: memberData.job_title,
          contact_no: memberData.contact_no,
          salon_id: this.professionalUser._id,
          email: `${memberData.first_name.toLowerCase()}.${memberData.last_name.toLowerCase()}@salon.com`,
          capacity: 8, // Default capacity
          created: new Date(),
          updated: new Date()
        });

        const savedMember = await member.save();
        this.members.push(savedMember);
      }
      console.log(`✅ ${this.members.length} members generated`);
    } catch (error) {
      console.error('❌ Error generating members:', error);
      throw error;
    }
  }

  // Generate services
  async generateServices() {
    try {
      for (const serviceData of CONFIG.SERVICES) {
        const existingService = await ProfessionalService.findOne({ 
          service_name: serviceData.service_name,
          professional_user_id: this.professionalUser._id
        });
        
        if (existingService) {
          this.services.push(existingService);
          continue;
        }

        const service = new ProfessionalService({
          service_name: serviceData.service_name,
          price: serviceData.price,
          period: `${serviceData.duration} minutes`,
          description: `${serviceData.category} service - ${serviceData.service_name}`,
          user_id: this.professionalUser._id,
          image_urls: 'https://via.placeholder.com/300x200',
          hashtag: [serviceData.category.toLowerCase(), serviceData.service_name.toLowerCase().replace(/\s+/g, '')],
          create_date: new Date(),
          update_date: new Date()
        });

        const savedService = await service.save();
        this.services.push(savedService);
      }
      console.log(`✅ ${this.services.length} services generated`);
    } catch (error) {
      console.error('❌ Error generating services:', error);
      throw error;
    }
  }

  // Generate products
  async generateProducts() {
    try {
      for (const productData of CONFIG.PRODUCTS) {
        const existingProduct = await Product.findOne({ 
          name: productData.name,
          professional_user_id: this.professionalUser._id
        });
        
        if (existingProduct) {
          this.products.push(existingProduct);
          continue;
        }

        const product = new Product({
          name: productData.name,
          price: productData.price,
          description: `${productData.category} product - ${productData.name}`,
          product_details: `High-quality ${productData.category.toLowerCase()} product`,
          seller_name: `${this.professionalUser.first_name} ${this.professionalUser.last_name}`,
          quantity: productData.stock,
          img_url: 'https://via.placeholder.com/300x300',
          user_id: this.professionalUser._id,
          created: new Date(),
          updated: new Date()
        });

        const savedProduct = await product.save();
        this.products.push(savedProduct);
      }
      console.log(`✅ ${this.products.length} products generated`);
    } catch (error) {
      console.error('❌ Error generating products:', error);
      throw error;
    }
  }

  // Generate time slots
  async generateTimeSlots() {
    try {
      const slots = [];
      const today = new Date();
      const startDate = utils.addDays(today, -CONFIG.SETTINGS.daysToGenerate + 1);
      
      for (let i = 0; i < CONFIG.SETTINGS.daysToGenerate; i++) {
        const currentDate = utils.addDays(startDate, i);
        
        for (const time of CONFIG.TIME_SLOTS) {
                  const slot = new Slot({
          slot_Date: currentDate,
          start_time: time,
          end_time: time, // Same time for now
          salon_id: this.professionalUser._id,
          member_id: this.members[0]._id, // Assign to first member
          slot_day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
          on_off: 'on',
          created: new Date(),
          updated: new Date()
        });
          
          slots.push(slot);
        }
      }
      
      await Slot.insertMany(slots);
      console.log(`✅ ${slots.length} time slots generated`);
    } catch (error) {
      console.error('❌ Error generating time slots:', error);
      throw error;
    }
  }

  // Generate bookings and payments for one year
  async generateYearlyData() {
    try {
      const today = new Date();
      const startDate = utils.addDays(today, -CONFIG.SETTINGS.daysToGenerate + 1);
      
      console.log(`📅 Generating data from ${utils.formatDate(startDate)} to ${utils.formatDate(today)}`);
      
      for (let dayIndex = 0; dayIndex < CONFIG.SETTINGS.daysToGenerate; dayIndex++) {
        const currentDate = utils.addDays(startDate, dayIndex);
        const seasonalMultiplier = utils.getSeasonalMultiplier(currentDate);
        
        // Generate bookings for this day
        const bookingsForDay = this.generateBookingsForDay(currentDate, seasonalMultiplier);
        
        // Generate payments for each booking
        for (const booking of bookingsForDay) {
          const payment = await this.generatePaymentForBooking(booking);
          this.payments.push(payment);
        }
        
        this.bookings.push(...bookingsForDay);
        
        // Progress indicator
        if ((dayIndex + 1) % 30 === 0) {
          console.log(`📊 Generated data for ${dayIndex + 1} days...`);
        }
      }
      
      console.log(`✅ Generated ${this.bookings.length} bookings and ${this.payments.length} payments`);
    } catch (error) {
      console.error('❌ Error generating yearly data:', error);
      throw error;
    }
  }

  // Generate bookings for a specific day
  generateBookingsForDay(date, seasonalMultiplier) {
    const bookings = [];
    const dayOfWeek = utils.getDayOfWeek(date);
    const isWeekend = utils.isWeekend(date);
    
    // Base number of bookings for this day
    let baseBookings = utils.random(CONFIG.SETTINGS.minBookingsPerDay, CONFIG.SETTINGS.maxBookingsPerDay);
    
    // Apply seasonal and day-of-week multipliers
    baseBookings = Math.floor(baseBookings * seasonalMultiplier);
    if (isWeekend) baseBookings = Math.floor(baseBookings * 1.3); // 30% weekend boost
    
    // Generate individual bookings
    for (let i = 0; i < baseBookings; i++) {
      const customer = this.customers[utils.random(0, this.customers.length - 1)];
      const service = this.services[utils.random(0, this.services.length - 1)];
      const member = this.members[utils.random(0, this.members.length - 1)];
      const timeSlot = CONFIG.TIME_SLOTS[utils.random(0, CONFIG.TIME_SLOTS.length - 1)];
      
      // Calculate pricing
      const originalPrice = service.price;
      const tip = utils.generateTip(originalPrice);
      const tax = utils.generateTax(originalPrice);
      const serviceFee = utils.generateServiceFee(originalPrice);
      const totalAmount = originalPrice + tip + tax + serviceFee;
      
      // Determine booking status
      const statusRoll = Math.random();
      let status = 'completed';
      if (statusRoll < CONFIG.SETTINGS.cancellationRate) {
        status = 'cancelled';
      } else if (statusRoll < CONFIG.SETTINGS.cancellationRate + CONFIG.SETTINGS.noShowRate) {
        status = 'no_show';
      }
      
      // Determine payment method
      const paymentMethod = this.selectPaymentMethod();
      const isCrypto = paymentMethod.type === 'crypto';
      
      const booking = new BookingService({
        booking_id: `BK${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${String(i + 1).padStart(3, '0')}`,
        customer_user_id: customer._id,
        seller_user_id: this.professionalUser._id,
        service_id: service._id,
        member_id: member._id,
        orignal_price: originalPrice,
        total_amount: totalAmount,
        tax: tax,
        professional_service_fee: serviceFee,
        other_charges: tip,
        day: date,
        time: timeSlot,
        status: status,
        booking_time: timeSlot,
        payment_mode: 'online',
        isCrypto: isCrypto,
        slot_date: date,
        created: date,
        updated: date
      });
      
      // Add card details if not crypto
      if (!isCrypto) {
        const cardData = utils.generateCardPayment(totalAmount, paymentMethod.method);
        booking.card_no = cardData.cardNumber;
        booking.cv = cardData.cvv;
        booking.exp_month = cardData.expMonth;
        booking.exp_year = cardData.expYear;
      }
      
      bookings.push(booking);
    }
    
    return bookings;
  }

  // Select payment method based on configured percentages
  selectPaymentMethod() {
    const rand = Math.random();
    let cumulative = 0;
    
    for (const method of CONFIG.PAYMENT_METHODS) {
      cumulative += method.percentage;
      if (rand <= cumulative) {
        return method;
      }
    }
    
    // Fallback to first method
    return CONFIG.PAYMENT_METHODS[0];
  }

  // Generate payment for a booking
  async generatePaymentForBooking(booking) {
    try {
      const payment = new Payment({
        payment_id: `PAY${Date.now()}${Math.random().toString(36).substr(2, 5)}`,
        booking_id: booking._id,
        type: booking.isCrypto ? 'crypto' : 'card',
        price: booking.total_amount,
        created: booking.created,
        updated: booking.updated
      });
      
      return await payment.save();
    } catch (error) {
      console.error('❌ Error generating payment:', error);
      throw error;
    }
  }

  // Generate ratings for completed bookings
  async generateRatings() {
    try {
      const completedBookings = this.bookings.filter(b => b.status === 'completed');
      
      for (const booking of completedBookings) {
        // 80% of completed bookings get ratings
        if (Math.random() < 0.8) {
          const rating = new Rating({
            user_id: booking.customer_user_id,
            salon_id: booking.seller_user_id,
            member_id: booking.member_id,
            rating: utils.random(3, 5), // Most ratings are positive
            type: 'salon',
            text: this.generateReview(),
            create_date: utils.addDays(booking.created, utils.random(0, 7)), // Review within a week
            update_date: utils.addDays(booking.created, utils.random(0, 7))
          });
          
          this.ratings.push(rating);
        }
      }
      
      await Rating.insertMany(this.ratings);
      console.log(`✅ ${this.ratings.length} ratings generated`);
    } catch (error) {
      console.error('❌ Error generating ratings:', error);
      throw error;
    }
  }

  // Generate realistic reviews
  generateReview() {
    const reviews = [
      "Great service! Very professional and friendly staff.",
      "Excellent work, highly recommend!",
      "Very satisfied with the results.",
      "Professional service, clean environment.",
      "Amazing experience, will definitely return!",
      "Great attention to detail, love the results.",
      "Friendly staff and excellent service quality.",
      "Very professional and skilled team.",
      "Outstanding service, exceeded expectations.",
      "Highly recommend, great value for money."
    ];
    
    return reviews[utils.random(0, reviews.length - 1)];
  }

  // Generate cart data for product sales
  async generateCartData() {
    try {
      const carts = [];
      const today = new Date();
      const startDate = utils.addDays(today, -CONFIG.SETTINGS.daysToGenerate + 1);
      
      for (let dayIndex = 0; dayIndex < CONFIG.SETTINGS.daysToGenerate; dayIndex++) {
        const currentDate = utils.addDays(startDate, dayIndex);
        const seasonalMultiplier = utils.getSeasonalMultiplier(currentDate);
        
        // Generate 1-5 cart transactions per day
        const dailyCarts = utils.random(1, Math.floor(5 * seasonalMultiplier));
        
        for (let i = 0; i < dailyCarts; i++) {
          const customer = this.customers[utils.random(0, this.customers.length - 1)];
          const product = this.products[utils.random(0, this.products.length - 1)];
          const quantity = utils.random(1, 3);
          
          const cart = new Cart({
            customer_user_id: customer._id,
            seller_user_id: this.professionalUser._id,
            product_id: product._id,
            quantity: quantity,
            price: product.price * quantity,
            status: 'paid',
            isCrypto: Math.random() < 0.2, // 20% crypto
            tax: parseFloat((product.price * quantity * 0.08).toFixed(2)), // 8% tax
            professional_product_fee: parseFloat((product.price * quantity * 0.03).toFixed(2)), // 3% fee
            created: currentDate,
            updated: currentDate
          });
          
          carts.push(cart);
        }
      }
      
      await Cart.insertMany(carts);
      this.carts = carts;
      console.log(`✅ ${carts.length} cart items generated`);
    } catch (error) {
      console.error('❌ Error generating cart data:', error);
      throw error;
    }
  }

  // Generate crypto payment analytics data
  generateCryptoAnalytics() {
    const cryptoPayments = this.payments.filter(p => p.type === 'crypto');
    const cryptoData = {
      totalTransactions: cryptoPayments.length,
      totalVolume: cryptoPayments.reduce((sum, p) => sum + p.price, 0),
      byCurrency: {},
      dailyVolume: {},
      adoptionTrend: []
    };
    
    // Group by cryptocurrency
    cryptoPayments.forEach(payment => {
      const booking = this.bookings.find(b => b._id.toString() === payment.booking_id.toString());
      if (booking && booking.isCrypto) {
        // This would need to be enhanced with actual crypto data from the booking
        const cryptoType = ['Bitcoin', 'Ethereum', 'USDC', 'Litecoin'][utils.random(0, 3)];
        cryptoData.byCurrency[cryptoType] = (cryptoData.byCurrency[cryptoType] || 0) + payment.price;
      }
    });
    
    return cryptoData;
  }

  // Generate comprehensive analytics summary
  generateAnalyticsSummary() {
    const totalRevenue = this.payments.reduce((sum, p) => sum + p.price, 0);
    const cryptoPayments = this.payments.filter(p => p.type === 'crypto');
    const cardPayments = this.payments.filter(p => p.type === 'card');
    
    const summary = {
      totalBookings: this.bookings.length,
      totalRevenue: totalRevenue,
      totalPayments: this.payments.length,
      cryptoPayments: {
        count: cryptoPayments.length,
        volume: cryptoPayments.reduce((sum, p) => sum + p.price, 0),
        percentage: (cryptoPayments.length / this.payments.length * 100).toFixed(2)
      },
      cardPayments: {
        count: cardPayments.length,
        volume: cardPayments.reduce((sum, p) => sum + p.price, 0),
        percentage: (cardPayments.length / this.payments.length * 100).toFixed(2)
      },
      averageBookingValue: (totalRevenue / this.bookings.length).toFixed(2),
      completionRate: (this.bookings.filter(b => b.status === 'completed').length / this.bookings.length * 100).toFixed(2),
      totalProducts: this.products.length,
      totalRatings: this.ratings.length,
      averageRating: (this.ratings.reduce((sum, r) => sum + r.rating, 0) / this.ratings.length).toFixed(1)
    };
    
    return summary;
  }

  // Main execution method
  async run() {
    try {
      console.log('🚀 Starting One Year Data Seeder...');
      
      await this.connect();
      await this.generateProfessionalUser();
      await this.generateCustomers();
      await this.generateMembers();
      await this.generateServices();
      await this.generateProducts();
      await this.generateTimeSlots();
      await this.generateYearlyData();
      await this.generateRatings();
      await this.generateCartData();
      
      // Save all bookings first
      await BookingService.insertMany(this.bookings);
      console.log(`✅ ${this.bookings.length} bookings saved to database`);
      
      // Generate analytics summary
      const summary = this.generateAnalyticsSummary();
      const cryptoAnalytics = this.generateCryptoAnalytics();
      
      console.log('\n📊 DATA GENERATION COMPLETE!');
      console.log('================================');
      console.log(`📅 Period: ${CONFIG.SETTINGS.daysToGenerate} days (including today)`);
      console.log(`👥 Customers: ${summary.totalBookings}`);
      console.log(`💼 Bookings: ${summary.totalBookings}`);
      console.log(`💰 Total Revenue: $${summary.totalRevenue.toLocaleString()}`);
      console.log(`💳 Card Payments: ${summary.cardPayments.count} (${summary.cardPayments.percentage}%)`);
      console.log(`₿ Crypto Payments: ${summary.cryptoPayments.count} (${summary.cryptoPayments.percentage}%)`);
      console.log(`⭐ Average Rating: ${summary.averageRating}/5`);
      console.log(`📦 Products: ${summary.totalProducts}`);
      console.log(`🛒 Cart Items: ${summary.totalProducts}`);
      
      console.log('\n🔍 Crypto Analytics:');
      console.log(`   Total Crypto Volume: $${cryptoAnalytics.totalVolume.toLocaleString()}`);
      console.log(`   Crypto Transactions: ${cryptoAnalytics.totalTransactions}`);
      
      console.log('\n✅ All data has been successfully generated and saved to the database!');
      console.log('🎯 You can now test the AI Insights page with comprehensive real-world data.');
      
    } catch (error) {
      console.error('❌ Seeder failed:', error);
    } finally {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  const seeder = new OneYearDataSeeder();
  seeder.run().catch(console.error);
}

module.exports = OneYearDataSeeder;
