
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { GenreSelect } from "./track-info/genre-select";
import { FormFieldWithInfo } from "./track-info/form-field-with-info";

// Default list of common music genres if none are provided
const DEFAULT_GENRES = [
  "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Dance", "Country", "Folk", "Latin", "Metal", "Blues", "Reggae", 
  "Soul", "Funk", "Indie", "Alternative", "Gospel", "World"
];

interface GenreSelectorProps {
  primaryGenre: string;
  secondaryGenre: string;
  onPrimaryGenreChange: (value: string) => void;
  onSecondaryGenreChange: (value: string) => void;
  error?: boolean;
  genreOptions?: string[];
}

export function GenreSelector({
  primaryGenre,
  secondaryGenre,
  onPrimaryGenreChange,
  onSecondaryGenreChange,
  error = false,
  genreOptions = DEFAULT_GENRES
}: GenreSelectorProps) {
  const [availableGenres, setAvailableGenres] = useState<string[]>(genreOptions || DEFAULT_GENRES);
  
  // Update available genres if genreOptions changes
  useEffect(() => {
    setAvailableGenres(genreOptions || DEFAULT_GENRES);
  }, [genreOptions]);

  return (
    <div className="space-y-4">
      <FormFieldWithInfo
        id="primaryGenre"
        label="Primary Genre"
        required={true}
        tooltip="The main genre category for the track."
      >
        <GenreSelect
          id="primaryGenre"
          value={primaryGenre}
          onChange={onPrimaryGenreChange}
          placeholder="Select primary genre"
          genres={availableGenres}
          error={error}
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="secondaryGenre"
        label="Secondary Genre"
        tooltip="Optional secondary genre for cross-genre tracks."
      >
        <GenreSelect
          id="secondaryGenre"
          value={secondaryGenre}
          onChange={onSecondaryGenreChange}
          placeholder="Select secondary genre (optional)"
          genres={availableGenres}
        />
      </FormFieldWithInfo>
    </div>
  );
}
