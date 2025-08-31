import React, { useState, useEffect, useContext, useCallback, useMemo, useRef } from 'react'
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
  ComposedChart,
  CartesianGrid
} from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'
import DashboardHeader from '../../components/DashboardHeader'
import Nav from '../../components/Nav'
import SideBar from '../../components/Sidebar'
import StatesContext from '../../context/StatesContext'
import aiService from '../../services/aiService'
import aiChatService from '../../services/aiChatService'

// AI & Analytics Icons
import PsychologyIcon from '@mui/icons-material/Psychology'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WarningIcon from '@mui/icons-material/Warning'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import InsightsIcon from '@mui/icons-material/Insights'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import GroupIcon from '@mui/icons-material/Group'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import ChatIcon from '@mui/icons-material/Chat'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/Download'
import UploadIcon from '@mui/icons-material/Upload'
import ClearAllIcon from '@mui/icons-material/ClearAll'

// Export and CSV parsing utilities
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'

// AI Insight Card Component
const AIInsightCard = ({ 
  insight, 
  isSelected, 
  onSelect, 
  onChat, 
  isProcessing = false 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getColorScheme = (type) => {
    const schemes = {
      earnings: 'from-[#66FCF1] to-[#009688]',
      churn: 'from-[#EF4444] to-[#DC2626]',
      promotions: 'from-[#F59E0B] to-[#D97706]',
      trends: 'from-[#10B981] to-[#059669]',
      hours: 'from-[#8B5CF6] to-[#7C3AED]',
      ltv: 'from-[#EC4899] to-[#DB2777]'
    }
    return schemes[type] || 'from-[#66FCF1] to-[#009688]'
  }

  const getIcon = (type) => {
    const icons = {
      earnings: TrendingUpIcon,
      churn: WarningIcon,
      promotions: PsychologyIcon,
      trends: ShowChartIcon,
      hours: AccessTimeIcon,
      ltv: MonetizationOnIcon
    }
    return icons[type] || InsightsIcon
  }

  const Icon = getIcon(insight.type)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-[#66FCF1] ring-offset-2 ring-offset-[#0F0F0F]' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(insight)}
    >
      <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-6 h-full relative overflow-hidden">
        {/* Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${getColorScheme(insight.type)} opacity-5 transition-opacity duration-300 ${
          isHovered ? 'opacity-10' : ''
        }`} />
        
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#66FCF1] mx-auto mb-2"></div>
              <p className="text-[#66FCF1] text-sm">AI Processing...</p>
            </div>
          </div>
        )}

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorScheme(insight.type)} flex items-center justify-center shadow-lg`}>
              <Icon className="text-white text-xl" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{insight.value}</div>
              <div className={`text-sm ${
                insight.trend.includes('+') ? 'text-emerald-400' : 
                insight.trend.includes('Risk') ? 'text-red-400' : 'text-blue-400'
              }`}>
                {insight.trend}
              </div>
            </div>
          </div>
          
          {/* Content */}
          <h3 className="text-lg font-semibold text-white mb-2">{insight.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{insight.description}</p>
          
          {/* AI Model Info */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>Model: {insight.model || 'AI Analysis'}</span>
            <span>Confidence: {insight.confidence || 85}%</span>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(insight)
              }}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white text-sm py-2 px-3 rounded-lg transition-colors"
            >
              View Details
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChat(insight)
              }}
              className="bg-[#66FCF1]/20 hover:bg-[#66FCF1]/30 text-[#66FCF1] text-sm py-2 px-3 rounded-lg transition-colors"
            >
              <ChatIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Main AI Insights Component
const AIInsights = () => {
  const { state } = useContext(StatesContext)
  const [loading, setLoading] = useState(true)
  const [aiData, setAiData] = useState(null)
  const [selectedInsight, setSelectedInsight] = useState(null)
  const [chatInsight, setChatInsight] = useState(null)
  const [processingInsights, setProcessingInsights] = useState(new Set())
  const [timeframe, setTimeframe] = useState('30')
  const [csvRows, setCsvRows] = useState(null)
  const [dataSource, setDataSource] = useState('backend')
  const fileInputRef = useRef(null)
  const exportRef = useRef(null)

  // AI Insights configuration
  const insights = [
    {
      id: 'earnings',
      type: 'earnings',
      title: 'Projected Earnings (Next Month)',
      description: 'AI-powered revenue forecasting using LSTM neural networks',
      value: '$0',
      trend: 'Calculating...',
      model: 'LSTM Neural Network',
      confidence: 0,
      accuracy: 0,
      dataPoints: 0
    },
    {
      id: 'churn',
      type: 'churn',
      title: 'Client Churn Risk Analysis',
      description: 'ML-based churn prediction using behavioral patterns and RFM analysis',
      value: '0',
      trend: 'Analyzing...',
      model: 'Neural Network Classifier',
      confidence: 0,
      accuracy: 0,
      dataPoints: 0
    },
    {
      id: 'promotions',
      type: 'promotions',
      title: 'Smart Promotions for Slow Days',
      description: 'AI optimization algorithm for dynamic pricing and promotion timing',
      value: '0',
      trend: 'Optimizing...',
      model: 'Optimization Algorithm',
      confidence: 0,
      accuracy: 0,
      dataPoints: 0
    },
    {
      id: 'trends',
      type: 'trends',
      title: 'Service Trend Analysis',
      description: 'Statistical trend detection with exponential smoothing and market analysis',
      value: '0%',
      trend: 'Analyzing...',
      model: 'Statistical Analysis',
      confidence: 0,
      accuracy: 0,
      dataPoints: 0
    },
    {
      id: 'hours',
      type: 'hours',
      title: 'Revenue Impact from Adjusting Hours',
      description: 'AI simulation models for "what-if" business hour scenarios',
      value: '$0',
      trend: 'Simulating...',
      model: 'Neural Network Simulator',
      confidence: 0,
      accuracy: 0,
      dataPoints: 0
    },
    {
      id: 'ltv',
      type: 'ltv',
      title: 'Client Lifetime Value (LTV)',
      description: 'Predictive LTV modeling using RFM analysis and retention prediction',
      value: '$0',
      trend: 'Calculating...',
      model: 'Predictive Analytics',
      confidence: 0,
      accuracy: 0,
      dataPoints: 0
    }
  ]

  // Initialize AI services and fetch data
  const initializeAI = useCallback(async () => {
    try {
      setLoading(true)
      
      // Initialize TensorFlow.js
      const tfReady = await aiService.initializeTensorFlow()
      if (!tfReady) {
        console.warn('TensorFlow.js not available, using fallback methods')
      }

      // Generate mock data for demonstration
      const mockData = generateMockData()
      
      // Process each insight with AI
      const processedInsights = await Promise.all(
        insights.map(async (insight) => {
          setProcessingInsights(prev => new Set(prev).add(insight.id))
          
          try {
            let result
            switch (insight.type) {
              case 'earnings':
                result = await aiService.forecastRevenue(mockData.historicalRevenue, 30)
                return {
                  ...insight,
                  value: `$${result.forecasts[0]?.toLocaleString() || '0'}`,
                  trend: `+${Math.round((result.confidence || 0.8) * 100)}% confidence`,
                  confidence: Math.round((result.confidence || 0.8) * 100),
                  accuracy: Math.round((result.accuracy || 0.85) * 100),
                  dataPoints: mockData.historicalRevenue.length,
                  model: result.model,
                  context: { ...result }
                }
              
              case 'churn':
                result = await aiService.predictChurn(mockData.clientData, mockData.bookingData)
                const highRiskCount = result.filter(c => c.riskLevel === 'High' || c.riskLevel === 'Critical').length
                return {
                  ...insight,
                  value: highRiskCount.toString(),
                  trend: `${highRiskCount} High Risk`,
                  confidence: Math.round((result[0]?.confidence || 0.75) * 100),
                  accuracy: 82,
                  dataPoints: mockData.clientData.length,
                  model: 'Neural Network Classifier',
                  context: { highRiskCount, churnData: result }
                }
              
              case 'promotions':
                result = await aiService.suggestPromotions(mockData.bookingData, mockData.revenueData, mockData.serviceData)
                return {
                  ...insight,
                  value: result.length.toString(),
                  trend: 'Opportunities',
                  confidence: Math.round((result[0]?.confidence || 0.85) * 100),
                  accuracy: 78,
                  dataPoints: mockData.bookingData.length,
                  model: 'Optimization Algorithm',
                  context: { promotions: result }
                }
              
              case 'trends':
                result = await aiService.analyzeServiceTrends(mockData.serviceData, mockData.marketData, mockData.cityData)
                return {
                  ...insight,
                  value: `${result[0]?.currentGrowth || 0}%`,
                  trend: 'Top Trend',
                  confidence: Math.round((result[0]?.confidence || 0.8) * 100),
                  accuracy: 85,
                  dataPoints: mockData.serviceData.length,
                  model: 'Statistical Analysis',
                  context: { trends: result }
                }
              
              case 'hours':
                result = await aiService.simulateRevenueImpact(
                  { open: 9, close: 18 },
                  { open: 9, close: 20 },
                  mockData.hourlyData
                )
                const projectedIncrease = result.find(r => r.scenario === 'Extended Hours')?.projectedRevenue || 0
                return {
                  ...insight,
                  value: `$${Math.round(projectedIncrease).toLocaleString()}`,
                  trend: 'Monthly Gain',
                  confidence: Math.round((result[0]?.confidence || 0.82) * 100),
                  accuracy: 79,
                  dataPoints: mockData.hourlyData.length,
                  model: 'Neural Network Simulator',
                  context: { simulations: result, hoursData: mockData.hourlyData }
                }
              
              case 'ltv':
                result = await aiService.calculateClientLTV(mockData.clientData, mockData.transactionData, mockData.behavioralData)
                return {
                  ...insight,
                  value: `$${result[0]?.predictedLTV?.toLocaleString() || '0'}`,
                  trend: 'Top Client',
                  confidence: Math.round((result[0]?.confidence || 0.88) * 100),
                  accuracy: 87,
                  dataPoints: mockData.clientData.length,
                  model: 'Predictive Analytics',
                  context: { ltvData: result }
                }
              
              default:
                return insight
            }
          } catch (error) {
            console.error(`Error processing ${insight.type}:`, error)
            return {
              ...insight,
              value: 'Error',
              trend: 'Failed to process',
              confidence: 0,
              accuracy: 0,
              dataPoints: 0
            }
          } finally {
            setProcessingInsights(prev => {
              const newSet = new Set(prev)
              newSet.delete(insight.id)
              return newSet
            })
          }
        })
      )

      setAiData({
        insights: processedInsights,
        rawData: mockData
      })

    } catch (error) {
      console.error('AI initialization error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Generate comprehensive mock data
  const generateMockData = () => {
    const now = new Date()
    const historicalRevenue = Array.from({ length: 90 }, (_, i) => {
      const date = new Date(now.getTime() - (89 - i) * 24 * 60 * 60 * 1000)
      return {
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 500) + 2000 + Math.sin(i / 30) * 200
      }
    })

    const clientData = [
      { id: 1, name: 'Sarah M.', daysSinceLastVisit: 45, visitFrequency: 0.8, avgSpend: 120, satisfaction: 4.2, daysSinceFirstVisit: 730 },
      { id: 2, name: 'Mike R.', daysSinceLastVisit: 38, visitFrequency: 0.6, avgSpend: 85, satisfaction: 3.8, daysSinceFirstVisit: 365 },
      { id: 3, name: 'Emma L.', daysSinceLastVisit: 42, visitFrequency: 0.4, avgSpend: 95, satisfaction: 4.5, daysSinceFirstVisit: 1095 },
      { id: 4, name: 'John D.', daysSinceLastVisit: 15, visitFrequency: 2.1, avgSpend: 180, satisfaction: 4.8, daysSinceFirstVisit: 180 },
      { id: 5, name: 'Lisa K.', daysSinceLastVisit: 28, visitFrequency: 1.5, avgSpend: 150, satisfaction: 4.6, daysSinceFirstVisit: 540 }
    ]

    const bookingData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
      count: Math.floor(Math.random() * 20) + 10,
      clientId: Math.floor(Math.random() * 5) + 1
    }))

    const revenueData = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000),
      amount: Math.floor(Math.random() * 500) + 200,
      clientId: Math.floor(Math.random() * 5) + 1
    }))

    const serviceData = [
      { name: 'Hair Color', history: [120, 135, 142, 138, 156, 168] },
      { name: 'Hair Extensions', history: [45, 52, 48, 58, 62, 68] },
      { name: 'Keratin Treatment', history: [78, 82, 79, 85, 88, 92] },
      { name: 'Haircut', history: [200, 195, 210, 205, 218, 225] }
    ]

    const marketData = [
      { service: 'Hair Color', demand: 'High' },
      { service: 'Hair Extensions', demand: 'Medium' },
      { service: 'Keratin Treatment', demand: 'Medium' },
      { service: 'Haircut', demand: 'High' }
    ]

    const cityData = [
      { service: 'Hair Color', growth: 23 },
      { service: 'Hair Extensions', growth: 15 },
      { service: 'Keratin Treatment', growth: 12 },
      { service: 'Haircut', growth: 8 }
    ]

    const hourlyData = [
      { hour: '9 AM', revenue: 120, demand: 'Low' },
      { hour: '10 AM', revenue: 180, demand: 'Medium' },
      { hour: '11 AM', revenue: 220, demand: 'Medium' },
      { hour: '12 PM', revenue: 280, demand: 'High' },
      { hour: '1 PM', revenue: 320, demand: 'High' },
      { hour: '2 PM', revenue: 380, demand: 'Peak' },
      { hour: '3 PM', revenue: 420, demand: 'Peak' },
      { hour: '4 PM', revenue: 450, demand: 'Peak' },
      { hour: '5 PM', revenue: 400, demand: 'High' },
      { hour: '6 PM', revenue: 320, demand: 'Medium' },
      { hour: '7 PM', revenue: 200, demand: 'Low' },
      { hour: '8 PM', revenue: 150, demand: 'Low' }
    ]

    const transactionData = clientData.map(client => ({
      clientId: client.id,
      amount: client.avgSpend,
      service: 'Hair Service',
      date: new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000)
    }))

    const behavioralData = clientData.map(client => ({
      clientId: client.id,
      preferences: ['Hair Color', 'Styling'],
      communication: 'Email',
      loyalty: client.visitFrequency > 1 ? 'High' : 'Medium'
    }))

    return {
      historicalRevenue,
      clientData,
      bookingData,
      revenueData,
      serviceData,
      marketData,
      cityData,
      hourlyData,
      transactionData,
      behavioralData
    }
  }

  useEffect(() => {
    initializeAI()
  }, [initializeAI])

  const handleInsightSelect = (insight) => {
    setSelectedInsight(insight)
  }

  const handleChat = (insight) => {
    setChatInsight(insight)
  }

  const handleRefresh = () => {
    initializeAI()
  }

  const handleExport = () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4')

      // Header
      pdf.setFontSize(16)
      pdf.text('AI Insights Report', 14, 15)
      pdf.setFontSize(10)
      pdf.text(`Source: ${dataSource === 'csv' ? 'CSV Upload' : 'Backend'}  |  Exported: ${new Date().toLocaleString()}`, 14, 21)

      // Define columns with keys and build rows
      const cols = [
        { header: 'ID', key: 'id' },
        { header: 'Title', key: 'title' },
        { header: 'Type', key: 'type' },
        { header: 'Value', key: 'value' },
        { header: 'Trend', key: 'trend' },
        { header: 'Model', key: 'model' },
        { header: 'Confidence %', key: 'confidence' },
        { header: 'Accuracy %', key: 'accuracy' },
        { header: 'Data Points', key: 'dataPoints' }
      ]

      const tableHead = [cols.map(c => c.header)]
      const tableBody = (displayedInsights || []).map((ins) => (
        cols.map(c => {
          const v = ins[c.key]
          return typeof v === 'undefined' || v === null ? '' : String(v)
        })
      ))

      autoTable(pdf, {
        head: tableHead,
        body: tableBody,
        startY: 28,
        theme: 'grid',
        styles: {
          fontSize: 9,
          cellPadding: 3,
          lineColor: [220, 225, 230],
          lineWidth: 0.2,
          textColor: [33, 33, 33],
          valign: 'middle'
        },
        headStyles: {
          fillColor: [0, 150, 136],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 247, 250] },
        columnStyles: {
          0: { cellWidth: 24 },
          1: { cellWidth: 50 },
          2: { cellWidth: 24 },
          3: { cellWidth: 24, halign: 'right' },
          4: { cellWidth: 30 },
          5: { cellWidth: 42 },
          6: { cellWidth: 24, halign: 'right' },
          7: { cellWidth: 24, halign: 'right' },
          8: { cellWidth: 26, halign: 'right' }
        },
        didDrawPage: (data) => {
          const pageSize = pdf.internal.pageSize
          const pageWidth = pageSize.getWidth()
          const pageHeight = pageSize.getHeight()
          pdf.setFontSize(8)
          pdf.setTextColor(150)
          pdf.text(`Page ${data.pageNumber} of ${pdf.getNumberOfPages()}`, pageWidth - 40, pageHeight - 8)
        }
      })

      pdf.save('ai-insights-report.pdf')
    } catch (err) {
      console.error('PDF export failed:', err)
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleCsvFile = (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = Array.isArray(results.data) ? results.data : []
        setCsvRows(rows)
        setDataSource('csv')
      },
      error: (error) => {
        console.error('CSV parse error:', error)
      }
    })
  }

  const handleClearCsv = () => {
    setCsvRows(null)
    setDataSource('backend')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const csvInsights = useMemo(() => {
    if (!csvRows || csvRows.length === 0) return null
    return csvRows.map((row, idx) => ({
      id: row.id || `csv-${idx}`,
      type: row.type || 'custom',
      title: row.title || 'Untitled',
      description: row.description || 'CSV imported insight',
      value: row.value || '0',
      trend: row.trend || 'N/A',
      model: row.model || 'CSV Import',
      confidence: Number(row.confidence || 0),
      accuracy: Number(row.accuracy || 0),
      dataPoints: Number(row.dataPoints || 0),
      context: {}
    }))
  }, [csvRows])

  const displayedInsights = useMemo(() => {
    if (dataSource === 'csv' && csvInsights) return csvInsights
    return aiData?.insights || insights
  }, [dataSource, csvInsights, aiData])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0F0F] text-white">
        <Nav />
        <div className="flex">
          <div className="w-64 lg:w-72 flex-shrink-0">
            <SideBar />
          </div>
          <div className="flex-1 min-w-0 bg-[#0F0F0F]">
            <div className="p-6">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#66FCF1] mx-auto mb-4"></div>
                  <p className="text-gray-400 text-lg">Initializing AI Services...</p>
                  <p className="text-gray-500 text-sm mt-2">Loading TensorFlow.js and AI models</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white" ref={exportRef} id="ai-insights-root">
      <Nav />
      <div className="flex">
        <div className="w-64 lg:w-72 flex-shrink-0">
          <SideBar />
        </div>
        
        <div className="flex-1 min-w-0 bg-[#0F0F0F]">
          <div className="p-6">
            <DashboardHeader 
              title="AI-Powered Business Intelligence" 
              subtitle="Advanced machine learning algorithms for business optimization"
            />

            {/* AI Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-[#1E1F23]/80 to-[#2f3136]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-6 mb-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#66FCF1] to-[#009688] flex items-center justify-center">
                  <AutoAwesomeIcon className="text-white text-3xl" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Pro Tools - AI Business Intelligence</h2>
                  <p className="text-gray-400">Powered by TensorFlow.js, LSTM networks, and advanced ML algorithms</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#66FCF1] rounded-full"></div>
                  <span className="text-gray-300">LSTM Neural Networks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#009688] rounded-full"></div>
                  <span className="text-gray-300">Machine Learning</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#00f0ff] rounded-full"></div>
                  <span className="text-gray-300">Real-time Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#F472B6] rounded-full"></div>
                  <span className="text-gray-300">Predictive Analytics</span>
                </div>
              </div>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
             
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 bg-[#2f3136] hover:bg-[#3f4147] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <RefreshIcon className="w-4 h-4" />
                  Refresh
                </button>
                <button
                  onClick={handleUploadClick}
                  className="flex items-center gap-2 bg-[#2f3136] hover:bg-[#3f4147] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <UploadIcon className="w-4 h-4" />
                  Upload CSV
                </button>
                {dataSource === 'csv' && (
                  <button
                    onClick={handleClearCsv}
                    className="flex items-center gap-2 bg-[#3b2f2f] hover:bg-[#4a3a3a] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <ClearAllIcon className="w-4 h-4" />
                    Clear CSV
                  </button>
                )}
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 bg-[#009688] hover:bg-[#00a896] text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Export
                </button>
                <input
                  type="file"
                  accept=".csv"
                  ref={fileInputRef}
                  onChange={handleCsvFile}
                  className="hidden"
                />
              </div>
            </div>

            {/* AI Insights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <AnimatePresence>
                {displayedInsights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AIInsightCard
                      insight={insight}
                      isSelected={selectedInsight?.id === insight.id}
                      onSelect={handleInsightSelect}
                      onChat={handleChat}
                      isProcessing={dataSource === 'backend' && processingInsights.has(insight.id)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {dataSource === 'csv' && csvRows && (
              <div className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-6 mb-6">
                <h3 className="text-xl font-bold text-white mb-4">CSV Preview</h3>
                <div className="overflow-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-gray-300">
                      <tr>
                        {Object.keys(csvRows[0] || {}).map((key) => (
                          <th key={key} className="px-3 py-2 border-b border-[#2f3136]">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="text-gray-400">
                      {csvRows.slice(0, 10).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-white/5">
                          {Object.keys(csvRows[0] || {}).map((key) => (
                            <td key={key} className="px-3 py-2 border-b border-[#2f3136]">{String(row[key] ?? '')}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {csvRows.length > 10 && (
                  <p className="text-xs text-gray-500 mt-2">Showing first 10 rows.</p>
                )}
              </div>
            )}

            {/* Selected Insight Details */}
            {selectedInsight && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1E1F23]/80 backdrop-blur-xl border border-[#2f3136] rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white">{selectedInsight.title} - AI Analysis</h3>
                  <button
                    onClick={() => setSelectedInsight(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <CloseIcon />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">AI Model Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Model Type</span>
                        <span className="text-white font-medium">{selectedInsight.model}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Confidence Level</span>
                        <span className="text-emerald-400 font-medium">{selectedInsight.confidence}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Model Accuracy</span>
                        <span className="text-blue-400 font-medium">{selectedInsight.accuracy}%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Data Points Analyzed</span>
                        <span className="text-purple-400 font-medium">{selectedInsight.dataPoints}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">AI Recommendations</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-[#66FCF1]/10 border border-[#66FCF1]/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircleIcon className="text-[#66FCF1] text-sm" />
                          <span className="text-[#66FCF1] font-medium">Immediate Action</span>
                        </div>
                        <p className="text-gray-300 text-sm">Based on AI analysis, implement suggested strategies within 2 weeks for maximum impact</p>
                      </div>
                      <div className="p-3 bg-[#009688]/10 border border-[#009688]/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUpIcon className="text-[#009688] text-sm" />
                          <span className="text-[#009688] font-medium">Growth Strategy</span>
                        </div>
                        <p className="text-gray-300 text-sm">Focus on high-margin opportunities during peak demand periods as identified by AI</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIInsights



