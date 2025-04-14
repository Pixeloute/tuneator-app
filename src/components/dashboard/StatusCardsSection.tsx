
import { StatusCard } from "@/components/dashboard/status-card";
import { Album, BarChart3, FileCheck, Users } from "lucide-react";

export const StatusCardsSection = () => {
  return (
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
  );
};
