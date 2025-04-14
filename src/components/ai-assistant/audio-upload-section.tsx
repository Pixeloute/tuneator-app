
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AudioFileUploader } from "@/components/ai-assistant/audio-file-uploader";
import { Spinner } from "@/components/ui/spinner";
import { Wand2 } from "lucide-react";

interface AudioUploadSectionProps {
  audioFile: File | null;
  isAnalyzing: boolean;
  onFileSelected: (file: File) => void;
  onAnalyze: () => void;
}

export const AudioUploadSection = ({
  audioFile,
  isAnalyzing,
  onFileSelected,
  onAnalyze
}: AudioUploadSectionProps) => {
  return (
    <div className="space-y-4">
      <AudioFileUploader 
        onFileSelect={onFileSelected} 
        file={audioFile}
        isAnalyzing={isAnalyzing}
        progress={isAnalyzing ? 60 : 0}
      />
      
      {audioFile && (
        <div className="flex justify-end">
          <Button 
            onClick={onAnalyze} 
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
