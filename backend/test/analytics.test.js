const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const AnalyticsService = require('../services/analyticsService');
const { validateDateRange, formatCurrency, calculatePercentage } = require('../utils/analyticsHelpers');

// Mock data for testing
const mockProfessionalId = new mongoose.Types.ObjectId();
const mockCustomerId = new mongoose.Types.ObjectId();
const mockServiceId = new mongoose.Types.ObjectId();

describe('Analytics System Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Setup test database connection
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/test-analytics');
    
    // Create test user and get auth token
    // This would typically involve creating a test user and logging in
    authToken = 'mock-jwt-token-for-testing';
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Analytics Helper Functions', () => {
    test('validateDateRange should validate correct date ranges', () => {
      const result = validateDateRange('2024-01-01', '2024-01-31');
      expect(result.isValid).toBe(true);
      expect(result.message).toBe('Date range is valid');
    });

    test('validateDateRange should reject invalid date ranges', () => {
      const result = validateDateRange('2024-01-31', '2024-01-01');
      expect(result.isValid).toBe(false);
      expect(result.message).toBe('Start date cannot be after end date');
    });

    test('formatCurrency should format numbers correctly', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(-100)).toBe('-$100.00');
    });

    test('calculatePercentage should calculate percentages correctly', () => {
      expect(calculatePercentage(25, 100)).toBe(25);
      expect(calculatePercentage(0, 100)).toBe(0);
      expect(calculatePercentage(50, 200)).toBe(25);
    });
  });

  describe('Analytics Service', () => {
    test('getDailyAnalytics should return structured daily data', async () => {
      const result = await AnalyticsService.getDailyAnalytics(mockProfessionalId.toString());
      
      expect(result).toHaveProperty('kpis');
      expect(result).toHaveProperty('charts');
      expect(result).toHaveProperty('metadata');
      
      expect(result.kpis).toHaveProperty('totalEarningsToday');
      expect(result.kpis).toHaveProperty('clientsServedToday');
      expect(result.kpis).toHaveProperty('mostPerformedServiceToday');
    });

    test('getWeeklyAnalytics should return structured weekly data', async () => {
      const startDate = '2024-01-01';
      const endDate = '2024-01-07';
      
      const result = await AnalyticsService.getWeeklyAnalytics(
        mockProfessionalId.toString(), 
        startDate, 
        endDate
      );
      
      expect(result).toHaveProperty('kpis');
      expect(result).toHaveProperty('charts');
      expect(result).toHaveProperty('details');
      expect(result).toHaveProperty('metadata');
      
      expect(result.kpis).toHaveProperty('top3ServicesByRevenue');
      expect(result.kpis).toHaveProperty('mostProfitableDayOfWeek');
      expect(result.kpis).toHaveProperty('averageRevenuePerClient');
    });

    test('getMonthlyAnalytics should return structured monthly data', async () => {
      const result = await AnalyticsService.getMonthlyAnalytics(
        mockProfessionalId.toString(),
        2024,
        1
      );
      
      expect(result).toHaveProperty('kpis');
      expect(result).toHaveProperty('charts');
      expect(result).toHaveProperty('details');
      expect(result).toHaveProperty('metadata');
      
      expect(result.kpis).toHaveProperty('highestProfitService');
      expect(result.kpis).toHaveProperty('newVsReturningClients');
      expect(result.kpis).toHaveProperty('totalMonthlyRevenue');
    });
  });

  describe('Analytics API Endpoints', () => {
    test('GET /analytics/daily/:professionalId should return daily analytics', async () => {
      const response = await request(app)
        .get(`/analytics/daily/${mockProfessionalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('kpis');
      expect(response.body.data).toHaveProperty('charts');
    });

    test('GET /analytics/weekly/:professionalId should return weekly analytics', async () => {
      const response = await request(app)
        .get(`/analytics/weekly/${mockProfessionalId}`)
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-07'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('kpis');
      expect(response.body.data).toHaveProperty('charts');
    });

    test('GET /analytics/monthly/:professionalId should return monthly analytics', async () => {
      const response = await request(app)
        .get(`/analytics/monthly/${mockProfessionalId}`)
        .query({
          year: 2024,
          month: 1
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('kpis');
      expect(response.body.data).toHaveProperty('charts');
    });

    test('GET /analytics/dashboard/:professionalId should return real-time data', async () => {
      const response = await request(app)
        .get(`/analytics/dashboard/${mockProfessionalId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('realTime');
      expect(response.body.data).toHaveProperty('todayRevenue');
    });

    test('GET /analytics/custom/:professionalId should return custom range data', async () => {
      const response = await request(app)
        .get(`/analytics/custom/${mockProfessionalId}`)
        .query({
          startDate: '2024-01-01',
          endDate: '2024-01-31',
          metrics: 'revenue,bookings'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('period');
      expect(response.body.data).toHaveProperty('summary');
    });
  });

  describe('Error Handling', () => {
    test('should return 401 for missing authentication', async () => {
      await request(app)
        .get(`/analytics/daily/${mockProfessionalId}`)
        .expect(401);
    });

    test('should return 400 for invalid date range', async () => {
      await request(app)
        .get(`/analytics/weekly/${mockProfessionalId}`)
        .query({
          startDate: '2024-01-31',
          endDate: '2024-01-01'
        })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);
    });

    test('should return 400 for missing professional ID', async () => {
      await request(app)
        .get('/analytics/daily/')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });
  });

  describe('Data Validation', () => {
    test('should handle empty data gracefully', async () => {
      const emptyProfessionalId = new mongoose.Types.ObjectId();
      
      const result = await AnalyticsService.getDailyAnalytics(emptyProfessionalId.toString());
      
      expect(result.kpis.totalEarningsToday).toBe(0);
      expect(result.kpis.clientsServedToday).toBe(0);
      expect(result.charts.revenueByHour).toBeInstanceOf(Array);
      expect(result.charts.topServices).toBeInstanceOf(Array);
    });

    test('should handle invalid professional ID format', async () => {
      await expect(
        AnalyticsService.getDailyAnalytics('invalid-id')
      ).rejects.toThrow();
    });
  });

  describe('Performance Tests', () => {
    test('daily analytics should complete within reasonable time', async () => {
      const startTime = Date.now();
      
      await AnalyticsService.getDailyAnalytics(mockProfessionalId.toString());
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(8000); // Should complete within 5 seconds
    });

    test('weekly analytics should complete within reasonable time', async () => {
      const startTime = Date.now();
      
      await AnalyticsService.getWeeklyAnalytics(
        mockProfessionalId.toString(),
        '2024-01-01',
        '2024-01-07'
      );
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
    });
  });
});

// Mock data setup functions
const createMockBooking = async (professionalId, customerId, serviceId, date, amount) => {
  // This would create a mock booking in the test database
  // Implementation depends on your test setup
};

const createMockPayment = async (bookingId, amount) => {
  // This would create a mock payment in the test database
  // Implementation depends on your test setup
};

const cleanupTestData = async () => {
  // This would clean up test data after tests
  // Implementation depends on your test setup
};
