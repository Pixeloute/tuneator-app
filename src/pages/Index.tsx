
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { StatusCard } from "@/components/dashboard/status-card";
import { MetadataHealthCard } from "@/components/dashboard/metadata-health-card";
import { RecentAssetsCard } from "@/components/dashboard/recent-assets-card";
import { RevenueChartCard } from "@/components/dashboard/revenue-chart-card";
import { RoyaltyFeedCard } from "@/components/dashboard/royalty-feed-card";
import { InsightCard } from "@/components/dashboard/insight-card";
import { Album, BarChart3, FileCheck, FileWarning, Users } from "lucide-react";

const Index = () => {
  useEffect(() => {
    document.title = "Tuneator - Dashboard";
  }, []);

  const metadataIssues = [
    { category: "Missing ISRC Codes", count: 2 },
    { category: "Incomplete Contributors", count: 5 },
    { category: "Missing Album Art", count: 1 },
    { category: "Registration Issues", count: 3 },
  ];
  
  const recentAssets = [
    {
      id: "1",
      name: "Midnight Dreams.wav",
      type: "audio" as const,
      date: "2 days ago",
      status: "complete" as const,
    },
    {
      id: "2",
      name: "Album Cover - Neon Horizons.jpg",
      type: "image" as const,
      date: "3 days ago",
      status: "complete" as const,
    },
    {
      id: "3",
      name: "Electric Sound - Promo Video.mp4",
      type: "video" as const,
      date: "5 days ago",
      status: "warning" as const,
    },
    {
      id: "4",
      name: "Urban Pulse.wav",
      type: "audio" as const,
      date: "1 week ago",
      status: "incomplete" as const,
    },
  ];
  
  const revenueData = [
    {
      month: "Jan",
      spotify: 320,
      apple: 220,
      youtube: 180,
      other: 120,
    },
    {
      month: "Feb",
      spotify: 380,
      apple: 250,
      youtube: 190,
      other: 140,
    },
    {
      month: "Mar",
      spotify: 350,
      apple: 210,
      youtube: 220,
      other: 110,
    },
    {
      month: "Apr",
      spotify: 410,
      apple: 290,
      youtube: 240,
      other: 130,
    },
    {
      month: "May",
      spotify: 460,
      apple: 310,
      youtube: 260,
      other: 170,
    },
    {
      month: "Jun",
      spotify: 520,
      apple: 350,
      youtube: 290,
      other: 220,
    },
  ];
  
  const royaltyEvents = [
    {
      id: "1",
      type: "payment" as const,
      title: "Quarterly royalty payment received",
      date: "June 15, 2023",
      amount: "1,245.78",
      source: "Spotify",
    },
    {
      id: "2",
      type: "usage" as const,
      title: "New streams detected for 'Midnight Dreams'",
      date: "June 10, 2023",
      source: "Apple Music",
      location: "USA, Canada, UK",
    },
    {
      id: "3",
      type: "registration" as const,
      title: "PRO registration completed",
      date: "June 5, 2023",
      source: "ASCAP",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <h1 className="text-2xl font-bold">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="Total Assets"
                value="128"
                description="Last 30 days"
                icon={Album}
                trend="up"
                trendValue="+12"
                colorScheme="electric"
              />
              <StatusCard
                title="Metadata Health"
                value="78%"
                description="8 issues found"
                icon={FileCheck}
                trend="up"
                trendValue="+5%"
                colorScheme="mint"
              />
              <StatusCard
                title="Total Revenue"
                value="$5,842"
                description="Year to date"
                icon={BarChart3}
                trend="up"
                trendValue="+18%"
                colorScheme="electric"
              />
              <StatusCard
                title="Contributors"
                value="24"
                icon={Users}
                description="Across 8 releases"
                colorScheme="mint"
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="col-span-1">
                <MetadataHealthCard score={78} issues={metadataIssues} />
              </div>
              <div className="col-span-1 lg:col-span-2 space-y-4">
                <RecentAssetsCard assets={recentAssets} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InsightCard
                    priority="high"
                    title="Missing Metadata"
                    description="5 tracks need ISRC codes for proper royalty tracking"
                    actionText="Review and Fix"
                    icon="warning"
                  />
                  <InsightCard
                    priority="medium"
                    title="Revenue Spike Detected"
                    description="Unusual activity from UK streams on Spotify"
                    actionText="View Analytics"
                    icon="info"
                  />
                </div>
              </div>
            </div>
            
            <RevenueChartCard data={revenueData} />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <RoyaltyFeedCard events={royaltyEvents} />
              </div>
              <div>
                <InsightCard
                  priority="low"
                  title="Metadata Validation Complete"
                  description="Your recent uploads have been validated successfully"
                  actionText="View Report"
                  icon="success"
                  className="h-full"
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
