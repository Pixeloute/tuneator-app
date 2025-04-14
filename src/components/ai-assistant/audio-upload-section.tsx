
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AudioFileUploader } from "@/components/ai-assistant/audio-file-uploader";
import { Spinner } from "@/components/ui/spinner";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioUploadSectionProps {
  audioFile?: File | null;
  isAnalyzing?: boolean;
  onFileSelected?: (file: File) => void;
  onAnalyze?: () => void;
}

export const AudioUploadSection = ({
  audioFile: propAudioFile,
  isAnalyzing: propIsAnalyzing,
  onFileSelected,
  onAnalyze
}: AudioUploadSectionProps) => {
  const { toast } = useToast();
  const [audioFile, setAudioFile] = useState<File | null>(propAudioFile || null);
  const [isAnalyzing, setIsAnalyzing] = useState(propIsAnalyzing || false);
  
  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    if (onFileSelected) {
      onFileSelected(file);
    }
  };
  
  const handleAnalyze = () => {
    if (!audioFile) {
      toast({
        title: "No File Selected",
        description: "Please upload an audio file first",
        variant: "destructive",
      });
      return;
    }
    
    if (onAnalyze) {
      onAnalyze();
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

