
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Sparkles } from "lucide-react";

interface AiInsightsPanelProps {
  openaiInsights: string | null;
  geminiInsights: string | null;
}

export const AiInsightsPanel = ({ openaiInsights, geminiInsights }: AiInsightsPanelProps) => {
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-electric" />
          AI Analysis Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              OpenAI Analysis
            </TabsTrigger>
            <TabsTrigger value="gemini" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Gemini Analysis
            </TabsTrigger>
          </TabsList>
          <TabsContent value="openai" className="mt-4">
            <div className="prose dark:prose-invert">
              {openaiInsights ? (
                <p className="text-sm whitespace-pre-line">{openaiInsights}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No OpenAI analysis available</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="gemini" className="mt-4">
            <div className="prose dark:prose-invert">
              {geminiInsights ? (
                <p className="text-sm whitespace-pre-line">{geminiInsights}</p>
              ) : (
                <p className="text-sm text-muted-foreground">No Gemini analysis available</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
