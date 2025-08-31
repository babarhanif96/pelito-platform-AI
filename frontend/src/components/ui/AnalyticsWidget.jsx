import React, { useState, useEffect } from 'react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import SpeedIcon from '@mui/icons-material/Speed'
import TimelineIcon from '@mui/icons-material/Timeline'

const AnalyticsWidget = ({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendValue, 
  icon: Icon, 
  color = "primary",
  type = "metric",
  data = [],
  maxValue = 100
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [animatedValue, setAnimatedValue] = useState(0)

  const colorMap = {
    primary: {
      gradient: "from-[#66FCF1] to-[#009688]",
      bg: "from-[#66FCF1]/20 to-[#009688]/20",
      text: "text-[#66FCF1]",
      border: "border-[#66FCF1]/30"
    },
    secondary: {
      gradient: "from-[#009688] to-[#00f0ff]",
      bg: "from-[#009688]/20 to-[#00f0ff]/20",
      text: "text-[#009688]",
      border: "border-[#009688]/30"
    },
    accent: {
      gradient: "from-[#00f0ff] to-[#66FCF1]",
      bg: "from-[#00f0ff]/20 to-[#66FCF1]/20",
      text: "text-[#00f0ff]",
      border: "border-[#00f0ff]/30"
    },
    success: {
      gradient: "from-[#10B981] to-[#059669]",
      bg: "from-[#10B981]/20 to-[#059669]/20",
      text: "text-[#10B981]",
      border: "border-[#10B981]/30"
    },
    warning: {
      gradient: "from-[#F59E0B] to-[#D97706]",
      bg: "from-[#F59E0B]/20 to-[#D97706]/20",
      text: "text-[#F59E0B]",
      border: "border-[#F59E0B]/30"
    },
    danger: {
      gradient: "from-[#EF4444] to-[#DC2626]",
      bg: "from-[#EF4444]/20 to-[#DC2626]/20",
      text: "text-[#EF4444]",
      border: "border-[#EF4444]/30"
    }
  }

  const colors = colorMap[color]

  // Animate value on mount
  useEffect(() => {
    if (typeof value === 'number') {
      const duration = 1500
      const steps = 60
      const increment = value / steps
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setAnimatedValue(value)
          clearInterval(timer)
        } else {
          setAnimatedValue(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [value])

  const renderMetric = () => (
    <div 
      className="relative group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-2xl blur-xl transition-all duration-500 ${
        isHovered ? 'blur-2xl scale-105' : 'blur-xl'
      }`}></div>
      
      {/* Glass Card */}
      <div className={`relative bg-white/5 backdrop-blur-xl border ${colors.border} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover-lift`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg transition-all duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}>
                {Icon && <Icon className="text-white" />}
              </div>
              {trend && (
                <div className={`flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                  trend === 'up' ? 'text-emerald-400' : 'text-red-400'
                } ${isHovered ? 'scale-110' : 'scale-100'}`}>
                  {trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
                  <span>{trendValue}</span>
                </div>
              )}
            </div>
            <h3 className="text-gray-300 text-sm font-medium mb-2">{title}</h3>
            <div className="text-2xl font-bold text-white mb-1">
              {typeof value === 'number' ? animatedValue.toLocaleString() : value}
            </div>
            {subtitle && <div className="text-xs text-gray-400">{subtitle}</div>}
          </div>
        </div>
        
        {/* Animated Border */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>
    </div>
  )

  const renderProgress = () => (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-xl blur-xl transition-all duration-500`}></div>
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`${colors.text}`} />}
            <span className="text-sm text-gray-300 font-medium">{title}</span>
          </div>
          <span className="text-sm font-semibold text-white">
            {Math.round((value / maxValue) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-2 rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out`}
            style={{ width: `${(value / maxValue) * 100}%` }}
          ></div>
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 mt-2">{subtitle}</div>
        )}
      </div>
    </div>
  )

  const renderMiniChart = () => (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-xl blur-xl transition-all duration-500`}></div>
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {Icon && <Icon className={`${colors.text}`} />}
            <span className="text-sm text-gray-300 font-medium">{title}</span>
          </div>
          <span className="text-sm font-semibold text-white">{value}</span>
        </div>
        <div className="flex items-end gap-1 h-16">
          {data.map((point, index) => (
            <div
              key={index}
              className={`flex-1 bg-gradient-to-t ${colors.gradient} rounded-t transition-all duration-300 hover:scale-110`}
              style={{ 
                height: `${(point / Math.max(...data)) * 100}%`,
                minHeight: '4px'
              }}
            ></div>
          ))}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 mt-2">{subtitle}</div>
        )}
      </div>
    </div>
  )

  const renderSpeedometer = () => (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-r ${colors.bg} rounded-xl blur-xl transition-all duration-500`}></div>
      <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <SpeedIcon className={`${colors.text}`} />
            <span className="text-sm text-gray-300 font-medium">{title}</span>
          </div>
          <span className="text-sm font-semibold text-white">{value}</span>
        </div>
        <div className="relative w-full h-16 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-gray-700 relative">
            <div 
              className={`absolute inset-0 rounded-full border-4 border-transparent border-t-current ${colors.text} transition-all duration-1000 ease-out`}
              style={{ 
                transform: `rotate(${(value / maxValue) * 180 - 90}deg)`,
                clipPath: 'polygon(50% 50%, 0 0, 100% 0)'
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        {subtitle && (
          <div className="text-xs text-gray-400 mt-2 text-center">{subtitle}</div>
        )}
      </div>
    </div>
  )

  switch (type) {
    case 'progress':
      return renderProgress()
    case 'mini-chart':
      return renderMiniChart()
    case 'speedometer':
      return renderSpeedometer()
    default:
      return renderMetric()
  }
}

export default AnalyticsWidget
