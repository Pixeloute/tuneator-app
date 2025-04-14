
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { RoyaltyDashboard } from "@/components/analytics/royalty-dashboard";
import { GeographicalInsights } from "@/components/analytics/geographical-insights";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, Calendar, BarChart3, Share2 } from "lucide-react";

const Analytics = () => {
  const [activeView, setActiveView] = useState<"royalties" | "geography">("royalties");

  useEffect(() => {
    document.title = "Tuneator - Analytics & Insights";
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold">Analytics & Insights</h1>
                <p className="text-muted-foreground">Track your performance and royalty distribution</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === "royalties" ? "default" : "outline"}
                  onClick={() => setActiveView("royalties")}
                  className={activeView === "royalties" ? "bg-electric hover:bg-electric/90" : ""}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Royalty Dashboard
                </Button>
                <Button
                  variant={activeView === "geography" ? "default" : "outline"}
                  onClick={() => setActiveView("geography")}
                  className={activeView === "geography" ? "bg-electric hover:bg-electric/90" : ""}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Geographical Insights
                </Button>
              </div>
            </div>
            
            {activeView === "royalties" ? (
              <RoyaltyDashboard />
            ) : (
              <GeographicalInsights />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button variant="outline" className="flex items-center gap-2 justify-center py-6">
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Download Royalty Report</div>
                  <p className="text-xs text-muted-foreground">Export complete royalty data as CSV</p>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 justify-center py-6">
                <Calendar className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Schedule Monthly Report</div>
                  <p className="text-xs text-muted-foreground">Get insights delivered to your inbox</p>
                </div>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-2 justify-center py-6">
                <BarChart3 className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Custom Analytics</div>
                  <p className="text-xs text-muted-foreground">Build specialized reports and insights</p>
                </div>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
