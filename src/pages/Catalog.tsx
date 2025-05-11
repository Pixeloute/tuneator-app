
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { CatalogTabs } from "@/components/catalog/catalog-tabs";
import { mockTrackData } from "@/components/catalog/mock-data";
import { TrackData } from "@/types/catalog-types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SpotifyIcon } from "@/components/icons/SpotifyIcon";
import { getSpotifyPlaylist, SpotifyPlaylist, SpotifyTrack } from "@/services/spotify-api";

const Catalog = () => {
  useEffect(() => {
    document.title = "Tuneator - Catalog";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTracks, setFilteredTracks] = useState<TrackData[]>(mockTrackData);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterTracks(term);
  };

  const filterTracks = (term: string) => {
    // Safety check for mockTrackData
    const safeTrackData = Array.isArray(mockTrackData) ? mockTrackData : [];
    
    if (!term) {
      setFilteredTracks(safeTrackData);
      return;
    }
    
    const termLower = term.toLowerCase();
    const filtered = safeTrackData.filter(track => 
      (track.title || '').toLowerCase().includes(termLower) ||
      (track.artist || '').toLowerCase().includes(termLower) ||
      (track.album || '').toLowerCase().includes(termLower) ||
      (track.isrc || '').toLowerCase().includes(termLower)
    );
    
    setFilteredTracks(filtered);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 grow overflow-hidden">
          <TopBar />
          <main className="container mx-auto p-4 md:p-6 space-y-6 pb-16">
            <div className="flex items-center justify-between">
              <CatalogHeader searchTerm={searchTerm} onSearch={handleSearch} />
              <Button onClick={() => setShowSpotifyModal(true)} className="flex items-center gap-2" variant="secondary">
                <SpotifyIcon />
                + Add from Spotify
              </Button>
            </div>
            <CatalogTabs tracks={filteredTracks} />
          </main>
        </div>
      </div>
      <Dialog open={showSpotifyModal} onOpenChange={setShowSpotifyModal}>
        <DialogContent className="max-w-2xl w-full p-0 sm:p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <SpotifyIcon /> Import from Spotify
            </DialogTitle>
            <DialogDescription>
              Paste a Spotify playlist link below. Instantly preview before importing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Paste Spotify playlist link..."
              value={spotifyLink}
              onChange={e => setSpotifyLink(e.target.value)}
              className="mt-2"
              autoFocus
            />
            {playlistLoading && (
              <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
                <span className="animate-spin"><SpotifyIcon /></span> Fetching playlist…
              </div>
            )}
            {playlistError && (
              <div className="text-destructive text-center py-4">{playlistError}</div>
            )}
            {playlistData && !playlistLoading && !playlistError && (
              <>
                {/* Playlist preview */}
                <div className="flex flex-col sm:flex-row items-center gap-4 p-3 rounded-lg border bg-muted">
                  <img src={playlistData.images[0]?.url} alt="cover art" className="w-24 h-24 rounded shadow object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-lg truncate">{playlistData.name}</div>
                    <div className="text-sm text-muted-foreground">{playlistData.tracks.total} tracks</div>
                  </div>
                </div>
                {/* Track list */}
                <div className="flex items-center justify-between mt-4">
                  <div className="font-medium">Tracks</div>
                  <button
                    className="text-primary text-sm underline"
                    onClick={toggleSelectAll}
                    type="button"
                  >
                    {allSelected ? "Deselect All" : "Select All"}
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y border rounded bg-background mt-2">
                  {playlistData.tracks.items.map(({ track }) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 px-2 py-2 sm:py-3 hover:bg-accent transition text-sm sm:text-base"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTracks.includes(track.id)}
                        onChange={() => toggleTrack(track.id)}
                        className="accent-primary w-4 h-4"
                        aria-label={`Select track ${track.name} by ${track.artists.map(a => a.name).join(", ")}`}
                      />
                      <img
                        src={track.album.images[0]?.url}
                        alt="album art"
                        className="w-10 h-10 rounded object-cover hidden sm:block"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate font-medium">{track.name}</div>
                        <div className="truncate text-xs text-muted-foreground">
                          {track.artists.map(a => a.name).join(", ")}
                        </div>
                      </div>
                      <div className="hidden sm:block text-xs text-muted-foreground min-w-[60px] text-right">
                        {msToMinSec(track.duration_ms)}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Catalog;
