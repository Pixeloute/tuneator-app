
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Spinner } from "@/components/ui/spinner";
import { Search, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api-service";
import type { EnrichedMetadata } from "@/services/types/shared-types";

interface SearchFormProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isrc: string;
  setIsrc: (value: string) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  setResults: (results: EnrichedMetadata | null) => void;
  setSearchPerformed: (value: boolean) => void;
}

export const SearchForm = ({
  searchQuery,
  setSearchQuery,
  isrc,
  setIsrc,
  isLoading,
  setIsLoading,
  setResults,
  setSearchPerformed
}: SearchFormProps) => {
  const { toast } = useToast();
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a search query.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      // Parse the search query to extract artist and track
      const parts = searchQuery.split(" - ");
      const artist = parts.length > 1 ? parts[0].trim() : "";
      const track = parts.length > 1 ? parts[1].trim() : searchQuery.trim();
      
      const metadata = await apiService.getComprehensiveMetadata(track, artist, isrc || undefined);
      setResults(metadata);
      
      toast({
        title: "Search Complete",
        description: "Metadata lookup completed successfully.",
      });
    } catch (error) {
      console.error("Metadata lookup error:", error);
      toast({
        title: "Search Error",
        description: "An error occurred during metadata lookup.",
        variant: "destructive",
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search Query (Artist - Track)</Label>
        <div className="flex gap-2">
          <Input
            id="search"
            placeholder="e.g. Daft Punk - Get Lucky"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-electric hover:bg-electric/90"
          >
            {isLoading ? <Spinner className="mr-2" /> : <Search className="mr-2 h-4 w-4" />}
            Search
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="isrc">ISRC (Optional)</Label>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-xs">
                International Standard Recording Code (ISRC) is a unique identifier for recordings.
                Adding an ISRC can improve search accuracy.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
        <Input
          id="isrc"
          placeholder="e.g. USRC17607839"
          value={isrc}
          onChange={(e) => setIsrc(e.target.value)}
        />
      </div>
    </div>
  );
};
