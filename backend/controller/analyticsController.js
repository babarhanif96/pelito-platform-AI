const AnalyticsService = require('../services/analyticsService');
const { validateDateRange, formatCurrency, calculatePercentage } = require('../utils/analyticsHelpers');

/**
 * Business Analytics Controller
 * Provides comprehensive analytics for professional dashboard
 */
class AnalyticsController {
  /**
   * Get daily analytics for the current day
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDailyAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { date } = req.query;
      
      // Validate professional ID
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'Professional ID is required'
        });
      }

      // Get daily analytics
      const analytics = await AnalyticsService.getDailyAnalytics(professionalId, date);
      
      res.status(200).json({
        success: true,
        message: 'Daily analytics retrieved successfully',
        data: analytics
      });

    } catch (error) {
      console.error('Error in getDailyAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve daily analytics',
        error: error.message
      });
    }
  }

  /**
   * Get weekly analytics for the current week
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getWeeklyAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Validate professional ID
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'Professional ID is required'
        });
      }

      // Validate date range
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: dateValidation.message
        });
      }

      // Get weekly analytics
      const analytics = await AnalyticsService.getWeeklyAnalytics(professionalId, startDate, endDate);
      
      res.status(200).json({
        success: true,
        message: 'Weekly analytics retrieved successfully',
        data: analytics
      });

    } catch (error) {
      console.error('Error in getWeeklyAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve weekly analytics',
        error: error.message
      });
    }
  }

  /**
   * Get monthly analytics for the current month
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getMonthlyAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { year, month } = req.query;
      
      // Validate professional ID
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'Professional ID is required'
        });
      }

      // Get monthly analytics
      const analytics = await AnalyticsService.getMonthlyAnalytics(professionalId, year, month);
      
      res.status(200).json({
        success: true,
        message: 'Monthly analytics retrieved successfully',
        data: analytics
      });

    } catch (error) {
      console.error('Error in getMonthlyAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve monthly analytics',
        error: error.message
      });
    }
  }

  /**
   * Get comprehensive analytics overview
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAnalyticsOverview(req, res) {
    try {
      const { professionalId } = req.params;
      const { period = '30' } = req.query; // Default to 30 days
      
      // Validate professional ID
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'Professional ID is required'
        });
      }

      // Get comprehensive analytics overview
      const overview = await AnalyticsService.getAnalyticsOverview(professionalId, period);
      
      res.status(200).json({
        success: true,
        message: 'Analytics overview retrieved successfully',
        data: overview
      });

    } catch (error) {
      console.error('Error in getAnalyticsOverview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve analytics overview',
        error: error.message
      });
    }
  }

  /**
   * Get real-time analytics dashboard data
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getDashboardData(req, res) {
    try {
      const { professionalId } = req.params;
      
      // Validate professional ID
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'Professional ID is required'
        });
      }

      // Get real-time dashboard data
      const dashboardData = await AnalyticsService.getDashboardData(professionalId);
      
      res.status(200).json({
        success: true,
        message: 'Dashboard data retrieved successfully',
        data: dashboardData
      });

    } catch (error) {
      console.error('Error in getDashboardData:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve dashboard data',
        error: error.message
      });
    }
  }

  /**
   * Get custom date range analytics
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getCustomRangeAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { startDate, endDate } = req.query;
      
      // Validate professional ID
      if (!professionalId) {
        return res.status(400).json({
          success: false,
          message: 'Professional ID is required'
        });
      }

      // Validate date range
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: dateValidation.message
        });
      }

      // Get custom range analytics
      const analytics = await AnalyticsService.getCustomRangeAnalytics(
        professionalId, 
        startDate, 
        endDate
      );
      
      res.status(200).json({
        success: true,
        message: 'Custom range analytics retrieved successfully',
        data: analytics
      });

    } catch (error) {
      console.error('Error in getCustomRangeAnalytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve custom range analytics',
        error: error.message
      });
    }
  }

  // New enhanced analytics endpoints
  async getTeamAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!professionalId) {
        return res.status(400).json({ success: false, message: 'Professional ID is required' });
      }

      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date();

      const teamData = await AnalyticsService.getTeamPerformance(professionalId, start, end);
      res.status(200).json({ success: true, message: 'Team analytics retrieved successfully', data: teamData });
    } catch (error) {
      console.error('Error in getTeamAnalytics:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve team analytics', error: error.message });
    }
  }

  async getAIInsights(req, res) {
    try {
      const { professionalId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!professionalId) {
        return res.status(400).json({ success: false, message: 'Professional ID is required' });
      }

      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date();

      const insights = await AnalyticsService.generateAIInsights(professionalId, start, end);
      res.status(200).json({ success: true, message: 'AI insights retrieved successfully', data: insights });
    } catch (error) {
      console.error('Error in getAIInsights:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve AI insights', error: error.message });
    }
  }

  async getProductSalesAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!professionalId) {
        return res.status(400).json({ success: false, message: 'Professional ID is required' });
      }

      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date();

      const productSales = await AnalyticsService.calculateProductSales(professionalId, start, end);
      res.status(200).json({ success: true, message: 'Product sales analytics retrieved successfully', data: { totalProductSales: productSales } });
    } catch (error) {
      console.error('Error in getProductSalesAnalytics:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve product sales analytics', error: error.message });
    }
  }

  async getClientAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { startDate, endDate } = req.query;
      
      if (!professionalId) {
        return res.status(400).json({ success: false, message: 'Professional ID is required' });
      }

      const start = startDate ? new Date(startDate) : new Date();
      const end = endDate ? new Date(endDate) : new Date();

      const clientData = await AnalyticsService.generateClientData(professionalId, start, end);
      const clientDistribution = await AnalyticsService.getClientDistribution(professionalId, start, end);
      const inactiveClients = await AnalyticsService.getInactiveClients(professionalId, 60);

      res.status(200).json({ 
        success: true, 
        message: 'Client analytics retrieved successfully', 
        data: { 
          clientData, 
          clientDistribution, 
          inactiveClients 
        } 
      });
    } catch (error) {
      console.error('Error in getClientAnalytics:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve client analytics', error: error.message });
    }
  }

  async getEnhancedAnalytics(req, res) {
    try {
      const { professionalId } = req.params;
      const { range, startDate, endDate } = req.query;
      
      if (!professionalId) {
        return res.status(400).json({ success: false, message: 'Professional ID is required' });
      }

      let analytics;
      switch (range) {
        case 'daily':
          analytics = await AnalyticsService.getDailyAnalytics(professionalId);
          break;
        case 'weekly':
          analytics = await AnalyticsService.getWeeklyAnalytics(professionalId, startDate, endDate);
          break;
        case 'monthly':
          analytics = await AnalyticsService.getMonthlyAnalytics(professionalId);
          break;
        default:
          analytics = await AnalyticsService.getDailyAnalytics(professionalId);
      }

      // Add enhanced data
      const teamData = await AnalyticsService.getTeamPerformance(professionalId, new Date(), new Date());
      const aiInsights = await AnalyticsService.generateAIInsights(professionalId, new Date(), new Date());

      analytics.team = teamData;
      analytics.aiInsights = aiInsights;

      res.status(200).json({ success: true, message: 'Enhanced analytics retrieved successfully', data: analytics });
    } catch (error) {
      console.error('Error in getEnhancedAnalytics:', error);
      res.status(500).json({ success: false, message: 'Failed to retrieve enhanced analytics', error: error.message });
    }
  }

  /**
   * ADMIN ANALYTICS METHODS
   * These methods provide comprehensive analytics for admin users
   */

  async getAdminTeamShopOverview(req, res) {
    try {
      const { startDate, endDate, shopId } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const overview = await AnalyticsService.getAdminTeamShopOverview(start, end, shopId);
      
      res.status(200).json({
        success: true,
        message: 'Admin team shop overview retrieved successfully',
        data: overview
      });
    } catch (error) {
      console.error('Error in getAdminTeamShopOverview:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin team shop overview',
        error: error.message
      });
    }
  }

  async getAdminTeamPerformance(req, res) {
    try {
      const { startDate, endDate, shopId, memberId } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const performance = await AnalyticsService.getAdminTeamPerformance(start, end, shopId, memberId);
      
      res.status(200).json({
        success: true,
        message: 'Admin team performance retrieved successfully',
        data: performance
      });
    } catch (error) {
      console.error('Error in getAdminTeamPerformance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin team performance',
        error: error.message
      });
    }
  }

  async getAdminRevenueAnalysis(req, res) {
    try {
      const { startDate, endDate, shopId, serviceType } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const revenueAnalysis = await AnalyticsService.getAdminRevenueAnalysis(start, end, shopId, serviceType);
      
      res.status(200).json({
        success: true,
        message: 'Admin revenue analysis retrieved successfully',
        data: revenueAnalysis
      });
    } catch (error) {
      console.error('Error in getAdminRevenueAnalysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin revenue analysis',
        error: error.message
      });
    }
  }

  async getAdminRebookingAnalysis(req, res) {
    try {
      const { startDate, endDate, shopId } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const rebookingAnalysis = await AnalyticsService.getAdminRebookingAnalysis(start, end, shopId);
      
      res.status(200).json({
        success: true,
        message: 'Admin rebooking analysis retrieved successfully',
        data: rebookingAnalysis
      });
    } catch (error) {
      console.error('Error in getAdminRebookingAnalysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin rebooking analysis',
        error: error.message
      });
    }
  }

  async getAdminServicePerformance(req, res) {
    try {
      const { startDate, endDate, shopId } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const servicePerformance = await AnalyticsService.getAdminServicePerformance(start, end, shopId);
      
      res.status(200).json({
        success: true,
        message: 'Admin service performance retrieved successfully',
        data: servicePerformance
      });
    } catch (error) {
      console.error('Error in getAdminServicePerformance:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin service performance',
        error: error.message
      });
    }
  }

  async getAdminProductSalesAnalysis(req, res) {
    try {
      const { startDate, endDate, shopId } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const productSalesAnalysis = await AnalyticsService.getAdminProductSalesAnalysis(start, end, shopId);
      
      res.status(200).json({
        success: true,
        message: 'Admin product sales analysis retrieved successfully',
        data: productSalesAnalysis
      });
    } catch (error) {
      console.error('Error in getAdminProductSalesAnalysis:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin product sales analysis',
        error: error.message
      });
    }
  }

  async getAdminUnderperformingMembers(req, res) {
    try {
      const { startDate, endDate, shopId, threshold = 20 } = req.query;
      
      const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const end = endDate ? new Date(endDate) : new Date();

      const underperformingMembers = await AnalyticsService.getAdminUnderperformingMembers(start, end, shopId, parseInt(threshold));
      
      res.status(200).json({
        success: true,
        message: 'Admin underperforming members analysis retrieved successfully',
        data: underperformingMembers
      });
    } catch (error) {
      console.error('Error in getAdminUnderperformingMembers:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve admin underperforming members analysis',
        error: error.message
      });
    }
  }
}

module.exports = new AnalyticsController();
