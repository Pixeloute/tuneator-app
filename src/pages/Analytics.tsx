import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { RoyaltyDashboard } from "@/components/analytics/royalty-dashboard";
import { GeographicalInsights } from "@/components/analytics/geographical-insights";
import { Button } from "@/components/ui/button";
import { BarChart3, Share2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

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
          <main className="p-4 md:p-6 space-y-6 pb-16 max-w-[1920px] mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Analytics</h1>
              
              <Button asChild>
                <Link to="/royalty-insights">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Royalty Insights
                </Link>
              </Button>
            </div>
            
            {activeView === "royalties" ? (
              <RoyaltyDashboard />
            ) : (
              <GeographicalInsights />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
