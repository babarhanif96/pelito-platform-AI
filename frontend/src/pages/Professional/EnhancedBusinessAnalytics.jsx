import React, { useMemo, useState, useContext, useEffect } from 'react'
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
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import StatesContext from '../../context/StatesContext'
import axios from 'axios'

// Modern Icons
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
import GroupIcon from '@mui/icons-material/Group'
import PsychologyIcon from '@mui/icons-material/Psychology'
import InsightsIcon from '@mui/icons-material/Insights'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'

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
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      
      <div className="relative bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6 hover:bg-[#1E1F23]/90 transition-all duration-300 hover:scale-105">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg`}>
                {Icon && <Icon className="text-white" />}
              </div>
              {trend && (
                <div className={`flex items-center gap-1 text-sm ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
            <div className="text-2xl font-bold text-white mb-1">{value}</div>
            {sub && <div className="text-xs text-gray-400">{sub}</div>}
          </div>
        </div>
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}

// Team Performance Card
const TeamPerformanceCard = ({ member, rank }) => (
  <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-4 hover:bg-[#1E1F23]/90 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#66FCF1] to-[#009688] flex items-center justify-center text-white text-sm font-bold`}>
          {rank}
        </div>
        <div>
          <h4 className="text-white font-medium">{member.name}</h4>
          <p className="text-gray-400 text-xs">{member.role}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-[#66FCF1] font-bold">{fmt(member.revenue)}</div>
        <div className="text-gray-400 text-xs">{member.bookings} bookings</div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Rebooking Rate</span>
        <span className="text-white">{member.rebookingRate}%</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Avg Rating</span>
        <span className="text-white">{member.avgRating}/5.0</span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-400">Product Sales</span>
        <span className="text-white">{fmt(member.productSales)}</span>
      </div>
    </div>
  </div>
)

// AI Insights Card
const AIInsightCard = ({ insight, type = "info" }) => {
  const typeConfig = {
    info: { icon: InsightsIcon, color: "text-[#66FCF1]", bg: "bg-[#66FCF1]/10" },
    warning: { icon: WarningIcon, color: "text-[#F59E0B]", bg: "bg-[#F59E0B]/10" },
    success: { icon: CheckCircleIcon, color: "text-[#10B981]", bg: "bg-[#10B981]/10" }
  }
  
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-4 hover:bg-[#1E1F23]/90 transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
          <Icon className={`${config.color}`} />
        </div>
        <div className="flex-1">
          <h4 className="text-white font-medium mb-1">{insight.title}</h4>
          <p className="text-gray-400 text-sm">{insight.description}</p>
          {insight.action && (
            <button className="mt-2 text-[#66FCF1] text-sm hover:underline">
              {insight.action}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Advanced Revenue Chart
const AdvancedRevenueChart = ({ data, title }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#66FCF1]/20 to-[#009688]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
    <div className="relative bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <ShowChartIcon className="text-[#66FCF1]" />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#66FCF1" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#009688" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="label" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(30, 31, 35, 0.95)', 
              border: '1px solid #2f3136',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }} 
          />
          <Area 
            type="monotone" 
            dataKey="revenue" 
            stroke="#66FCF1" 
            strokeWidth={3}
            fill="url(#revenueGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// Performance Indicator
const PerformanceIndicator = ({ value, max = 100, label, color = "primary" }) => {
  const percentage = Math.min((value / max) * 100, 100)
  const colorMap = {
    primary: "from-[#66FCF1] to-[#009688]",
    secondary: "from-[#009688] to-[#00f0ff]",
    accent: "from-[#00f0ff] to-[#66FCF1]"
  }

  return (
    <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-300">{label}</span>
        <span className="text-sm font-semibold text-white">{percentage.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className={`h-2 rounded-full bg-gradient-to-r ${colorMap[color]}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

// Format numbers
const fmt = (n, prefix = '$') => {
  if (typeof n !== 'number' || isNaN(n)) return `${prefix}0.00`
  return `${prefix}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function EnhancedBusinessAnalytics() {
  const { state } = useContext(StatesContext)
  const [range, setRange] = useState('daily')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Enhanced mock data with all requirements
  const getMockData = (dataRange) => {
    const mockDaily = {
      kpis: { 
        totalEarningsToday: 2847.50, 
        clientsServedToday: 47, 
        mostPerformedServiceToday: 'Premium Haircut (18)', 
        averageTipPerClient: 12.80, 
        peakTimeSlot: '14:00 - 16:00', 
        noShowsThisWeek: 3,
        conversionRate: 94.2,
        averageSessionTime: 45,
        customerSatisfaction: 4.8,
        totalProductSales: 420.50,
        averageRevenuePerHour: 356.25
      },
      team: [
        { name: 'Sarah Johnson', role: 'Senior Stylist', revenue: 1240, bookings: 12, rebookingRate: 92, avgRating: 4.9, productSales: 180 },
        { name: 'Mike Chen', role: 'Barber', revenue: 980, bookings: 10, rebookingRate: 88, avgRating: 4.7, productSales: 120 },
        { name: 'Elena Rodriguez', role: 'Color Specialist', revenue: 1560, bookings: 8, rebookingRate: 95, avgRating: 4.8, productSales: 320 }
      ],
      aiInsights: [
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
      ],
      charts: {
        revenueByHour: [
          { label: '09', revenue: 320 }, { label: '10', revenue: 580 }, 
          { label: '11', revenue: 420 }, { label: '12', revenue: 890 }, 
          { label: '13', revenue: 645 }, { label: '14', revenue: 1240 }, 
          { label: '15', revenue: 1560 }, { label: '16', revenue: 1780 }, 
          { label: '17', revenue: 980 }, { label: '18', revenue: 720 }
        ],
        topServices: [
          { service: 'Premium Haircut', revenue: 1240, profit: 992 }, 
          { service: 'Beard Trim', revenue: 680, profit: 544 }, 
          { service: 'Hair Color', revenue: 920, profit: 644 },
          { service: 'Facial Treatment', revenue: 480, profit: 336 }
        ],
        clientsDistribution: [
          { name: 'New', value: 18 }, 
          { name: 'Returning', value: 29 },
          { name: 'VIP', value: 12 }
        ],
        topClients: [
          { name: 'Ahmed Al-Rashid', visits: 8, spend: 1240, status: 'VIP', ltv: 12400 }, 
          { name: 'Sarah Johnson', visits: 6, spend: 980, status: 'Regular', ltv: 7840 }, 
          { name: 'Michael Chen', visits: 5, spend: 820, status: 'Regular', ltv: 6560 },
          { name: 'Elena Rodriguez', visits: 4, spend: 680, status: 'New', ltv: 4080 },
          { name: 'David Kim', visits: 3, spend: 540, status: 'New', ltv: 3240 }
        ]
      }
    }

    const mockWeekly = {
      kpis: { 
        top3ServicesByRevenue: 'Premium Haircut, Hair Color, Beard Trim', 
        mostProfitableDayOfWeek: 'Saturday', 
        averageRevenuePerClient: 68.45, 
        top5HighestSpendingClients: 'Ahmed, Sarah, Michael, Elena, David', 
        clientRetentionRate: 87.3, 
        inactiveClients: 8,
        weeklyGrowth: 12.5,
        peakDayRevenue: 2847.50,
        averageBookingValue: 72.30,
        totalProductSales: 2840.50,
        revenuePerHourPerBarber: 89.25
      },
      team: [
        { name: 'Sarah Johnson', role: 'Senior Stylist', revenue: 12400, bookings: 48, rebookingRate: 92, avgRating: 4.9, productSales: 1800 },
        { name: 'Mike Chen', role: 'Barber', revenue: 9800, bookings: 42, rebookingRate: 88, avgRating: 4.7, productSales: 1200 },
        { name: 'Elena Rodriguez', role: 'Color Specialist', revenue: 15600, bookings: 32, rebookingRate: 95, avgRating: 4.8, productSales: 3200 }
      ],
      aiInsights: [
        {
          title: "Service Trend Analysis",
          description: "Hair coloring services are trending +25% in your area. Consider expanding your color team.",
          type: "info",
          action: "View market trends"
        },
        {
          title: "Promotion Opportunity",
          description: "Tuesday bookings are 30% below average. A 15% discount could increase bookings by 40%",
          type: "success",
          action: "Create promotion"
        },
        {
          title: "Team Performance",
          description: "Elena has the highest rebooking rate (95%). Consider sharing her techniques with the team.",
          type: "success",
          action: "Schedule training"
        }
      ],
      charts: {
        revenueByDay: [
          { label: 'Mon', revenue: 2847 }, { label: 'Tue', revenue: 2650 }, 
          { label: 'Wed', revenue: 2980 }, { label: 'Thu', revenue: 3120 }, 
          { label: 'Fri', revenue: 3450 }, { label: 'Sat', revenue: 3890 }, 
          { label: 'Sun', revenue: 2650 }
        ],
        topServices: [
          { service: 'Premium Haircut', revenue: 12400, profit: 9920 }, 
          { service: 'Hair Color', revenue: 8900, profit: 6230 }, 
          { service: 'Beard Trim', revenue: 6800, profit: 5440 },
          { service: 'Facial Treatment', revenue: 4200, profit: 2940 }
        ],
        clientsDistribution: [
          { name: 'New', value: 45 }, 
          { name: 'Returning', value: 89 },
          { name: 'VIP', value: 34 }
        ],
        topClients: [
          { name: 'Ahmed Al-Rashid', visits: 12, spend: 1840, status: 'VIP', ltv: 18400 }, 
          { name: 'Sarah Johnson', visits: 8, spend: 1240, status: 'Regular', ltv: 9920 }, 
          { name: 'Michael Chen', visits: 7, spend: 1120, status: 'Regular', ltv: 8960 },
          { name: 'Elena Rodriguez', visits: 6, spend: 980, status: 'New', ltv: 5880 },
          { name: 'David Kim', visits: 5, spend: 820, status: 'New', ltv: 4100 }
        ]
      }
    }

    const mockMonthly = {
      kpis: { 
        highestProfitService: 'Premium Haircut ($18,240.00)', 
        newVsReturningClients: '156 New / 298 Returning', 
        underperformingTimeBlocks: '09:00 - 11:00', 
        totalMonthlyRevenue: 124800, 
        mostProfitableHour: '15:00 - 16:00', 
        bookingAvailabilityRatio: '89.2%',
        monthlyGrowth: 18.7,
        averageCustomerRating: 4.8,
        repeatCustomerRate: 76.4,
        totalProductSales: 12480,
        revenuePerHourPerBarber: 89.25,
        clientLifetimeValue: 2840
      },
      team: [
        { name: 'Sarah Johnson', role: 'Senior Stylist', revenue: 49600, bookings: 192, rebookingRate: 92, avgRating: 4.9, productSales: 7200 },
        { name: 'Mike Chen', role: 'Barber', revenue: 39200, bookings: 168, rebookingRate: 88, avgRating: 4.7, productSales: 4800 },
        { name: 'Elena Rodriguez', role: 'Color Specialist', revenue: 62400, bookings: 128, rebookingRate: 95, avgRating: 4.8, productSales: 12800 }
      ],
      aiInsights: [
        {
          title: "Lifetime Value Analysis",
          description: "Your top 20% of clients generate 80% of revenue. Focus retention efforts on VIP clients.",
          type: "success",
          action: "View client segments"
        },
        {
          title: "Seasonal Trend",
          description: "Hair coloring peaks in December (+40%). Plan inventory and staffing accordingly.",
          type: "info",
          action: "Plan seasonal strategy"
        },
        {
          title: "Competitive Analysis",
          description: "Your pricing is 15% below market average. Consider a 10% price increase.",
          type: "warning",
          action: "Review pricing strategy"
        }
      ],
      charts: {
        revenueByWeek: [
          { label: 'Week 1', revenue: 28470 }, 
          { label: 'Week 2', revenue: 31200 }, 
          { label: 'Week 3', revenue: 29800 }, 
          { label: 'Week 4', revenue: 35330 }
        ],
        topServices: [
          { service: 'Premium Haircut', revenue: 45600, profit: 36480 }, 
          { service: 'Hair Color', revenue: 32400, profit: 22680 }, 
          { service: 'Beard Trim', revenue: 24800, profit: 19840 },
          { service: 'Facial Treatment', revenue: 22000, profit: 15400 }
        ],
        clientsDistribution: [
          { name: 'New', value: 156 }, 
          { name: 'Returning', value: 298 },
          { name: 'VIP', value: 89 }
        ],
        topClients: [
          { name: 'Ahmed Al-Rashid', visits: 24, spend: 3680, status: 'VIP', ltv: 36800 }, 
          { name: 'Sarah Johnson', visits: 18, spend: 2480, status: 'Regular', ltv: 19840 }, 
          { name: 'Michael Chen', visits: 15, spend: 2240, status: 'Regular', ltv: 17920 },
          { name: 'Elena Rodriguez', visits: 12, spend: 1960, status: 'New', ltv: 11760 },
          { name: 'David Kim', visits: 10, spend: 1640, status: 'New', ltv: 8200 }
        ]
      }
    }

    switch (dataRange) {
      case 'weekly':
        return mockWeekly
      case 'monthly':
        return mockMonthly
      default:
        return mockDaily
    }
  }

  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Authentication token not found')
      }

      const professionalId = state.user?._id
      if (!professionalId) {
        throw new Error('Professional ID not found')
      }

      // For now, use mock data
      setAnalyticsData(getMockData(range))

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError(error.message || 'Failed to load analytics data')
      setAnalyticsData(getMockData(range))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalyticsData()
  }, [range, state.user?._id])

  const data = useMemo(() => {
    return analyticsData || getMockData(range)
  }, [analyticsData, range])

  const tabs = [
    { id: 'overview', label: 'Overview', icon: AnalyticsIcon },
    { id: 'team', label: 'Team Analysis', icon: GroupIcon },
    { id: 'ai', label: 'AI Insights', icon: PsychologyIcon },
    { id: 'clients', label: 'Client Analytics', icon: PeopleIcon },
    { id: 'products', label: 'Product Sales', icon: ShoppingCartIcon }
  ]

  return (
    <div className="min-h-screen bg-[#141414]">
      <Nav />
      <SideBar />
      
      <div className="fixed inset-0 bg-gradient-to-br from-[#66FCF1]/10 via-[#009688]/10 to-[#00f0ff]/10 animate-pulse"></div>
      
      <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] relative z-10">
        <div className="px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1400px] mx-auto pt-[20px] pb-[40px]">
          
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#66FCF1] to-[#009688] flex items-center justify-center">
                <AnalyticsIcon className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Enhanced Business Analytics</h1>
                <p className="text-gray-400">Comprehensive insights with AI-powered recommendations</p>
              </div>
            </div>
            
            {/* Range Selector */}
            <div className="flex items-center gap-2 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-1 w-fit mb-6">
              {['daily', 'weekly', 'monthly'].map(r => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                    range === r 
                      ? 'bg-gradient-to-r from-[#66FCF1] to-[#009688] text-white shadow-lg' 
                      : 'text-gray-300 hover:text-white hover:bg-[#2f3136]/50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-2 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-1 w-fit">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 font-medium ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-[#66FCF1] to-[#009688] text-white shadow-lg' 
                        : 'text-gray-300 hover:text-white hover:bg-[#2f3136]/50'
                    }`}
                  >
                    <Icon fontSize="small" />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 backdrop-blur-xl border border-red-500/50 text-red-300 px-6 py-4 rounded-xl mb-6">
              <div className="flex items-center gap-3">
                <span className="text-red-400 text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#66FCF1]/20 border-t-[#66FCF1] rounded-full animate-spin"></div>
              </div>
              <span className="ml-4 text-gray-300 text-lg">Loading analytics data...</span>
            </div>
          )}

          {/* Content based on active tab */}
          {!loading && (
            <>
              {activeTab === 'overview' && (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    <ModernKpiCard 
                      title="Total Earnings" 
                      value={fmt(data.kpis.totalEarningsToday || data.kpis.peakDayRevenue || data.kpis.totalMonthlyRevenue)} 
                      Icon={AttachMoneyIcon}
                      trend="up"
                      trendValue="+12.5%"
                      color="primary"
                    />
                    <ModernKpiCard 
                      title="Clients Served" 
                      value={data.kpis.clientsServedToday || 'N/A'} 
                      Icon={PeopleIcon}
                      trend="up"
                      trendValue="+8.2%"
                      color="secondary"
                    />
                    <ModernKpiCard 
                      title="Product Sales" 
                      value={fmt(data.kpis.totalProductSales || 0)} 
                      Icon={ShoppingCartIcon}
                      trend="up"
                      trendValue="+15.3%"
                      color="accent"
                    />
                    <ModernKpiCard 
                      title="Avg Revenue/Hour" 
                      value={fmt(data.kpis.averageRevenuePerHour || data.kpis.revenuePerHourPerBarber || 0)} 
                      Icon={AccessTimeIcon}
                      trend="up"
                      trendValue="+6.8%"
                      color="success"
                    />
                  </div>

                  {/* Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <AdvancedRevenueChart 
                      data={data.charts.revenueByHour || data.charts.revenueByDay || data.charts.revenueByWeek}
                      title={range === 'daily' ? 'Revenue by Hour' : range === 'weekly' ? 'Revenue by Day' : 'Revenue by Week'}
                    />
                    <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <BarChartIcon className="text-[#009688]" />
                        <h3 className="text-white font-semibold">Top Services Performance</h3>
                      </div>
                      <div className="space-y-3">
                        {data.charts.topServices?.slice(0, 4).map((service, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-300">{service.service}</span>
                            <div className="flex items-center gap-4">
                              <span className="text-[#66FCF1] font-semibold">{fmt(service.revenue)}</span>
                              <span className="text-gray-400 text-sm">Profit: {fmt(service.profit)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'team' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Team Performance Analysis</h2>
                  
                  {/* Team Performance Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {data.team?.map((member, index) => (
                      <TeamPerformanceCard key={index} member={member} rank={index + 1} />
                    ))}
                  </div>

                  {/* Team Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <PerformanceIndicator 
                      value={data.team?.[0]?.rebookingRate || 0} 
                      label="Top Rebooking Rate"
                      color="primary"
                    />
                    <PerformanceIndicator 
                      value={data.team?.[0]?.avgRating * 20 || 0} 
                      label="Top Rating"
                      color="secondary"
                    />
                    <PerformanceIndicator 
                      value={data.team?.[0]?.productSales / 100 || 0} 
                      label="Top Product Sales"
                      color="accent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'ai' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">AI-Powered Insights</h2>
                  
                  {/* AI Insights */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {data.aiInsights?.map((insight, index) => (
                      <AIInsightCard key={index} insight={insight} type={insight.type} />
                    ))}
                  </div>

                  {/* Advanced Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <ModernKpiCard 
                      title="Client LTV" 
                      value={fmt(data.kpis.clientLifetimeValue || 0)} 
                      Icon={MonetizationOnIcon}
                      color="primary"
                    />
                    <ModernKpiCard 
                      title="Growth Rate" 
                      value={`${data.kpis.monthlyGrowth || data.kpis.weeklyGrowth || 0}%`} 
                      Icon={TrendingUpIcon}
                      color="success"
                    />
                    <ModernKpiCard 
                      title="Retention Rate" 
                      value={`${data.kpis.clientRetentionRate || data.kpis.repeatCustomerRate || 0}%`} 
                      Icon={CheckCircleIcon}
                      color="secondary"
                    />
                    <ModernKpiCard 
                      title="Booking Ratio" 
                      value={data.kpis.bookingAvailabilityRatio || 'N/A'} 
                      Icon={ScheduleIcon}
                      color="accent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'clients' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Client Analytics</h2>
                  
                  {/* Client Distribution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <PieChartIcon className="text-[#00f0ff]" />
                        <h3 className="text-white font-semibold">Client Distribution</h3>
                      </div>
                      <div className="space-y-3">
                        {data.charts.clientsDistribution?.map((client, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-300">{client.name}</span>
                            <span className="text-[#66FCF1] font-semibold">{client.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
                      <div className="flex items-center gap-2 mb-4">
                        <StarIcon className="text-[#009688]" />
                        <h3 className="text-white font-semibold">Top Clients by LTV</h3>
                      </div>
                      <div className="space-y-3">
                        {data.charts.topClients?.slice(0, 5).map((client, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div>
                              <div className="text-white font-medium">{client.name}</div>
                              <div className="text-gray-400 text-sm">{client.status}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-[#66FCF1] font-semibold">{fmt(client.ltv)}</div>
                              <div className="text-gray-400 text-sm">{client.visits} visits</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">Product Sales Analysis</h2>
                  
                  {/* Product Sales Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <ModernKpiCard 
                      title="Total Product Sales" 
                      value={fmt(data.kpis.totalProductSales || 0)} 
                      Icon={ShoppingCartIcon}
                      trend="up"
                      trendValue="+15.3%"
                      color="primary"
                    />
                    <ModernKpiCard 
                      title="Avg Product Sale" 
                      value={fmt((data.kpis.totalProductSales || 0) / (data.kpis.clientsServedToday || 1))} 
                      Icon={MonetizationOnIcon}
                      color="secondary"
                    />
                    <ModernKpiCard 
                      title="Product Penetration" 
                      value={`${((data.kpis.totalProductSales || 0) / (data.kpis.totalEarningsToday || data.kpis.peakDayRevenue || data.kpis.totalMonthlyRevenue || 1) * 100).toFixed(1)}%`} 
                      Icon={TrendingUpIcon}
                      color="accent"
                    />
                  </div>

                  {/* Team Product Performance */}
                  <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
                    <h3 className="text-white font-semibold mb-4">Team Product Sales Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {data.team?.map((member, index) => (
                        <div key={index} className="text-center">
                          <div className="text-[#66FCF1] font-bold text-lg">{member.name}</div>
                          <div className="text-gray-400 text-sm">{member.role}</div>
                          <div className="text-white font-semibold mt-2">{fmt(member.productSales)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  )
}
