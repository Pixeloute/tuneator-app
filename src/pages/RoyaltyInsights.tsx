
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { RoyaltyDashboard } from "@/components/analytics/royalty-dashboard";
import { RoyaltyInsightsPanel } from "@/components/analytics/royalty-insights-panel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllRoyaltyData, PlatformRoyaltyData } from "@/services/revenue-service";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, PieChart, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const RoyaltyInsights = () => {
  const [platformData, setPlatformData] = useState<PlatformRoyaltyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<string>("6months");
  const [artistGenre, setArtistGenre] = useState<string>("Electronic");
  const [analysisTime, setAnalysisTime] = useState<string | null>(null);
  
  useEffect(() => {
    loadRoyaltyData();
  }, [timeRange]);
  
  const loadRoyaltyData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllRoyaltyData(timeRange);
      
      if (data) {
        setPlatformData(data);
      } else {
        toast.error("Failed to load royalty data");
      }
    } catch (error) {
      console.error("Error loading royalty data:", error);
      toast.error("Using demo data for visualization");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAnalyzeRoyalties = async () => {
    if (!platformData) {
      toast.error("No royalty data available to analyze");
      return;
    }
    
    setIsAnalyzing(true);
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('royalty-insights', {
        body: { 
          royaltyData: platformData, 
          timeframe: timeRange,
          artistGenre
        }
      });
      
      if (error) throw error;
      
      setInsightsData(data);
      setAnalysisTime(((Date.now() - startTime) / 1000).toFixed(2));
      
      toast.success("AI analysis complete!");
    } catch (error) {
      console.error("Error analyzing royalty data:", error);
      toast.error("Failed to generate insights");
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  return (
    <PageLayout>
      <div className="space-y-6 pb-16 max-w-[1920px] mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/analytics">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Analytics
              </Link>
            </Button>
            <h1 className="text-2xl font-bold">Royalty Insights AI Analyzer</h1>
          </div>
        </div>
        
        {/* Analysis Controls moved above as filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Analysis Filters</CardTitle>
            <CardDescription>Customize your royalty data view and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                <label className="text-sm font-medium block mb-2">Time Range</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1month">Last Month</SelectItem>
                    <SelectItem value="3months">Last 3 Months</SelectItem>
                    <SelectItem value="6months">Last 6 Months</SelectItem>
                    <SelectItem value="1year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto flex-1 min-w-[200px]">
                <label className="text-sm font-medium block mb-2">Primary Genre</label>
                <Select value={artistGenre} onValueChange={setArtistGenre}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Hip-Hop">Hip-Hop</SelectItem>
                    <SelectItem value="Electronic">Electronic</SelectItem>
                    <SelectItem value="R&B">R&B</SelectItem>
                    <SelectItem value="Country">Country</SelectItem>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Classical">Classical</SelectItem>
                    <SelectItem value="Folk">Folk</SelectItem>
                    <SelectItem value="Metal">Metal</SelectItem>
                    <SelectItem value="Indie">Indie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full sm:w-auto flex items-end">
                <Button 
                  className="w-full" 
                  onClick={handleAnalyzeRoyalties} 
                  disabled={isLoading || isAnalyzing || !platformData}
                >
                  {isAnalyzing ? (
                    <>Analyzing Royalties...</>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate AI Insights
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {analysisTime && (
              <p className="text-xs text-muted-foreground mt-4">
                Analysis completed in {analysisTime} seconds
              </p>
            )}
          </CardContent>
        </Card>
            
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          {/* Royalty Dashboard */}
          {platformData && (
            <RoyaltyDashboard />
          )}
          
          {/* Insights Panel */}
          {insightsData && (
            <RoyaltyInsightsPanel insightsData={insightsData} />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default RoyaltyInsights;
