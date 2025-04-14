
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AudioUploadSection } from "@/components/ai-assistant/audio-upload-section";
import { AnalysisTabs } from "@/components/ai-assistant/analysis-tabs";
import { supabase } from "@/integrations/supabase/client";

// Default empty objects for analysis results to prevent undefined errors
const DEFAULT_ANALYSIS = {
  genres: [],
  danceability: 0,
  energy: 0,
  instrumentalness: 0,
  acousticness: 0,
  valence: 0
};

const DEFAULT_METADATA = {
  genres: [],
  recommendedTags: [],
  moodTags: [],
  genreConfidence: {}
};

export const GenreAnalyzer = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [additionalMetadata, setAdditionalMetadata] = useState<any>(null);
  const [aiInsights, setAiInsights] = useState<{ openai: string | null; gemini: string | null }>({
    openai: null,
    gemini: null
  });
  const [activeTab, setActiveTab] = useState("attributes");
  
  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    setAnalysisResults(null);
    setAdditionalMetadata(null);
    setAiInsights({ openai: null, gemini: null });
  };
  
  const handleAnalyze = async () => {
    if (!audioFile) {
      toast({
        title: "No File Selected",
        description: "Please select an audio file first",
        variant: "destructive",
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Call our Supabase Edge Function that handles both OpenAI and Gemini
      const { data: aiAnalysis, error } = await supabase.functions.invoke('ai-metadata-analysis', {
        body: { 
          audioFile: audioFile.name, // In a real implementation, you'd send the actual audio data
          analysisType: 'full'
        }
      });

      if (error) throw error;

      // Update the analysis results with AI insights
      setAiInsights({
        openai: aiAnalysis.openai,
        gemini: aiAnalysis.gemini
      });

      // Set default analysis data (in a real implementation, this would come from audio analysis)
      setAnalysisResults(DEFAULT_ANALYSIS);
      setAdditionalMetadata(DEFAULT_METADATA);
      
      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed by both OpenAI and Gemini",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your track",
        variant: "destructive",
      });
      
      // Set default objects instead of null in case of error
      setAnalysisResults(DEFAULT_ANALYSIS);
      setAdditionalMetadata(DEFAULT_METADATA);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const resetAnalysis = () => {
    setAudioFile(null);
    setAnalysisResults(null);
    setAdditionalMetadata(null);
    setAiInsights({ openai: null, gemini: null });
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
      
      {(analysisResults || additionalMetadata) && (
        <AnalysisTabs 
          analysisResults={analysisResults || DEFAULT_ANALYSIS}
          additionalMetadata={additionalMetadata || DEFAULT_METADATA}
          aiInsights={aiInsights}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          resetAnalysis={resetAnalysis}
        />
      )}
    </div>
  );
};
