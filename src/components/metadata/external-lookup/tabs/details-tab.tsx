
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import type { EnrichedMetadata } from "@/services/types/shared-types";

interface DetailsTabProps {
  metadata: EnrichedMetadata;
}

export const DetailsTab = ({ metadata }: DetailsTabProps) => {
  return (
    <div className="space-y-4">
      {/* Credits */}
      {metadata.credits && metadata.credits.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Credits</h4>
          <div className="border rounded-md divide-y">
            {metadata.credits.map((credit, index) => (
              <div key={index} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{credit.name}</span>
                </div>
                <Badge variant="outline">{credit.role}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Related Artists */}
      {metadata.relatedArtists && metadata.relatedArtists.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Related Artists</h4>
          <div className="flex flex-wrap gap-1">
            {metadata.relatedArtists.map((artist, index) => (
              <Badge key={index} className="bg-electric/10 text-electric border-electric/30">
                {artist.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Label Info */}
      {metadata.album?.label && (
        <div className="space-y-1">
          <h4 className="text-sm font-medium">Label</h4>
          <p>{metadata.album.label}</p>
        </div>
      )}
    </div>
  );
};
