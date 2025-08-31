# 🚀 One Year Data Seeder - Pelito Platform

## 📋 Overview

This comprehensive data seeder generates **365 days of realistic test data** for the entire Pelito platform, including today's date. It creates a complete business ecosystem with realistic patterns, seasonal variations, and comprehensive payment data for both crypto and card payments.

## ✨ Features

### 🗓️ **Time Coverage**
- **Full Year Data**: 365 days of continuous data
- **Today Included**: Current date is always included
- **Realistic Patterns**: Weekday/weekend variations, holiday season boosts

### 💳 **Payment Methods**
- **Credit Cards**: Visa, Mastercard, American Express
- **Cryptocurrencies**: Bitcoin, Ethereum, USDC, Litecoin
- **Realistic Distribution**: 80% cards, 20% crypto (configurable)

### 📊 **Data Types Generated**
- **Professional Users**: Salon owners and service providers
- **Customers**: 20 realistic customer profiles with loyalty scores
- **Staff Members**: 8 team members with performance ratings
- **Services**: 15 beauty services with realistic pricing
- **Products**: 10 retail products for e-commerce
- **Bookings**: Daily appointments with realistic patterns
- **Payments**: Complete payment records with fees and taxes
- **Ratings**: Customer reviews and ratings
- **Cart Items**: Product purchases and transactions

### 🔄 **Realistic Business Patterns**
- **Seasonal Variations**: Holiday season boosts (40% increase)
- **Weekend Effects**: Weekend bookings 30% higher
- **Service Popularity**: Different services have varying demand
- **Customer Loyalty**: Repeat customers with loyalty scores
- **Staff Performance**: Team members with different skill levels

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB running and accessible
- All required models exist in your database

### Quick Start

#### Option 1: Direct Node.js Execution
```bash
cd backend/scripts
node runOneYearSeeder.js
```

#### Option 2: Windows Batch File
```bash
cd backend/scripts
seed-one-year.bat
```

#### Option 3: Linux/Mac Shell Script
```bash
cd backend/scripts
chmod +x seed-one-year.sh
./seed-one-year.sh
```

## 📊 Data Generation Details

### 🏢 **Professional User**
- **Name**: Sarah Johnson
- **Business**: Sarah's Beauty Salon
- **Location**: New York, NY
- **Experience**: 8 years
- **Rating**: 4.8/5

### 👥 **Customer Profiles**
- **Total**: 20 customers
- **Loyalty Scores**: 0.6 - 0.9 (realistic distribution)
- **Average Spend**: $70 - $160 per customer
- **Email Format**: `firstname.lastname@email.com`

### 💼 **Services Offered**
| Service | Price | Duration | Category | Popularity |
|---------|-------|----------|----------|------------|
| Haircut & Style | $45 | 60 min | Hair | 90% |
| Hair Coloring | $120 | 120 min | Hair | 80% |
| Hair Extensions | $200 | 180 min | Hair | 60% |
| Facial Treatment | $80 | 90 min | Skincare | 70% |
| Manicure | $35 | 45 min | Nails | 80% |
| Pedicure | $45 | 60 min | Nails | 70% |
| Makeup Application | $75 | 90 min | Makeup | 60% |
| Eyebrow Shaping | $25 | 30 min | Beauty | 90% |
| Hair Treatment | $65 | 75 min | Hair | 70% |
| Spa Massage | $95 | 60 min | Spa | 80% |
| Keratin Treatment | $150 | 150 min | Hair | 50% |
| Hair Highlights | $90 | 90 min | Hair | 70% |
| Gel Nails | $55 | 60 min | Nails | 60% |
| Acrylic Nails | $65 | 75 min | Nails | 50% |
| Deep Conditioning | $40 | 45 min | Hair | 80% |

### 🛍️ **Products Available**
| Product | Price | Cost | Stock | Category |
|---------|-------|------|-------|----------|
| Professional Hair Shampoo | $25 | $12 | 50 | Hair Care |
| Luxury Hair Conditioner | $28 | $14 | 45 | Hair Care |
| Anti-Aging Serum | $45 | $22 | 30 | Skincare |
| Nail Polish Set | $35 | $18 | 60 | Nails |
| Makeup Brush Set | $55 | $28 | 25 | Makeup |
| Hair Styling Gel | $18 | $9 | 70 | Hair Care |
| Facial Cleanser | $32 | $16 | 40 | Skincare |
| Nail File Kit | $15 | $8 | 80 | Nails |
| Eyeshadow Palette | $42 | $21 | 35 | Makeup |
| Hair Mask Treatment | $38 | $19 | 55 | Hair Care |

### 👨‍💼 **Staff Members**
| Name | Role | Performance | Hourly Rate |
|------|------|-------------|-------------|
| Jessica Smith | Senior Stylist | 90% | $25 |
| Alex Johnson | Color Specialist | 80% | $28 |
| Maria Garcia | Nail Technician | 70% | $22 |
| Kevin Chen | Spa Therapist | 80% | $26 |
| Lisa Wang | Makeup Artist | 90% | $30 |
| Ryan O'Connor | Junior Stylist | 60% | $20 |
| Sofia Rodriguez | Esthetician | 80% | $24 |
| Marcus Thompson | Barber | 70% | $23 |

## 💰 Payment Structure

### 💳 **Card Payments (80%)**
- **Visa**: 35% of card payments
- **Mastercard**: 30% of card payments
- **American Express**: 15% of card payments
- **Processing Fees**: 2.9% + $0.30 per transaction

### ₿ **Crypto Payments (20%)**
- **Bitcoin (BTC)**: 40% of crypto payments
- **Ethereum (ETH)**: 30% of crypto payments
- **USDC**: 20% of crypto payments
- **Litecoin (LTC)**: 10% of crypto payments
- **Network Fees**: 0.1% of transaction amount

### 💸 **Additional Charges**
- **Tips**: 8-25% of service price
- **Taxes**: 6.5-9.5% (varies by location)
- **Service Fees**: 2.5-4.5% of service price

## 📈 Business Patterns

### 🗓️ **Daily Variations**
- **Weekdays**: Normal booking volume
- **Weekends**: 30% increase in bookings
- **Holiday Season** (Nov-Dec): 40% increase in bookings

### 📊 **Seasonal Trends**
- **Spring**: Hair coloring and styling peak
- **Summer**: Nail services and facials popular
- **Fall**: Hair treatments and extensions
- **Winter**: Spa services and holiday specials

### 🎯 **Customer Behavior**
- **Loyalty**: 60-90% loyalty scores
- **Spending**: $70-$160 average per visit
- **Frequency**: 0.4-2.1 visits per month
- **Ratings**: 3-5 stars (mostly positive)

## 🔧 Configuration Options

### ⚙️ **Settings in `seedOneYearData.js`**
```javascript
SETTINGS: {
  daysToGenerate: 365,           // Total days to generate
  maxBookingsPerDay: 25,         // Maximum bookings per day
  minBookingsPerDay: 5,          // Minimum bookings per day
  tipPercentage: { min: 8, max: 25 }, // Tip range
  cancellationRate: 0.08,        // 8% cancellation rate
  noShowRate: 0.04,             // 4% no-show rate
  cryptoAdoptionRate: 0.20,     // 20% crypto payments
  seasonalVariation: true,       // Enable seasonal patterns
  weekendBoost: true,            // Weekend boost enabled
  holidayEffect: true            // Holiday season boost
}
```

### 🎨 **Customization**
You can modify the configuration to:
- Change payment method distributions
- Adjust seasonal multipliers
- Modify service pricing
- Add new customer profiles
- Customize business patterns

## 📊 Expected Data Volume

### 📈 **After Running the Seeder**
- **Total Bookings**: ~6,000-9,000 (varies by season)
- **Total Revenue**: $300,000 - $500,000
- **Total Payments**: ~6,000-9,000 transactions
- **Crypto Payments**: ~1,200-1,800 transactions
- **Card Payments**: ~4,800-7,200 transactions
- **Customer Ratings**: ~4,800-7,200 reviews
- **Product Sales**: ~1,800-2,700 cart items

### ⏱️ **Generation Time**
- **Estimated Duration**: 2-5 minutes
- **Database Size**: +50-100MB
- **Memory Usage**: ~200-500MB during generation

## 🧪 Testing Your AI Insights

### 🎯 **AI Insights Page**
Navigate to `/professional/ai-insights` to test:
- **Revenue Forecasting**: LSTM neural networks with real data
- **Churn Prediction**: ML-based analysis with 20 customers
- **Smart Promotions**: AI optimization with booking patterns
- **Service Trends**: Statistical analysis with 15 services
- **Hours Optimization**: Revenue simulation with time slots
- **Client LTV**: Predictive modeling with transaction history

### 📊 **Admin Analytics**
Navigate to `/admin/team-shop-analysis` to test:
- **Team Performance**: 8 staff members with metrics
- **Revenue Analysis**: Year-long financial data
- **Service Performance**: 15 services with popularity scores
- **Product Sales**: 10 products with inventory tracking

## 🚨 Important Notes

### ⚠️ **Before Running**
1. **Backup Database**: This generates a large amount of data
2. **MongoDB Running**: Ensure your database is accessible
3. **Model Compatibility**: All required models must exist
4. **Sufficient Storage**: Expect +50-100MB of new data

### 🔒 **Data Security**
- **Test Environment**: Only run in development/testing
- **Production Warning**: Never run in production
- **Data Isolation**: Consider using a separate test database

### 🧹 **Cleanup (Optional)**
If you need to remove the test data:
```javascript
// In MongoDB shell or Mongoose
db.booking_services.deleteMany({})
db.payments.deleteMany({})
db.ratings.deleteMany({})
db.carts.deleteMany({})
```

## 🆘 Troubleshooting

### ❌ **Common Issues**

#### MongoDB Connection Error
```
❌ MongoDB connection error: ECONNREFUSED
```
**Solution**: Ensure MongoDB is running and accessible

#### Model Not Found Error
```
❌ Error: Cannot find module '../models/bookingServiceModel'
```
**Solution**: Check file paths and model names

#### Permission Denied Error
```
❌ Error: EACCES: permission denied
```
**Solution**: Check file permissions and database access

### 🔧 **Debug Mode**
To see detailed logging, modify the seeder:
```javascript
// Add this to see all database operations
mongoose.set('debug', true);
```

## 📞 Support

If you encounter issues:
1. Check the error logs above
2. Verify MongoDB connection
3. Ensure all models exist
4. Check file permissions
5. Review the configuration

## 🎉 Success!

After successful execution, you'll see:
```
📊 DATA GENERATION COMPLETE!
================================
📅 Period: 365 days (including today)
👥 Customers: 20
💼 Bookings: ~6,000-9,000
💰 Total Revenue: $300,000 - $500,000
💳 Card Payments: ~4,800-7,200 (80%)
₿ Crypto Payments: ~1,200-1,800 (20%)
⭐ Average Rating: 4.2/5
📦 Products: 10
🛒 Cart Items: ~1,800-2,700

✅ All data has been successfully generated and saved to the database!
🎯 You can now test the AI Insights page with comprehensive real-world data.
```

**Happy Testing! 🚀✨**



