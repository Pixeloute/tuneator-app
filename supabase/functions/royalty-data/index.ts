
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// CORS headers for browser requests
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
    
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Authenticate the user (if private data is needed)
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    
    if (!user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Format the date range based on timeRange parameter
    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(timeRange.replace('months', '')));
    
    console.log(`Fetching data from ${startDate.toISOString()} to now for user ${user.id}`);

    // In a real implementation, this would call Spotify, Apple Music, and YouTube APIs
    // For now, we're generating mock data that resembles real API responses
    
    // Get data from Spotify API
    const spotifyData = await fetchSpotifyData(startDate, user.id);
    
    // Get data from Apple Music API
    const appleData = await fetchAppleMusicData(startDate, user.id);
    
    // Get data from YouTube API
    const youtubeData = await fetchYouTubeData(startDate, user.id);
    
    // Get data from other platforms (DDEX, etc)
    const otherData = await fetchOtherPlatformsData(startDate, user.id);

    // Return combined data
    return new Response(
      JSON.stringify({
        spotify: spotifyData,
        apple: appleData,
        youtube: youtubeData,
        others: otherData,
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

// Mock function to fetch Spotify data
// In a real implementation, this would use the Spotify API
async function fetchSpotifyData(startDate: Date, userId: string): Promise<RoyaltyData[]> {
  // In a real app, you would make API calls to Spotify for Artists API
  // For now, returning sample data for demonstration
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const result: RoyaltyData[] = [];
  
  // Create 6 months of data (or however many months are in the timeRange)
  for (let i = 5; i >= 0; i--) {
    const month = (currentMonth - i) >= 0 ? (currentMonth - i) : (12 + currentMonth - i);
    const year = (currentMonth - i) >= 0 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    
    // Add some randomness to the data to make it look realistic
    const baseRevenue = 320 + Math.floor(Math.random() * 50);
    const growth = 1 + (0.1 * (5 - i));
    
    result.push({
      platform: "Spotify",
      month: `${monthNames[month]} ${year}`,
      revenue: Math.floor(baseRevenue * growth),
      streams: Math.floor((baseRevenue * growth * 1000) + Math.random() * 5000),
    });
  }
  
  return result;
}

// Mock function to fetch Apple Music data
async function fetchAppleMusicData(startDate: Date, userId: string): Promise<RoyaltyData[]> {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const result: RoyaltyData[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const month = (currentMonth - i) >= 0 ? (currentMonth - i) : (12 + currentMonth - i);
    const year = (currentMonth - i) >= 0 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    
    const baseRevenue = 250 + Math.floor(Math.random() * 40);
    const growth = 1 + (0.08 * (5 - i));
    
    result.push({
      platform: "Apple Music",
      month: `${monthNames[month]} ${year}`,
      revenue: Math.floor(baseRevenue * growth),
      streams: Math.floor((baseRevenue * growth * 800) + Math.random() * 4000),
    });
  }
  
  return result;
}

// Mock function to fetch YouTube data
async function fetchYouTubeData(startDate: Date, userId: string): Promise<RoyaltyData[]> {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const result: RoyaltyData[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const month = (currentMonth - i) >= 0 ? (currentMonth - i) : (12 + currentMonth - i);
    const year = (currentMonth - i) >= 0 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    
    const baseRevenue = 180 + Math.floor(Math.random() * 30);
    const growth = 1 + (0.12 * (5 - i));
    
    result.push({
      platform: "YouTube",
      month: `${monthNames[month]} ${year}`,
      revenue: Math.floor(baseRevenue * growth),
      streams: Math.floor((baseRevenue * growth * 2000) + Math.random() * 10000),
    });
  }
  
  return result;
}

// Mock function to fetch data from other platforms
async function fetchOtherPlatformsData(startDate: Date, userId: string): Promise<RoyaltyData[]> {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonth = new Date().getMonth();
  const result: RoyaltyData[] = [];
  
  for (let i = 5; i >= 0; i--) {
    const month = (currentMonth - i) >= 0 ? (currentMonth - i) : (12 + currentMonth - i);
    const year = (currentMonth - i) >= 0 ? new Date().getFullYear() : new Date().getFullYear() - 1;
    
    const baseRevenue = 120 + Math.floor(Math.random() * 20);
    const growth = 1 + (0.09 * (5 - i));
    
    result.push({
      platform: "Other",
      month: `${monthNames[month]} ${year}`,
      revenue: Math.floor(baseRevenue * growth),
      streams: Math.floor((baseRevenue * growth * 600) + Math.random() * 3000),
    });
  }
  
  return result;
}
