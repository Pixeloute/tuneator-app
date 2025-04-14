
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { searchRecordings, searchArtists, MusicBrainzRecording, MusicBrainzArtist } from "@/services/musicbrainz-api";
import { toast } from "@/hooks/use-toast";

interface MusicBrainzSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (data: { 
    title?: string;
    artist?: string;
    isrc?: string;
    duration?: number;
  }) => void;
}

export function MusicBrainzSearchModal({ isOpen, onClose, onSelect }: MusicBrainzSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recordings, setRecordings] = useState<MusicBrainzRecording[]>([]);
  const [artists, setArtists] = useState<MusicBrainzArtist[]>([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const [recordingsData, artistsData] = await Promise.all([
        searchRecordings(searchQuery),
        searchArtists(searchQuery)
      ]);

      setRecordings(recordingsData);
      setArtists(artistsData);
    } catch (error) {
      console.error("MusicBrainz search error:", error);
      toast({
        title: "Search Error",
        description: "Failed to fetch results from MusicBrainz",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (recording: MusicBrainzRecording) => {
    onSelect({
      title: recording.title,
      artist: recording.artist_credit?.[0]?.name,
      isrc: recording.isrcs?.[0],
      duration: recording.length
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Search MusicBrainz</DialogTitle>
          <DialogDescription>
            Search for tracks and artists to auto-fill metadata
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search by track or artist name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {recordings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recordings</h3>
              <div className="rounded-md border divide-y">
                {recordings.slice(0, 5).map((recording) => (
                  <div
                    key={recording.id}
                    className="p-4 hover:bg-secondary/50 cursor-pointer"
                    onClick={() => handleSelect(recording)}
                  >
                    <div className="font-medium">{recording.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {recording.artist_credit?.[0]?.name}
                      {recording.isrcs?.length ? ` • ISRC: ${recording.isrcs[0]}` : ""}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {artists.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Artists</h3>
              <div className="rounded-md border divide-y">
                {artists.slice(0, 3).map((artist) => (
                  <div key={artist.id} className="p-4">
                    <div className="font-medium">{artist.name}</div>
                    {artist.country && (
                      <div className="text-sm text-muted-foreground">
                        Country: {artist.country}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
