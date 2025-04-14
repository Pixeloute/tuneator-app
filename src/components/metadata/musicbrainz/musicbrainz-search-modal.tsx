
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Search, Disc, Clock, Music, User, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data - in a real application, this would come from the MusicBrainz API
const mockSearchResults = [
  {
    id: "1",
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    isrc: "GBUM71029604",
    duration: 354000 // 5:54 in milliseconds
  },
  {
    id: "2",
    title: "Imagine",
    artist: "John Lennon",
    album: "Imagine",
    isrc: "USIR19700004",
    duration: 183000 // 3:03
  },
  {
    id: "3",
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller",
    isrc: "USSM17900073",
    duration: 294000 // 4:54
  }
];

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
  const [searchResults, setSearchResults] = useState(mockSearchResults);
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // In a real app, this would fetch from the MusicBrainz API
      // For demo purposes, we're using the mock data and filtering it
      const filteredResults = mockSearchResults.filter(
        result => 
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 800);
  };
  
  const formatDuration = (ms: number) => {
    if (!ms) return "0:00";
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleSelectResult = (result: typeof mockSearchResults[0]) => {
    onSelect({
      title: result.title,
      artist: result.artist,
      isrc: result.isrc,
      duration: result.duration
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Search MusicBrainz</DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center gap-2 mt-2">
          <div className="relative flex-1">
            <Input
              placeholder="Search by track title or artist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-8"
            />
            {searchQuery && (
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            onClick={handleSearch} 
            variant="secondary" 
            disabled={isSearching || !searchQuery.trim()}
          >
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        <ScrollArea className="mt-4 h-[300px] rounded-md border">
          {searchResults.length > 0 ? (
            <div className="p-4 space-y-4">
              {searchResults.map((result) => (
                <div 
                  key={result.id}
                  className="flex flex-col space-y-2 p-3 hover:bg-secondary rounded-md cursor-pointer"
                  onClick={() => handleSelectResult(result)}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">{result.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>{result.artist}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Disc className="h-3 w-3" />
                        <span>{result.album}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDuration(result.duration)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Music className="h-3 w-3" />
                      <span>ISRC: {result.isrc}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 text-xs text-electric hover:text-electric/80"
                    >
                      Use
                    </Button>
                  </div>
                  
                  <Separator className="mt-2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <Search className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "No results found" : "Search for tracks or artists"}
              </p>
              {searchQuery && (
                <p className="text-xs text-muted-foreground mt-1">
                  Try a different search term or browse the catalog
                </p>
              )}
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <p className="text-xs text-muted-foreground">
            Data from MusicBrainz
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
