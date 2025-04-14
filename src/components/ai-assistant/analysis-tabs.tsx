
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioAnalysisPanel } from "@/components/ai-assistant/audio-analysis-panel";
import { GenreAnalysisPanel } from "@/components/ai-assistant/genre-analysis-panel";
import { MarketFitPanel } from "@/components/ai-assistant/market-fit-panel";
import { RecommendationsPanel } from "@/components/ai-assistant/recommendations-panel";
import { toast } from "@/hooks/use-toast";

interface AnalysisTabsProps {
  analysisResults: any;
  additionalMetadata: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  resetAnalysis: () => void;
}

export const AnalysisTabs = ({
  analysisResults,
  additionalMetadata,
  activeTab,
  setActiveTab,
  resetAnalysis
}: AnalysisTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="attributes">Audio Attributes</TabsTrigger>
        <TabsTrigger value="genres">Genre Analysis</TabsTrigger>
        <TabsTrigger value="market">Market Fit</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>
      
      <TabsContent value="attributes" className="mt-4 space-y-4">
        <AudioAnalysisPanel 
          analysisResults={analysisResults}
          onReset={resetAnalysis}
          onApply={() => {
            toast({
              title: "Applied Analysis",
              description: "Audio analysis has been applied to your track",
            });
          }}
        />
      </TabsContent>
      
      <TabsContent value="genres" className="mt-4 space-y-4">
        <GenreAnalysisPanel 
          additionalMetadata={additionalMetadata} 
        />
      </TabsContent>
      
      <TabsContent value="market" className="mt-4 space-y-4">
        <MarketFitPanel 
          additionalMetadata={additionalMetadata}
        />
      </TabsContent>
      
      <TabsContent value="recommendations" className="mt-4 space-y-4">
        <RecommendationsPanel 
          additionalMetadata={additionalMetadata}
        />
      </TabsContent>
    </Tabs>
  );
};
