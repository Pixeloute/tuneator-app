
import { AIAssistantChat } from "@/components/metadata/ai-assistant-chat";
import { RevenueKpiCard } from "@/components/analytics/dashboard/cards/revenue-kpi-card";
import { MetadataHealthCard } from "@/components/dashboard/metadata-health-card";
import { RecentAssetsCard } from "@/components/dashboard/recent-assets-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FeatureFlag, useExperimentVariant } from "@/lib/feature-flags";

const mockAssets = [
  { id: "1", name: "Midnight Dreams", type: "audio" as const, date: "2024-06-01", status: "complete" as const },
  { id: "2", name: "Cover Art - MD", type: "image" as const, date: "2024-06-01", status: "complete" as const },
  { id: "3", name: "Collab Agreement", type: "document" as const, date: "2024-05-28", status: "warning" as const },
];

const mockIssues = [
  { category: "Missing ISRC", count: 1 },
  { category: "Genre Tag", count: 2 },
  { category: "Collaborator", count: 0 },
];

export default function Index() {
  const [showBanner, setShowBanner] = useState(true);
  const variant = useExperimentVariant(FeatureFlag.AIDETECTIVE_EXPERIMENT);

  if (variant !== 'ai_detective') {
    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-background justify-center">
        <main className="w-full max-w-6xl flex flex-col items-center justify-center mt-24 px-2">
          <h1 className="text-3xl font-bold mb-4">Welcome to Tuneator</h1>
          <p className="text-muted-foreground text-lg">Your dashboard and analytics are available as usual.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-background">
      {showBanner && (
        <div className="w-full max-w-3xl mt-8 mb-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg flex-1">🎉 Meet the new AI Detective</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowBanner(false)}>
                Dismiss
              </Button>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Tuneator is now conversation-first. Ask the AI Detective about your artists, revenue, or metadata. All legacy features are still here.
            </CardContent>
          </Card>
        </div>
      )}
      <main className="w-full max-w-6xl flex flex-col md:flex-row gap-8 mt-4 px-2">
        <section className="flex-1 flex flex-col gap-6">
          <AIAssistantChat />
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Button size="sm" variant="outline">Ask about Artist</Button>
              <Button size="sm" variant="outline">Explain Revenue Drop</Button>
              <Button size="sm" variant="outline">Fix Metadata Issues</Button>
              <Button size="sm" variant="outline">Show Trending Tracks</Button>
            </CardContent>
          </Card>
        </section>
        <aside className="flex flex-col gap-6 w-full md:w-[340px]">
          <RevenueKpiCard totalRevenue="18,420" revenueGrowth="12.5" />
          <MetadataHealthCard score={94} issues={mockIssues} />
          <RecentAssetsCard assets={mockAssets} />
        </aside>
      </main>
    </div>
  );
}
