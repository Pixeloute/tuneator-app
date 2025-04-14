
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RoyaltyData {
  platform: string;
  month: string;
  revenue: number;
  streams: number;
  country?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const { timeRange } = await req.json();
    
    // Generate realistic demo data
    const spotifyData = generateMonthlyData(timeRange, {
      baseRevenue: 3200,
      baseStreams: 850000,
      growthRate: 1.15
    });
    
    const appleData = generateMonthlyData(timeRange, {
      baseRevenue: 2800,
      baseStreams: 720000,
      growthRate: 1.12
    });
    
    const youtubeData = generateMonthlyData(timeRange, {
      baseRevenue: 1800,
      baseStreams: 450000,
      growthRate: 1.18
    });
    
    const othersData = generateMonthlyData(timeRange, {
      baseRevenue: 1200,
      baseStreams: 280000,
      growthRate: 1.10
    });

    return new Response(
      JSON.stringify({
        spotify: spotifyData,
        apple: appleData,
        youtube: youtubeData,
        others: othersData,
        lastUpdated: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function generateMonthlyData(timeRange: string, config: {
  baseRevenue: number,
  baseStreams: number,
  growthRate: number
}): RoyaltyData[] {
  const months = parseInt(timeRange.replace('months', ''));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  const result: RoyaltyData[] = [];
  
  for (let i = months - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(currentDate.getMonth() - i);
    const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Add some randomness to make the data look more realistic
    const randomFactor = 0.9 + Math.random() * 0.2; // Random factor between 0.9 and 1.1
    const monthlyGrowth = Math.pow(config.growthRate, (months - i) / months);
    
    result.push({
      platform: "Platform",
      month: monthYear,
      revenue: Math.round(config.baseRevenue * monthlyGrowth * randomFactor),
      streams: Math.round(config.baseStreams * monthlyGrowth * randomFactor)
    });
  }
  
  return result;
}
