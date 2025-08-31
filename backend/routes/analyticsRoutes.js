const express = require('express');
const router = express.Router();
const analyticsController = require('../controller/analyticsController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * Analytics Routes
 * All routes require authentication and professional authorization
 */

// Apply authentication middleware to all analytics routes
router.use(authMiddleware.authenticateToken);

/**
 * @route   GET /analytics/daily/:professionalId
 * @desc    Get daily analytics for a professional
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} date - Optional date in YYYY-MM-DD format (defaults to today)
 */
router.get('/daily/:professionalId', 
  authMiddleware.authorizeProfessional,
  analyticsController.getDailyAnalytics
);

/**
 * @route   GET /analytics/weekly/:professionalId
 * @desc    Get weekly analytics for a professional
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 */
router.get('/weekly/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getWeeklyAnalytics
);

/**
 * @route   GET /analytics/monthly/:professionalId
 * @desc    Get monthly analytics for a professional
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} year - Year (optional, defaults to current year)
 * @query   {string} month - Month (optional, defaults to current month)
 */
router.get('/monthly/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getMonthlyAnalytics
);

/**
 * @route   GET /analytics/overview/:professionalId
 * @desc    Get comprehensive analytics overview
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} period - Period in days (default: 30)
 */
router.get('/overview/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getAnalyticsOverview
);

/**
 * @route   GET /analytics/dashboard/:professionalId
 * @desc    Get real-time dashboard data
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 */
router.get('/dashboard/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getDashboardData
);

/**
 * @route   GET /analytics/custom/:professionalId
 * @desc    Get custom date range analytics
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} metrics - Comma-separated list of metrics to include
 */
router.get('/custom/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getCustomRangeAnalytics
);

/**
 * @route   GET /analytics/team/:professionalId
 * @desc    Get team performance analytics
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 */
router.get('/team/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getTeamAnalytics
);

/**
 * @route   GET /analytics/ai-insights/:professionalId
 * @desc    Get AI-powered insights and recommendations
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 */
router.get('/ai-insights/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getAIInsights
);

/**
 * @route   GET /analytics/product-sales/:professionalId
 * @desc    Get product sales analytics
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 */
router.get('/product-sales/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getProductSalesAnalytics
);

/**
 * @route   GET /analytics/client/:professionalId
 * @desc    Get client analytics and insights
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 */
router.get('/client/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getClientAnalytics
);

/**
 * @route   GET /analytics/enhanced/:professionalId
 * @desc    Get comprehensive enhanced analytics with all features
 * @access  Private (Professional only)
 * @param   {string} professionalId - Professional user ID
 * @query   {string} range - Time range (daily, weekly, monthly)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 */
router.get('/enhanced/:professionalId',
  authMiddleware.authorizeProfessional,
  analyticsController.getEnhancedAnalytics
);

/**
 * ADMIN ANALYTICS ROUTES
 * These routes provide comprehensive analytics for admin users
 */

/**
 * @route   GET /analytics/admin/team-shop-overview
 * @desc    Get comprehensive team and shop analytics overview for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 */
router.get('/admin/team-shop-overview',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminTeamShopOverview
);

/**
 * @route   GET /analytics/admin/team-performance
 * @desc    Get detailed team performance analytics for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 * @query   {string} memberId - Specific team member ID (optional)
 */
router.get('/admin/team-performance',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminTeamPerformance
);

/**
 * @route   GET /analytics/admin/revenue-analysis
 * @desc    Get revenue analysis by team member and service for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 * @query   {string} serviceType - Specific service type (optional)
 */
router.get('/admin/revenue-analysis',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminRevenueAnalysis
);

/**
 * @route   GET /analytics/admin/rebooking-analysis
 * @desc    Get rebooking rate analysis for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 */
router.get('/admin/rebooking-analysis',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminRebookingAnalysis
);

/**
 * @route   GET /analytics/admin/service-performance
 * @desc    Get service performance analysis by team member for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 */
router.get('/admin/service-performance',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminServicePerformance
);

/**
 * @route   GET /analytics/admin/product-sales-analysis
 * @desc    Get product sales analysis by team member for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 */
router.get('/admin/product-sales-analysis',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminProductSalesAnalysis
);

/**
 * @route   GET /analytics/admin/underperforming-members
 * @desc    Get analysis of underperforming team members for admin
 * @access  Private (Admin only)
 * @query   {string} startDate - Start date in YYYY-MM-DD format
 * @query   {string} endDate - End date in YYYY-MM-DD format
 * @query   {string} shopId - Specific shop ID (optional)
 * @query   {number} threshold - Performance threshold percentage (default: 20)
 */
router.get('/admin/underperforming-members',
  authMiddleware.authorizeAdmin,
  analyticsController.getAdminUnderperformingMembers
);

module.exports = router;
