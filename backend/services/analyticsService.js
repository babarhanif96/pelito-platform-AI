const BookingService = require('../models/bookingServiceModel');
const Payment = require('../models/paymentModel');
const User = require('../models/usersModel');
const Member = require('../models/memberModel');
const ProfessionalService = require('../models/professionalServiceModel');
const mongoose = require('mongoose');

/**
 * Analytics Service
 * Handles all business logic for analytics calculations
 */
class AnalyticsService {
  /**
   * Get daily analytics for a specific date
   * @param {string} professionalId - Professional user ID
   * @param {string} date - Date in YYYY-MM-DD format (optional, defaults to today)
   * @returns {Object} Daily analytics data
   */
  async getDailyAnalytics(professionalId, date = null) {
    try {
      const targetDate = date ? new Date(date) : new Date();
      const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

      // Get today's bookings with payment information
      const dailyBookings = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(professionalId),
            slot_date: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: 'booking_id',
            as: 'payment'
          }
        },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customer_user_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$payment'
        },
        {
          $unwind: '$service'
        },
        {
          $unwind: '$customer'
        }
      ]);

      // Calculate KPIs
      const totalEarnings = dailyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const clientsServed = dailyBookings.length;
      const uniqueClients = new Set(dailyBookings.map(b => b.customer_user_id.toString())).size;

      // Most performed service today
      const serviceCounts = {};
      dailyBookings.forEach(booking => {
        const serviceName = booking.service.service_name || 'Unknown Service';
        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
      });
      const mostPerformedService = Object.entries(serviceCounts)
        .sort(([,a], [,b]) => b - a)[0] || ['No services', 0];

      // Average tip per client (assuming tips are in other_charges)
      const totalTips = dailyBookings.reduce((sum, booking) => sum + (booking.other_charges || 0), 0);
      const averageTipPerClient = clientsServed > 0 ? totalTips / clientsServed : 0;

      // Peak time slot analysis
      const timeSlotCounts = {};
      dailyBookings.forEach(booking => {
        const time = booking.time || 'Unknown';
        timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
      });
      const peakTimeSlot = Object.entries(timeSlotCounts)
        .sort(([,a], [,b]) => b - a)[0] || ['No bookings', 0];

      // No-shows this week
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const noShowsThisWeek = await BookingService.countDocuments({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: weekStart },
        status: 'cancelled',
        canceled_by: 'customer'
      });

      // Revenue by hour for charts
      const revenueByHour = this.generateHourlyRevenueData(dailyBookings);

      // Top services by revenue
      const serviceRevenue = {};
      dailyBookings.forEach(booking => {
        const serviceName = booking.service.service_name || 'Unknown Service';
        serviceRevenue[serviceName] = (serviceRevenue[serviceName] || 0) + (booking.total_amount || 0);
      });
      const topServices = Object.entries(serviceRevenue)
        .map(([name, revenue]) => ({ service: name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Client distribution (new vs returning)
      const clientDistribution = await this.getClientDistribution(professionalId, startOfDay, endOfDay);

      // Top clients
      const clientSpending = {};
      dailyBookings.forEach(booking => {
        const clientName = `${booking.customer.first_name || ''} ${booking.customer.last_name || ''}`.trim();
        if (!clientSpending[clientName]) {
          clientSpending[clientName] = { visits: 0, spend: 0 };
        }
        clientSpending[clientName].visits += 1;
        clientSpending[clientName].spend += booking.total_amount || 0;
      });
      const topClients = Object.entries(clientSpending)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.spend - a.spend)
        .slice(0, 5);

      // Calculate additional metrics
      const averageRevenuePerHour = this.calculateAverageRevenuePerHour(dailyBookings);
      const totalProductSales = await this.calculateProductSales(professionalId, startOfDay, endOfDay);
      const conversionRate = await this.calculateConversionRate(professionalId, startOfDay, endOfDay);
      const customerSatisfaction = await this.getAverageCustomerRating(professionalId, startOfDay, endOfDay);
      const averageSessionTime = this.calculateAverageSessionTime(dailyBookings);

      return {
        kpis: {
          totalEarningsToday: totalEarnings,
          clientsServedToday: clientsServed,
          uniqueClientsToday: uniqueClients,
          mostPerformedServiceToday: `${mostPerformedService[0]} (${mostPerformedService[1]})`,
          averageTipPerClient: averageTipPerClient,
          peakTimeSlot: `${peakTimeSlot[0]} (${peakTimeSlot[1]} bookings)`,
          noShowsThisWeek: noShowsThisWeek,
          totalProductSales: totalProductSales,
          averageRevenuePerHour: averageRevenuePerHour,
          conversionRate: conversionRate,
          customerSatisfaction: customerSatisfaction,
          averageSessionTime: averageSessionTime
        },
        charts: {
          revenueByHour: revenueByHour,
          topServices: topServices,
          clientsDistribution: clientDistribution,
          topClients: topClients
        },
        metadata: {
          date: startOfDay.toISOString().split('T')[0],
          totalBookings: dailyBookings.length,
          averageBookingValue: clientsServed > 0 ? totalEarnings / clientsServed : 0
        }
      };

    } catch (error) {
      console.error('Error in getDailyAnalytics:', error);
      throw error;
    }
  }

  /**
   * Get weekly analytics for a date range
   * @param {string} professionalId - Professional user ID
   * @param {string} startDate - Start date in YYYY-MM-DD format
   * @param {string} endDate - End date in YYYY-MM-DD format
   * @returns {Object} Weekly analytics data
   */
  async getWeeklyAnalytics(professionalId, startDate, endDate) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      // Get weekly bookings
      const weeklyBookings = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(professionalId),
            slot_date: { $gte: start, $lte: end },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customer_user_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$service'
        },
        {
          $unwind: '$customer'
        }
      ]);

      // Top 3 services by revenue
      const serviceRevenue = {};
      weeklyBookings.forEach(booking => {
        const serviceName = booking.service.service_name || 'Unknown Service';
        serviceRevenue[serviceName] = (serviceRevenue[serviceName] || 0) + (booking.total_amount || 0);
      });
      const top3Services = Object.entries(serviceRevenue)
        .map(([name, revenue]) => ({ service: name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 3);

      // Most profitable day of the week
      const dayRevenue = {};
      weeklyBookings.forEach(booking => {
        const day = new Date(booking.slot_date).toLocaleDateString('en-US', { weekday: 'long' });
        dayRevenue[day] = (dayRevenue[day] || 0) + (booking.total_amount || 0);
      });
      const mostProfitableDay = Object.entries(dayRevenue)
        .sort(([,a], [,b]) => b - a)[0] || ['No data', 0];

      // Average revenue per client
      const totalRevenue = weeklyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const uniqueClients = new Set(weeklyBookings.map(b => b.customer_user_id.toString())).size;
      const averageRevenuePerClient = uniqueClients > 0 ? totalRevenue / uniqueClients : 0;

      // Top 5 highest-spending clients
      const clientSpending = {};
      weeklyBookings.forEach(booking => {
        const clientName = `${booking.customer.first_name || ''} ${booking.customer.last_name || ''}`.trim();
        if (!clientSpending[clientName]) {
          clientSpending[clientName] = { visits: 0, spend: 0 };
        }
        clientSpending[clientName].visits += 1;
        clientSpending[clientName].spend += booking.total_amount || 0;
      });
      const top5Clients = Object.entries(clientSpending)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.spend - a.spend)
        .slice(0, 5);

      // Client retention rate
      const retentionRate = await this.calculateClientRetentionRate(professionalId, start, end);

      // Inactive clients (last 60 days)
      const inactiveClients = await this.getInactiveClients(professionalId, 60);

      // Revenue by day for charts
      const revenueByDay = this.generateDailyRevenueData(weeklyBookings);

      // Client distribution
      const clientDistribution = await this.getClientDistribution(professionalId, start, end);

      // Calculate additional metrics
      const totalProductSales = await this.calculateProductSales(professionalId, start, end);
      const weeklyGrowth = await this.calculateWeeklyGrowth(professionalId, start, end);
      const averageBookingValue = weeklyBookings.length > 0 ? totalRevenue / weeklyBookings.length : 0;

      return {
        kpis: {
          top3ServicesByRevenue: top3Services.map(s => s.service).join(', '),
          mostProfitableDayOfWeek: mostProfitableDay[0],
          averageRevenuePerClient: averageRevenuePerClient,
          top5HighestSpendingClients: top5Clients.map(c => c.name).join(', '),
          clientRetentionRate: retentionRate,
          inactiveClients: inactiveClients.length,
          totalProductSales: totalProductSales,
          weeklyGrowth: weeklyGrowth,
          peakDayRevenue: totalRevenue,
          averageBookingValue: averageBookingValue
        },
        charts: {
          revenueByDay: revenueByDay,
          topServices: top3Services,
          clientsDistribution: clientDistribution,
          topClients: top5Clients
        },
        details: {
          totalRevenue: totalRevenue,
          totalBookings: weeklyBookings.length,
          uniqueClients: uniqueClients,
          inactiveClientsList: inactiveClients.slice(0, 10) // Top 10 inactive clients
        },
        metadata: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          period: 'weekly'
        }
      };

    } catch (error) {
      console.error('Error in getWeeklyAnalytics:', error);
      throw error;
    }
  }

  /**
   * Get monthly analytics for a specific month
   * @param {string} professionalId - Professional user ID
   * @param {string} year - Year (optional, defaults to current year)
   * @param {string} month - Month (optional, defaults to current month)
   * @returns {Object} Monthly analytics data
   */
  async getMonthlyAnalytics(professionalId, year = null, month = null) {
    try {
      const currentDate = new Date();
      const targetYear = year || currentDate.getFullYear();
      const targetMonth = month || currentDate.getMonth() + 1;
      
      const startOfMonth = new Date(targetYear, targetMonth - 1, 1);
      const endOfMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

      // Get monthly bookings
      const monthlyBookings = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(professionalId),
            slot_date: { $gte: startOfMonth, $lte: endOfMonth },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customer_user_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$service'
        },
        {
          $unwind: '$customer'
        }
      ]);

      // Highest profit service (assuming profit margin is 70% for services)
      const serviceProfit = {};
      monthlyBookings.forEach(booking => {
        const serviceName = booking.service.service_name || 'Unknown Service';
        const profit = (booking.total_amount || 0) * 0.7; // 70% profit margin
        serviceProfit[serviceName] = (serviceProfit[serviceName] || 0) + profit;
      });
      const highestProfitService = Object.entries(serviceProfit)
        .sort(([,a], [,b]) => b - a)[0] || ['No services', 0];

      // New vs returning clients
      const clientDistribution = await this.getClientDistribution(professionalId, startOfMonth, endOfMonth);

      // Underperforming time blocks
      const timeBlockPerformance = await this.analyzeTimeBlockPerformance(professionalId, startOfMonth, endOfMonth);

      // Total monthly revenue
      const totalMonthlyRevenue = monthlyBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      // Revenue by week for charts
      const revenueByWeek = this.generateWeeklyRevenueData(monthlyBookings);

      // Top services by revenue
      const serviceRevenue = {};
      monthlyBookings.forEach(booking => {
        const serviceName = booking.service.service_name || 'Unknown Service';
        serviceRevenue[serviceName] = (serviceRevenue[serviceName] || 0) + (booking.total_amount || 0);
      });
      const topServices = Object.entries(serviceRevenue)
        .map(([name, revenue]) => ({ service: name, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Top clients
      const clientSpending = {};
      monthlyBookings.forEach(booking => {
        const clientName = `${booking.customer.first_name || ''} ${booking.customer.last_name || ''}`.trim();
        if (!clientSpending[clientName]) {
          clientSpending[clientName] = { visits: 0, spend: 0 };
        }
        clientSpending[clientName].visits += 1;
        clientSpending[clientName].spend += booking.total_amount || 0;
      });
      const topClients = Object.entries(clientSpending)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.spend - a.spend)
        .slice(0, 5);

      return {
        kpis: {
          highestProfitService: `${highestProfitService[0]} ($${highestProfitService[1].toFixed(2)})`,
          newVsReturningClients: `${clientDistribution.find(c => c.name === 'New')?.value || 0} New / ${clientDistribution.find(c => c.name === 'Returning')?.value || 0} Returning`,
          underperformingTimeBlocks: timeBlockPerformance.underperforming.join(', '),
          totalMonthlyRevenue: totalMonthlyRevenue,
          mostProfitableHour: timeBlockPerformance.mostProfitable,
          bookingAvailabilityRatio: timeBlockPerformance.availabilityRatio
        },
        charts: {
          revenueByWeek: revenueByWeek,
          topServices: topServices,
          clientsDistribution: clientDistribution,
          topClients: topClients
        },
        details: {
          totalBookings: monthlyBookings.length,
          uniqueClients: new Set(monthlyBookings.map(b => b.customer_user_id.toString())).size,
          averageBookingValue: monthlyBookings.length > 0 ? totalMonthlyRevenue / monthlyBookings.length : 0,
          timeBlockAnalysis: timeBlockPerformance
        },
        metadata: {
          year: targetYear,
          month: targetMonth,
          monthName: startOfMonth.toLocaleDateString('en-US', { month: 'long' }),
          period: 'monthly'
        }
      };

    } catch (error) {
      console.error('Error in getMonthlyAnalytics:', error);
      throw error;
    }
  }

  /**
   * Get analytics overview for a specified period
   * @param {string} professionalId - Professional user ID
   * @param {string} period - Period in days (default: 30)
   * @returns {Object} Analytics overview data
   */
  async getAnalyticsOverview(professionalId, period = '30') {
    try {
      const days = parseInt(period);
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Get overview data
      const [daily, weekly, monthly] = await Promise.all([
        this.getDailyAnalytics(professionalId),
        this.getWeeklyAnalytics(professionalId, startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]),
        this.getMonthlyAnalytics(professionalId)
      ]);

      return {
        summary: {
          period: `${period} days`,
          totalRevenue: daily.kpis.totalEarningsToday + weekly.details.totalRevenue,
          totalBookings: daily.metadata.totalBookings + weekly.details.totalBookings,
          averageRevenuePerDay: (daily.kpis.totalEarningsToday + weekly.details.totalRevenue) / days
        },
        daily: daily,
        weekly: weekly,
        monthly: monthly,
        trends: await this.calculateTrends(professionalId, startDate, endDate)
      };

    } catch (error) {
      console.error('Error in getAnalyticsOverview:', error);
      throw error;
    }
  }

  /**
   * Get real-time dashboard data
   * @param {string} professionalId - Professional user ID
   * @returns {Object} Real-time dashboard data
   */
  async getDashboardData(professionalId) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      // Get today's real-time data
      const todayBookings = await BookingService.find({
        seller_user_id: professionalId,
        slot_date: { $gte: startOfDay, $lte: endOfDay }
      });

      const upcomingBookings = todayBookings.filter(booking => 
        booking.status === 'confirmed' && new Date(booking.slot_date) > new Date()
      );

      const completedBookings = todayBookings.filter(booking => 
        booking.status === 'completed'
      );

      const pendingBookings = todayBookings.filter(booking => 
        booking.status === 'pending'
      );

      return {
        realTime: {
          upcomingBookings: upcomingBookings.length,
          completedBookings: completedBookings.length,
          pendingBookings: pendingBookings.length,
          totalBookings: todayBookings.length
        },
        todayRevenue: completedBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0),
        nextBooking: upcomingBookings.length > 0 ? upcomingBookings[0] : null,
        recentActivity: await this.getRecentActivity(professionalId)
      };

    } catch (error) {
      console.error('Error in getDashboardData:', error);
      throw error;
    }
  }

  /**
   * Get custom date range analytics
   * @param {string} professionalId - Professional user ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   * @param {Array} metrics - Specific metrics to include
   * @returns {Object} Custom range analytics
   */
  async getCustomRangeAnalytics(professionalId, startDate, endDate, metrics = null) {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const bookings = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(professionalId),
            slot_date: { $gte: start, $lte: end },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'customer_user_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$service'
        },
        {
          $unwind: '$customer'
        }
      ]);

      const result = {
        period: {
          startDate: start.toISOString().split('T')[0],
          endDate: end.toISOString().split('T')[0],
          totalDays: Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        },
        summary: {
          totalRevenue: bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0),
          totalBookings: bookings.length,
          uniqueClients: new Set(bookings.map(b => b.customer_user_id.toString())).size
        }
      };

      // Add specific metrics based on request
      if (!metrics || metrics.includes('revenue')) {
        result.revenue = this.generateRevenueData(bookings);
      }
      if (!metrics || metrics.includes('services')) {
        result.services = this.generateServiceData(bookings);
      }
      if (!metrics || metrics.includes('clients')) {
        result.clients = await this.generateClientData(professionalId, start, end);
      }

      // Enrich custom analytics to mirror daily-style KPIs and charts
      const totalRevenue = result.summary.totalRevenue || 0;
      const totalBookings = result.summary.totalBookings || 0;

      // Most performed service
      const serviceCounts = {};
      bookings.forEach(booking => {
        const serviceName = booking.service?.service_name || 'Unknown Service';
        serviceCounts[serviceName] = (serviceCounts[serviceName] || 0) + 1;
      });
      const mostPerformedServiceEntry = Object.entries(serviceCounts).sort(([, a], [, b]) => b - a)[0] || ['No services', 0];

      // Peak time slot (by count)
      const timeSlotCounts = {};
      bookings.forEach(booking => {
        const time = booking.time || '12:00';
        timeSlotCounts[time] = (timeSlotCounts[time] || 0) + 1;
      });
      const peakTimeSlotEntry = Object.entries(timeSlotCounts).sort(([, a], [, b]) => b - a)[0] || ['No bookings', 0];

      // No-shows within this period (customer-cancelled)
      const noShows = await BookingService.countDocuments({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: start, $lte: end },
        status: 'cancelled',
        canceled_by: 'customer'
      });

      // Product sales (approximation based on revenue)
      const totalProductSales = await this.calculateProductSales(professionalId, start, end);

      // Conversion rate, customer satisfaction, average session time
      const conversionRate = await this.calculateConversionRate(professionalId, start, end);
      const customerSatisfaction = await this.getAverageCustomerRating(professionalId, start, end);
      const averageSessionTime = this.calculateAverageSessionTime(bookings);

      // Average revenue per hour over the period (assume 8h/day)
      const assumedHours = Math.max(1, result.period.totalDays) * 8;
      const averageRevenuePerHour = assumedHours > 0 ? totalRevenue / assumedHours : 0;

      // Charts
      const totalDays = result.period.totalDays;
      const revenueByHour = this.generateHourlyRevenueData(bookings);
      const revenueByDay = this.generateDailyRevenueData(bookings);
      const revenueByWeek = this.generateWeeklyRevenueData(bookings);

      // Top services by revenue (reuse services aggregation if present)
      const serviceRevenue = {};
      bookings.forEach(booking => {
        const serviceName = booking.service?.service_name || 'Unknown Service';
        serviceRevenue[serviceName] = (serviceRevenue[serviceName] || 0) + (booking.total_amount || 0);
      });
      const topServices = Object.entries(serviceRevenue)
        .map(([service, revenue]) => ({ service, revenue }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Client distribution (new vs returning)
      const clientDistribution = await this.getClientDistribution(professionalId, start, end);

      // Top clients (map to table-friendly fields)
      const clientData = await this.generateClientData(professionalId, start, end);
      const topClients = (clientData || [])
        .map(c => ({ name: c.name, visits: c.bookings, spend: c.totalSpent }))
        .sort((a, b) => (b.spend || 0) - (a.spend || 0))
        .slice(0, 5);

      result.kpis = {
        totalEarningsToday: totalRevenue,
        clientsServedToday: totalBookings,
        mostPerformedServiceToday: `${mostPerformedServiceEntry[0]} (${mostPerformedServiceEntry[1]})`,
        averageTipPerClient: 0,
        peakTimeSlot: `${peakTimeSlotEntry[0]} (${peakTimeSlotEntry[1]} bookings)`,
        noShowsThisWeek: noShows,
        totalProductSales: totalProductSales,
        averageRevenuePerHour: averageRevenuePerHour,
        conversionRate: conversionRate,
        customerSatisfaction: customerSatisfaction,
        averageSessionTime: averageSessionTime,
        averageBookingValue: totalBookings > 0 ? totalRevenue / totalBookings : 0
      };

      result.charts = {
        revenueByHour,
        revenueByDay,
        revenueByWeek,
        topServices,
        clientsDistribution: clientDistribution,
        topClients
      };

      return result;

    } catch (error) {
      console.error('Error in getCustomRangeAnalytics:', error);
      throw error;
    }
  }

  // Helper methods

  /**
   * Generate hourly revenue data for charts
   * @param {Array} bookings - Array of booking data
   * @returns {Array} Hourly revenue data
   */
  generateHourlyRevenueData(bookings) {
    const hourlyRevenue = {};
    
    // Initialize all hours with 0
    for (let i = 9; i <= 20; i++) {
      hourlyRevenue[i] = 0;
    }

    // Calculate revenue for each hour
    bookings.forEach(booking => {
      const hour = parseInt(booking.time?.split(':')[0]) || 12;
      hourlyRevenue[hour] = (hourlyRevenue[hour] || 0) + (booking.total_amount || 0);
    });

    return Object.entries(hourlyRevenue).map(([hour, revenue]) => ({
      label: hour.toString().padStart(2, '0'),
      revenue: revenue
    }));
  }

  /**
   * Generate daily revenue data for charts
   * @param {Array} bookings - Array of booking data
   * @returns {Array} Daily revenue data
   */
  generateDailyRevenueData(bookings) {
    const dailyRevenue = {};
    
    bookings.forEach(booking => {
      const day = new Date(booking.slot_date).toLocaleDateString('en-US', { weekday: 'short' });
      dailyRevenue[day] = (dailyRevenue[day] || 0) + (booking.total_amount || 0);
    });

    return Object.entries(dailyRevenue).map(([day, revenue]) => ({
      label: day,
      revenue: revenue
    }));
  }

  /**
   * Generate weekly revenue data for charts
   * @param {Array} bookings - Array of booking data
   * @returns {Array} Weekly revenue data
   */
  generateWeeklyRevenueData(bookings) {
    const weeklyRevenue = {};
    
    bookings.forEach(booking => {
      const week = Math.ceil(new Date(booking.slot_date).getDate() / 7);
      weeklyRevenue[`Week ${week}`] = (weeklyRevenue[`Week ${week}`] || 0) + (booking.total_amount || 0);
    });

    return Object.entries(weeklyRevenue).map(([week, revenue]) => ({
      label: week,
      revenue: revenue
    }));
  }

  /**
   * Get client distribution (new vs returning)
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Client distribution data
   */
  async getClientDistribution(professionalId, startDate, endDate) {
    try {
      // Get all bookings for the period
      const periodBookings = await BookingService.find({
        seller_user_id: professionalId,
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      // Get all historical bookings to determine new vs returning
      const allHistoricalBookings = await BookingService.find({
        seller_user_id: professionalId,
        status: { $in: ['completed', 'confirmed'] }
      });

      const clientFirstVisit = {};
      const periodClients = new Set();

      // Find first visit for each client
      allHistoricalBookings.forEach(booking => {
        const clientId = booking.customer_user_id.toString();
        if (!clientFirstVisit[clientId] || booking.slot_date < clientFirstVisit[clientId]) {
          clientFirstVisit[clientId] = booking.slot_date;
        }
      });

      // Categorize clients in the period
      periodBookings.forEach(booking => {
        const clientId = booking.customer_user_id.toString();
        periodClients.add(clientId);
      });

      let newClients = 0;
      let returningClients = 0;

      periodClients.forEach(clientId => {
        if (clientFirstVisit[clientId] >= startDate) {
          newClients++;
        } else {
          returningClients++;
        }
      });

      return [
        { name: 'New', value: newClients },
        { name: 'Returning', value: returningClients }
      ];

    } catch (error) {
      console.error('Error in getClientDistribution:', error);
      return [{ name: 'New', value: 0 }, { name: 'Returning', value: 0 }];
    }
  }

  /**
   * Calculate client retention rate
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Retention rate percentage
   */
  async calculateClientRetentionRate(professionalId, startDate, endDate) {
    try {
      // This is a simplified calculation
      // In a real implementation, you'd track client visits over time
      const periodBookings = await BookingService.find({
        seller_user_id: professionalId,
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      const uniqueClients = new Set(periodBookings.map(b => b.customer_user_id.toString())).size;
      const totalBookings = periodBookings.length;

      // Simplified retention rate calculation
      return uniqueClients > 0 ? Math.min(100, Math.round((totalBookings / uniqueClients) * 20)) : 0;

    } catch (error) {
      console.error('Error in calculateClientRetentionRate:', error);
      return 0;
    }
  }

  /**
   * Get inactive clients
   * @param {string} professionalId - Professional user ID
   * @param {number} days - Number of days to consider inactive
   * @returns {Array} List of inactive clients
   */
  async getInactiveClients(professionalId, days = 60) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const inactiveClients = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(professionalId),
            slot_date: { $lt: cutoffDate },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $group: {
            _id: '$customer_user_id',
            lastVisit: { $max: '$slot_date' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$customer'
        },
        {
          $project: {
            name: { $concat: ['$customer.first_name', ' ', '$customer.last_name'] },
            lastVisit: 1,
            daysInactive: {
              $floor: {
                $divide: [
                  { $subtract: [new Date(), '$lastVisit'] },
                  1000 * 60 * 60 * 24
                ]
              }
            }
          }
        },
        {
          $sort: { lastVisit: -1 }
        },
        {
          $limit: 10
        }
      ]);

      return inactiveClients;

    } catch (error) {
      console.error('Error in getInactiveClients:', error);
      return [];
    }
  }

  /**
   * Analyze time block performance
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Time block analysis
   */
  async analyzeTimeBlockPerformance(professionalId, startDate, endDate) {
    try {
      const bookings = await BookingService.find({
        seller_user_id: professionalId,
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      const timeBlockRevenue = {};
      const timeBlockBookings = {};

      bookings.forEach(booking => {
        const time = booking.time || '12:00';
        const hour = parseInt(time.split(':')[0]);
        const timeBlock = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
        
        timeBlockRevenue[timeBlock] = (timeBlockRevenue[timeBlock] || 0) + (booking.total_amount || 0);
        timeBlockBookings[timeBlock] = (timeBlockBookings[timeBlock] || 0) + 1;
      });

      const averageRevenue = Object.values(timeBlockRevenue).reduce((sum, rev) => sum + rev, 0) / Object.keys(timeBlockRevenue).length || 0;
      
      const underperforming = Object.entries(timeBlockRevenue)
        .filter(([, revenue]) => revenue < averageRevenue * 0.5)
        .map(([timeBlock]) => timeBlock);

      const mostProfitable = Object.entries(timeBlockRevenue)
        .sort(([,a], [,b]) => b - a)[0] || ['No data', 0];

      // Calculate availability ratio (simplified)
      const totalPossibleSlots = Object.keys(timeBlockBookings).length * 30; // Assuming 30 days
      const totalBookedSlots = Object.values(timeBlockBookings).reduce((sum, count) => sum + count, 0);
      const availabilityRatio = totalPossibleSlots > 0 ? Math.round((totalBookedSlots / totalPossibleSlots) * 100) : 0;

      return {
        underperforming: underperforming,
        mostProfitable: mostProfitable[0],
        availabilityRatio: `${availabilityRatio}%`,
        timeBlockRevenue: timeBlockRevenue
      };

    } catch (error) {
      console.error('Error in analyzeTimeBlockPerformance:', error);
      return {
        underperforming: [],
        mostProfitable: 'No data',
        availabilityRatio: '0%',
        timeBlockRevenue: {}
      };
    }
  }

  /**
   * Calculate trends
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Trend data
   */
  async calculateTrends(professionalId, startDate, endDate) {
    try {
      // This is a simplified trend calculation
      // In a real implementation, you'd compare with previous periods
      const currentPeriodBookings = await BookingService.find({
        seller_user_id: professionalId,
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      const currentRevenue = currentPeriodBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const currentBookings = currentPeriodBookings.length;

      // Simplified trend calculation (assuming 10% growth)
      return {
        revenueGrowth: 10.5,
        bookingGrowth: 8.2,
        clientGrowth: 12.1
      };

    } catch (error) {
      console.error('Error in calculateTrends:', error);
      return {
        revenueGrowth: 0,
        bookingGrowth: 0,
        clientGrowth: 0
      };
    }
  }

  /**
   * Get recent activity
   * @param {string} professionalId - Professional user ID
   * @returns {Array} Recent activity data
   */
  async getRecentActivity(professionalId) {
    try {
      const recentBookings = await BookingService.find({
        seller_user_id: professionalId
      })
      .sort({ created: -1 })
      .limit(5)
      .populate('customer_user_id', 'first_name last_name')
      .populate('service_id', 'service_name');

      return recentBookings.map(booking => ({
        id: booking._id,
        type: 'booking',
        status: booking.status,
        customer: booking.customer_user_id ? 
          `${booking.customer_user_id.first_name} ${booking.customer_user_id.last_name}` : 
          'Unknown Customer',
        service: booking.service_id ? booking.service_id.service_name : 'Unknown Service',
        amount: booking.total_amount,
        date: booking.slot_date
      }));

    } catch (error) {
      console.error('Error in getRecentActivity:', error);
      return [];
    }
  }

  /**
   * Generate revenue data for custom range
   * @param {Array} bookings - Array of booking data
   * @returns {Object} Revenue data
   */
  generateRevenueData(bookings) {
    const dailyRevenue = {};
    
    bookings.forEach(booking => {
      const date = booking.slot_date.toISOString().split('T')[0];
      dailyRevenue[date] = (dailyRevenue[date] || 0) + (booking.total_amount || 0);
    });

    return {
      total: bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0),
      daily: Object.entries(dailyRevenue).map(([date, revenue]) => ({ date, revenue }))
    };
  }

  /**
   * Generate service data for custom range
   * @param {Array} bookings - Array of booking data
   * @returns {Object} Service data
   */
  generateServiceData(bookings) {
    const serviceStats = {};
    
    bookings.forEach(booking => {
      const serviceName = booking.service?.service_name || 'Unknown Service';
      if (!serviceStats[serviceName]) {
        serviceStats[serviceName] = { bookings: 0, revenue: 0 };
      }
      serviceStats[serviceName].bookings += 1;
      serviceStats[serviceName].revenue += booking.total_amount || 0;
    });

    return Object.entries(serviceStats).map(([name, stats]) => ({
      service: name,
      bookings: stats.bookings,
      revenue: stats.revenue
    }));
  }

  /**
   * Generate client data for custom range
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Object} Client data
   */
  async generateClientData(professionalId, startDate, endDate) {
    try {
      const clientStats = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(professionalId),
            slot_date: { $gte: startDate, $lte: endDate },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $group: {
            _id: '$customer_user_id',
            bookings: { $sum: 1 },
            totalSpent: { $sum: '$total_amount' }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'customer'
          }
        },
        {
          $unwind: '$customer'
        },
        {
          $project: {
            name: { $concat: ['$customer.first_name', ' ', '$customer.last_name'] },
            bookings: 1,
            totalSpent: 1
          }
        },
        {
          $sort: { totalSpent: -1 }
        }
      ]);

      return clientStats;

    } catch (error) {
      console.error('Error in generateClientData:', error);
      return [];
    }
  }

  /**
   * Calculate average revenue per hour
   * @param {Array} bookings - Array of booking data
   * @returns {number} Average revenue per hour
   */
  calculateAverageRevenuePerHour(bookings) {
    try {
      if (!bookings || bookings.length === 0) return 0;

      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const totalHours = 8; // Assuming 8-hour workday
      
      return totalRevenue / totalHours;
    } catch (error) {
      console.error('Error in calculateAverageRevenuePerHour:', error);
      return 0;
    }
  }

  /**
   * Calculate product sales for a date range
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Total product sales
   */
  async calculateProductSales(professionalId, startDate, endDate) {
    try {
      // This would need to be implemented based on your product sales model
      // For now, returning a mock value based on total revenue
      const bookings = await BookingService.find({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      // Assuming 15% of revenue comes from product sales
      return totalRevenue * 0.15;
    } catch (error) {
      console.error('Error in calculateProductSales:', error);
      return 0;
    }
  }

  /**
   * Calculate conversion rate (bookings vs inquiries)
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Conversion rate percentage
   */
  async calculateConversionRate(professionalId, startDate, endDate) {
    try {
      const completedBookings = await BookingService.countDocuments({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      const totalBookings = await BookingService.countDocuments({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: startDate, $lte: endDate }
      });

      return totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
    } catch (error) {
      console.error('Error in calculateConversionRate:', error);
      return 0;
    }
  }

  /**
   * Get average customer rating
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Average rating
   */
  async getAverageCustomerRating(professionalId, startDate, endDate) {
    try {
      // This would need to be implemented based on your rating model
      // For now, returning a mock value
      return 4.8;
    } catch (error) {
      console.error('Error in getAverageCustomerRating:', error);
      return 0;
    }
  }

  /**
   * Calculate average session time
   * @param {Array} bookings - Array of booking data
   * @returns {number} Average session time in minutes
   */
  calculateAverageSessionTime(bookings) {
    try {
      if (!bookings || bookings.length === 0) return 0;

      // This would need to be calculated based on actual service duration
      // For now, returning a mock value
      return 45;
    } catch (error) {
      console.error('Error in calculateAverageSessionTime:', error);
      return 0;
    }
  }

  /**
   * Calculate growth rate between two periods
   * @param {number} currentValue - Current period value
   * @param {number} previousValue - Previous period value
   * @returns {number} Growth rate percentage
   */
  calculateGrowthRate(currentValue, previousValue) {
    try {
      if (previousValue === 0) return currentValue > 0 ? 100 : 0;
      return ((currentValue - previousValue) / previousValue) * 100;
    } catch (error) {
      console.error('Error in calculateGrowthRate:', error);
      return 0;
    }
  }

  /**
   * Calculate weekly growth rate
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {number} Weekly growth rate percentage
   */
  async calculateWeeklyGrowth(professionalId, startDate, endDate) {
    try {
      // Get current week revenue
      const currentWeekBookings = await BookingService.find({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });
      const currentWeekRevenue = currentWeekBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      // Get previous week revenue
      const previousWeekStart = new Date(startDate);
      previousWeekStart.setDate(previousWeekStart.getDate() - 7);
      const previousWeekEnd = new Date(endDate);
      previousWeekEnd.setDate(previousWeekEnd.getDate() - 7);

      const previousWeekBookings = await BookingService.find({
        seller_user_id: new mongoose.Types.ObjectId(professionalId),
        slot_date: { $gte: previousWeekStart, $lte: previousWeekEnd },
        status: { $in: ['completed', 'confirmed'] }
      });
      const previousWeekRevenue = previousWeekBookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);

      return this.calculateGrowthRate(currentWeekRevenue, previousWeekRevenue);
    } catch (error) {
      console.error('Error in calculateWeeklyGrowth:', error);
      return 0;
    }
  }

  /**
   * Get team performance analytics
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} Team performance data
   */
  async getTeamPerformance(professionalId, startDate, endDate) {
    try {
      // This would need to be implemented based on your team structure
      // For now, returning mock data
      return [
        {
          name: 'Sarah Johnson',
          role: 'Senior Stylist',
          revenue: 12400,
          bookings: 48,
          rebookingRate: 92,
          avgRating: 4.9,
          productSales: 1800
        },
        {
          name: 'Mike Chen',
          role: 'Barber',
          revenue: 9800,
          bookings: 42,
          rebookingRate: 88,
          avgRating: 4.7,
          productSales: 1200
        },
        {
          name: 'Elena Rodriguez',
          role: 'Color Specialist',
          revenue: 15600,
          bookings: 32,
          rebookingRate: 95,
          avgRating: 4.8,
          productSales: 3200
        }
      ];
    } catch (error) {
      console.error('Error in getTeamPerformance:', error);
      return [];
    }
  }

  /**
   * Generate AI insights
   * @param {string} professionalId - Professional user ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {Array} AI insights
   */
  async generateAIInsights(professionalId, startDate, endDate) {
    try {
      // This would need to be implemented with actual AI/ML logic
      // For now, returning mock insights
      return [
        {
          title: "Revenue Projection",
          description: "Based on current trends, you're projected to earn $32,400 next month (+18.7% growth)",
          type: "success",
          action: "View detailed forecast"
        },
        {
          title: "Client Retention Alert",
          description: "3 VIP clients haven't booked in 45 days. Consider reaching out with special offers.",
          type: "warning",
          action: "Send personalized offers"
        },
        {
          title: "Peak Hour Optimization",
          description: "Extending hours by 1 hour could increase daily revenue by $280",
          type: "info",
          action: "Adjust schedule"
        }
      ];
    } catch (error) {
      console.error('Error in generateAIInsights:', error);
      return [];
    }
  }

  /**
   * ADMIN ANALYTICS SERVICE METHODS
   * These methods provide comprehensive analytics for admin users across all shops and teams
   */

  /**
   * Get comprehensive team and shop analytics overview for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @returns {Object} Team and shop overview data
   */
  async getAdminTeamShopOverview(startDate, endDate, shopId = null) {
    try {
      // Build match conditions
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      // Add shop filter if specified
      if (shopId && shopId !== 'all') {
        // This would need to be adjusted based on your actual shop structure
        // For now, we'll filter by professional users who have the shop name
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      // Get total revenue and bookings
      const revenueData = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total_amount' },
            totalBookings: { $sum: 1 }
          }
        }
      ]);

      // Get team member count
      const teamCount = await Member.countDocuments();

      // Get rebooking rate data
      const rebookingData = await this.calculateAdminRebookingRate(startDate, endDate, shopId);

      // Get top performing member
      const topPerformer = await this.getTopPerformingMember(startDate, endDate, shopId);

      // Get product sales
      const productSales = await this.calculateAdminProductSales(startDate, endDate, shopId);

      // Calculate growth rates
      const growthRates = await this.calculateAdminGrowthRates(startDate, endDate, shopId);

      // Get average rating
      const averageRating = await this.getAdminAverageRating(startDate, endDate, shopId);

      const overview = {
        totalRevenue: revenueData[0]?.totalRevenue || 0,
        totalBookings: revenueData[0]?.totalBookings || 0,
        averageRebookingRate: rebookingData.overallRate || 0,
        totalTeamMembers: teamCount,
        topPerformingShop: shopId || 'All Shops',
        topPerformingMember: topPerformer?.name || 'N/A',
        revenueGrowth: growthRates.revenueGrowth || 0,
        bookingGrowth: growthRates.bookingGrowth || 0,
        averageRating: averageRating || 0,
        totalProductsSold: productSales.totalUnits || 0
      };

      return overview;
    } catch (error) {
      console.error('Error in getAdminTeamShopOverview:', error);
      return {
        totalRevenue: 0,
        totalBookings: 0,
        averageRebookingRate: 0,
        totalTeamMembers: 0,
        topPerformingShop: 'N/A',
        topPerformingMember: 'N/A',
        revenueGrowth: 0,
        bookingGrowth: 0,
        averageRating: 0,
        totalProductsSold: 0
      };
    }
  }

  /**
   * Get detailed team performance analytics for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @param {string} memberId - Specific team member ID (optional)
   * @returns {Array} Team performance data
   */
  async getAdminTeamPerformance(startDate, endDate, shopId = null, memberId = null) {
    try {
      // Build match conditions
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      // Add shop filter if specified
      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      // Add member filter if specified
      if (memberId) {
        matchConditions.seller_user_id = new mongoose.Types.ObjectId(memberId);
      }

      // Get team performance data
      const teamData = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'seller_user_id',
            foreignField: '_id',
            as: 'professional'
          }
        },
        {
          $lookup: {
            from: 'members',
            localField: 'seller_user_id',
            foreignField: '_id',
            as: 'member'
          }
        },
        {
          $unwind: '$professional'
        },
        {
          $group: {
            _id: '$seller_user_id',
            name: { $first: { $concat: ['$professional.first_name', ' ', '$professional.last_name'] } },
            role: { $first: '$member.job_title' },
            shop: { $first: '$professional.salon_name' },
            revenue: { $sum: '$total_amount' },
            bookings: { $sum: 1 },
            hoursWorked: { $sum: 1 }, // Assuming 1 hour per booking
            servicesPerformed: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails'
          }
        },
        {
          $unwind: '$userDetails'
        },
        {
          $addFields: {
            role: { $ifNull: ['$role', 'Professional'] },
            shop: { $ifNull: ['$shop', 'Unknown'] }
          }
        },
        {
          $sort: { revenue: -1 }
        }
      ]);

      // Calculate additional metrics for each team member
      const enhancedTeamData = await Promise.all(teamData.map(async (member) => {
        // Calculate rebooking rate
        const rebookingRate = await this.calculateMemberRebookingRate(member._id, startDate, endDate);
        
        // Calculate revenue per hour
        const revenuePerHour = member.hoursWorked > 0 ? member.revenue / member.hoursWorked : 0;
        
        // Calculate products sold
        const productsSold = await this.calculateMemberProductSales(member._id, startDate, endDate);
        
        // Get average rating
        const rating = member.userDetails.rating || 0;
        
        // Determine status based on performance
        const status = this.determineMemberStatus(revenuePerHour, rebookingRate, rating);

        return {
          id: member._id.toString(),
          name: member.name,
          role: member.role,
          shop: member.shop,
          revenue: member.revenue,
          bookings: member.bookings,
          rebookingRate: rebookingRate,
          revenuePerHour: Math.round(revenuePerHour * 100) / 100,
          productsSold: productsSold,
          rating: rating,
          status: status,
          hoursWorked: member.hoursWorked,
          servicesPerformed: member.servicesPerformed
        };
      }));

      return enhancedTeamData;
    } catch (error) {
      console.error('Error in getAdminTeamPerformance:', error);
      return [];
    }
  }

  /**
   * Get revenue analysis by team member and service for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @param {string} serviceType - Specific service type (optional)
   * @returns {Object} Revenue analysis data
   */
  async getAdminRevenueAnalysis(startDate, endDate, shopId = null, serviceType = null) {
    try {
      // Build match conditions
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      // Add shop filter if specified
      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      // Add service filter if specified
      if (serviceType) {
        matchConditions['service.service_name'] = serviceType;
      }

      // Get revenue by member
      const revenueByMember = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'seller_user_id',
            foreignField: '_id',
            as: 'professional'
          }
        },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $unwind: '$professional'
        },
        {
          $unwind: '$service'
        },
        {
          $group: {
            _id: '$seller_user_id',
            member: { $first: { $concat: ['$professional.first_name', ' ', '$professional.last_name'] } },
            revenue: { $sum: '$total_amount' }
          }
        },
        {
          $sort: { revenue: -1 }
        }
      ]);

      // Get revenue by service
      const revenueByService = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $unwind: '$service'
        },
        {
          $group: {
            _id: '$service.service_name',
            service: { $first: '$service.service_name' },
            revenue: { $sum: '$total_amount' }
          }
        },
        {
          $sort: { revenue: -1 }
        }
      ]);

      // Get revenue by hour
      const revenueByHour = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: '$time',
            hour: { $first: '$time' },
            revenue: { $sum: '$total_amount' }
          }
        },
        {
          $sort: { hour: 1 }
        }
      ]);

      // Calculate total revenue
      const totalRevenue = revenueByMember.reduce((sum, member) => sum + member.revenue, 0);

      // Calculate percentages
      const revenueByMemberWithPercentage = revenueByMember.map(member => ({
        ...member,
        percentage: totalRevenue > 0 ? Math.round((member.revenue / totalRevenue) * 1000) / 10 : 0
      }));

      const revenueByServiceWithPercentage = revenueByService.map(service => ({
        ...service,
        percentage: totalRevenue > 0 ? Math.round((service.revenue / totalRevenue) * 1000) / 10 : 0
      }));

      // Calculate average revenue per hour
      const averageRevenuePerHour = totalRevenue / 8; // Assuming 8-hour workday

      return {
        totalRevenue: totalRevenue,
        revenueByMember: revenueByMemberWithPercentage,
        revenueByService: revenueByServiceWithPercentage,
        revenueByHour: revenueByHour,
        averageRevenuePerHour: Math.round(averageRevenuePerHour * 100) / 100
      };
    } catch (error) {
      console.error('Error in getAdminRevenueAnalysis:', error);
      return {
        totalRevenue: 0,
        revenueByMember: [],
        revenueByService: [],
        revenueByHour: [],
        averageRevenuePerHour: 0
      };
    }
  }

  /**
   * Get rebooking rate analysis for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @returns {Object} Rebooking analysis data
   */
  async getAdminRebookingAnalysis(startDate, endDate, shopId = null) {
    try {
      const rebookingData = await this.calculateAdminRebookingRate(startDate, endDate, shopId);
      
      // Get rebooking by member
      const rebookingByMember = await this.getRebookingByMember(startDate, endDate, shopId);
      
      // Get rebooking by service
      const rebookingByService = await this.getRebookingByService(startDate, endDate, shopId);
      
      // Get rebooking trends (monthly)
      const rebookingTrends = await this.getRebookingTrends(startDate, endDate, shopId);

      return {
        overallRebookingRate: rebookingData.overallRate,
        rebookingByMember: rebookingByMember,
        rebookingByService: rebookingByService,
        rebookingTrends: rebookingTrends
      };
    } catch (error) {
      console.error('Error in getAdminRebookingAnalysis:', error);
      return {
        overallRebookingRate: 0,
        rebookingByMember: [],
        rebookingByService: [],
        rebookingTrends: []
      };
    }
  }

  /**
   * Get service performance analysis by team member for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @returns {Array} Service performance data
   */
  async getAdminServicePerformance(startDate, endDate, shopId = null) {
    try {
      // Build match conditions
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      // Add shop filter if specified
      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      // Get service performance data
      const servicePerformance = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'seller_user_id',
            foreignField: '_id',
            as: 'professional'
          }
        },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $unwind: '$professional'
        },
        {
          $unwind: '$service'
        },
        {
          $group: {
            _id: {
              memberId: '$seller_user_id',
              memberName: { $concat: ['$professional.first_name', ' ', '$professional.last_name'] },
              serviceName: '$service.service_name'
            },
            count: { $sum: 1 },
            totalRevenue: { $sum: '$total_amount' }
          }
        },
        {
          $group: {
            _id: '$_id.memberId',
            member: { $first: '$_id.memberName' },
            services: {
              $push: {
                service: '$_id.serviceName',
                count: '$count',
                revenue: '$totalRevenue'
              }
            },
            totalServices: { $sum: '$count' }
          }
        }
      ]);

      // Transform data to match expected format
      const transformedData = servicePerformance.map(member => {
        const serviceData = {};
        let totalRating = 0;
        let ratingCount = 0;

        member.services.forEach(service => {
          serviceData[service.service] = service.count;
        });

        // Get member rating
        const memberUser = User.findById(member._id);
        if (memberUser && memberUser.rating) {
          totalRating = memberUser.rating;
          ratingCount = 1;
        }

        return {
          member: member.member,
          ...serviceData,
          averageRating: ratingCount > 0 ? totalRating / ratingCount : 0,
          totalServices: member.totalServices
        };
      });

      return transformedData;
    } catch (error) {
      console.error('Error in getAdminServicePerformance:', error);
      return [];
    }
  }

  /**
   * Get product sales analysis by team member for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @returns {Object} Product sales analysis data
   */
  async getAdminProductSalesAnalysis(startDate, endDate, shopId = null) {
    try {
      const productSales = await this.calculateAdminProductSales(startDate, endDate, shopId);
      
      // Get sales by member
      const salesByMember = await this.getProductSalesByMember(startDate, endDate, shopId);
      
      // Get sales by category
      const salesByCategory = await this.getProductSalesByCategory(startDate, endDate, shopId);
      
      // Get top selling products
      const topSellingProducts = await this.getTopSellingProducts(startDate, endDate, shopId);

      return {
        totalProductsSold: productSales.totalUnits,
        totalProductRevenue: productSales.totalRevenue,
        salesByMember: salesByMember,
        salesByCategory: salesByCategory,
        topSellingProducts: topSellingProducts
      };
    } catch (error) {
      console.error('Error in getAdminProductSalesAnalysis:', error);
      return {
        totalProductsSold: 0,
        totalProductRevenue: 0,
        salesByMember: [],
        salesByCategory: [],
        topSellingProducts: []
      };
    }
  }

  /**
   * Get analysis of underperforming team members for admin
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {string} shopId - Specific shop ID (optional)
   * @param {number} threshold - Performance threshold percentage (default: 20)
   * @returns {Array} Underperforming members data
   */
  async getAdminUnderperformingMembers(startDate, endDate, shopId = null, threshold = 20) {
    try {
      // Get all team performance data
      const allTeamData = await this.getAdminTeamPerformance(startDate, endDate, shopId);
      
      if (allTeamData.length === 0) return [];

      // Calculate averages
      const totalRevenue = allTeamData.reduce((sum, member) => sum + member.revenue, 0);
      const totalRebookingRate = allTeamData.reduce((sum, member) => sum + member.rebookingRate, 0);
      const averageRevenue = totalRevenue / allTeamData.length;
      const averageRebookingRate = totalRebookingRate / allTeamData.length;

      // Identify underperforming members
      const underperformingMembers = allTeamData.filter(member => {
        const revenueBelowAverage = member.revenue < (averageRevenue * (1 - threshold / 100));
        const rebookingBelowAverage = member.rebookingRate < (averageRebookingRate * (1 - threshold / 100));
        
        return revenueBelowAverage || rebookingBelowAverage;
      }).map(member => {
        let issue = '';
        let percentageBelow = 0;
        
        if (member.revenue < averageRevenue) {
          percentageBelow = Math.round(((averageRevenue - member.revenue) / averageRevenue) * 100);
          issue = `Revenue ${percentageBelow}% below average`;
        } else if (member.rebookingRate < averageRebookingRate) {
          percentageBelow = Math.round(((averageRebookingRate - member.rebookingRate) / averageRebookingRate) * 100);
          issue = `Rebooking rate ${percentageBelow}% below average`;
        }

        return {
          name: member.name,
          shop: member.shop,
          issue: issue,
          revenue: member.revenue,
          average: Math.round(averageRevenue),
          percentageBelow: percentageBelow,
          recommendations: this.generateRecommendations(member, averageRevenue, averageRebookingRate)
        };
      });

      return underperformingMembers;
    } catch (error) {
      console.error('Error in getAdminUnderperformingMembers:', error);
      return [];
    }
  }

  // Helper methods for admin analytics

  /**
   * Calculate overall rebooking rate for admin
   */
  async calculateAdminRebookingRate(startDate, endDate, shopId = null) {
    try {
      // This is a simplified calculation - in a real implementation,
      // you'd need to track which clients are returning vs new
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      const totalBookings = await BookingService.countDocuments(matchConditions);
      
      // Simplified rebooking rate calculation
      // In a real implementation, you'd compare with historical data
      const rebookingRate = totalBookings > 0 ? Math.min(100, Math.round((totalBookings * 0.8))) : 0;

      return { overallRate: rebookingRate };
    } catch (error) {
      console.error('Error in calculateAdminRebookingRate:', error);
      return { overallRate: 0 };
    }
  }

  /**
   * Get top performing member
   */
  async getTopPerformingMember(startDate, endDate, shopId = null) {
    try {
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      const topMember = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'users',
            localField: 'seller_user_id',
            foreignField: '_id',
            as: 'professional'
          }
        },
        {
          $unwind: '$professional'
        },
        {
          $group: {
            _id: '$seller_user_id',
            name: { $first: { $concat: ['$professional.first_name', ' ', '$professional.last_name'] } },
            revenue: { $sum: '$total_amount' }
          }
        },
        {
          $sort: { revenue: -1 }
        },
        {
          $limit: 1
        }
      ]);

      return topMember[0] || null;
    } catch (error) {
      console.error('Error in getTopPerformingMember:', error);
      return null;
    }
  }

  /**
   * Calculate admin product sales
   */
  async calculateAdminProductSales(startDate, endDate, shopId = null) {
    try {
      // This would need to be implemented based on your product sales model
      // For now, returning a calculation based on total revenue
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      const totalRevenue = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            total: { $sum: '$total_amount' }
          }
        }
      ]);

      const revenue = totalRevenue[0]?.total || 0;
      // Assuming 15% of revenue comes from product sales
      const productRevenue = revenue * 0.15;
      const productUnits = Math.round(productRevenue / 40); // Assuming average product price of $40

      return {
        totalRevenue: productRevenue,
        totalUnits: productUnits
      };
    } catch (error) {
      console.error('Error in calculateAdminProductSales:', error);
      return { totalRevenue: 0, totalUnits: 0 };
    }
  }

  /**
   * Calculate admin growth rates
   */
  async calculateAdminGrowthRates(startDate, endDate, shopId = null) {
    try {
      // Calculate current period metrics
      const currentMetrics = await this.getPeriodMetrics(startDate, endDate, shopId);
      
      // Calculate previous period metrics
      const periodLength = endDate - startDate;
      const previousStartDate = new Date(startDate.getTime() - periodLength);
      const previousEndDate = new Date(startDate.getTime());
      const previousMetrics = await this.getPeriodMetrics(previousStartDate, previousEndDate, shopId);

      // Calculate growth rates
      const revenueGrowth = this.calculateGrowthRate(currentMetrics.revenue, previousMetrics.revenue);
      const bookingGrowth = this.calculateGrowthRate(currentMetrics.bookings, previousMetrics.bookings);

      return {
        revenueGrowth: revenueGrowth,
        bookingGrowth: bookingGrowth
      };
    } catch (error) {
      console.error('Error in calculateAdminGrowthRates:', error);
      return { revenueGrowth: 0, bookingGrowth: 0 };
    }
  }

  /**
   * Get period metrics for growth calculation
   */
  async getPeriodMetrics(startDate, endDate, shopId = null) {
    try {
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      const metrics = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$total_amount' },
            bookings: { $sum: 1 }
          }
        }
      ]);

      return {
        revenue: metrics[0]?.revenue || 0,
        bookings: metrics[0]?.bookings || 0
      };
    } catch (error) {
      console.error('Error in getPeriodMetrics:', error);
      return { revenue: 0, bookings: 0 };
    }
  }

  /**
   * Get admin average rating
   */
  async getAdminAverageRating(startDate, endDate, shopId = null) {
    try {
      // This would need to be implemented based on your rating model
      // For now, returning a calculation based on user ratings
      let query = { user_type: 'professional' };
      
      if (shopId && shopId !== 'all') {
        query.salon_name = shopId;
      }

      const professionals = await User.find(query).select('rating');
      const validRatings = professionals.filter(p => p.rating && p.rating > 0);
      
      if (validRatings.length === 0) return 0;
      
      const totalRating = validRatings.reduce((sum, p) => sum + p.rating, 0);
      return Math.round((totalRating / validRatings.length) * 10) / 10;
    } catch (error) {
      console.error('Error in getAdminAverageRating:', error);
      return 0;
    }
  }

  /**
   * Calculate member rebooking rate
   */
  async calculateMemberRebookingRate(memberId, startDate, endDate) {
    try {
      // Simplified rebooking rate calculation
      // In a real implementation, you'd track returning clients
      const totalBookings = await BookingService.countDocuments({
        seller_user_id: memberId,
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      });

      // Mock rebooking rate based on total bookings
      return totalBookings > 0 ? Math.min(100, Math.round(70 + (totalBookings * 0.5))) : 0;
    } catch (error) {
      console.error('Error in calculateMemberRebookingRate:', error);
      return 0;
    }
  }

  /**
   * Calculate member product sales
   */
  async calculateMemberProductSales(memberId, startDate, endDate) {
    try {
      // Simplified product sales calculation
      const totalRevenue = await BookingService.aggregate([
        {
          $match: {
            seller_user_id: new mongoose.Types.ObjectId(memberId),
            slot_date: { $gte: startDate, $lte: endDate },
            status: { $in: ['completed', 'confirmed'] }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$total_amount' }
          }
        }
      ]);

      const revenue = totalRevenue[0]?.total || 0;
      // Assuming 15% of revenue comes from product sales
      return Math.round((revenue * 0.15) / 40); // Assuming average product price of $40
    } catch (error) {
      console.error('Error in calculateMemberProductSales:', error);
      return 0;
    }
  }

  /**
   * Determine member status based on performance
   */
  determineMemberStatus(revenuePerHour, rebookingRate, rating) {
    if (revenuePerHour >= 40 && rebookingRate >= 80 && rating >= 4.5) {
      return 'excellent';
    } else if (revenuePerHour >= 30 && rebookingRate >= 70 && rating >= 4.0) {
      return 'good';
    } else if (revenuePerHour >= 20 && rebookingRate >= 60 && rating >= 3.5) {
      return 'average';
    } else {
      return 'needs_improvement';
    }
  }

  /**
   * Get rebooking by member
   */
  async getRebookingByMember(startDate, endDate, shopId = null) {
    try {
      // Simplified implementation
      const teamData = await this.getAdminTeamPerformance(startDate, endDate, shopId);
      
      return teamData.map(member => ({
        member: member.name,
        rate: member.rebookingRate,
        totalBookings: member.bookings,
        rebookings: Math.round((member.rebookingRate / 100) * member.bookings)
      }));
    } catch (error) {
      console.error('Error in getRebookingByMember:', error);
      return [];
    }
  }

  /**
   * Get rebooking by service
   */
  async getRebookingByService(startDate, endDate, shopId = null) {
    try {
      // Simplified implementation
      const matchConditions = {
        slot_date: { $gte: startDate, $lte: endDate },
        status: { $in: ['completed', 'confirmed'] }
      };

      if (shopId && shopId !== 'all') {
        const shopProfessionals = await User.find({ 
          salon_name: shopId, 
          user_type: 'professional' 
        }).select('_id');
        const professionalIds = shopProfessionals.map(p => p._id);
        matchConditions.seller_user_id = { $in: professionalIds };
      }

      const serviceData = await BookingService.aggregate([
        { $match: matchConditions },
        {
          $lookup: {
            from: 'professional_services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $unwind: '$service'
        },
        {
          $group: {
            _id: '$service.service_name',
            service: { $first: '$service.service_name' },
            totalBookings: { $sum: 1 }
          }
        }
      ]);

      return serviceData.map(service => ({
        service: service.service,
        rate: Math.round(70 + Math.random() * 20), // Mock rate
        totalBookings: service.totalBookings,
        rebookings: Math.round((70 + Math.random() * 20) / 100 * service.totalBookings)
      }));
    } catch (error) {
      console.error('Error in getRebookingByService:', error);
      return [];
    }
  }

  /**
   * Get rebooking trends
   */
  async getRebookingTrends(startDate, endDate, shopId = null) {
    try {
      // Simplified monthly trends
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      return months.map(month => ({
        month: month,
        rate: Math.round(70 + Math.random() * 15)
      }));
    } catch (error) {
      console.error('Error in getRebookingTrends:', error);
      return [];
    }
  }

  /**
   * Get product sales by member
   */
  async getProductSalesByMember(startDate, endDate, shopId = null) {
    try {
      const teamData = await this.getAdminTeamPerformance(startDate, endDate, shopId);
      
      return teamData.map(member => ({
        member: member.name,
        units: member.productsSold,
        revenue: member.productsSold * 40, // Assuming $40 per product
        percentage: 0 // Would need to calculate based on total sales
      }));
    } catch (error) {
      console.error('Error in getProductSalesByMember:', error);
      return [];
    }
  }

  /**
   * Get product sales by category
   */
  async getProductSalesByCategory(startDate, endDate, shopId = null) {
    try {
      // Simplified categories
      const categories = [
        { name: 'Hair Products', units: 180, revenue: 7200 },
        { name: 'Styling Tools', units: 120, revenue: 4800 },
        { name: 'Accessories', units: 90, revenue: 3600 },
        { name: 'Grooming Kits', units: 66, revenue: 2640 }
      ];

      const totalRevenue = categories.reduce((sum, cat) => sum + cat.revenue, 0);

      return categories.map(category => ({
        category: category.name,
        units: category.units,
        revenue: category.revenue,
        percentage: Math.round((category.revenue / totalRevenue) * 1000) / 10
      }));
    } catch (error) {
      console.error('Error in getProductSalesByCategory:', error);
      return [];
    }
  }

  /**
   * Get top selling products
   */
  async getTopSellingProducts(startDate, endDate, shopId = null) {
    try {
      // Simplified top products
      return [
        { name: 'Premium Hair Gel', units: 45, revenue: 1800 },
        { name: 'Professional Scissors', units: 32, revenue: 1280 },
        { name: 'Hair Color Kit', units: 28, revenue: 1120 },
        { name: 'Styling Brush', units: 25, revenue: 1000 }
      ];
    } catch (error) {
      console.error('Error in getTopSellingProducts:', error);
      return [];
    }
  }

  /**
   * Generate recommendations for underperforming members
   */
  generateRecommendations(member, averageRevenue, averageRebookingRate) {
    const recommendations = [];
    
    if (member.revenue < averageRevenue) {
      recommendations.push('Provide additional training on upselling techniques');
      recommendations.push('Schedule more appointments during peak hours');
      recommendations.push('Focus on building client relationships');
    }
    
    if (member.rebookingRate < averageRebookingRate) {
      recommendations.push('Improve service quality and client satisfaction');
      recommendations.push('Follow up with clients after appointments');
      recommendations.push('Offer loyalty programs and incentives');
    }
    
    return recommendations;
  }
}

module.exports = new AnalyticsService();
