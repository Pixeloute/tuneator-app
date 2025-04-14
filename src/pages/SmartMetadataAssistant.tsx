
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { AudioUploadSection } from "@/components/ai-assistant/audio-upload-section";
import { MetadataEnrichmentPanel } from "@/components/ai-assistant/metadata-enrichment-panel";
import { SmartSuggestionsList } from "@/components/ai-assistant/smart-suggestions-list";
import { AnalysisTabs } from "@/components/ai-assistant/analysis-tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const SmartMetadataAssistant = () => {
  const { toast } = useToast();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [additionalMetadata, setAdditionalMetadata] = useState<any>({
    keywords: ["electronic", "ambient", "atmospheric", "cinematic", "downtempo", "dreamy"],
    similarArtists: ["Bonobo", "Jon Hopkins", "Tycho", "Four Tet", "Boards of Canada"],
    recommendedTags: ["chillout", "electronic", "ambient", "downtempo"],
    genreConfidence: {
      "Electronic": 0.85,
      "Ambient": 0.72,
      "Downtempo": 0.68,
      "Chillwave": 0.45,
      "IDM": 0.32
    },
    moodTags: ["relaxed", "introspective", "atmospheric", "dreamy", "smooth"],
    marketRecommendations: ["USA", "UK", "Germany", "Japan", "Australia"]
  });
  const [activeAnalysisTab, setActiveAnalysisTab] = useState("attributes");
  
  const handleTrackSelect = (trackId: string) => {
    setActiveTrack(trackId);
    toast({
      title: "Track Selected",
      description: `Selected track for AI analysis`,
    });
  };
  
  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveAnalysisTab("attributes");
    
    toast({
      title: "Analysis Complete",
      description: "AI analysis has finished processing your track",
    });
  };
  
  const resetAnalysis = () => {
    setAnalysisResults(null);
    setActiveTrack(null);
  };
  
  const handleEnrichmentComplete = () => {
    toast({
      title: "Metadata Enriched",
      description: "AI has enhanced your track's metadata",
    });
  };
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16 max-w-[1920px] mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/metadata">
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Metadata
                  </Link>
                </Button>
                <h1 className="text-2xl font-bold">Smart Metadata Assistant</h1>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <AudioUploadSection 
                  onAnalysisComplete={handleAnalysisComplete}
                />
                
                {analysisResults ? (
                  <AnalysisTabs 
                    analysisResults={analysisResults}
                    additionalMetadata={additionalMetadata}
                    activeTab={activeAnalysisTab}
                    setActiveTab={setActiveAnalysisTab}
                    resetAnalysis={resetAnalysis}
                  />
                ) : (
                  <MetadataEnrichmentPanel 
                    onEnrichmentComplete={handleEnrichmentComplete}
                  />
                )}
              </div>
              
              <div>
                <SmartSuggestionsList 
                  activeTrack={activeTrack}
                  onSelectTrack={handleTrackSelect}
                />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SmartMetadataAssistant;
