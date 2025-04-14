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
import { MetadataProvider } from "@/contexts/metadata";
import { analyzeAudio } from "@/services/google-api";

const SmartMetadataAssistant = () => {
  const { toast } = useToast();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
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
  
  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    setAnalysisResults(null);
  };
  
  const handleAnalyze = async () => {
    if (!audioFile) return;
    
    setIsAnalyzing(true);
    try {
      const results = await analyzeAudio(audioFile);
      setAnalysisResults(results);
      setActiveAnalysisTab("attributes");
      
      toast({
        title: "Analysis Complete",
        description: "AI analysis has finished processing your track",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your track",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setAnalysisResults(null);
    setActiveTrack(null);
    setAudioFile(null);
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
            
            <MetadataProvider>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <AudioUploadSection 
                    audioFile={audioFile}
                    isAnalyzing={isAnalyzing}
                    onFileSelected={handleFileSelected}
                    onAnalyze={handleAnalyze}
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
                    <MetadataEnrichmentPanel />
                  )}
                </div>
                
                <div>
                  <SmartSuggestionsList 
                    activeTrack={activeTrack}
                    onSelectTrack={handleTrackSelect}
                  />
                </div>
              </div>
            </MetadataProvider>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SmartMetadataAssistant;
