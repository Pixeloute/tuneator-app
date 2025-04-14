
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AudioUploadSection } from "@/components/ai-assistant/audio-upload-section";
import { AnalysisTabs } from "@/components/ai-assistant/analysis-tabs";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_ANALYSIS = {
  genres: [],
  danceability: 0,
  energy: 0,
  instrumentalness: 0,
  acousticness: 0,
  valence: 0,
  openaiAnalysis: null,
  geminiAnalysis: null
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
  const [activeTab, setActiveTab] = useState("attributes");

  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    setAnalysisResults(null);
    setAdditionalMetadata(null);
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
      // Call our Supabase Edge Function for AI analysis
      const { data: aiAnalysis, error } = await supabase.functions.invoke('ai-metadata-analysis', {
        body: { 
          audioFile: audioFile.name,
          analysisType: 'full'
        }
      });

      if (error) throw error;

      // Update the analysis results with AI insights
      setAnalysisResults({
        ...DEFAULT_ANALYSIS,
        ...aiAnalysis.audioAnalysis,
        openaiAnalysis: aiAnalysis.openai,
        geminiAnalysis: aiAnalysis.gemini
      });

      setAdditionalMetadata({
        ...DEFAULT_METADATA,
        genres: aiAnalysis.genres || [],
        recommendedTags: aiAnalysis.recommendedTags || [],
        moodTags: aiAnalysis.moodTags || [],
        genreConfidence: aiAnalysis.genreConfidence || {}
      });

      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed by both OpenAI and Google Gemini",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your track",
        variant: "destructive",
      });

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
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          resetAnalysis={resetAnalysis}
        />
      )}
    </div>
  );
};
