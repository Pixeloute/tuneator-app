
import { PageLayout } from "@/components/layout/page-layout";
import { DisplayCardsDemo } from "@/components/ui/demo";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Insights = () => {
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
            <CardTitle>Featured Insights</CardTitle>
            <CardDescription>Discover important data trends and insights for your music</CardDescription>
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
