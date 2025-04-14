
import { ExternalLink, Music, Youtube, Database, Disc } from "lucide-react";
import type { EnrichedMetadata } from "@/services/types/shared-types";

interface LinksTabProps {
  metadata: EnrichedMetadata;
}

export const LinksTab = ({ metadata }: LinksTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">External Platform Links</h3>
      
      <div className="grid grid-cols-1 gap-2">
        {metadata.externalLinks?.spotify && (
          <a
            href={metadata.externalLinks.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
          >
            <Music className="h-5 w-5 text-[#1DB954]" />
            <span>View on Spotify</span>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </a>
        )}
        
        {metadata.externalLinks?.youtube && (
          <a
            href={metadata.externalLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
          >
            <Youtube className="h-5 w-5 text-[#FF0000]" />
            <span>View on YouTube</span>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </a>
        )}
        
        {metadata.externalLinks?.musicbrainz && (
          <a
            href={metadata.externalLinks.musicbrainz}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
          >
            <Database className="h-5 w-5 text-[#BA478F]" />
            <span>View on MusicBrainz</span>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </a>
        )}
        
        {metadata.externalLinks?.discogs && (
          <a
            href={metadata.externalLinks.discogs}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
          >
            <Disc className="h-5 w-5 text-[#333333]" />
            <span>View on Discogs</span>
            <ExternalLink className="h-4 w-4 ml-auto" />
          </a>
        )}
      </div>
      
      {/* Videos */}
      {metadata.videos && metadata.videos.length > 0 && (
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium">Related Videos</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {metadata.videos.slice(0, 4).map((video, index) => (
              <a
                key={index}
                href={video.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="relative pb-[56.25%] overflow-hidden rounded-md bg-muted">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Youtube className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-1 line-clamp-1">{video.title}</p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
