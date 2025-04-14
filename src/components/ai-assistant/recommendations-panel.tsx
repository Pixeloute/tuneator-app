
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tags, User, Wand2 } from "lucide-react";

interface RecommendationsPanelProps {
  additionalMetadata: any;
}

export const RecommendationsPanel = ({ additionalMetadata }: RecommendationsPanelProps) => {
  const genreConfidenceToArray = () => {
    if (!additionalMetadata || !additionalMetadata.genreConfidence) return [];
    
    return Object.entries(additionalMetadata.genreConfidence).map(([name, value]) => ({
      name,
      value: Number(value) * 100
    }));
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="text-base flex items-center gap-2">
          <Tags className="h-4 w-4 text-electric" />
          Metadata Enhancement Suggestions
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block">Recommended Keywords</Label>
          <div className="flex flex-wrap gap-2">
            {additionalMetadata.keywords.map((keyword: string) => (
              <Badge key={keyword} variant="outline" className="bg-secondary">
                {keyword}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Add these keywords to your track metadata to improve discoverability.
          </p>
        </div>
        
        <div>
          <Label className="mb-2 block">Similar Artists</Label>
          <div className="flex flex-wrap gap-2">
            {additionalMetadata.similarArtists.map((artist: string) => (
              <div key={artist} className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-md">
                <User className="h-3 w-3" />
                <span>{artist}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Your track may appeal to fans of these artists.
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">AI Recommendations</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20 mt-0.5">Tip</Badge>
              <span>Add "{additionalMetadata.moodTags[0]}" and "{additionalMetadata.moodTags[1]}" as mood descriptors</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20 mt-0.5">Tip</Badge>
              <span>Register for royalty collection in {additionalMetadata.marketRecommendations.slice(0, 3).join(", ")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="bg-electric/10 text-electric border-electric/20 mt-0.5">Action</Badge>
              <span>Consider creating a "{additionalMetadata.recommendedTags[0]}" alternative mix to maximize playlist potential</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="bg-electric/10 text-electric border-electric/20 mt-0.5">Action</Badge>
              <span>Target pitching to curators of {genreConfidenceToArray()[0]?.name || "Electronic"} playlists</span>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-electric hover:bg-electric/90">
          <Wand2 className="h-4 w-4 mr-2" />
          Apply Metadata Suggestions
        </Button>
      </CardFooter>
    </Card>
  );
};
