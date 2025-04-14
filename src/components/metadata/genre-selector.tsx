
import { useState, useEffect, useRef } from "react";
import { Check, ChevronsUpDown, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { spotifyGenres } from "@/lib/genre-data";

interface GenreSelectorProps {
  primaryGenre: string;
  secondaryGenre?: string;
  onPrimaryGenreChange: (value: string) => void;
  onSecondaryGenreChange: (value: string) => void;
  error?: boolean;
}

export function GenreSelector({
  primaryGenre,
  secondaryGenre,
  onPrimaryGenreChange,
  onSecondaryGenreChange,
  error
}: GenreSelectorProps) {
  const [primaryOpen, setPrimaryOpen] = useState(false);
  const [secondaryOpen, setSecondaryOpen] = useState(false);
  const [filteredGenres, setFilteredGenres] = useState(spotifyGenres);
  const [secondaryFilteredGenres, setSecondaryFilteredGenres] = useState(spotifyGenres);
  const primaryInputRef = useRef<HTMLInputElement>(null);
  const secondaryInputRef = useRef<HTMLInputElement>(null);

  // Filter out the primary genre from secondary options
  useEffect(() => {
    if (primaryGenre) {
      setSecondaryFilteredGenres(
        spotifyGenres.filter(genre => genre.toLowerCase() !== primaryGenre.toLowerCase())
      );
    } else {
      setSecondaryFilteredGenres(spotifyGenres);
    }
  }, [primaryGenre]);

  const handlePrimaryFilter = (value: string) => {
    if (!value) {
      setFilteredGenres(spotifyGenres);
      return;
    }
    
    const searchValue = value.toLowerCase();
    const filtered = spotifyGenres.filter(genre => 
      genre.toLowerCase().includes(searchValue)
    );
    setFilteredGenres(filtered);
  };

  const handleSecondaryFilter = (value: string) => {
    if (!value) {
      setSecondaryFilteredGenres(spotifyGenres.filter(
        genre => genre.toLowerCase() !== primaryGenre.toLowerCase()
      ));
      return;
    }
    
    const searchValue = value.toLowerCase();
    const filtered = spotifyGenres.filter(genre => 
      genre.toLowerCase().includes(searchValue) && 
      genre.toLowerCase() !== primaryGenre.toLowerCase()
    );
    setSecondaryFilteredGenres(filtered);
  };

  const clearPrimaryGenre = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPrimaryGenreChange("");
  };

  const clearSecondaryGenre = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSecondaryGenreChange("");
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="primary-genre" className="text-sm font-medium">
            Primary Genre <span className="text-destructive">*</span>
          </label>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-xs">
                The main genre of the track. This is required for distribution and helps platforms categorize your music.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <Popover open={primaryOpen} onOpenChange={setPrimaryOpen}>
          <PopoverTrigger asChild>
            <Button
              id="primary-genre"
              variant="outline"
              role="combobox"
              aria-expanded={primaryOpen}
              className={cn(
                "w-full justify-between",
                !primaryGenre && "text-muted-foreground",
                error && "border-destructive"
              )}
            >
              <div className="flex items-center gap-2 truncate">
                {primaryGenre ? primaryGenre : "Select genre (e.g. Indie Rock, Trap, Afrobeats)"}
                {primaryGenre && (
                  <X 
                    className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100" 
                    onClick={clearPrimaryGenre}
                  />
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Search genres..." 
                onValueChange={handlePrimaryFilter}
                ref={primaryInputRef}
              />
              <CommandEmpty>No genre found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {filteredGenres.map((genre) => (
                  <CommandItem
                    key={genre}
                    value={genre}
                    onSelect={() => {
                      onPrimaryGenreChange(genre);
                      setPrimaryOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        primaryGenre === genre ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {genre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        
        {error && !primaryGenre && (
          <p className="text-xs text-destructive">Primary genre is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="secondary-genre" className="text-sm font-medium">
            Secondary Genre
          </label>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <p className="text-xs">
                An optional secondary genre to further classify your track.
              </p>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        <Popover open={secondaryOpen} onOpenChange={setSecondaryOpen}>
          <PopoverTrigger asChild>
            <Button
              id="secondary-genre"
              variant="outline"
              role="combobox"
              aria-expanded={secondaryOpen}
              className={cn(
                "w-full justify-between",
                !secondaryGenre && "text-muted-foreground"
              )}
              disabled={!primaryGenre}
            >
              <div className="flex items-center gap-2 truncate">
                {secondaryGenre ? secondaryGenre : "Select secondary genre (optional)"}
                {secondaryGenre && (
                  <X 
                    className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100" 
                    onClick={clearSecondaryGenre}
                  />
                )}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput 
                placeholder="Search genres..." 
                onValueChange={handleSecondaryFilter}
                ref={secondaryInputRef}
              />
              <CommandEmpty>No genre found.</CommandEmpty>
              <CommandGroup className="max-h-60 overflow-y-auto">
                {secondaryFilteredGenres.map((genre) => (
                  <CommandItem
                    key={genre}
                    value={genre}
                    onSelect={() => {
                      onSecondaryGenreChange(genre);
                      setSecondaryOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        secondaryGenre === genre ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {genre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
      
      {primaryGenre && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="bg-electric/20">
            {primaryGenre}
          </Badge>
          {secondaryGenre && (
            <Badge variant="outline">
              {secondaryGenre}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
