import axios from 'axios'

class AIChatService {
  constructor() {
    this.baseURL = process.env.REACT_APP_AI_API_URL || 'http://localhost:8000'
    this.openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY
    this.conversationHistory = new Map()
  }

  // Initialize conversation for a specific insight
  initializeConversation(insightId, context) {
    if (!this.conversationHistory.has(insightId)) {
      this.conversationHistory.set(insightId, {
        messages: [
          {
            role: 'system',
            content: `You are an AI business analyst specializing in ${context.type} insights. 
                     Provide actionable, data-driven advice based on the context: ${context.description}.
                     Always give specific, practical recommendations that business owners can implement immediately.`
          }
        ],
        context: context
      })
    }
    return this.conversationHistory.get(insightId)
  }

  // Send message and get AI response
  async sendMessage(insightId, userMessage) {
    try {
      const conversation = this.conversationHistory.get(insightId)
      if (!conversation) {
        throw new Error('Conversation not initialized')
      }

      // Add user message to conversation
      conversation.messages.push({
        role: 'user',
        content: userMessage
      })

      // Get AI response
      let aiResponse
      if (this.openaiApiKey) {
        aiResponse = await this.getOpenAIResponse(conversation.messages)
      } else {
        aiResponse = await this.getLocalAIResponse(conversation.messages, conversation.context)
      }

      // Add AI response to conversation
      conversation.messages.push({
        role: 'assistant',
        content: aiResponse
      })

      return {
        response: aiResponse,
        conversationId: insightId,
        timestamp: new Date().toISOString()
      }

    } catch (error) {
      console.error('AI chat error:', error)
      return {
        response: 'I apologize, but I\'m having trouble processing your request right now. Please try again in a moment.',
        error: true
      }
    }
  }

  // Get response from OpenAI API
  async getOpenAIResponse(messages) {
    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4',
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      }, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      })

      return response.data.choices[0].message.content

    } catch (error) {
      console.error('OpenAI API error:', error)
      throw new Error('Failed to get OpenAI response')
    }
  }

  // Get response from local AI model (fallback)
  async getLocalAIResponse(messages, context) {
    try {
      // Use local AI logic based on context type
      const lastUserMessage = messages[messages.length - 1].content.toLowerCase()
      
      switch (context.type) {
        case 'earnings':
          return this.generateEarningsResponse(lastUserMessage, context)
        case 'churn':
          return this.generateChurnResponse(lastUserMessage, context)
        case 'promotions':
          return this.generatePromotionsResponse(lastUserMessage, context)
        case 'trends':
          return this.generateTrendsResponse(lastUserMessage, context)
        case 'hours':
          return this.generateHoursResponse(lastUserMessage, context)
        case 'ltv':
          return this.generateLTVResponse(lastUserMessage, context)
        default:
          return this.generateGeneralResponse(lastUserMessage, context)
      }

    } catch (error) {
      console.error('Local AI response error:', error)
      throw new Error('Failed to generate local AI response')
    }
  }

  // Generate context-specific responses
  generateEarningsResponse(message, context) {
    if (message.includes('increase') || message.includes('boost') || message.includes('grow')) {
      return `Based on your earnings projection of $${context.value}, here are 3 immediate actions to boost revenue:

1. **Optimize Peak Hours**: Focus marketing efforts during your highest-revenue periods (${context.peakHours || '2-6 PM'})
2. **Upsell Services**: Bundle complementary services to increase average transaction value
3. **Client Retention**: Implement a loyalty program to reduce churn and increase repeat business

Would you like me to elaborate on any of these strategies?`
    }
    
    if (message.includes('forecast') || message.includes('prediction') || message.includes('accuracy')) {
      return `Your revenue forecast has a confidence level of ${context.confidence}% based on:

• Historical trend analysis
• Seasonal pattern recognition  
• Market demand fluctuations
• Client behavior patterns

The model accuracy is ${context.accuracy}%, which is excellent for business planning.`
    }

    return `I can help you with earnings optimization strategies, forecast accuracy, revenue growth tactics, or any specific questions about your financial projections. What would you like to know more about?`
  }

  generateChurnResponse(message, context) {
    if (message.includes('prevent') || message.includes('stop') || message.includes('reduce')) {
      return `To prevent client churn, focus on these high-impact strategies:

1. **Immediate Engagement**: Contact ${context.highRiskCount || 3} high-risk clients within 48 hours
2. **Personalized Offers**: Create custom promotions based on their service preferences
3. **Feedback Loop**: Implement a satisfaction survey and act on feedback quickly
4. **Loyalty Rewards**: Offer exclusive benefits for returning clients

The key is proactive communication and personalized attention.`
    }

    if (message.includes('risk') || message.includes('probability')) {
      return `Your churn risk analysis shows:

• **Critical Risk**: ${context.criticalCount || 0} clients (80%+ churn probability)
• **High Risk**: ${context.highCount || 0} clients (60-80% churn probability)
• **Medium Risk**: ${context.mediumCount || 0} clients (40-60% churn probability)

Focus your retention efforts on Critical and High-risk clients first for maximum impact.`
    }

    return `I can help you with churn prevention strategies, risk assessment, client retention tactics, or specific questions about at-risk clients. What would you like to explore?`
  }

  generatePromotionsResponse(message, context) {
    if (message.includes('discount') || message.includes('offer') || message.includes('promotion')) {
      return `Based on your booking patterns, here are optimal promotion strategies:

1. **Tuesday/Wednesday Focus**: ${context.recommendedDiscount || 15}% discount on premium services
2. **Timing**: Launch 2-3 weeks in advance for maximum awareness
3. **Target Services**: Focus on ${context.targetServices || 'high-margin services'} during slow periods
4. **ROI Projection**: Expected ${context.expectedUplift || 25}% increase in bookings

The key is targeting the right services on the right days with optimal timing.`
    }

    if (message.includes('roi') || message.includes('return') || message.includes('effectiveness')) {
      return `Your promotion ROI analysis shows:

• **Best Performing Day**: ${context.bestDay || 'Tuesday'} with ${context.bestROI || 3.2}x return
• **Optimal Discount**: ${context.optimalDiscount || 15}% for maximum impact
• **Expected Revenue Increase**: $${context.revenueIncrease || 1200} per month
• **Confidence Level**: ${context.confidence || 85}%

Focus on high-ROI days and services for maximum promotional effectiveness.`
    }

    return `I can help you with promotion strategies, ROI optimization, discount recommendations, or specific questions about your marketing campaigns. What would you like to know?`
  }

  generateTrendsResponse(message, context) {
    if (message.includes('growing') || message.includes('trend') || message.includes('popular')) {
      return `Your service trend analysis reveals:

1. **Fastest Growing**: ${context.topTrend || 'Hair Color'} with ${context.topGrowth || 23}% growth
2. **Market Demand**: ${context.marketDemand || 'High'} demand in your city
3. **Seasonality**: ${context.seasonality || 'Year-round'} popularity
4. **Recommendation**: ${context.recommendation || 'Expand capacity'}

Consider increasing marketing spend on trending services and expanding your team's expertise in high-growth areas.`
    }

    if (message.includes('decline') || message.includes('falling') || message.includes('decrease')) {
      return `For declining services, consider these strategies:

1. **Pricing Review**: Analyze if pricing is competitive with market rates
2. **Service Innovation**: Update offerings to match current trends
3. **Marketing Refresh**: Rebrand declining services with new messaging
4. **Bundle Opportunities**: Combine with popular services to boost demand

Sometimes a service refresh can turn declining trends around.`
    }

    return `I can help you with trend analysis, growth strategies, market insights, or specific questions about your service performance. What would you like to explore?`
  }

  generateHoursResponse(message, context) {
    if (message.includes('extend') || message.includes('hours') || message.includes('schedule')) {
      return `Based on your revenue analysis, here's the optimal schedule adjustment:

1. **Extended Hours**: Open until ${context.optimalClosing || 8} PM on peak days
2. **Revenue Impact**: +$${context.projectedIncrease || 1200} monthly revenue increase
3. **Peak Hours**: Focus on ${context.peakHours || '2-6 PM'} for maximum efficiency
4. **Staff Scheduling**: Optimize team allocation during high-demand periods

The data shows extending hours would be profitable, especially during your busiest periods.`
    }

    if (message.includes('cost') || message.includes('profit') || message.includes('efficiency')) {
      return `Your hours optimization analysis shows:

• **Current Revenue**: $${context.currentRevenue || 2800} per day
• **Extended Hours Revenue**: $${context.extendedRevenue || 3200} per day
• **Additional Costs**: $${context.additionalCosts || 200} per day
• **Net Profit Increase**: $${context.netIncrease || 200} per day

The ROI on extended hours is ${context.roi || 100}%, making it a profitable expansion.`
    }

    return `I can help you with schedule optimization, revenue impact analysis, cost-benefit calculations, or specific questions about your business hours. What would you like to know?`
  }

  generateLTVResponse(message, context) {
    if (message.includes('increase') || message.includes('boost') || message.includes('grow')) {
      return `To increase client LTV, focus on these strategies:

1. **VIP Program**: Create exclusive benefits for your top ${context.vipCount || 12} clients
2. **Upselling**: ${context.upsellingOpportunity || 'Service diversification'} for existing clients
3. **Retention**: Focus on clients with ${context.retentionProbability || 85}%+ retention probability
4. **Cross-selling**: Bundle complementary services to increase transaction value

Your top clients represent ${context.topClientPercentage || 20}% of revenue but have high growth potential.`
    }

    if (message.includes('tier') || message.includes('segment') || message.includes('category')) {
      return `Your client segmentation shows:

• **VIP Clients**: ${context.vipCount || 12} clients, avg LTV $${context.vipLTV || 15000}
• **Premium Clients**: ${context.premiumCount || 28} clients, avg LTV $${context.premiumLTV || 8500}
• **Regular Clients**: ${context.regularCount || 45} clients, avg LTV $${context.regularLTV || 4200}
• **Occasional Clients**: ${context.occasionalCount || 67} clients, avg LTV $${context.occasionalLTV || 1800}

Focus retention efforts on VIP and Premium clients for maximum revenue impact.`
    }

    return `I can help you with LTV optimization, client segmentation, retention strategies, or specific questions about your client value analysis. What would you like to explore?`
  }

  generateGeneralResponse(message, context) {
    return `I'm here to help you with ${context.type} insights and business optimization strategies. 

I can provide:
• Detailed analysis of your data
• Actionable recommendations
• Strategy implementation guidance
• Performance optimization tips

What specific aspect would you like to explore further?`
  }

  // Get conversation history
  getConversationHistory(insightId) {
    return this.conversationHistory.get(insightId)?.messages || []
  }

  // Clear conversation history
  clearConversation(insightId) {
    this.conversationHistory.delete(insightId)
  }

  // Get conversation summary
  getConversationSummary(insightId) {
    const conversation = this.conversationHistory.get(insightId)
    if (!conversation) return null

    const userMessages = conversation.messages.filter(m => m.role === 'user').length
    const aiMessages = conversation.messages.filter(m => m.role === 'assistant').length

    return {
      totalMessages: userMessages + aiMessages,
      userQuestions: userMessages,
      aiResponses: aiMessages,
      lastActivity: conversation.messages[conversation.messages.length - 1]?.timestamp || null
    }
  }
}

export default new AIChatService()



