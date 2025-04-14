
import { useState, useEffect } from "react";
import { spotifyGenres } from "@/lib/genre-data";
import { GenreLabel } from "./track-info/genre-label";
import { GenreSelect } from "./track-info/genre-select";
import { GenreBadges } from "./track-info/genre-badges";

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
  const [secondaryFilteredGenres, setSecondaryFilteredGenres] = useState(spotifyGenres);

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

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <GenreLabel 
          id="primary-genre"
          label="Primary Genre"
          tooltip="The main genre of the track. This is required for distribution and helps platforms categorize your music."
          required={true}
        />
        
        <GenreSelect
          id="primary-genre"
          value={primaryGenre}
          onChange={onPrimaryGenreChange}
          placeholder="Select genre (e.g. Indie Rock, Trap, Afrobeats)"
          genres={spotifyGenres}
          error={error && !primaryGenre}
        />
        
        {error && !primaryGenre && (
          <p className="text-xs text-destructive">Primary genre is required</p>
        )}
      </div>
      
      <div className="space-y-2">
        <GenreLabel
          id="secondary-genre"
          label="Secondary Genre"
          tooltip="An optional secondary genre to further classify your track."
        />
        
        <GenreSelect
          id="secondary-genre"
          value={secondaryGenre || ""}
          onChange={onSecondaryGenreChange}
          placeholder="Select secondary genre (optional)"
          genres={secondaryFilteredGenres}
          disabled={!primaryGenre}
        />
      </div>
      
      <GenreBadges
        primaryGenre={primaryGenre}
        secondaryGenre={secondaryGenre}
      />
    </div>
  );
}
