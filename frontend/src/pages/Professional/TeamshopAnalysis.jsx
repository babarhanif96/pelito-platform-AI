import React, { useMemo } from 'react'
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
  Cell
} from 'recharts'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import InsightsIcon from '@mui/icons-material/Insights'
import BarChartIcon from '@mui/icons-material/BarChart'
import PeopleIcon from '@mui/icons-material/People'

const KpiCard = ({ title, value, Icon }) => (
  <div className="bg-[#1E1F23] rounded-2xl p-4 shadow-sm flex items-center gap-4 border border-[#2f3136]">
    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#009688] to-[#00796B] flex items-center justify-center text-white">
      {Icon ? <Icon fontSize="small" /> : <InsightsIcon fontSize="small" />}
    </div>
    <div className="flex-1">
      <div className="text-sm text-gray-300">{title}</div>
      <div className="mt-1 font-semibold text-white text-xl">{value}</div>
    </div>
  </div>
)

const RevenueBar = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data}>
      <XAxis dataKey="name" stroke="#808089" />
      <YAxis stroke="#808089" />
      <Tooltip wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }} />
      <Bar dataKey="revenue" fill="#009688" barSize={20} />
    </BarChart>
  </ResponsiveContainer>
)

const RebookingLine = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <LineChart data={data}>
      <XAxis dataKey="name" stroke="#808089" />
      <YAxis stroke="#808089" />
      <Tooltip wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }} />
      <Line type="monotone" dataKey="rebookingRate" stroke="#FBBF24" strokeWidth={3} dot={{ r: 3 }} />
    </LineChart>
  </ResponsiveContainer>
)

const ServicesPerformanceBar = ({ data }) => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data} layout="vertical" margin={{ left: 60 }}>
      <XAxis type="number" stroke="#808089" />
      <YAxis type="category" dataKey="name" stroke="#808089" />
      <Tooltip wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }} />
      <Bar dataKey="Haircut" fill="#3B82F6" />
      <Bar dataKey="Shave" fill="#10B981" />
      <Bar dataKey="Color" fill="#F472B6" />
    </BarChart>
  </ResponsiveContainer>
)

const ProductSalesPie = ({ data }) => {
  const COLORS = ['#009688', '#FBBF24', '#F472B6', '#3B82F6', '#A78BFA']
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          innerRadius={40}
          paddingAngle={3}
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }} />
      </PieChart>
    </ResponsiveContainer>
  )
}

const RevenuePerHourBar = ({ data }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data}>
      <XAxis dataKey="name" stroke="#808089" />
      <YAxis stroke="#808089" />
      <Tooltip wrapperStyle={{ background: '#111214', border: '1px solid #2f3136' }} formatter={(value) => `$${value}`} />
      <Bar dataKey="revenuePerHour" fill="#F472B6" barSize={20} />
    </BarChart>
  </ResponsiveContainer>
)

export default function TeamShopDashboard() {
  // MOCK DATA
  const data = useMemo(() => ({
    kpis: {
      topRevenue: 'Ali Khan ($450)',
      highestRebooking: 'Sara (78%)',
      avgRevenueHour: '$120/hr',
      topProductSeller: 'Mark ($320)',
      underperforming: 'Ahmed'
    },
    revenueByMember: [
      { name: 'Ali Khan', revenue: 450 },
      { name: 'Sara', revenue: 400 },
      { name: 'Ahmed', revenue: 320 },
      { name: 'Mark', revenue: 380 }
    ],
    rebookingRate: [
      { name: 'Ali Khan', rebookingRate: 70 },
      { name: 'Sara', rebookingRate: 78 },
      { name: 'Ahmed', rebookingRate: 55 },
      { name: 'Mark', rebookingRate: 65 }
    ],
    servicesPerformance: [
      { name: 'Ali Khan', Haircut: 300, Shave: 120, Color: 50 },
      { name: 'Sara', Haircut: 250, Shave: 100, Color: 60 },
      { name: 'Ahmed', Haircut: 200, Shave: 80, Color: 40 },
      { name: 'Mark', Haircut: 220, Shave: 90, Color: 50 }
    ],
    revenuePerHour: [
      { name: 'Ali Khan', revenuePerHour: 120 },
      { name: 'Sara', revenuePerHour: 105 },
      { name: 'Ahmed', revenuePerHour: 80 },
      { name: 'Mark', revenuePerHour: 95 }
    ],
    productSales: [
      { name: 'Ali Khan', value: 50 },
      { name: 'Sara', value: 30 },
      { name: 'Ahmed', value: 20 },
      { name: 'Mark', value: 40 }
    ]
  }), [])

  return (
    <div>
      <Nav />
      <SideBar />
      <div className="md:ml-[230px] lg:ml-[270px] pt-[65px] bg-[#25262B] min-h-screen">
        <div className="px-[20px] sm:px-[30px] xl:px-[50px] max-w-[1200px] mx-auto pt-[10px] pb-[40px]">
          <DashboardHeader title="Team & Shop Analysis" />

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <KpiCard title="Top Revenue Generator" value={data.kpis.topRevenue} Icon={BarChartIcon} />
            <KpiCard title="Highest Rebooking Rate" value={data.kpis.highestRebooking} Icon={PeopleIcon} />
            <KpiCard title="Avg Revenue per Hour" value={data.kpis.avgRevenueHour} Icon={InsightsIcon} />
            <KpiCard title="Top Product Seller" value={data.kpis.topProductSeller} Icon={InsightsIcon} />
            <KpiCard title="Underperforming Member" value={data.kpis.underperforming} Icon={InsightsIcon} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#1e1f23] p-4 rounded-2xl">
              <div className="text-sm text-gray-300 mb-2">Revenue by Team Member</div>
              <RevenueBar data={data.revenueByMember} />
            </div>
            <div className="bg-[#1e1f23] p-4 rounded-2xl">
              <div className="text-sm text-gray-300 mb-2">Rebooking Rate</div>
              <RebookingLine data={data.rebookingRate} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#1e1f23] p-4 rounded-2xl">
              <div className="text-sm text-gray-300 mb-2">Services Performance</div>
              <ServicesPerformanceBar data={data.servicesPerformance} />
            </div>
            <div className="bg-[#1e1f23] p-4 rounded-2xl">
              <div className="text-sm text-gray-300 mb-2">Revenue per Hour per Member</div>
              <RevenuePerHourBar data={data.revenuePerHour} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-[#1e1f23] p-4 rounded-2xl">
              <div className="text-sm text-gray-300 mb-2">Product Sales by Member</div>
              <ProductSalesPie data={data.productSales} />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
