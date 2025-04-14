
import { AudioAttributesChart } from "@/components/ai-assistant/audio-attributes-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { processAnalysisResults } from "@/components/ai-assistant/audio-analysis-utils";
import { useMetadata } from "@/contexts/metadata";
import { MetadataFormState } from "@/contexts/metadata/types";
import { toast } from "@/hooks/use-toast";

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
  // Try to use the metadata context, but provide fallback values if not available
  const metadata = useMetadata();
  const { updateForm, formState } = metadata || { updateForm: null, formState: {} };
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
  
  const handleApplyToMetadata = () => {
    if (!updateForm) {
      toast({
        title: "Cannot Apply Analysis",
        description: "Metadata context is not available",
        variant: "destructive",
      });
      return;
    }
    
    if (updateForm && analysisResults) {
      // Apply genre information if available
      if (analysisResults.genres && analysisResults.genres.length > 0) {
        // Update primary genre with first genre
        updateForm('genre', analysisResults.genres[0]);
        
        // If there's a second genre, set it as secondary
        if (analysisResults.genres.length > 1) {
          updateForm('secondaryGenre', analysisResults.genres[1]);
        }
        
        // Store full genres array if supported
        if ('genres' in formState) {
          updateForm('genres' as keyof MetadataFormState, analysisResults.genres.slice(0, 3));
        }
      }
      
      // Apply mood information if available
      if (analysisResults.mood && analysisResults.mood.length > 0) {
        updateForm('mood', analysisResults.mood.join(', '));
      }
      
      // Add analysis description to the track notes if supported
      const analysisNote = getAnalysisDescription();
      if ('notes' in formState) {
        const updatedNotes = formState.notes 
          ? `${formState.notes}\n\nAI Analysis: ${analysisNote}`
          : `AI Analysis: ${analysisNote}`;
        
        updateForm('notes' as keyof MetadataFormState, updatedNotes);
      }
      
      toast({
        title: "Analysis Applied",
        description: "Audio analysis has been applied to your track metadata",
      });
      
      onApply();
    }
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
          onClick={handleApplyToMetadata}
        >
          Apply to Metadata
        </Button>
      </div>
    </div>
  );
};
