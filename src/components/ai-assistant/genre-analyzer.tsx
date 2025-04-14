
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeAudio, GoogleAnalysisResponse } from "@/services/google-api";
import { AudioFileUploader } from "./audio-file-uploader";
import { AnalysisResultsDisplay } from "./analysis-results-display";
import { processAnalysisResults } from "./audio-analysis-utils";

export const GenreAnalyzer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<GoogleAnalysisResponse | null>(null);
  
  const { genreData, attributesData } = processAnalysisResults(analysisResults);
  
  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };
  
  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    // Set up a progress simulation interval
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return newProgress;
      });
    }, 150);
    
    try {
      // Call the Google API service
      const results = await analyzeAudio(file);
      setAnalysisResults(results);
      
      // Complete the progress and show success
      clearInterval(progressInterval);
      setProgress(100);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed successfully using Google AI!",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      clearInterval(progressInterval);
      setProgress(0);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your track. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleReset = () => {
    setFile(null);
    setAnalysisComplete(false);
    setProgress(0);
    setAnalysisResults(null);
  };
  
  const handleApply = () => {
    toast({
      title: "Metadata Updated",
      description: "Genre and audio attributes have been applied to the track metadata.",
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music2 className="h-5 w-5 text-electric" />
          <span>Google AI Audio Analyzer</span>
        </CardTitle>
        <CardDescription>
          Upload your audio file to analyze its genre and audio characteristics using Google AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysisComplete ? (
          <div className="space-y-6">
            <AudioFileUploader 
              onFileSelect={handleFileSelect}
              isAnalyzing={isAnalyzing}
              progress={progress}
              file={file}
            />
            
            <div className="flex justify-end">
              <button 
                className="bg-electric hover:bg-electric/90 text-white px-4 py-2 rounded-md"
                disabled={!file || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Track"}
              </button>
            </div>
          </div>
        ) : (
          <AnalysisResultsDisplay 
            genreData={genreData}
            attributesData={attributesData}
            onReset={handleReset}
            onApply={handleApply}
          />
        )}
      </CardContent>
    </Card>
  );
};
