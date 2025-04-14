
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AudioFileUploader } from "@/components/ai-assistant/audio-file-uploader";
import { Spinner } from "@/components/ui/spinner";
import { Wand2 } from "lucide-react";
import { analyzeAudio } from "@/services/google-api";
import { toast } from "@/hooks/use-toast";

interface AudioUploadSectionProps {
  audioFile?: File | null;
  isAnalyzing?: boolean;
  onFileSelected?: (file: File) => void;
  onAnalyze?: () => void;
  onAnalysisComplete?: (results: any) => void;
}

export const AudioUploadSection = ({
  audioFile: propAudioFile,
  isAnalyzing: propIsAnalyzing,
  onFileSelected,
  onAnalyze: propOnAnalyze,
  onAnalysisComplete
}: AudioUploadSectionProps) => {
  const [audioFile, setAudioFile] = useState<File | null>(propAudioFile || null);
  const [isAnalyzing, setIsAnalyzing] = useState(propIsAnalyzing || false);
  
  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    if (onFileSelected) {
      onFileSelected(file);
    }
  };
  
  const handleAnalyze = async () => {
    if (!audioFile) return;
    
    if (propOnAnalyze) {
      propOnAnalyze();
      return;
    }
    
    setIsAnalyzing(true);
    toast({
      title: "Analysis Started",
      description: "Processing your audio file...",
    });
    
    try {
      const results = await analyzeAudio(audioFile);
      
      if (onAnalysisComplete) {
        onAnalysisComplete(results);
      }
      
      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed successfully",
      });
    } catch (error) {
      console.error("Error analyzing audio:", error);
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
  );
};
