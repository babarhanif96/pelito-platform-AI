# Admin Analytics - Team & Shop Analysis

## Overview

The Admin Analytics module provides comprehensive team and shop-level analysis for platform administrators. This module gives admins deep insights into team performance, revenue analysis, and operational metrics across all shops and team members.

## Features

### 🔷 Team & Shop-Level Analysis (For Owners)

#### 1. **Team Member Revenue Analysis**
- **Which team member generated the most revenue?**
  - Individual revenue tracking per team member
  - Revenue comparison across team members
  - Revenue trends over time
  - Performance ranking system

#### 2. **Rebooking Rate Analysis**
- **Who had the highest rebooking rate?**
  - Individual rebooking rates per team member
  - Rebooking rate trends over time
  - Service-specific rebooking analysis
  - Client retention insights

#### 3. **Service Performance Analysis**
- **Which services are team members best at?**
  - Service-specific performance metrics
  - Skill assessment per team member
  - Service quality ratings
  - Performance comparison across services

#### 4. **Underperforming Team Identification**
- **Who is underperforming compared to shop average?**
  - Performance threshold monitoring
  - Automated underperformer detection
  - Performance gap analysis
  - Improvement recommendations

#### 5. **Revenue Per Hour Analysis**
- **What's the revenue per hour per barber?**
  - Hourly revenue calculations
  - Productivity metrics
  - Time efficiency analysis
  - Performance optimization insights

#### 6. **Product Sales Analysis**
- **Which team member sells the most products?**
  - Product sales tracking per team member
  - Sales performance metrics
  - Product category analysis
  - Upselling effectiveness

## Technical Implementation

### Frontend Components

#### `AdminTeamShopAnalysis.jsx`
- **Location**: `/frontend/src/pages/admin/AdminTeamShopAnalysis.jsx`
- **Features**:
  - Modern glassmorphism UI design
  - Responsive charts and graphs
  - Real-time data filtering
  - Interactive team performance table
  - Date range and shop selection filters

#### Key Components:
1. **ModernKpiCard**: Displays key performance indicators with trends
2. **TeamPerformanceTable**: Interactive table showing team member metrics
3. **ServicePerformanceChart**: Bar chart showing service performance by member
4. **RevenuePerHourChart**: Revenue per hour analysis
5. **ProductSalesAnalysis**: Product sales breakdown with pie chart
6. **UnderperformingAlert**: Highlights team members needing attention

### Backend API Endpoints

#### Analytics Routes
- **Location**: `/backend/routes/analyticsRoutes.js`
- **Admin-specific endpoints**:

```javascript
// Team & Shop Overview
GET /analytics/admin/team-shop-overview
// Team Performance Details
GET /analytics/admin/team-performance
// Revenue Analysis
GET /analytics/admin/revenue-analysis
// Rebooking Analysis
GET /analytics/admin/rebooking-analysis
// Service Performance
GET /analytics/admin/service-performance
// Product Sales Analysis
GET /analytics/admin/product-sales-analysis
// Underperforming Members
GET /analytics/admin/underperforming-members
```

#### Controller Methods
- **Location**: `/backend/controller/analyticsController.js`
- **Admin methods**:
  - `getAdminTeamShopOverview()`
  - `getAdminTeamPerformance()`
  - `getAdminRevenueAnalysis()`
  - `getAdminRebookingAnalysis()`
  - `getAdminServicePerformance()`
  - `getAdminProductSalesAnalysis()`
  - `getAdminUnderperformingMembers()`

#### Service Layer
- **Location**: `/backend/services/analyticsService.js`
- **Admin service methods**:
  - `getAdminTeamShopOverview()`
  - `getAdminTeamPerformance()`
  - `getAdminRevenueAnalysis()`
  - `getAdminRebookingAnalysis()`
  - `getAdminServicePerformance()`
  - `getAdminProductSalesAnalysis()`
  - `getAdminUnderperformingMembers()`

## Data Structure

### Team Performance Data
```javascript
{
  id: "1",
  name: "John Smith",
  role: "Senior Barber",
  shop: "Downtown Shop",
  revenue: 12500,
  bookings: 52,
  rebookingRate: 85,
  revenuePerHour: 45,
  productsSold: 23,
  rating: 4.8,
  status: "excellent",
  hoursWorked: 278,
  servicesPerformed: 156
}
```

### Service Performance Data
```javascript
{
  member: "John Smith",
  Haircut: 95,
  Shave: 88,
  Color: 92,
  Styling: 90,
  averageRating: 4.8,
  totalServices: 156
}
```

### Product Sales Data
```javascript
{
  totalProductsSold: 456,
  totalProductRevenue: 18240,
  salesByMember: [...],
  salesByCategory: [...],
  topSellingProducts: [...]
}
```

## Usage

### Accessing Admin Analytics
1. **Login as Admin**: Use admin credentials to access the platform
2. **Navigate to Analytics**: Click on "Team & Shop Analysis" in the admin navigation
3. **Filter Data**: Use date range and shop filters to customize the view
4. **Interact with Charts**: Hover over charts for detailed information
5. **Click Team Members**: Click on team members in the table for detailed views

### Filtering Options
- **Date Range**: 7 days, 30 days, 90 days, 1 year
- **Shop Selection**: All shops, Downtown Shop, Mall Location, Suburban Branch
- **Real-time Updates**: Click refresh button to get latest data

## Security

### Authentication & Authorization
- **JWT Token Required**: All admin analytics endpoints require valid authentication
- **Admin Role Check**: Only users with `user_type: 'admin'` can access these endpoints
- **Middleware Protection**: Uses `authMiddleware.authorizeAdmin` for route protection

### Data Privacy
- **Shop-level Isolation**: Admins can filter data by specific shops
- **User Consent**: Respects user privacy settings and data sharing preferences
- **Audit Logging**: All admin analytics access is logged for security purposes

## Future Enhancements

### Planned Features
1. **Real-time Dashboard**: Live updates without manual refresh
2. **Export Functionality**: PDF/Excel reports generation
3. **Advanced Filtering**: More granular filtering options
4. **Performance Alerts**: Automated notifications for performance issues
5. **Predictive Analytics**: AI-powered performance predictions
6. **Mobile Optimization**: Responsive design for mobile devices

### Integration Opportunities
1. **HR Systems**: Integration with employee management systems
2. **Payroll Systems**: Automatic commission calculations
3. **CRM Integration**: Customer relationship insights
4. **Inventory Management**: Product performance correlation
5. **Marketing Tools**: Campaign effectiveness analysis

## Troubleshooting

### Common Issues
1. **No Data Displayed**: Check if team members have completed services
2. **API Errors**: Verify admin authentication and permissions
3. **Slow Loading**: Check network connectivity and server performance
4. **Chart Display Issues**: Ensure browser supports modern JavaScript features

### Support
- **Technical Issues**: Contact development team
- **Data Questions**: Contact platform administrators
- **Feature Requests**: Submit through platform feedback system

## Performance Considerations

### Optimization
- **Data Caching**: Implemented for frequently accessed metrics
- **Lazy Loading**: Charts load only when needed
- **Efficient Queries**: Database queries optimized for performance
- **Pagination**: Large datasets are paginated for better performance

### Scalability
- **Database Indexing**: Proper indexing for analytics queries
- **API Rate Limiting**: Prevents abuse and ensures fair usage
- **Data Archiving**: Historical data management for performance
- **CDN Integration**: Static assets served from CDN for speed

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Platform**: Pelito Professional Platform
