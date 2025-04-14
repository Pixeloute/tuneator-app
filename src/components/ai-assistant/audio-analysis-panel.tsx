
import { AudioAttributesChart } from "@/components/ai-assistant/audio-attributes-chart";
import { Button } from "@/components/ui/button";
import { processAnalysisResults } from "@/components/ai-assistant/audio-analysis-utils";

interface AudioAnalysisPanelProps {
  analysisResults: any;
  onReset: () => void;
  onApply: () => void;
}

export const AudioAnalysisPanel = ({ 
  analysisResults,
  onReset,
  onApply 
}: AudioAnalysisPanelProps) => {
  const { attributesData } = processAnalysisResults(analysisResults);
  
  return (
    <div className="space-y-4">
      <AudioAttributesChart attributesData={attributesData} />
      
      <div className="p-4 bg-muted/20 rounded-md">
        <h3 className="text-base font-medium mb-2">Audio Characteristics Analysis</h3>
        <p className="text-sm text-muted-foreground">
          This track has high energy and danceability with moderate instrumentalness,
          making it suitable for workout, dance, and electronic playlists.
        </p>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" onClick={onReset}>
          Analyze Another Track
        </Button>
        
        <Button 
          variant="default" 
          className="bg-electric hover:bg-electric/90"
          onClick={onApply}
        >
          Apply to Metadata
        </Button>
      </div>
    </div>
  );
};
