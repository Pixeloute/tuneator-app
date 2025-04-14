
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GenreDistributionChart } from "./genre-distribution-chart";
import { AudioAttributesChart } from "./audio-attributes-chart";
import { GenreData, AttributeData } from "./audio-analysis-utils";

interface AnalysisResultsDisplayProps {
  genreData: GenreData[];
  attributesData: AttributeData[];
  onReset: () => void;
  onApply: () => void;
}

export const AnalysisResultsDisplay = ({ 
  genreData, 
  attributesData, 
  onReset, 
  onApply 
}: AnalysisResultsDisplayProps) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="genres">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="genres">Genre Distribution</TabsTrigger>
          <TabsTrigger value="attributes">Audio Attributes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="genres" className="h-80 pt-4">
          <GenreDistributionChart genreData={genreData} />
        </TabsContent>
        
        <TabsContent value="attributes" className="h-80 pt-4">
          <AudioAttributesChart attributesData={attributesData} />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between mt-4">
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
