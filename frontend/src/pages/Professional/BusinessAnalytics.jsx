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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import GroupIcon from '@mui/icons-material/Group'
import PsychologyIcon from '@mui/icons-material/Psychology'
import InsightsIcon from '@mui/icons-material/Insights'
import DateRangeIcon from '@mui/icons-material/DateRange'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

// Modern KPI Card with Glassmorphism
const ModernKpiCard = ({ title, value, sub, Icon, trend, trendValue, color = "blue" }) => {
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
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      
      {/* Glass Card */}
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
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
        
        {/* Animated Border */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>
    </div>
  )
}

// Advanced Revenue Chart with Gradient
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

// Modern Services Chart
const ModernServicesChart = ({ data, title }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#009688]/20 to-[#00f0ff]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
    <div className="relative bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <BarChartIcon className="text-[#009688]" />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="service" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" />
          <Tooltip 
            contentStyle={{ 
              background: 'rgba(30, 31, 35, 0.95)', 
              border: '1px solid #2f3136',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)'
            }} 
          />
          <Bar 
            dataKey="revenue" 
            radius={[4, 4, 0, 0]}
            fill="url(#serviceGradient)"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={index === 0 ? '#66FCF1' : index === 1 ? '#009688' : index === 2 ? '#00f0ff' : '#10B981'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

// Advanced Clients Distribution
const AdvancedClientsChart = ({ data, title }) => {
  const COLORS = ['#66FCF1', '#009688', '#00f0ff', '#10B981', '#F59E0B']

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/20 to-[#66FCF1]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
      <div className="relative bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="text-[#00f0ff]" />
          <h3 className="text-white font-semibold">{title}</h3>
        </div>
        <div className="flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                innerRadius={40}
                paddingAngle={5}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(30, 31, 35, 0.95)', 
                  border: '1px solid #2f3136',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-gray-300">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Performance Indicator
const PerformanceIndicator = ({ value, max = 100, label, color = "primary" }) => {
  const percentage = (value / max) * 100
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

// Modern Data Table
const ModernDataTable = ({ data = [], title }) => (
  <div className="relative group">
    <div className="absolute inset-0 bg-gradient-to-r from-[#009688]/20 to-[#66FCF1]/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
    <div className="relative bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <AnalyticsIcon className="text-[#009688]" />
        <h3 className="text-white font-semibold">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-gray-300 font-medium">Client</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Visits</th>
              <th className="text-right py-3 px-4 text-gray-300 font-medium">Total Spend</th>
              <th className="text-center py-3 px-4 text-gray-300 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((client, index) => (
              <tr key={index} className="border-b border-gray-800/50 hover:bg-[#2f3136]/50 transition-colors">
                <td className="py-3 px-4 text-white font-medium">{client.name}</td>
                <td className="py-3 px-4 text-center text-gray-300">{client.visits}</td>
                <td className="py-3 px-4 text-right text-gray-300 font-semibold">{fmt(client.spend)}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    client.visits > 5 ? 'bg-[#009688]/20 text-[#66FCF1]' : 
                    client.visits > 2 ? 'bg-[#00f0ff]/20 text-[#00f0ff]' : 
                    'bg-gray-900/50 text-gray-400'
                  }`}>
                    {client.visits > 5 ? 'VIP' : client.visits > 2 ? 'Regular' : 'New'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)

// Format numbers with modern styling
const fmt = (n, prefix = '$') => {
  if (typeof n !== 'number') return n
  return `${prefix}${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export default function BusinessAnalytics() {
  const { state } = useContext(StatesContext)
  const [range, setRange] = useState('daily')
  const [customStartDate, setCustomStartDate] = useState('')
  const [customEndDate, setCustomEndDate] = useState('')
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMetric, setSelectedMetric] = useState('revenue')

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  // Fetch analytics data from API
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

      let endpoint = ''
      let params = {}

      switch (range) {
        case 'daily':
          endpoint = `/analytics/daily/${professionalId}`
          break
        case 'weekly':
          const now = new Date()
          const startOfWeek = new Date(now)
          startOfWeek.setDate(now.getDate() - now.getDay())
          const endOfWeek = new Date(now)
          endOfWeek.setDate(now.getDate() + (6 - now.getDay()))
          
          endpoint = `/analytics/weekly/${professionalId}`
          params = {
            startDate: startOfWeek.toISOString().split('T')[0],
            endDate: endOfWeek.toISOString().split('T')[0]
          }
          break
        case 'monthly':
          const currentDate = new Date()
          endpoint = `/analytics/monthly/${professionalId}`
          params = {
            year: currentDate.getFullYear(),
            month: currentDate.getMonth() + 1
          }
          break
        case 'custom':
          if (!customStartDate) {
            throw new Error('Please select a start date')
          }
          endpoint = `/analytics/custom/${professionalId}`
          params = {
            startDate: customStartDate,
            endDate: customEndDate || customStartDate
          }
          break
        default:
          endpoint = `/analytics/daily/${professionalId}`
      }

      const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params
      })

      if (response.data.success) {
        if (range === 'custom') {
          const res = response.data.data || {}
          // Transform custom response to expected shape for charts/cards
          const revenueByDay = (res.revenue?.daily || []).map(it => ({ label: it.date, revenue: it.revenue }))
          const topServices = (res.services || [])
            .sort((a,b) => (b.revenue||0) - (a.revenue||0))
            .slice(0,4)
            .map(s => ({ service: s.service, revenue: s.revenue }))

          const transformed = {
            kpis: {
              totalEarningsToday: res.summary?.totalRevenue || 0,
              clientsServedToday: res.summary?.totalBookings || 0,
              averageRevenuePerHour: (res.summary?.totalRevenue || 0) / 8,
              averageBookingValue: res.summary && res.summary.totalBookings ? (res.summary.totalRevenue / res.summary.totalBookings) : 0
            },
            charts: {
              revenueByDay,
              topServices,
              clientsDistribution: [],
              topClients: []
            }
          }
          setAnalyticsData(transformed)
        } else {
          setAnalyticsData(response.data.data)
        }
      } else {
        throw new Error(response.data.message || 'Failed to fetch analytics data')
      }

    } catch (error) {
      console.error('Error fetching analytics data:', error)
      setError(error.message || 'Failed to load analytics data')
      setAnalyticsData(getMockData(range))
    } finally {
      setLoading(false)
    }
  }

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
        averageRevenuePerHour: 356.25,
        clientRetentionRate: 87.3,
        inactiveClients: 8,
        weeklyGrowth: 12.5,
        monthlyGrowth: 18.7,
        repeatCustomerRate: 76.4,
        bookingAvailabilityRatio: '89.2%',
        averageBookingValue: 72.30,
        peakDayRevenue: 2847.50,
        totalMonthlyRevenue: 124800,
        highestProfitService: 'Premium Haircut ($18,240.00)',
        newVsReturningClients: '156 New / 298 Returning',
        underperformingTimeBlocks: '09:00 - 11:00',
        mostProfitableHour: '15:00 - 16:00',
        averageCustomerRating: 4.8
      },
      charts: {
        revenueByHour: [
          { label: '09', revenue: 320 }, { label: '10', revenue: 580 }, 
          { label: '11', revenue: 420 }, { label: '12', revenue: 890 }, 
          { label: '13', revenue: 645 }, { label: '14', revenue: 1240 }, 
          { label: '15', revenue: 1560 }, { label: '16', revenue: 1780 }, 
          { label: '17', revenue: 980 }, { label: '18', revenue: 720 }
        ],
        topServices: [
          { service: 'Premium Haircut', revenue: 1240 }, 
          { service: 'Beard Trim', revenue: 680 }, 
          { service: 'Hair Color', revenue: 920 },
          { service: 'Facial Treatment', revenue: 480 }
        ],
        clientsDistribution: [
          { name: 'New', value: 18 }, 
          { name: 'Returning', value: 29 },
          { name: 'VIP', value: 12 }
        ],
        topClients: [
          { name: 'Ahmed Al-Rashid', visits: 8, spend: 1240, status: 'VIP' }, 
          { name: 'Sarah Johnson', visits: 6, spend: 980, status: 'Regular' }, 
          { name: 'Michael Chen', visits: 5, spend: 820, status: 'Regular' },
          { name: 'Elena Rodriguez', visits: 4, spend: 680, status: 'New' },
          { name: 'David Kim', visits: 3, spend: 540, status: 'New' }
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
        averageBookingValue: 72.30
      },
      charts: {
        revenueByDay: [
          { label: 'Mon', revenue: 2847 }, { label: 'Tue', revenue: 2650 }, 
          { label: 'Wed', revenue: 2980 }, { label: 'Thu', revenue: 3120 }, 
          { label: 'Fri', revenue: 3450 }, { label: 'Sat', revenue: 3890 }, 
          { label: 'Sun', revenue: 2650 }
        ],
        topServices: [
          { service: 'Premium Haircut', revenue: 12400 }, 
          { service: 'Hair Color', revenue: 8900 }, 
          { service: 'Beard Trim', revenue: 6800 },
          { service: 'Facial Treatment', revenue: 4200 }
        ],
        clientsDistribution: [
          { name: 'New', value: 45 }, 
          { name: 'Returning', value: 89 },
          { name: 'VIP', value: 34 }
        ],
        topClients: [
          { name: 'Ahmed Al-Rashid', visits: 12, spend: 1840, status: 'VIP' }, 
          { name: 'Sarah Johnson', visits: 8, spend: 1240, status: 'Regular' }, 
          { name: 'Michael Chen', visits: 7, spend: 1120, status: 'Regular' },
          { name: 'Elena Rodriguez', visits: 6, spend: 980, status: 'New' },
          { name: 'David Kim', visits: 5, spend: 820, status: 'New' }
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
        repeatCustomerRate: 76.4
      },
      charts: {
        revenueByWeek: [
          { label: 'Week 1', revenue: 28470 }, 
          { label: 'Week 2', revenue: 31200 }, 
          { label: 'Week 3', revenue: 29800 }, 
          { label: 'Week 4', revenue: 35330 }
        ],
        topServices: [
          { service: 'Premium Haircut', revenue: 45600 }, 
          { service: 'Hair Color', revenue: 32400 }, 
          { service: 'Beard Trim', revenue: 24800 },
          { service: 'Facial Treatment', revenue: 22000 }
        ],
        clientsDistribution: [
          { name: 'New', value: 156 }, 
          { name: 'Returning', value: 298 },
          { name: 'VIP', value: 89 }
        ],
        topClients: [
          { name: 'Ahmed Al-Rashid', visits: 24, spend: 3680, status: 'VIP' }, 
          { name: 'Sarah Johnson', visits: 18, spend: 2480, status: 'Regular' }, 
          { name: 'Michael Chen', visits: 15, spend: 2240, status: 'Regular' },
          { name: 'Elena Rodriguez', visits: 12, spend: 1960, status: 'New' },
          { name: 'David Kim', visits: 10, spend: 1640, status: 'New' }
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

  useEffect(() => {
    fetchAnalyticsData()
  }, [range, state.user?._id, customStartDate, customEndDate])

  const data = useMemo(() => {
    return analyticsData || getMockData(range)
  }, [analyticsData, range])

  return (
    <div className="min-h-screen bg-[#141414]">
      <Nav />
      <SideBar />
      
      {/* Animated Background */}
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
                <h1 className="text-3xl font-bold text-white">Business Analytics</h1>
                <p className="text-gray-400">Real-time insights and performance metrics</p>
              </div>
            </div>
            
            {/* Modern Range Selector */}
            <div className="flex items-center gap-2 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-1 w-fit">
              {['daily', 'weekly', 'monthly', 'custom'].map(r => (
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
            {range === 'custom' && (
              <div className="mt-3 flex items-center gap-3 bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl px-3 py-2 w-fit">
                <DateRangeIcon className="text-gray-400" />
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="bg-transparent text-white border border-[#2f3136] rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#66FCF1]"
                    max={customEndDate || undefined}
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="bg-transparent text-white border border-[#2f3136] rounded-md px-2 py-1 text-sm focus:outline-none focus:border-[#66FCF1]"
                    min={customStartDate || undefined}
                  />
                </div>
              </div>
            )}
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
                <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin animation-delay-200"></div>
              </div>
              <span className="ml-4 text-gray-300 text-lg">Loading analytics data...</span>
            </div>
          )}

          {/* KPI Cards Grid */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {range === 'daily' && (
                <>
                  <ModernKpiCard 
                    title="Total Earnings Today" 
                    value={fmt(data.kpis.totalEarningsToday)} 
                    Icon={AttachMoneyIcon}
                    trend="up"
                    trendValue="+12.5%"
                    color="primary"
                  />
                  <ModernKpiCard 
                    title="Clients Served Today" 
                    value={data.kpis.clientsServedToday} 
                    Icon={PeopleIcon}
                    trend="up"
                    trendValue="+8.2%"
                    color="secondary"
                  />
                  <ModernKpiCard 
                    title="Top Service" 
                    value={data.kpis.mostPerformedServiceToday} 
                    Icon={StarIcon}
                    color="accent"
                  />
                  <ModernKpiCard 
                    title="Avg Tip / Client" 
                    value={fmt(data.kpis.averageTipPerClient)} 
                    Icon={TrendingUpIcon}
                    trend="up"
                    trendValue="+5.3%"
                    color="success"
                  />
                  <ModernKpiCard 
                    title="Peak Time Slot" 
                    value={data.kpis.peakTimeSlot} 
                    Icon={ScheduleIcon}
                    color="primary"
                  />
                  <ModernKpiCard 
                    title="No-shows This Week" 
                    value={data.kpis.noShowsThisWeek} 
                    Icon={TrendingDownIcon}
                    trend="down"
                    trendValue="-15.2%"
                    color="success"
                  />
                  <ModernKpiCard 
                    title="Product Sales" 
                    value={fmt(data.kpis.totalProductSales)} 
                    Icon={ShoppingCartIcon}
                    trend="up"
                    trendValue="+15.3%"
                    color="warning"
                  />
                  <ModernKpiCard 
                    title="Avg Revenue/Hour" 
                    value={fmt(data.kpis.averageRevenuePerHour)} 
                    Icon={AccessTimeIcon}
                    trend="up"
                    trendValue="+6.8%"
                    color="danger"
                  />
                </>
              )}
              {range === 'weekly' && (
                <>
                  <ModernKpiCard 
                    title="Weekly Revenue" 
                    value={fmt(data.kpis.peakDayRevenue)} 
                    Icon={AttachMoneyIcon}
                    trend="up"
                    trendValue="+18.7%"
                    color="primary"
                  />
                  <ModernKpiCard 
                    title="Most Profitable Day" 
                    value={data.kpis.mostProfitableDayOfWeek} 
                    Icon={StarIcon}
                    color="accent"
                  />
                  <ModernKpiCard 
                    title="Avg Revenue / Client" 
                    value={fmt(data.kpis.averageRevenuePerClient)} 
                    Icon={TrendingUpIcon}
                    trend="up"
                    trendValue="+6.8%"
                    color="secondary"
                  />
                  <ModernKpiCard 
                    title="Client Retention Rate" 
                    value={`${data.kpis.clientRetentionRate}%`} 
                    Icon={PeopleIcon}
                    trend="up"
                    trendValue="+2.1%"
                    color="success"
                  />
                  <ModernKpiCard 
                    title="Top 3 Services" 
                    value={data.kpis.top3ServicesByRevenue} 
                    Icon={BarChartIcon}
                    color="warning"
                  />
                  <ModernKpiCard 
                    title="Inactive Clients (60+ days)" 
                    value={data.kpis.inactiveClients} 
                    Icon={WarningIcon}
                    color="danger"
                  />
                  <ModernKpiCard 
                    title="Weekly Growth" 
                    value={`${data.kpis.weeklyGrowth}%`} 
                    Icon={TrendingUpIcon}
                    trend="up"
                    trendValue="+12.5%"
                    color="primary"
                  />
                  <ModernKpiCard 
                    title="Avg Booking Value" 
                    value={fmt(data.kpis.averageBookingValue)} 
                    Icon={MonetizationOnIcon}
                    color="secondary"
                  />
                </>
              )}
              {range === 'monthly' && (
                <>
                  <ModernKpiCard 
                    title="Monthly Revenue" 
                    value={fmt(data.kpis.totalMonthlyRevenue)} 
                    Icon={AttachMoneyIcon}
                    trend="up"
                    trendValue="+18.7%"
                    color="primary"
                  />
                  <ModernKpiCard 
                    title="Highest Profit Service" 
                    value={data.kpis.highestProfitService} 
                    Icon={StarIcon}
                    color="accent"
                  />
                  <ModernKpiCard 
                    title="Booking Availability" 
                    value={data.kpis.bookingAvailabilityRatio} 
                    Icon={ScheduleIcon}
                    trend="up"
                    trendValue="+3.2%"
                    color="secondary"
                  />
                  <ModernKpiCard 
                    title="Customer Rating" 
                    value={`${data.kpis.averageCustomerRating}/5.0`} 
                    Icon={StarIcon}
                    trend="up"
                    trendValue="+0.2"
                    color="success"
                  />
                  <ModernKpiCard 
                    title="New vs Returning" 
                    value={data.kpis.newVsReturningClients} 
                    Icon={PeopleIcon}
                    color="warning"
                  />
                  <ModernKpiCard 
                    title="Underperforming Blocks" 
                    value={data.kpis.underperformingTimeBlocks} 
                    Icon={WarningIcon}
                    color="danger"
                  />
                  <ModernKpiCard 
                    title="Most Profitable Hour" 
                    value={data.kpis.mostProfitableHour} 
                    Icon={AccessTimeIcon}
                    color="primary"
                  />
                  <ModernKpiCard 
                    title="Monthly Growth" 
                    value={`${data.kpis.monthlyGrowth}%`} 
                    Icon={TrendingUpIcon}
                    trend="up"
                    trendValue="+18.7%"
                    color="secondary"
                  />
                </>
              )}
            </div>
          )}

          {/* Performance Indicators */}
          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <PerformanceIndicator 
                value={range === 'daily' ? (data.kpis.conversionRate || 0) : range === 'weekly' ? (data.kpis.clientRetentionRate || 0) : (data.kpis.repeatCustomerRate || 0)} 
                label={range === 'daily' ? 'Conversion Rate' : range === 'weekly' ? 'Client Retention' : 'Repeat Customer Rate'}
                color="primary"
              />
              <PerformanceIndicator 
                value={range === 'daily' ? ((data.kpis.customerSatisfaction || 0) * 20) : range === 'weekly' ? (data.kpis.weeklyGrowth || 0) : (data.kpis.monthlyGrowth || 0)} 
                label={range === 'daily' ? 'Customer Satisfaction' : range === 'weekly' ? 'Weekly Growth' : 'Monthly Growth'}
                color="secondary"
              />
              <PerformanceIndicator 
                value={range === 'daily' ? ((data.kpis.averageSessionTime || 0) / 60 * 100) : range === 'weekly' ? ((data.kpis.averageBookingValue || 0) / 100) : (parseFloat(data.kpis.bookingAvailabilityRatio) || 0)} 
                label={range === 'daily' ? 'Session Efficiency' : range === 'weekly' ? 'Booking Value' : 'Availability'}
                color="accent"
              />
            </div>
          )}

          {/* Charts Section */}
          {!loading && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <AdvancedRevenueChart 
                  data={
                    range === 'daily' ? data.charts.revenueByHour :
                    range === 'weekly' ? data.charts.revenueByDay :
                    range === 'monthly' ? data.charts.revenueByWeek :
                    data.charts.revenueByDay
                  }
                  title={
                    range === 'daily' ? 'Revenue by Hour' :
                    range === 'weekly' ? 'Revenue by Day' :
                    range === 'monthly' ? 'Revenue by Week' :
                    'Revenue by Day'
                  }
                />
                <ModernServicesChart 
                  data={data.charts.topServices}
                  title="Top Services Performance"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <AdvancedClientsChart 
                  data={data.charts.clientsDistribution}
                  title="Client Distribution"
                />
                <div className="lg:col-span-2">
                  <ModernDataTable 
                    data={data.charts.topClients}
                    title="Top Performing Clients"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
