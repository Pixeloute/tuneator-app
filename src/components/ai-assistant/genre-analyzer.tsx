
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioFileUploader } from "@/components/ai-assistant/audio-file-uploader";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/hooks/use-toast";
import { Wand2 } from "lucide-react";
import { AudioAnalysisPanel } from "@/components/ai-assistant/audio-analysis-panel";
import { GenreAnalysisPanel } from "@/components/ai-assistant/genre-analysis-panel";
import { MarketFitPanel } from "@/components/ai-assistant/market-fit-panel";
import { RecommendationsPanel } from "@/components/ai-assistant/recommendations-panel";
import { analyzeAudio, getMetadataSuggestions } from "@/services/google-api";

export const GenreAnalyzer = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [additionalMetadata, setAdditionalMetadata] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("attributes");
  
  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    setAnalysisResults(null);
    setAdditionalMetadata(null);
  };
  
  const handleAnalyze = async () => {
    if (!audioFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Perform audio analysis
      const results = await analyzeAudio(audioFile);
      setAnalysisResults(results);
      
      // Get additional metadata suggestions
      const additionalData = await getMetadataSuggestions(audioFile.name.replace(/\.[^/.]+$/, ""), "Unknown Artist");
      setAdditionalMetadata(additionalData);
      
      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed successfully",
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
  
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-6 space-y-4">
          <AudioFileUploader 
            onFileSelect={handleFileSelected} 
            file={audioFile}
            isAnalyzing={isAnalyzing}
            progress={isAnalyzing ? 60 : 0}
          />
          
          {audioFile && (
            <div className="flex justify-end">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className="bg-electric hover:bg-electric/90"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </Card>
      
      {analysisResults && additionalMetadata && (
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
              onReset={() => {
                setAudioFile(null);
                setAnalysisResults(null);
                setAdditionalMetadata(null);
              }}
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
      )}
    </div>
  );
};
