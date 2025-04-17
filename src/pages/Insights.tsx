
import { PageLayout } from "@/components/layout/page-layout";
import { DisplayCardsDemo } from "@/components/ui/demo";
import DisplayCards, { createInsightCards } from "@/components/ui/display-cards";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Insights = () => {
  // Create custom insight cards with various themes
  const royaltyInsights = createInsightCards("electric");
  const metadataInsights = createInsightCards("mint");
  const audienceInsights = createInsightCards("gradient");
  
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
            <h1 className="text-2xl font-bold">Insights</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Royalty Insights</CardTitle>
            <CardDescription>Revenue trends and performance metrics for your music</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[400px] w-full items-center justify-center">
              <div className="w-full max-w-3xl">
                <DisplayCards cards={royaltyInsights} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Metadata Health</CardTitle>
            <CardDescription>Insights about your catalog's metadata quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[400px] w-full items-center justify-center">
              <div className="w-full max-w-3xl">
                <DisplayCards cards={metadataInsights} variant="mint" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Audience Analytics</CardTitle>
            <CardDescription>Discover key trends about your listeners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[400px] w-full items-center justify-center">
              <div className="w-full max-w-3xl">
                <DisplayCards cards={audienceInsights} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Display Card Variants</CardTitle>
            <CardDescription>Complete showcase of all available card styles</CardDescription>
          </CardHeader>
          <CardContent>
            <DisplayCardsDemo />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Insights;
