
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AnalyticsFilter {
  startDate: string;
  endDate: string;
  platforms: string[];
  tracks?: string[];
  countries?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get request body
    const filters: AnalyticsFilter = await req.json();
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Authenticate the user
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    console.log(`Fetching custom analytics for user ${user.id} with filters:`, filters);
    
    // In a real implementation, this would query APIs based on the filters
    // For now, returning sample data
    
    // Generate sample data based on filters
    const sampleData = generateSampleData(filters);
    
    return new Response(
      JSON.stringify(sampleData),
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

// Generate sample data based on filters
function generateSampleData(filters: AnalyticsFilter) {
  const result = [];
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);
  const platforms = filters.platforms;
  const countries = filters.countries || ["US", "UK", "CA", "AU", "DE", "FR", "JP"];
  
  // Generate monthly data for each platform in the date range
  for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    
    // For each platform
    for (const platform of platforms) {
      // Generate country-specific data if requested
      if (countries.length > 0) {
        for (const country of countries) {
          const baseRevenue = 
            platform === "Spotify" ? 100 + Math.random() * 200 :
            platform === "Apple Music" ? 80 + Math.random() * 150 : 
            platform === "YouTube" ? 60 + Math.random() * 120 :
            40 + Math.random() * 80;
          
          const baseStreams = 
            platform === "Spotify" ? 50000 + Math.random() * 100000 :
            platform === "Apple Music" ? 30000 + Math.random() * 80000 : 
            platform === "YouTube" ? 100000 + Math.random() * 200000 :
            20000 + Math.random() * 50000;
            
          result.push({
            platform,
            month: `${month} ${year}`,
            revenue: Math.floor(baseRevenue),
            streams: Math.floor(baseStreams),
            country
          });
        }
      } else {
        // Generate aggregate data by platform
        const baseRevenue = 
          platform === "Spotify" ? 1000 + Math.random() * 500 :
          platform === "Apple Music" ? 800 + Math.random() * 400 : 
          platform === "YouTube" ? 600 + Math.random() * 300 :
          400 + Math.random() * 200;
        
        const baseStreams = 
          platform === "Spotify" ? 500000 + Math.random() * 1000000 :
          platform === "Apple Music" ? 300000 + Math.random() * 800000 : 
          platform === "YouTube" ? 1000000 + Math.random() * 2000000 :
          200000 + Math.random() * 500000;
          
        result.push({
          platform,
          month: `${month} ${year}`,
          revenue: Math.floor(baseRevenue),
          streams: Math.floor(baseStreams)
        });
      }
    }
  }
  
  return result;
}
