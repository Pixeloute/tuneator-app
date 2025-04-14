
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MetadataFormState } from "@/contexts/metadata";
import { FormFieldWithInfo } from "./form-field-with-info";
import { GenreSelector } from "@/components/metadata/genre-selector";
import { useState } from "react";

// Default list of common music genres
const DEFAULT_GENRES = [
  "Pop", "Rock", "Hip Hop", "R&B", "Jazz", "Classical", "Electronic", 
  "Dance", "Country", "Folk", "Latin", "Metal", "Blues", "Reggae", 
  "Soul", "Funk", "Indie", "Alternative", "Gospel", "World"
];

interface GenreAndMoodProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export function GenreAndMood({ formState, updateForm }: GenreAndMoodProps) {
  const [genreError, setGenreError] = useState(false);
  
  // Handle tags change with null checks
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(Boolean);
    updateForm('tags', tagsArray);
  };
  
  // Handle primary genre change
  const handlePrimaryGenreChange = (value: string) => {
    updateForm('genre', value);
    setGenreError(!value);
  };
  
  // Handle secondary genre change
  const handleSecondaryGenreChange = (value: string) => {
    updateForm('secondaryGenre', value);
  };

  // Ensure we have a valid tags array
  const safeTags = Array.isArray(formState.tags) ? formState.tags : [];
  
  // Ensure we have a valid genres array
  const genreOptions = Array.isArray(formState.genres) ? formState.genres : DEFAULT_GENRES;

  return (
    <div className="space-y-4">
      <GenreSelector
        primaryGenre={formState.genre || ''}
        secondaryGenre={formState.secondaryGenre || ''}
        onPrimaryGenreChange={handlePrimaryGenreChange}
        onSecondaryGenreChange={handleSecondaryGenreChange}
        error={genreError}
        genreOptions={genreOptions}
      />
      
      <FormFieldWithInfo
        id="subGenre"
        label="Sub-Genre"
        tooltip="More specific genre classification (e.g., Deep House, Trap, Alt-Pop)."
      >
        <Input
          id="subGenre"
          value={formState.subGenre || ''}
          onChange={(e) => updateForm('subGenre', e.target.value)}
          placeholder="e.g., Deep House, Trap"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="language"
        label="Language"
        tooltip="The primary language of the lyrics or vocals."
      >
        <Input
          id="language"
          value={formState.language || ''}
          onChange={(e) => updateForm('language', e.target.value)}
          placeholder="e.g., English, Spanish"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="mood"
        label="Mood Description"
        tooltip="Descriptive terms for the emotional quality of the track."
      >
        <Input
          id="mood"
          value={formState.mood || ''}
          onChange={(e) => updateForm('mood', e.target.value)}
          placeholder="e.g., Energetic, Relaxed, Melancholic"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="tags"
        label="Tags"
        tooltip="Keywords to help with discoverability. Separate with commas."
      >
        <Input
          id="tags"
          value={safeTags.join(', ')}
          onChange={handleTagsChange}
          placeholder="e.g., summer, dance, remix"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="explicit"
        label="Explicit Content"
        tooltip="Toggle on if the track contains explicit lyrics or content."
      >
        <div className="flex items-center space-x-2">
          <Switch
            id="explicit"
            checked={formState.explicit || false}
            onCheckedChange={(checked) => updateForm('explicit', checked)}
          />
          <Label htmlFor="explicit">Contains explicit content</Label>
        </div>
      </FormFieldWithInfo>
    </div>
  );
}
