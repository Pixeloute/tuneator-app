
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { EnrichedMetadata } from "@/services/types/shared-types";

interface OverviewTabProps {
  metadata: EnrichedMetadata;
}

export const OverviewTab = ({ metadata }: OverviewTabProps) => {
  const { toast } = useToast();
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-4">
        {metadata.album?.artwork && (
          <img
            src={metadata.album.artwork}
            alt="Album Artwork"
            className="w-24 h-24 object-cover rounded-md"
          />
        )}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{metadata.title}</h3>
          {metadata.artists && metadata.artists.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              <span className="text-muted-foreground">by</span>
              {metadata.artists.map((artist, index) => (
                <span key={index} className="text-md">
                  {artist.name}
                  {index < metadata.artists!.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
          {metadata.album?.title && (
            <p className="text-sm text-muted-foreground">
              Album: {metadata.album.title}
            </p>
          )}
          {metadata.album?.releaseDate && (
            <p className="text-sm text-muted-foreground">
              Released: {metadata.album.releaseDate}
            </p>
          )}
        </div>
      </div>
      
      {/* Genres and Styles */}
      {(metadata.genres || metadata.styles) && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Genres & Styles</h4>
          <div className="flex flex-wrap gap-1">
            {metadata.genres?.map((genre, index) => (
              <Badge key={`genre-${index}`} variant="secondary">
                {genre}
              </Badge>
            ))}
            {metadata.styles?.map((style, index) => (
              <Badge key={`style-${index}`} variant="outline" className="bg-muted">
                {style}
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* ISRC */}
      {metadata.isrc && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">ISRC:</span>
          <code className="bg-muted px-1 py-0.5 rounded text-sm">
            {metadata.isrc}
          </code>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => copyToClipboard(metadata.isrc!, "ISRC")}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
