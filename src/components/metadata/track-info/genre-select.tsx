
import { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Default genres list to use when none are provided
const DEFAULT_GENRES = [
  "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Dance", "Country", "Folk", "Latin", "Metal", "Blues", "Reggae", 
  "Soul", "Funk", "Indie", "Alternative", "Gospel", "World"
];

interface GenreSelectProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  genres?: string[];
  disabled?: boolean;
  error?: boolean;
}

export function GenreSelect({
  id,
  value,
  onChange,
  placeholder,
  genres,
  disabled = false,
  error = false
}: GenreSelectProps) {
  const [open, setOpen] = useState(false);
  const [filteredGenres, setFilteredGenres] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize filtered genres when the component mounts or genres change
  useEffect(() => {
    // Use the provided genres or fall back to default genres
    const genresToUse = Array.isArray(genres) && genres.length > 0 
      ? [...genres] 
      : [...DEFAULT_GENRES];
      
    setFilteredGenres(genresToUse);
  }, [genres]);

  const handleFilter = (searchValue: string) => {
    // Make sure we have a valid array to filter
    const genresToFilter = Array.isArray(genres) && genres.length > 0 
      ? genres 
      : DEFAULT_GENRES;
    
    if (!searchValue) {
      setFilteredGenres(genresToFilter);
      return;
    }
    
    const searchLower = searchValue.toLowerCase();
    const filtered = genresToFilter.filter(genre => 
      genre.toLowerCase().includes(searchLower)
    );
    setFilteredGenres(filtered);
  };

  const clearGenre = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            error && "border-destructive",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2 truncate">
            {value || placeholder}
            {value && (
              <X 
                className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100" 
                onClick={clearGenre}
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
            onValueChange={handleFilter}
            ref={inputRef}
          />
          <CommandEmpty>No genre found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto">
            {filteredGenres.map((genre) => (
              <CommandItem
                key={genre}
                value={genre}
                onSelect={() => {
                  onChange(genre);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === genre ? "opacity-100" : "opacity-0"
                  )}
                />
                {genre}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
