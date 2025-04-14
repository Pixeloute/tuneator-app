
import { Card, CardContent } from "@/components/ui/card";
import { MetadataFormState } from "@/contexts/metadata";
import { TrackDetails } from "./track-info/track-details";
import { GenreAndMood } from "./track-info/genre-and-mood";
import { LyricsSection } from "./track-info/lyrics-section";
import { AiSuggestionsButton } from "./track-info/ai-suggestions-button";

interface TrackInfoTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const TrackInfoTab = ({ formState, updateForm }: TrackInfoTabProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TrackDetails formState={formState} updateForm={updateForm} />
          <GenreAndMood formState={formState} updateForm={updateForm} />
        </div>
        
        <div className="mt-6 space-y-2">
          <LyricsSection formState={formState} updateForm={updateForm} />
        </div>
        
        <div className="mt-4">
          <AiSuggestionsButton />
        </div>
      </CardContent>
    </Card>
  );
}
