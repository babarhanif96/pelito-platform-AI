# Demo Data Seeder for Analytics Testing

This script generates realistic demo data for testing the Business Analytics dashboard without requiring real money or cryptocurrency transactions.

## 🚀 Quick Start

### Option 1: Using npm script (Recommended)
```bash
cd backend
npm run seed:demo
```

### Option 2: Direct execution
```bash
cd backend/scripts
node runSeeder.js
```

### Option 3: Using the seeder directly
```bash
cd backend/scripts
node seedDemoData.js
```

## 📊 What Gets Created

### 👤 Users
- **1 Professional User**: Sarah Johnson (Beauty Salon Owner)
- **15 Customer Users**: Various customers with realistic names and emails
- **4 Staff Members**: Different roles (Stylist, Color Specialist, etc.)

### 💇‍♀️ Services
- **10 Professional Services**: Hair, makeup, spa, and nail services
- **Realistic Pricing**: $25-$200 per service
- **Service Categories**: Hair, Skincare, Nails, Makeup, Beauty, Spa

### 📅 Bookings & Payments
- **90 Days of Recent Data**: Last 3 months of bookings
- **6 Months of Historical Data**: For trend analysis
- **Realistic Patterns**: 
  - 3-15 bookings per day
  - 10% cancellation rate
  - 5% no-show rate
  - 5-20% tip range
  - 8% tax calculation

### 🕐 Time Slots
- **Business Hours**: 9:00 AM - 8:00 PM
- **30-minute intervals**: Professional scheduling
- **6 days per week**: Closed on Sundays

## 🎯 Generated Data Details

### Professional User
```
Name: Sarah Johnson
Email: sarah.johnson@demo.com
Salon: Sarah's Beauty Salon
Location: New York, NY
Experience: 8 years
Rating: 4.8/5
```

### Services Offered
1. **Haircut & Style** - $45 (60 min)
2. **Hair Coloring** - $120 (120 min)
3. **Hair Extensions** - $200 (180 min)
4. **Facial Treatment** - $80 (90 min)
5. **Manicure** - $35 (45 min)
6. **Pedicure** - $45 (60 min)
7. **Makeup Application** - $75 (90 min)
8. **Eyebrow Shaping** - $25 (30 min)
9. **Hair Treatment** - $65 (75 min)
10. **Spa Massage** - $95 (60 min)

### Customer Base
- 15 diverse customers with realistic names
- Mix of regular and occasional clients
- Various spending patterns for analytics

### Staff Members
- **Jessica Smith** - Senior Stylist
- **Alex Johnson** - Color Specialist
- **Maria Garcia** - Nail Technician
- **Kevin Chen** - Spa Therapist

## 🔧 Configuration

You can modify the data generation settings in `seedDemoData.js`:

```javascript
const CONFIG = {
  SETTINGS: {
    daysToGenerate: 90,           // Days of recent data
    maxBookingsPerDay: 15,        // Maximum bookings per day
    minBookingsPerDay: 3,         // Minimum bookings per day
    tipPercentage: { min: 5, max: 20 }, // Tip range
    cancellationRate: 0.1,        // 10% cancellation rate
    noShowRate: 0.05              // 5% no-show rate
  }
};
```

## 🗄️ Database Requirements

### Required Collections
- `users` - Professional and customer users
- `members` - Staff members
- `professional_services` - Services offered
- `booking_services` - Booking records
- `payments` - Payment records
- `slots` - Time slot availability

### Environment Variables
```env
MONGODB_URI=mongodb://localhost:27017/pelito-platform
```

## 🧪 Testing the Analytics

After running the seeder:

1. **Start your backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start your frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Navigate to analytics dashboard**:
   ```
   http://localhost:5173/professional/analytics
   ```

4. **Use the professional ID** shown in the seeder output for testing

## 📈 Analytics Data You'll See

### Daily Analytics
- **Total Earnings**: $200-$800 per day
- **Clients Served**: 3-15 clients per day
- **Peak Hours**: Usually 2-5 PM
- **Popular Services**: Haircut & Style, Manicure

### Weekly Analytics
- **Revenue Trends**: Day-by-day patterns
- **Service Performance**: Top 3 services by revenue
- **Client Retention**: Mix of new and returning clients

### Monthly Analytics
- **Revenue Growth**: Realistic monthly patterns
- **Service Profitability**: Margin analysis
- **Time Block Performance**: Peak and off-peak hours

## 🔄 Re-running the Seeder

The seeder automatically clears existing demo data before creating new data. If you want to keep existing data, comment out the cleanup section in `seedDemoData.js`:

```javascript
// Comment out these lines to keep existing data
// await User.deleteMany({ email: { $regex: /@demo\.com|@email\.com/ } });
// await ProfessionalService.deleteMany({ service_name: { $in: CONFIG.SERVICES.map(s => s.service_name) } });
// ... etc
```

## 🛠️ Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   ```
   ❌ Error: connect ECONNREFUSED 127.0.0.1:27017
   ```
   **Solution**: Make sure MongoDB is running on your system

2. **Permission Denied**
   ```
   ❌ Error: EACCES: permission denied
   ```
   **Solution**: Check database user permissions

3. **Duplicate Key Error**
   ```
   ❌ Error: E11000 duplicate key error
   ```
   **Solution**: The seeder will automatically clear existing demo data

### Environment Setup

1. **Install MongoDB** (if not already installed):
   ```bash
   # macOS
   brew install mongodb-community
   
   # Ubuntu
   sudo apt-get install mongodb
   
   # Windows
   # Download from mongodb.com
   ```

2. **Start MongoDB**:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Ubuntu
   sudo systemctl start mongodb
   
   # Windows
   # Start MongoDB service
   ```

3. **Verify Connection**:
   ```bash
   mongosh mongodb://localhost:27017
   ```

## 📝 Customization

### Adding More Services
Edit the `SERVICES` array in `seedDemoData.js`:

```javascript
SERVICES: [
  { service_name: 'New Service', price: 50, duration: 60, category: 'Category' },
  // ... existing services
]
```

### Adding More Customers
Edit the `CUSTOMERS` array:

```javascript
CUSTOMERS: [
  { first_name: 'New', last_name: 'Customer', email: 'new@email.com', phone: '+1-555-9999' },
  // ... existing customers
]
```

### Modifying Data Patterns
Adjust the `SETTINGS` object to change:
- Number of days to generate
- Booking frequency
- Tip percentages
- Cancellation rates

## 🎉 Success!

After running the seeder successfully, you'll see output like:

```
📊 Demo Data Summary:
=====================
👤 Professional User: Sarah Johnson
👥 Customers: 15
👨‍💼 Staff Members: 4
💇‍♀️ Services: 10
📅 Recent Bookings: 1,234
💰 Recent Payments: 1,156
📅 Historical Bookings: 2,456
💰 Historical Payments: 2,234
📊 Total Bookings: 3,690
💳 Total Payments: 3,390

🎯 Analytics Testing Ready!
========================
🔑 Professional ID: 507f1f77bcf86cd799439011
📧 Professional Email: sarah.johnson@demo.com
🏪 Salon Name: Sarah's Beauty Salon
```

Your analytics dashboard is now ready for comprehensive testing! 🚀
