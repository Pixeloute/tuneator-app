
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Globe, Headphones } from "lucide-react";

interface MarketFitPanelProps {
  additionalMetadata: any;
}

export const MarketFitPanel = ({ additionalMetadata }: MarketFitPanelProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="text-base flex items-center gap-2">
          <Globe className="h-4 w-4 text-mint" />
          Market Recommendations
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-2 block">Target Markets</Label>
          <div className="flex flex-wrap gap-2">
            {additionalMetadata.marketRecommendations.map((market: string) => (
              <Badge key={market} variant="outline" className="bg-mint/10 text-mint border-mint/20">
                {market}
              </Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            These markets show the highest affinity for your genre and style of music.
          </p>
        </div>
        
        <div>
          <Label className="mb-2 block">Mood Classification</Label>
          <div className="flex flex-wrap gap-2">
            {additionalMetadata.moodTags.map((mood: string) => (
              <Badge key={mood} variant="outline" className="bg-secondary">
                {mood}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label className="mb-2 block">Playlist Potential</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-electric" />
                  <span className="text-sm font-medium">Chillout & Ambient</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">High match potential</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-electric" />
                  <span className="text-sm font-medium">Electronic Focus</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">High match potential</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-mint" />
                  <span className="text-sm font-medium">Study & Concentration</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Medium match potential</p>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Headphones className="h-4 w-4 text-mint" />
                  <span className="text-sm font-medium">Atmospheric Electronic</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Medium match potential</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
