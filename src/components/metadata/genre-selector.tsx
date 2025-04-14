
import { FormFieldWithInfo } from "@/components/metadata/track-info/form-field-with-info";
import { GenreSelect } from "@/components/metadata/track-info/genre-select";

interface GenreSelectorProps {
  primaryGenre: string;
  secondaryGenre: string;
  onPrimaryGenreChange: (value: string) => void;
  onSecondaryGenreChange: (value: string) => void;
  error?: boolean;
  genreOptions: string[];
}

export function GenreSelector({
  primaryGenre,
  secondaryGenre,
  onPrimaryGenreChange,
  onSecondaryGenreChange,
  error = false,
  genreOptions = [] // Default to empty array
}: GenreSelectorProps) {
  // Ensure genreOptions is always an array
  const safeOptions = Array.isArray(genreOptions) ? genreOptions : [];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormFieldWithInfo
        id="genre"
        label="Primary Genre"
        required={true}
        tooltip="The main genre classification for this track."
      >
        <GenreSelect
          id="genre"
          value={primaryGenre}
          onChange={onPrimaryGenreChange}
          placeholder="Select primary genre"
          genres={safeOptions}
          error={error}
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="secondaryGenre"
        label="Secondary Genre"
        tooltip="Optional secondary genre classification."
      >
        <GenreSelect
          id="secondaryGenre"
          value={secondaryGenre}
          onChange={onSecondaryGenreChange}
          placeholder="Select secondary genre"
          genres={safeOptions}
        />
      </FormFieldWithInfo>
    </div>
  );
}
