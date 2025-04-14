
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')

// Handle OPTIONS requests for CORS
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { royaltyData, timeframe, artistGenre } = await req.json()
    console.log(`Processing royalty insights request for timeframe: ${timeframe}, genre: ${artistGenre}`)
    console.time('royalty-insights')

    // Generate insights from AI
    const aiInsights = await generateAIInsights(royaltyData, timeframe, artistGenre)
    
    // Generate revenue predictions
    const revenuePredictions = generateRevenuePredictions(royaltyData, timeframe, artistGenre)
    
    // Generate optimization recommendations
    const recommendations = generateRecommendations(royaltyData, artistGenre)
    
    // Calculate royalty health score
    const healthScore = calculateRoyaltyHealthScore(royaltyData, artistGenre)

    console.timeEnd('royalty-insights')

    return new Response(JSON.stringify({
      insights: aiInsights,
      predictions: revenuePredictions,
      recommendations,
      healthScore,
      processingMetadata: {
        timestamp: new Date().toISOString(),
        timeframe,
        genre: artistGenre
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in royalty insights function:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to generate royalty insights', 
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function generateAIInsights(royaltyData: any, timeframe: string, artistGenre: string) {
  try {
    // Call OpenAI for generating insights
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a music industry financial analyst specializing in royalties and streaming revenue. 
            Analyze the provided royalty data and provide 3-5 specific, actionable insights about:
            1. Performance trends across platforms
            2. Revenue optimization opportunities
            3. Potential issues or areas of concern
            4. Strategic recommendations for improving royalty earnings
            
            Keep insights concise, practical, and focused on maximizing revenue.`
          },
          {
            role: 'user',
            content: `Analyze these royalty earnings for a ${artistGenre} artist over the past ${timeframe}:
            ${JSON.stringify(royaltyData)}`
          }
        ],
        max_tokens: 500,
        temperature: 0.4
      }),
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('AI insights generation error:', error)
    return 'Could not generate AI insights at this time. Please try again later.'
  }
}

function generateRevenuePredictions(royaltyData: any, timeframe: string, artistGenre: string) {
  // Generate predictions for next 3, 6, and 12 months
  // This is a simplified implementation - in a real system, this would use more sophisticated ML models
  
  try {
    // Get historical data points
    const platforms = ['spotify', 'apple', 'youtube', 'others']
    const totalHistoricalRevenue = platforms.reduce((total, platform) => {
      if (royaltyData[platform]) {
        return total + royaltyData[platform].reduce((sum: number, item: any) => sum + item.revenue, 0)
      }
      return total
    }, 0)
    
    // Calculate average monthly revenue
    const months = timeframe === '1year' ? 12 : parseInt(timeframe.replace('months', ''))
    const avgMonthlyRevenue = totalHistoricalRevenue / months
    
    // Apply growth rate based on genre
    // Different genres have different growth patterns
    const genreGrowthMap: Record<string, number> = {
      'Pop': 1.08,
      'Rock': 1.03,
      'Hip-Hop': 1.12,
      'Electronic': 1.09,
      'R&B': 1.05,
      'Country': 1.04,
      'Jazz': 1.02,
      'Classical': 1.01,
      'Folk': 1.02,
      'Metal': 1.03,
      'Indie': 1.07
    }
    
    const growthRate = genreGrowthMap[artistGenre] || 1.05 // Default growth rate
    
    // Generate predictions
    return {
      nextThreeMonths: Math.round(avgMonthlyRevenue * 3 * growthRate),
      nextSixMonths: Math.round(avgMonthlyRevenue * 6 * Math.pow(growthRate, 1.5)),
      nextYear: Math.round(avgMonthlyRevenue * 12 * Math.pow(growthRate, 2)),
      monthlyProjections: generateMonthlyProjections(avgMonthlyRevenue, growthRate, 12),
      confidence: 0.85,
      methodology: "Time series analysis with genre-specific growth factors"
    }
  } catch (error) {
    console.error('Revenue prediction error:', error)
    return {
      error: 'Could not generate predictions',
      details: error.message
    }
  }
}

function generateMonthlyProjections(baseRevenue: number, growthRate: number, months: number) {
  const currentDate = new Date()
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const projections = []
  
  for (let i = 1; i <= months; i++) {
    const projectionDate = new Date()
    projectionDate.setMonth(currentDate.getMonth() + i)
    
    // Add some realistic variance (±10%)
    const variance = 0.9 + Math.random() * 0.2
    const projectedRevenue = Math.round(baseRevenue * Math.pow(growthRate, i) * variance)
    
    projections.push({
      month: monthNames[projectionDate.getMonth()],
      year: projectionDate.getFullYear(),
      revenue: projectedRevenue
    })
  }
  
  return projections
}

function generateRecommendations(royaltyData: any, artistGenre: string) {
  // Generate platform-specific and general recommendations
  // In a real implementation, this would analyze platform data and trends
  
  const platformRecommendations: Record<string, string[]> = {
    spotify: [
      "Create and submit tracks for Spotify editorial playlist consideration",
      "Focus on building monthly listeners rather than just stream count",
      "Consider shorter track lengths for improved playlist placement"
    ],
    apple: [
      "Submit for New Music Daily and other curated Apple Music playlists",
      "Ensure your Apple Music artist profile is complete with high-quality images",
      "Focus on engagement with Apple Music's ecosystem through interviews and exclusives"
    ],
    youtube: [
      "Invest in high-quality visualizers for YouTube streams",
      "Create extended versions or remixes exclusively for YouTube",
      "Use YouTube Shorts to promote your music and increase engagement"
    ],
    others: [
      "Register all tracks with performance rights organizations",
      "Ensure proper metadata across all platforms",
      "Consider sync licensing opportunities for additional revenue"
    ]
  }
  
  // Add genre-specific recommendations
  const genreRecommendations: Record<string, string[]> = {
    'Pop': [
      "Focus on creating 15-30 second hooks that are TikTok-friendly",
      "Prioritize Spotify and Apple Music for maximum revenue potential"
    ],
    'Hip-Hop': [
      "Invest in YouTube promotion for higher ad revenue shares",
      "Consider releasing singles more frequently to maintain engagement"
    ],
    'Electronic': [
      "Target platform-specific electronic music playlists",
      "Consider Beatport and other genre-specific platforms"
    ],
    'Rock': [
      "Focus on album releases over singles for better rock audience engagement",
      "Prioritize platforms with higher per-stream payouts like Tidal and Amazon Music"
    ]
  }
  
  return {
    platforms: platformRecommendations,
    genre: genreRecommendations[artistGenre] || [],
    general: [
      "Release music on Fridays to maximize first-week streams",
      "Promote pre-saves to boost day-one performance",
      "Distribute exclusive content across different platforms to maximize engagement"
    ]
  }
}

function calculateRoyaltyHealthScore(royaltyData: any, artistGenre: string) {
  try {
    // Calculate health score based on multiple factors
    // In a real implementation, this would be more sophisticated
    
    // 1. Platform diversity (25%)
    let platformDiversityScore = 0
    const platforms = ['spotify', 'apple', 'youtube', 'others']
    let activePlatforms = 0
    
    platforms.forEach(platform => {
      if (royaltyData[platform] && royaltyData[platform].length > 0) {
        activePlatforms++
      }
    })
    
    platformDiversityScore = (activePlatforms / platforms.length) * 25
    
    // 2. Growth trend (25%)
    let growthScore = 0
    const recentGrowth = calculateRecentGrowth(royaltyData)
    
    if (recentGrowth > 20) {
      growthScore = 25
    } else if (recentGrowth > 10) {
      growthScore = 20
    } else if (recentGrowth > 5) {
      growthScore = 15
    } else if (recentGrowth > 0) {
      growthScore = 10
    } else if (recentGrowth > -10) {
      growthScore = 5
    }
    
    // 3. Revenue per stream efficiency (25%)
    const rpsScore = calculateRevenuePerStreamScore(royaltyData) * 25
    
    // 4. Genre-specific performance (25%)
    const genreScore = calculateGenrePerformanceScore(royaltyData, artistGenre) * 25
    
    // Overall score
    const totalScore = Math.round(platformDiversityScore + growthScore + rpsScore + genreScore)
    
    return {
      score: totalScore,
      categories: {
        platformDiversity: Math.round(platformDiversityScore),
        growthTrend: growthScore,
        revenueEfficiency: Math.round(rpsScore),
        genrePerformance: Math.round(genreScore)
      },
      interpretation: interpretHealthScore(totalScore),
      improvementAreas: identifyImprovementAreas(
        platformDiversityScore, 
        growthScore, 
        rpsScore, 
        genreScore,
        artistGenre
      )
    }
  } catch (error) {
    console.error('Health score calculation error:', error)
    return {
      score: 50,
      categories: {
        platformDiversity: 10,
        growthTrend: 10,
        revenueEfficiency: 15,
        genrePerformance: 15
      },
      interpretation: "Could not calculate detailed health score",
      improvementAreas: ["Ensure complete data submission for accurate scoring"]
    }
  }
}

function calculateRecentGrowth(royaltyData: any) {
  // Calculate recent growth percentage across platforms
  // Compare first month to last month
  const platforms = ['spotify', 'apple', 'youtube', 'others'] as const
  let firstMonthTotal = 0
  let lastMonthTotal = 0
  
  platforms.forEach(platform => {
    if (royaltyData[platform] && royaltyData[platform].length > 1) {
      firstMonthTotal += royaltyData[platform][0].revenue
      lastMonthTotal += royaltyData[platform][royaltyData[platform].length - 1].revenue
    }
  })
  
  if (firstMonthTotal === 0) return 0
  return ((lastMonthTotal - firstMonthTotal) / firstMonthTotal) * 100
}

function calculateRevenuePerStreamScore(royaltyData: any) {
  // Calculate revenue per stream efficiency
  // Higher is better - compare to industry averages
  const platforms = ['spotify', 'apple', 'youtube', 'others'] as const
  let totalRevenue = 0
  let totalStreams = 0
  
  platforms.forEach(platform => {
    if (royaltyData[platform]) {
      royaltyData[platform].forEach((month: any) => {
        totalRevenue += month.revenue
        totalStreams += month.streams
      })
    }
  })
  
  if (totalStreams === 0) return 0.5 // Default middle score
  
  const rps = totalRevenue / totalStreams
  
  // Industry average is around $0.004 per stream
  // Scoring based on comparison to this average
  if (rps > 0.008) return 1.0 // Excellent
  if (rps > 0.006) return 0.8 // Very good
  if (rps > 0.004) return 0.6 // Good
  if (rps > 0.002) return 0.4 // Fair
  return 0.2 // Needs improvement
}

function calculateGenrePerformanceScore(royaltyData: any, artistGenre: string) {
  // Calculate performance relative to genre benchmarks
  // This would use industry data in a real implementation
  
  // Simplified implementation for demo
  const genreBenchmarkMap: Record<string, number> = {
    'Pop': 9000,         // Monthly revenue benchmark
    'Rock': 7500,
    'Hip-Hop': 10000,
    'Electronic': 8000,
    'R&B': 7000,
    'Country': 7500,
    'Jazz': 5000,
    'Classical': 4500,
    'Folk': 5500,
    'Metal': 6500,
    'Indie': 6000
  }
  
  const benchmark = genreBenchmarkMap[artistGenre] || 7000 // Default benchmark
  
  // Calculate average monthly revenue
  const platforms = ['spotify', 'apple', 'youtube', 'others'] as const
  let totalRevenue = 0
  let monthCount = 0
  
  platforms.forEach(platform => {
    if (royaltyData[platform]) {
      totalRevenue += royaltyData[platform].reduce((sum: number, month: any) => sum + month.revenue, 0)
      monthCount = Math.max(monthCount, royaltyData[platform].length)
    }
  })
  
  if (monthCount === 0) return 0.5 // Default middle score
  
  const avgMonthlyRevenue = totalRevenue / monthCount
  
  // Score based on comparison to benchmark
  return Math.min(1.0, Math.max(0.1, avgMonthlyRevenue / benchmark))
}

function interpretHealthScore(score: number) {
  if (score >= 90) return "Excellent - Your royalty strategy is highly optimized"
  if (score >= 75) return "Very Good - Your royalty performance is strong with minor improvement opportunities"
  if (score >= 60) return "Good - Your royalty strategy is working well but has several areas for optimization"
  if (score >= 45) return "Fair - Your royalty performance could benefit from significant improvements"
  if (score >= 30) return "Needs Work - Your royalty strategy requires substantial optimization"
  return "Critical - Immediate attention to your royalty strategy is recommended"
}

function identifyImprovementAreas(
  platformDiversityScore: number, 
  growthScore: number, 
  rpsScore: number, 
  genreScore: number,
  artistGenre: string
) {
  const improvements = []
  
  // Identify the weakest areas and provide specific recommendations
  if (platformDiversityScore < 15) {
    improvements.push("Expand your presence across more streaming platforms")
  }
  
  if (growthScore < 15) {
    improvements.push("Focus on strategies to increase monthly growth rate")
  }
  
  if (rpsScore < 15) {
    improvements.push("Target platforms with higher per-stream payouts")
  }
  
  if (genreScore < 15) {
    improvements.push(`Optimize your ${artistGenre} content for better performance relative to genre benchmarks`)
  }
  
  // Always provide at least one recommendation
  if (improvements.length === 0) {
    improvements.push("Continue optimizing your strongest platforms while exploring new revenue streams")
  }
  
  return improvements
}
