
import { MetadataHealthCard } from "@/components/dashboard/metadata-health-card";
import { RecentAssetsCard } from "@/components/dashboard/recent-assets-card";
import { InsightCard } from "@/components/dashboard/insight-card";

export const MetadataAndAssetsSection = () => {
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
  
  return (
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
  );
};
