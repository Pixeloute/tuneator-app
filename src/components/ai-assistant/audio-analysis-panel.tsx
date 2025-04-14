
import { AudioAttributesChart } from "@/components/ai-assistant/audio-attributes-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  
  // Generate a dynamic analysis description based on the top attributes
  const getAnalysisDescription = () => {
    const sortedAttributes = [...attributesData].sort((a, b) => b.value - a.value);
    const topAttributes = sortedAttributes.slice(0, 2);
    const midAttribute = sortedAttributes[2];
    
    return `This track has high ${topAttributes[0]?.name.toLowerCase()} and ${topAttributes[1]?.name.toLowerCase()} with moderate ${midAttribute?.name.toLowerCase()}, making it suitable for various playlist types including ${getRecommendedPlaylists(sortedAttributes)}.`;
  };
  
  const getRecommendedPlaylists = (attributes: typeof attributesData) => {
    const playlists = [];
    
    if (attributes.find(a => a.name === "Energy")?.value || 0 > 60) {
      playlists.push("workout");
    }
    
    if (attributes.find(a => a.name === "Danceability")?.value || 0 > 60) {
      playlists.push("dance");
    }
    
    if (attributes.find(a => a.name === "Instrumentalness")?.value || 0 > 50) {
      playlists.push("focus");
    }
    
    if (attributes.find(a => a.name === "Acousticness")?.value || 0 > 60) {
      playlists.push("acoustic");
    }
    
    return playlists.join(", ") || "electronic";
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-0">
          <h3 className="text-base font-medium">Audio Characteristics Visualization</h3>
        </CardHeader>
        <CardContent>
          <AudioAttributesChart attributesData={attributesData} />
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <h3 className="text-base font-medium mb-2">Audio Characteristics Analysis</h3>
          <p className="text-sm text-muted-foreground">
            {getAnalysisDescription()}
          </p>
        </CardContent>
      </Card>
      
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
