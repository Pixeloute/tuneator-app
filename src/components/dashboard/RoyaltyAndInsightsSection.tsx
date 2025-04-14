
import { RoyaltyFeedCard } from "@/components/dashboard/royalty-feed-card";
import { InsightCard } from "@/components/dashboard/insight-card";

export const RoyaltyAndInsightsSection = () => {
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
  );
};
