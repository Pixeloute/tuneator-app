
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AudioUploadSection } from "@/components/ai-assistant/audio-upload-section";
import { AnalysisTabs } from "@/components/ai-assistant/analysis-tabs";
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
  
  const resetAnalysis = () => {
    setAudioFile(null);
    setAnalysisResults(null);
    setAdditionalMetadata(null);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <div className="p-6 space-y-4">
          <AudioUploadSection
            audioFile={audioFile}
            isAnalyzing={isAnalyzing}
            onFileSelected={handleFileSelected}
            onAnalyze={handleAnalyze}
          />
        </div>
      </Card>
      
      {analysisResults && additionalMetadata && (
        <AnalysisTabs 
          analysisResults={analysisResults}
          additionalMetadata={additionalMetadata}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          resetAnalysis={resetAnalysis}
        />
      )}
    </div>
  );
};
