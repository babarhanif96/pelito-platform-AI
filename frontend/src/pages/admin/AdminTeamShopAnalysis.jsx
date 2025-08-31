import React, { useState, useEffect, useContext } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  CartesianGrid
} from 'recharts'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import DashboardHeader from '../../components/DashboardHeader'
import StatesContext from '../../context/StatesContext'
import { BACKEND_URL } from '../../constant'
import axios from 'axios'

// Material-UI Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PeopleIcon from '@mui/icons-material/People'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ScheduleIcon from '@mui/icons-material/Schedule'
import StarIcon from '@mui/icons-material/Star'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import PieChartIcon from '@mui/icons-material/PieChart'
import BarChartIcon from '@mui/icons-material/BarChart'
import TimelineIcon from '@mui/icons-material/Timeline'
import SpeedIcon from '@mui/icons-material/Speed'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import GroupIcon from '@mui/icons-material/Group'
import PsychologyIcon from '@mui/icons-material/Psychology'
import InsightsIcon from '@mui/icons-material/Insights'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import FilterListIcon from '@mui/icons-material/FilterList'
import DateRangeIcon from '@mui/icons-material/DateRange'
import RefreshIcon from '@mui/icons-material/Refresh'

// Modern KPI Card with Glassmorphism
const ModernKpiCard = ({ title, value, sub, Icon, trend, trendValue, color = "primary" }) => {
  const colorMap = {
    primary: "from-[#66FCF1] to-[#009688]",
    secondary: "from-[#009688] to-[#00f0ff]",
    accent: "from-[#00f0ff] to-[#66FCF1]",
    success: "from-[#10B981] to-[#059669]",
    warning: "from-[#F59E0B] to-[#D97706]",
    danger: "from-[#EF4444] to-[#DC2626]"
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl sm:rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg flex-shrink-0`}>
                {Icon && <Icon className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />}
              </div>
              {trend && (
                <div className={`flex items-center gap-1 text-xs sm:text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <span className="hidden sm:inline">{trendValue}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-300 text-xs sm:text-sm font-medium mb-1 sm:mb-2 truncate">{title}</h3>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 truncate">{value}</div>
            {sub && <div className="text-xs text-gray-400 truncate">{sub}</div>}
          </div>
        </div>

        <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}

// Team Member Performance Table
const TeamPerformanceTable = ({ data, onMemberClick }) => (
  <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
    <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
      <GroupIcon className="text-[#66FCF1] w-5 h-5 sm:w-6 sm:h-6" />
      Team Performance Overview
    </h3>
    <div className="overflow-x-auto -mx-3 sm:-mx-4 lg:-mx-6">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-[#2f3136]">
            <thead className="bg-[#1E1F23]/50">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">Member</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">Revenue</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">Rebooking</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">$/Hour</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">Products</th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-[#1E1F23]/30 divide-y divide-[#2f3136]/50">
              {data.map((member, index) => (
                <tr
                  key={index}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => onMemberClick(member)}
                >
                  <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#66FCF1] to-[#009688] flex items-center justify-center text-white text-xs sm:text-sm font-medium flex-shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-medium text-xs sm:text-sm truncate">{member.name}</div>
                        <div className="text-gray-400 text-xs truncate">{member.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-white">${member.revenue}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-white text-xs sm:text-sm">{member.rebookingRate}%</span>
                      <div className="w-12 sm:w-16 bg-gray-700 rounded-full h-1.5 sm:h-2">
                        <div
                          className={`h-1.5 sm:h-2 rounded-full ${member.rebookingRate >= 80 ? 'bg-emerald-500' : member.rebookingRate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${member.rebookingRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-white">${member.revenuePerHour}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap text-xs sm:text-sm text-white">{member.productsSold}</td>
                  <td className="px-3 sm:px-4 py-2 sm:py-3 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${member.status === 'excellent' ? 'bg-emerald-500/20 text-emerald-400' :
                      member.status === 'good' ? 'bg-blue-500/20 text-blue-400' :
                        member.status === 'average' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                      }`}>
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
)

// Service Performance Chart
const ServicePerformanceChart = ({ data }) => (
  <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
    <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
      <BarChartIcon className="text-[#66FCF1] w-5 h-5 sm:w-6 sm:h-6" />
      Service Performance by Team Member
    </h3>
    <div className="w-full h-48 sm:h-64 lg:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3136" />
          <XAxis dataKey="member" stroke="#808089" fontSize={12} />
          <YAxis stroke="#808089" fontSize={12} />
          <Tooltip
            wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }}
            formatter={(value, name) => [`${value}%`, name]}
          />
          <Bar dataKey="Haircut" fill="#3B82F6" name="Haircut" />
          <Bar dataKey="Shave" fill="#10B981" name="Shave" />
          <Bar dataKey="Color" fill="#F472B6" name="Color" />
          <Bar dataKey="Styling" fill="#A78BFA" name="Styling" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// Revenue Per Hour Chart
const RevenuePerHourChart = ({ data }) => (
  <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
    <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
      <MonetizationOnIcon className="text-[#66FCF1] w-5 h-5 sm:w-6 sm:h-6" />
      Revenue Per Hour Analysis
    </h3>
    <div className="w-full h-48 sm:h-64 lg:h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2f3136" />
          <XAxis dataKey="member" stroke="#808089" fontSize={12} />
          <YAxis stroke="#808089" fontSize={12} />
          <Tooltip
            wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }}
            formatter={(value) => [`$${value}`, 'Revenue/Hour']}
          />
          <Bar dataKey="revenuePerHour" fill="#66FCF1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// Product Sales Analysis
const ProductSalesAnalysis = ({ data }) => (
  <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
    <h3 className="text-white font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
      <ShoppingCartIcon className="text-[#66FCF1] w-5 h-5 sm:w-6 sm:h-6" />
      Product Sales by Team Member
    </h3>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <div className="w-full h-48 sm:h-56 lg:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={60}
              innerRadius={30}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={index} fill={['#66FCF1', '#009688', '#00f0ff', '#F472B6', '#A78BFA'][index % 5]} />
              ))}
            </Pie>
            <Tooltip wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-white/5 rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div
                className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: ['#66FCF1', '#009688', '#00f0ff', '#F472B6', '#A78BFA'][index % 5] }}
              ></div>
              <span className="text-white text-xs sm:text-sm truncate">{item.name}</span>
            </div>
            <span className="text-gray-300 font-medium text-xs sm:text-sm">{item.value} units</span>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Underperforming Members Alert
const UnderperformingAlert = ({ members }) => (
  <div className="bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6">
    <h3 className="text-red-400 font-semibold mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
      <WarningIcon className="text-red-400 w-5 h-5 sm:w-6 sm:h-6" />
      Underperforming Team Members
    </h3>
    <div className="space-y-2 sm:space-y-3">
      {members.map((member, index) => (
        <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-red-500/10 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-red-500/20 flex items-center justify-center text-red-400 text-xs sm:text-sm font-medium flex-shrink-0">
              {member.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-white font-medium text-xs sm:text-sm truncate">{member.name}</div>
              <div className="text-red-400 text-xs truncate">{member.issue}</div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-red-400 text-xs sm:text-sm">${member.revenue}</div>
            <div className="text-red-400 text-xs">vs ${member.average} avg</div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const AdminTeamShopAnalysis = () => {
  const context = useContext(StatesContext)
  const [dateRange, setDateRange] = useState('30')
  const [selectedShop, setSelectedShop] = useState('all')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [analyticsData, setAnalyticsData] = useState({
    teamMembers: [],
    servicePerformance: [],
    revenuePerHour: [],
    productSales: [],
    underperforming: [],
    overview: {}
  })

  // Add error state
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Safe context access
  const handleStateChange = context?.handleStateChange || (() => { })

  // Ensure we always have valid data structure
  const safeAnalyticsData = {
    teamMembers: analyticsData?.teamMembers || [],
    servicePerformance: analyticsData?.servicePerformance || [],
    revenuePerHour: analyticsData?.revenuePerHour || [],
    productSales: analyticsData?.productSales || [],
    underperforming: analyticsData?.underperforming || [],
    overview: analyticsData?.overview || {}
  }

  // API functions to fetch analytics data
  const fetchAnalyticsData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const headers = { Authorization: `Bearer ${token}` }

      // Resolve start/end dates (supports custom range)
      let startDateParam
      let endDateParam
      if (dateRange === 'custom') {
        if (!customStartDate) {
          throw new Error('Please select a start date for the custom range')
        }
        startDateParam = customStartDate
        endDateParam = customEndDate || customStartDate
      } else {
        startDateParam = getDateString(-parseInt(dateRange))
        endDateParam = getDateString(0)
      }

      // Fetch all analytics data in parallel
      const [
        teamPerformanceRes,
        servicePerformanceRes,
        productSalesRes,
        underperformingRes,
        overviewRes
      ] = await Promise.all([
        axios.get(`${BACKEND_URL}/analytics/admin/team-performance?startDate=${startDateParam}&endDate=${endDateParam}&shopId=${selectedShop}`, { headers }),
        axios.get(`${BACKEND_URL}/analytics/admin/service-performance?startDate=${startDateParam}&endDate=${endDateParam}&shopId=${selectedShop}`, { headers }),
        axios.get(`${BACKEND_URL}/analytics/admin/product-sales-analysis?startDate=${startDateParam}&endDate=${endDateParam}&shopId=${selectedShop}`, { headers }),
        axios.get(`${BACKEND_URL}/analytics/admin/underperforming-members?startDate=${startDateParam}&endDate=${endDateParam}&shopId=${selectedShop}`, { headers }),
        axios.get(`${BACKEND_URL}/analytics/admin/team-shop-overview?startDate=${startDateParam}&endDate=${endDateParam}&shopId=${selectedShop}`, { headers })
      ])

      // Check if all responses are successful
      if (!teamPerformanceRes.data.success || !servicePerformanceRes.data.success ||
        !productSalesRes.data.success || !underperformingRes.data.success ||
        !overviewRes.data.success) {
        throw new Error('One or more API calls failed')
      }

      // Transform data for the frontend with safe defaults
      const teamMembers = (teamPerformanceRes.data.data || []).map(member => ({
        name: member.name || 'Unknown',
        role: member.role || 'Unknown',
        revenue: member.revenue || 0,
        rebookingRate: member.rebookingRate || 0,
        revenuePerHour: member.revenuePerHour || 0,
        productsSold: member.productsSold || 0,
        status: member.status || 'unknown'
      }))

      const revenuePerHour = (teamPerformanceRes.data.data || []).map(member => ({
        member: member.name || 'Unknown',
        revenuePerHour: member.revenuePerHour || 0
      }))

      const productSales = (productSalesRes.data.data?.salesByCategory || []).map(category => ({
        name: category.category || 'Unknown',
        value: category.units || 0
      }))

      setAnalyticsData({
        teamMembers,
        servicePerformance: servicePerformanceRes.data.data || [],
        revenuePerHour,
        productSales,
        underperforming: underperformingRes.data.data || [],
        overview: overviewRes.data.data || {}
      })

      // Clear any previous errors
      setError(null)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError('Failed to load analytics data. Using fallback data.')

      // Set fallback data when API fails
      setAnalyticsData({
        teamMembers: [],
        servicePerformance: [],
        revenuePerHour: [],
        productSales: [],
        underperforming: [],
        overview: {
          totalRevenue: 0,
          averageRebookingRate: 0,
          topPerformingMember: 'N/A',
          totalProductsSold: 0,
          revenueGrowth: 0,
          bookingGrowth: 0
        }
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get date string
  const getDateString = (daysOffset) => {
    const date = new Date()
    date.setDate(date.getDate() + daysOffset)
    return date.toISOString().split('T')[0]
  }

  useEffect(() => {
    // Only fetch data if we have a valid date range
    if (dateRange && selectedShop) {
      fetchAnalyticsData()
    }
  }, [dateRange, selectedShop, customStartDate, customEndDate])

  // Initial data fetch on component mount
  useEffect(() => {
    fetchAnalyticsData()
  }, [])

  const handleMemberClick = (member) => {
    // Handle member click for detailed view
    console.log('Member clicked:', member)
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    // Fetch new data based on date range
  }

  const handleShopChange = (shop) => {
    setSelectedShop(shop)
    // Fetch new data based on shop selection
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Nav />
        <div className="flex">
          <SideBar />
          <div className="flex-1 p-3 sm:p-4 md:p-6">
            <DashboardHeader title="Team & Shop Analytics" subtitle="Loading analytics data..." />
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66FCF1] mx-auto mb-4"></div>
                <p className="text-gray-400">Loading analytics data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <Nav />
      <div className="flex">
        {/* Sidebar - Fixed width, no overlap */}
        <div className="w-64 lg:w-72 flex-shrink-0">
          <SideBar />
        </div>

        {/* Main Content Area - Takes remaining space, starts beside sidebar */}
        <div className="flex-1 min-w-0 bg-[#0F0F0F]">
          <div className="p-3 sm:p-4 md:p-6">
            <DashboardHeader title="Team & Shop Analytics" subtitle="Comprehensive analysis of team performance and shop metrics" />

            {/* Error Display */}
            {error && (
              <div className="mb-4 sm:mb-6 bg-red-500/10 border border-red-500/20 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <WarningIcon className="text-red-400 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-red-400 font-semibold text-sm sm:text-base">Error</h3>
                    <p className="text-red-300 text-xs sm:text-sm truncate">{error}</p>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Filters and Actions */}
            <div className="mb-4 sm:mb-6 space-y-4 sm:space-y-0 sm:flex sm:flex-wrap sm:gap-4 sm:items-center sm:justify-between">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex items-center gap-2 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-lg px-3 py-2 w-full sm:w-auto">
                  <DateRangeIcon className="text-gray-400 w-4 h-4" />
                  <select
                    value={dateRange}
                    onChange={(e) => handleDateRangeChange(e.target.value)}
                    className="bg-transparent text-gray-200 text-sm border-none outline-none appearance-none w-full sm:w-auto pr-6 cursor-pointer"
                  >
                    <option value="7" className="bg-[#1E1F23] text-gray-200">
                      Last 7 days
                    </option>
                    <option value="30" className="bg-[#1E1F23] text-gray-200">
                      Last 30 days
                    </option>
                    <option value="90" className="bg-[#1E1F23] text-gray-200">
                      Last 90 days
                    </option>
                    <option value="365" className="bg-[#1E1F23] text-gray-200">
                      Last year
                    </option>
                    <option value="custom" className="bg-[#1E1F23] text-gray-200">
                      Custom range
                    </option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <svg
                    className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {dateRange === "custom" && (
                  <div className="flex items-center gap-2 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-lg px-3 py-2 w-full sm:w-auto">
                    <DateRangeIcon className="text-gray-400 w-4 h-4" />
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="date-input bg-transparent text-white border border-[#2f3136] rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#66FCF1]"
                      max={customEndDate || undefined}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="date-input bg-transparent text-white border border-[#2f3136] rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#66FCF1]"
                      min={customStartDate || undefined}
                    />
                  </div>
                )}


                <div className="relative flex items-center gap-2 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-lg px-3 py-2 w-full sm:w-auto">
                  <FilterListIcon className="text-gray-400 w-4 h-4" />
                  <select
                    value={selectedShop}
                    onChange={(e) => handleShopChange(e.target.value)}
                    className="bg-transparent text-gray-200 text-sm border-none outline-none appearance-none w-full sm:w-auto pr-6 cursor-pointer"
                  >
                    <option value="all" className="bg-[#1E1F23] text-gray-200">
                      All Shops
                    </option>
                    <option value="Downtown Shop" className="bg-[#1E1F23] text-gray-200">
                      Downtown Shop
                    </option>
                    <option value="Mall Location" className="bg-[#1E1F23] text-gray-200">
                      Mall Location
                    </option>
                    <option value="Suburban Branch" className="bg-[#1E1F23] text-gray-200">
                      Suburban Branch
                    </option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <svg
                    className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

              </div>

              <button
                onClick={fetchAnalyticsData}
                disabled={loading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-[#66FCF1] to-[#009688] text-white px-4 py-2 rounded-lg hover:from-[#009688] hover:to-[#66FCF1] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                <RefreshIcon className="w-4 h-4" />
                Refresh Data
              </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
              <ModernKpiCard
                title="Total Team Revenue"
                value={safeAnalyticsData.overview.totalRevenue ? `$${Number(safeAnalyticsData.overview.totalRevenue)}` : '$0'}
                sub={`Last ${dateRange} days`}
                Icon={AttachMoneyIcon}
                trend="up"
                trendValue={safeAnalyticsData.overview.revenueGrowth ? `+${Number(safeAnalyticsData.overview.revenueGrowth).toFixed(1)}%` : '+0%'}
                color="success"
              />
              <ModernKpiCard
                title="Average Rebooking Rate"
                value={safeAnalyticsData.overview.averageRebookingRate ? `${Number(safeAnalyticsData.overview.averageRebookingRate).toFixed(1)}%` : '0%'}
                sub="Team average"
                Icon={StarIcon}
                trend="up"
                trendValue={safeAnalyticsData.overview.bookingGrowth ? `+${Number(safeAnalyticsData.overview.bookingGrowth).toFixed(1)}%` : '+0%'}
                color="primary"
              />
              <ModernKpiCard
                title="Top Performer"
                value={safeAnalyticsData.overview.topPerformingMember || 'N/A'}
                sub="Highest revenue generator"
                Icon={TrendingUpIcon}
                color="accent"
              />
              <ModernKpiCard
                title="Products Sold"
                value={safeAnalyticsData.overview.totalProductsSold || 0}
                sub="Total units sold"
                Icon={ShoppingCartIcon}
                trend="up"
                trendValue="+15.3%"
                color="secondary"
              />
            </div>

            {/* Main Content Grid */}
            {safeAnalyticsData.servicePerformance.length > 0 && safeAnalyticsData.revenuePerHour.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                <ServicePerformanceChart data={safeAnalyticsData.servicePerformance} />
                <RevenuePerHourChart data={safeAnalyticsData.revenuePerHour} />
              </div>
            ) : (
              <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center mb-6 sm:mb-8">
                <BarChartIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2">No Performance Data Available</h3>
                <p className="text-gray-400 text-sm">Performance data will appear here once team members start providing services.</p>
              </div>
            )}

            {/* Team Performance Table */}
            {safeAnalyticsData.teamMembers.length > 0 ? (
              <div className="mb-6 sm:mb-8">
                <TeamPerformanceTable
                  data={safeAnalyticsData.teamMembers}
                  onMemberClick={handleMemberClick}
                />
              </div>
            ) : (
              <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center mb-6 sm:mb-8">
                <GroupIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2">No Team Data Available</h3>
                <p className="text-gray-400 text-sm">Team performance data will appear here once team members are added and start working.</p>
              </div>
            )}

            {/* Bottom Row */}
            {safeAnalyticsData.productSales.length > 0 || safeAnalyticsData.underperforming.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                {safeAnalyticsData.productSales.length > 0 && (
                  <ProductSalesAnalysis data={safeAnalyticsData.productSales} />
                )}
                {safeAnalyticsData.underperforming.length > 0 && (
                  <UnderperformingAlert members={safeAnalyticsData.underperforming} />
                )}
              </div>
            ) : (
              <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
                <InsightsIcon className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-white text-base sm:text-lg font-semibold mb-2">No Additional Analytics Available</h3>
                <p className="text-gray-400 text-sm">Product sales and performance insights will appear here as data becomes available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTeamShopAnalysis
