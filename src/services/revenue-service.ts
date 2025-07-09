import { supabase } from "@/integrations/supabase/client";
import { SpotifyTrack } from "./spotify-api";
import { toast } from "sonner";

export interface RoyaltyData {
  platform: string;
  month: string;
  revenue: number;
  streams: number;
  country?: string;
}

export interface PlatformRoyaltyData {
  spotify: RoyaltyData[];
  apple: RoyaltyData[];
  youtube: RoyaltyData[];
  others: RoyaltyData[];
  lastUpdated: string;
}

// Generate demo data if API call fails
const generateDemoData = (timeRange: string): PlatformRoyaltyData => {
  console.log("Generating fallback demo data locally...");
  const months = parseInt(timeRange.replace('months', '')) || 6;
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentDate = new Date();
  
  const generatePlatformData = (baseRevenue: number, baseStreams: number, growthRate: number): RoyaltyData[] => {
    const result: RoyaltyData[] = [];
    
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      
      // Add randomness for realistic data
      const randomFactor = 0.9 + Math.random() * 0.2;
      const monthlyGrowth = Math.pow(growthRate, (months - i) / months);
      
      result.push({
        platform: "Platform",
        month: monthYear,
        revenue: Math.round(baseRevenue * monthlyGrowth * randomFactor),
        streams: Math.round(baseStreams * monthlyGrowth * randomFactor)
      });
    }
    
    return result;
  };
  
  return {
    spotify: generatePlatformData(3200, 850000, 1.15),
    apple: generatePlatformData(2800, 720000, 1.12),
    youtube: generatePlatformData(1800, 450000, 1.18),
    others: generatePlatformData(1200, 280000, 1.10),
    lastUpdated: new Date().toISOString()
  };
};

// Centralized function to fetch royalty data from all platforms
export const fetchAllRoyaltyData = async (timeRange: string): Promise<PlatformRoyaltyData | null> => {
  try {
    console.log(`Fetching all royalty data for timeRange: ${timeRange}`);
    
    try {
      // Fetch data from Supabase edge function
      const { data, error } = await supabase.functions.invoke('royalty-data', {
        body: { timeRange }
      });
      
      if (error) {
        console.error("Error fetching royalty data:", error);
        throw new Error("Failed to load royalty data from API");
      }
      
      return {
        spotify: data.spotify || [],
        apple: data.apple || [],
        youtube: data.youtube || [],
        others: data.others || [],
        lastUpdated: new Date().toISOString()
      };
    } catch (apiError) {
      console.error("API Error:", apiError);
      // If API fails, generate demo data locally
      return generateDemoData(timeRange);
    }
  } catch (error) {
    console.error("Error in fetchAllRoyaltyData:", error);
    toast.error("Using demo data for visualization");
    // Fallback to demo data
    return generateDemoData(timeRange);
  }
};

// Download royalty report as CSV
export const downloadRoyaltyReport = async (data: PlatformRoyaltyData): Promise<void> => {
  try {
    // Combine all platform data into a single array
    const allData = [
      ...data.spotify.map(item => ({ ...item, platform: 'Spotify' })),
      ...data.apple.map(item => ({ ...item, platform: 'Apple Music' })),
      ...data.youtube.map(item => ({ ...item, platform: 'YouTube' })),
      ...data.others.map(item => ({ ...item, platform: 'Other' }))
    ];
    
    // Sort by month
    allData.sort((a, b) => {
      const dateA = new Date(a.month);
      const dateB = new Date(b.month);
      return dateA.getTime() - dateB.getTime();
    });
    
    // Create CSV content
    const headers = ['Platform', 'Month', 'Revenue', 'Streams', 'Country'];
    const csvContent = [
      headers.join(','),
      ...allData.map(row => 
        [
          row.platform,
          row.month,
          row.revenue,
          row.streams,
          row.country || 'All'
        ].join(',')
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `royalty-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Royalty report downloaded successfully");
  } catch (error) {
    console.error("Error downloading royalty report:", error);
    toast.error("Failed to download royalty report");
  }
};

// Schedule monthly report
export const scheduleMonthlyReport = async (email: string, reportType: string = 'monthly'): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('schedule-report', {
      body: { email, reportType }
    });
    
    if (error) {
      console.error("Error scheduling report:", error);
      toast.error("Failed to schedule monthly report");
      return false;
    }
    
    toast.success("Monthly report scheduled successfully");
    return true;
  } catch (error) {
    console.error("Error scheduling monthly report:", error);
    toast.error("An unexpected error occurred");
    return false;
  }
};

// Fetch custom analytics with filters
export const fetchCustomAnalytics = async (filters: {
  startDate: string;
  endDate: string;
  platforms: string[];
  tracks?: string[];
  countries?: string[];
}): Promise<RoyaltyData[] | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('custom-analytics', {
      body: { ...filters }
    });
    
    if (error) {
      console.error("Error fetching custom analytics:", error);
      toast.error("Failed to load custom analytics");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error in fetchCustomAnalytics:", error);
    toast.error("An unexpected error occurred");
    return null;
  }
};
