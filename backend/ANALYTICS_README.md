# Business Analytics System

A comprehensive analytics dashboard for professional service providers, built with Node.js, MongoDB, and React.

## 🚀 Features

### Daily Analytics
- **Total Earnings Today**: Real-time revenue tracking
- **Clients Served Today**: Number of completed appointments
- **Most Performed Service Today**: Top service by booking count
- **Average Tip Per Client**: Tip analysis per client
- **Peak Time Slot**: Busiest hours of the day
- **No-Shows This Week**: Cancellation tracking

### Weekly Analytics
- **Top 3 Services by Revenue**: Highest-earning services
- **Most Profitable Day of the Week**: Best performing day
- **Average Revenue per Client**: Client value analysis
- **Top 5 Highest-Spending Clients**: VIP client identification
- **Client Retention Rate**: Customer loyalty metrics
- **Inactive Clients**: Clients who haven't visited in 60+ days

### Monthly Analytics
- **Highest Profit Service**: Most profitable service with margin analysis
- **New vs Returning Clients**: Customer acquisition vs retention
- **Underperforming Time Blocks**: Optimization opportunities
- **Total Monthly Revenue**: Overall performance
- **Most Profitable Hour**: Peak performance time
- **Booking Availability Ratio**: Capacity utilization

## 🏗️ Architecture

### Backend Structure
```
backend/
├── controller/
│   └── analyticsController.js    # API endpoints
├── services/
│   └── analyticsService.js       # Business logic
├── utils/
│   └── analyticsHelpers.js       # Utility functions
├── routes/
│   └── analyticsRoutes.js        # Route definitions
└── middleware/
    └── authMiddleware.js         # Authentication & authorization
```

### Frontend Structure
```
frontend/src/pages/Professional/
└── BusinessAnalytics.jsx         # Main analytics dashboard
```

## 📊 API Endpoints

### Authentication
All endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Daily Analytics
```http
GET /analytics/daily/:professionalId?date=YYYY-MM-DD
```

**Response:**
```json
{
  "success": true,
  "message": "Daily analytics retrieved successfully",
  "data": {
    "kpis": {
      "totalEarningsToday": 540.75,
      "clientsServedToday": 22,
      "uniqueClientsToday": 18,
      "mostPerformedServiceToday": "Haircut (12)",
      "averageTipPerClient": 4.8,
      "peakTimeSlot": "15:00 (5 bookings)",
      "noShowsThisWeek": 3
    },
    "charts": {
      "revenueByHour": [...],
      "topServices": [...],
      "clientsDistribution": [...],
      "topClients": [...]
    },
    "metadata": {
      "date": "2024-01-15",
      "totalBookings": 22,
      "averageBookingValue": 24.58
    }
  }
}
```

### Weekly Analytics
```http
GET /analytics/weekly/:professionalId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
```

### Monthly Analytics
```http
GET /analytics/monthly/:professionalId?year=2024&month=1
```

### Analytics Overview
```http
GET /analytics/overview/:professionalId?period=30
```

### Real-time Dashboard
```http
GET /analytics/dashboard/:professionalId
```

### Custom Range Analytics
```http
GET /analytics/custom/:professionalId?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD&metrics=revenue,bookings,clients
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
MONGODB_URI=mongodb://localhost:27017/your-database
JWT_SECRET_KEY=your-secret-key
PORT=8000
```

5. Start the server:
```bash
npm start
```

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
VITE_API_URL=http://localhost:8000
```

5. Start the development server:
```bash
npm run dev
```

## 📈 Data Models

### BookingService Model
```javascript
{
  booking_id: String,
  customer_user_id: ObjectId,
  seller_user_id: ObjectId,
  service_id: ObjectId,
  slot_id: ObjectId,
  total_amount: Number,
  tax: Number,
  other_charges: Number,
  day: Date,
  time: String,
  status: String,
  slot_date: Date,
  created: Date,
  updated: Date
}
```

### Payment Model
```javascript
{
  payment_id: String,
  booking_id: ObjectId,
  price: Number,
  type: String,
  created: Date,
  updated: Date
}
```

### User Model
```javascript
{
  first_name: String,
  last_name: String,
  email: String,
  user_type: String, // 'professional', 'enthusiastic', 'admin'
  created: Date,
  updated: Date
}
```

## 🔐 Security

### Authentication
- JWT-based authentication
- Token expiration handling
- Secure password hashing

### Authorization
- Role-based access control
- Professional data isolation
- Admin privileges for system-wide analytics

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🚀 Performance Optimization

### Database Optimization
- Indexed queries on frequently accessed fields
- Aggregation pipeline optimization
- Connection pooling

### Caching Strategy
- Redis caching for frequently accessed data
- Cache invalidation on data updates
- Memory-efficient data structures

### Query Optimization
- Efficient MongoDB aggregation pipelines
- Pagination for large datasets
- Lazy loading for charts and tables

## 📊 Analytics Features

### Real-time Data
- Live booking updates
- Real-time revenue tracking
- Instant KPI calculations

### Historical Analysis
- Trend analysis over time
- Year-over-year comparisons
- Seasonal pattern recognition

### Predictive Analytics
- Booking pattern prediction
- Revenue forecasting
- Client behavior analysis

## 🎨 Frontend Features

### Interactive Charts
- Responsive design
- Real-time data updates
- Interactive tooltips
- Zoom and pan capabilities

### Data Visualization
- Line charts for revenue trends
- Bar charts for service performance
- Pie charts for client distribution
- Heat maps for time slot analysis

### User Experience
- Loading states
- Error handling
- Responsive design
- Dark theme support

## 🔧 Configuration

### Environment Variables
```env
# Database
MONGODB_URI=mongodb://localhost:27017/analytics-db

# Authentication
JWT_SECRET_KEY=your-secret-key
JWT_EXPIRES_IN=7d

# Server
PORT=8000
NODE_ENV=development

# Analytics
ANALYTICS_CACHE_TTL=300
ANALYTICS_BATCH_SIZE=1000
```

### Customization
- Modify KPI calculations in `analyticsService.js`
- Add new chart types in the frontend
- Customize date ranges and periods
- Adjust profit margin calculations

## 🧪 Testing

### Backend Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test -- analyticsController.test.js

# Run with coverage
npm run test:coverage
```

### Frontend Testing
```bash
# Run component tests
npm test

# Run E2E tests
npm run test:e2e
```

## 📝 API Documentation

### Error Responses
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### Success Responses
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Status Codes
- `200`: Success
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Daily, weekly, and monthly analytics
- Real-time dashboard
- Professional authorization
- Comprehensive KPI tracking

---

**Built with ❤️ for professional service providers**
