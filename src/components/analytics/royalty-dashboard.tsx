
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { DollarSign, Calendar, BarChart3 } from "lucide-react";
import { fetchAllRoyaltyData, downloadRoyaltyReport, PlatformRoyaltyData } from "@/services/revenue-service";
import { CustomAnalyticsModal } from "./custom-analytics-modal";
import { ScheduleReportModal } from "./schedule-report-modal";
import { KpiCards } from "./dashboard/kpi-cards";
import { RevenueOverview } from "./dashboard/revenue-overview";
import { StreamsAnalysis } from "./dashboard/streams-analysis";
import { RevenueProjection } from "./dashboard/revenue-projection";
import { toast } from "sonner";

export function RoyaltyDashboard() {
  const [timeRange, setTimeRange] = useState<string>("6months");
  const [platformData, setPlatformData] = useState<PlatformRoyaltyData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [showAnalyticsModal, setShowAnalyticsModal] = useState<boolean>(false);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);
  
  useEffect(() => {
    const loadRoyaltyData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchAllRoyaltyData(timeRange);
        if (data) {
          setPlatformData(data);
        }
      } catch (error) {
        console.error("Failed to load royalty data:", error);
        toast.error("Failed to load royalty data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoyaltyData();
  }, [timeRange]);
  
  const handleDownloadReport = async () => {
    if (platformData) {
      await downloadRoyaltyReport(platformData);
    } else {
      toast.error("No data available to download");
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Royalty Dashboard</CardTitle>
            <CardDescription>
              Track your earnings across streaming platforms
              {platformData && (
                <span className="text-xs text-muted-foreground block mt-1">
                  Last updated: {new Date(platformData.lastUpdated).toLocaleString()}
                </span>
              )}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="time-range">Time Range:</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="time-range" className="w-[160px]">
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
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-[350px] w-full" />
          </>
        ) : !platformData ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-medium">No royalty data available</h3>
            <p className="text-muted-foreground mt-2">
              We couldn't retrieve your royalty data at this time. Please check your API connections
              or try again later.
            </p>
          </div>
        ) : (
          <>
            <KpiCards platformData={platformData} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
                <TabsTrigger value="streams">Streams Analysis</TabsTrigger>
                <TabsTrigger value="projection">Revenue Projection</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <RevenueOverview platformData={platformData} />
              </TabsContent>
              
              <TabsContent value="streams" className="space-y-4">
                <StreamsAnalysis platformData={platformData} />
              </TabsContent>
              
              <TabsContent value="projection" className="space-y-4">
                <RevenueProjection platformData={platformData} />
              </TabsContent>
            </Tabs>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleDownloadReport}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Download Royalty Report</h3>
                    <p className="text-xs text-muted-foreground">Export complete royalty data as CSV</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShow

ScheduleModal(true)}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Schedule Monthly Report</h3>
                    <p className="text-xs text-muted-foreground">Get insights delivered to your inbox</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowAnalyticsModal(true)}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                    <BarChart3 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">Custom Analytics</h3>
                    <p className="text-xs text-muted-foreground">Build specialized reports and insights</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
      
      <CustomAnalyticsModal open={showAnalyticsModal} onOpenChange={setShowAnalyticsModal} />
      <ScheduleReportModal open={showScheduleModal} onOpenChange={setShowScheduleModal} />
    </Card>
  );
}
