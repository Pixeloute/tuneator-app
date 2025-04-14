
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Upload, Brain } from "lucide-react";

export interface AudioFileUploaderProps {
  onFileSelect: (file: File) => void;
  onFileSelected?: (file: File) => void; // For backward compatibility
  isAnalyzing?: boolean;
  progress?: number;
  file?: File | null;
}

export const AudioFileUploader = ({ 
  onFileSelect, 
  onFileSelected, 
  isAnalyzing = false, 
  progress = 0, 
  file = null 
}: AudioFileUploaderProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Support both callback props
      onFileSelect(selectedFile);
      if (onFileSelected) onFileSelected(selectedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <div className="flex flex-col items-center">
          <Upload className="h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">Upload Audio File</h3>
          <p className="text-sm text-muted-foreground mb-4">WAV, MP3, AIFF or FLAC, max 15MB</p>
          <input
            id="file-upload"
            type="file"
            accept=".wav,.mp3,.aiff,.flac"
            className="hidden"
            onChange={handleFileChange}
          />
          <label htmlFor="file-upload">
            <Button variant="outline" className="cursor-pointer" asChild>
              <span>Select File</span>
            </Button>
          </label>
        </div>
        {file && (
          <div className="mt-4 text-sm">
            <span className="font-medium">Selected file:</span> {file.name}
          </div>
        )}
      </div>
      
      {isAnalyzing && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-electric animate-pulse" />
              <Label>Google AI analyzing audio patterns...</Label>
            </div>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};
