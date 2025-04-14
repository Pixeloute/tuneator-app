
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
  // Ensure additionalMetadata is safe to use
  const safeMetadata = additionalMetadata || {};
  const genreConfidence = safeMetadata.genreConfidence || {};
  const recommendedTags = Array.isArray(safeMetadata.recommendedTags) ? safeMetadata.recommendedTags : [];
  const moodTags = Array.isArray(safeMetadata.moodTags) ? safeMetadata.moodTags : [];
  
  const genreConfidenceToArray = () => {
    if (!genreConfidence || typeof genreConfidence !== 'object') return [];
    
    return Object.entries(genreConfidence).map(([name, value]) => ({
      name,
      value: Number(value) * 100
    }));
  };
  
  const genreData = genreConfidenceToArray();
  const genreEntries = Object.entries(genreConfidence);
  const defaultGenre = genreEntries.length > 0 ? genreEntries[0][0] : "";
  
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
          <Select defaultValue={defaultGenre}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary genre" />
            </SelectTrigger>
            <SelectContent>
              {genreEntries.map(([genre]) => (
                <SelectItem key={genre} value={genre}>{genre}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="mt-4">
          <Label className="mb-2 block">Recommended Tags</Label>
          <div className="flex flex-wrap gap-2">
            {recommendedTags.map((tag: string) => (
              <Badge key={tag} variant="outline" className="bg-muted">
                {tag}
              </Badge>
            ))}
            {moodTags.slice(0, 3).map((tag: string) => (
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
