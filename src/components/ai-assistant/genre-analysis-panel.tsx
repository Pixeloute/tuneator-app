
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { GenreDistributionChart } from "@/components/ai-assistant/genre-distribution-chart";
import { Music, Tags } from "lucide-react";

interface GenreAnalysisPanelProps {
  additionalMetadata: any;
}

export const GenreAnalysisPanel = ({ additionalMetadata }: GenreAnalysisPanelProps) => {
  const genreConfidenceToArray = () => {
    if (!additionalMetadata || !additionalMetadata.genreConfidence) return [];
    
    return Object.entries(additionalMetadata.genreConfidence).map(([name, value]) => ({
      name,
      value: Number(value) * 100
    }));
  };
  
  const genreData = genreConfidenceToArray();
  
  return (
    <Card>
      <CardHeader>
        <div className="text-base flex items-center gap-2">
          <Music className="h-4 w-4 text-electric" />
          Genre Distribution
        </div>
      </CardHeader>
      <CardContent>
        <GenreDistributionChart genreData={genreData} />
        
        <div className="mt-4 space-y-2">
          <Label>Primary Genre</Label>
          <Select defaultValue={Object.entries(additionalMetadata.genreConfidence)[0]?.[0] || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary genre" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(additionalMetadata.genreConfidence).map(([genre]) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <Label className="mb-2 block">Recommended Tags</Label>
          <div className="flex flex-wrap gap-2">
            {additionalMetadata.recommendedTags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-muted">
                {tag}
              </Badge>
            ))}
            {additionalMetadata.moodTags.slice(0, 3).map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-electric/10 text-electric border-electric/20">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
