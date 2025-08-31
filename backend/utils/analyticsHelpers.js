/**
 * Analytics Helper Utilities
 * Provides validation, formatting, and calculation functions for analytics
 */

/**
 * Validate date range parameters
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Object} Validation result with isValid and message
 */
function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) {
    return {
      isValid: false,
      message: 'Start date and end date are required'
    };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return {
      isValid: false,
      message: 'Invalid date format. Use YYYY-MM-DD format'
    };
  }

  if (start > end) {
    return {
      isValid: false,
      message: 'Start date cannot be after end date'
    };
  }

  // Check if date range is not more than 1 year
  const oneYearFromStart = new Date(start);
  oneYearFromStart.setFullYear(oneYearFromStart.getFullYear() + 1);
  
  if (end > oneYearFromStart) {
    return {
      isValid: false,
      message: 'Date range cannot exceed 1 year'
    };
  }

  return {
    isValid: true,
    message: 'Date range is valid'
  };
}

/**
 * Format currency values
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code (default: USD)
 * @param {string} locale - Locale for formatting (default: en-US)
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount, currency = 'USD', locale = 'en-US') {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return '$0.00';
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Calculate percentage
 * @param {number} value - Current value
 * @param {number} total - Total value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Percentage value
 */
function calculatePercentage(value, total, decimals = 2) {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Calculate growth rate between two values
 * @param {number} currentValue - Current period value
 * @param {number} previousValue - Previous period value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Growth rate percentage
 */
function calculateGrowthRate(currentValue, previousValue, decimals = 2) {
  if (previousValue === 0) {
    return currentValue > 0 ? 100 : 0;
  }
  
  const growthRate = ((currentValue - previousValue) / previousValue) * 100;
  return Number(growthRate.toFixed(decimals));
}

/**
 * Format large numbers with K, M, B suffixes
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
function formatLargeNumber(num, decimals = 1) {
  if (typeof num !== 'number' || isNaN(num)) {
    return '0';
  }

  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1e9) {
    return `${sign}${(absNum / 1e9).toFixed(decimals)}B`;
  } else if (absNum >= 1e6) {
    return `${sign}${(absNum / 1e6).toFixed(decimals)}M`;
  } else if (absNum >= 1e3) {
    return `${sign}${(absNum / 1e3).toFixed(decimals)}K`;
  } else {
    return `${sign}${absNum.toFixed(decimals)}`;
  }
}

/**
 * Calculate average value from array of numbers
 * @param {Array} numbers - Array of numbers
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {number} Average value
 */
function calculateAverage(numbers, decimals = 2) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }

  const sum = numbers.reduce((acc, num) => acc + (Number(num) || 0), 0);
  return Number((sum / numbers.length).toFixed(decimals));
}

/**
 * Calculate median value from array of numbers
 * @param {Array} numbers - Array of numbers
 * @returns {number} Median value
 */
function calculateMedian(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }

  const sorted = numbers.slice().sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  } else {
    return sorted[middle];
  }
}

/**
 * Calculate mode (most frequent value) from array
 * @param {Array} values - Array of values
 * @returns {*} Mode value
 */
function calculateMode(values) {
  if (!Array.isArray(values) || values.length === 0) {
    return null;
  }

  const frequency = {};
  let maxFreq = 0;
  let mode = null;

  values.forEach(value => {
    frequency[value] = (frequency[value] || 0) + 1;
    if (frequency[value] > maxFreq) {
      maxFreq = frequency[value];
      mode = value;
    }
  });

  return mode;
}

/**
 * Generate date range for different periods
 * @param {string} period - Period type ('today', 'week', 'month', 'quarter', 'year')
 * @returns {Object} Object with start and end dates
 */
function generateDateRange(period) {
  const now = new Date();
  const start = new Date();
  const end = new Date();

  switch (period.toLowerCase()) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'week':
      const dayOfWeek = start.getDay();
      const diff = start.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      start.setDate(diff);
      start.setHours(0, 0, 0, 0);
      end.setDate(end.getDate() + (6 - end.getDay()));
      end.setHours(23, 59, 59, 999);
      break;

    case 'month':
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(end.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'quarter':
      const quarter = Math.floor(now.getMonth() / 3);
      start.setMonth(quarter * 3, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth((quarter + 1) * 3, 0);
      end.setHours(23, 59, 59, 999);
      break;

    case 'year':
      start.setMonth(0, 1);
      start.setHours(0, 0, 0, 0);
      end.setMonth(11, 31);
      end.setHours(23, 59, 59, 999);
      break;

    default:
      throw new Error('Invalid period. Use: today, week, month, quarter, year');
  }

  return {
    start: start.toISOString(),
    end: end.toISOString(),
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0]
  };
}

/**
 * Format duration in human-readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration string
 */
function formatDuration(minutes) {
  if (minutes < 60) {
    return `${minutes}m`;
  } else if (minutes < 1440) { // Less than 24 hours
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  } else {
    const days = Math.floor(minutes / 1440);
    const remainingHours = Math.floor((minutes % 1440) / 60);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
}

/**
 * Calculate time difference between two dates
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Time difference object
 */
function calculateTimeDifference(startDate, endDate) {
  const diff = Math.abs(endDate - startDate);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  return {
    milliseconds: diff,
    seconds: Math.floor(diff / 1000),
    minutes: minutes,
    hours: hours,
    days: days,
    formatted: formatDuration(minutes)
  };
}

/**
 * Validate professional ID format
 * @param {string} professionalId - Professional user ID
 * @returns {boolean} True if valid, false otherwise
 */
function validateProfessionalId(professionalId) {
  if (!professionalId || typeof professionalId !== 'string') {
    return false;
  }

  // Check if it's a valid MongoDB ObjectId format
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(professionalId);
}

/**
 * Sanitize and validate analytics parameters
 * @param {Object} params - Parameters to validate
 * @returns {Object} Sanitized parameters
 */
function sanitizeAnalyticsParams(params) {
  const sanitized = {};

  // Professional ID validation
  if (params.professionalId) {
    if (!validateProfessionalId(params.professionalId)) {
      throw new Error('Invalid professional ID format');
    }
    sanitized.professionalId = params.professionalId;
  }

  // Date validation
  if (params.startDate && params.endDate) {
    const dateValidation = validateDateRange(params.startDate, params.endDate);
    if (!dateValidation.isValid) {
      throw new Error(dateValidation.message);
    }
    sanitized.startDate = params.startDate;
    sanitized.endDate = params.endDate;
  }

  // Period validation
  if (params.period) {
    const validPeriods = ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'];
    if (!validPeriods.includes(params.period.toLowerCase())) {
      throw new Error('Invalid period. Use: daily, weekly, monthly, quarterly, yearly');
    }
    sanitized.period = params.period.toLowerCase();
  }

  // Metrics validation
  if (params.metrics) {
    const validMetrics = ['revenue', 'bookings', 'clients', 'services', 'performance'];
    const requestedMetrics = Array.isArray(params.metrics) ? params.metrics : [params.metrics];
    
    const invalidMetrics = requestedMetrics.filter(metric => !validMetrics.includes(metric));
    if (invalidMetrics.length > 0) {
      throw new Error(`Invalid metrics: ${invalidMetrics.join(', ')}`);
    }
    sanitized.metrics = requestedMetrics;
  }

  return sanitized;
}

/**
 * Generate cache key for analytics data
 * @param {string} professionalId - Professional user ID
 * @param {string} type - Analytics type
 * @param {Object} params - Additional parameters
 * @returns {string} Cache key
 */
function generateCacheKey(professionalId, type, params = {}) {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}:${params[key]}`)
    .join('|');
  
  return `analytics:${professionalId}:${type}:${paramString}`;
}

/**
 * Calculate moving average
 * @param {Array} values - Array of values
 * @param {number} window - Window size for moving average
 * @returns {Array} Array of moving averages
 */
function calculateMovingAverage(values, window) {
  if (!Array.isArray(values) || values.length < window) {
    return [];
  }

  const result = [];
  for (let i = window - 1; i < values.length; i++) {
    const sum = values.slice(i - window + 1, i + 1).reduce((acc, val) => acc + val, 0);
    result.push(sum / window);
  }

  return result;
}

/**
 * Detect outliers using IQR method
 * @param {Array} values - Array of values
 * @param {number} multiplier - IQR multiplier (default: 1.5)
 * @returns {Array} Array of outlier indices
 */
function detectOutliers(values, multiplier = 1.5) {
  if (!Array.isArray(values) || values.length < 4) {
    return [];
  }

  const sorted = values.slice().sort((a, b) => a - b);
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = q3 - q1;
  const lowerBound = q1 - (multiplier * iqr);
  const upperBound = q3 + (multiplier * iqr);

  return values
    .map((value, index) => ({ value, index }))
    .filter(item => item.value < lowerBound || item.value > upperBound)
    .map(item => item.index);
}

module.exports = {
  validateDateRange,
  formatCurrency,
  calculatePercentage,
  calculateGrowthRate,
  formatLargeNumber,
  calculateAverage,
  calculateMedian,
  calculateMode,
  generateDateRange,
  formatDuration,
  calculateTimeDifference,
  validateProfessionalId,
  sanitizeAnalyticsParams,
  generateCacheKey,
  calculateMovingAverage,
  detectOutliers
};
