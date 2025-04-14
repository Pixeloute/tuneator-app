
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
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Basic Track Information</h3>
          <div className="space-y-6">
            <TrackDetails formState={formState} updateForm={updateForm} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Genre & Descriptors</h3>
          <div className="space-y-6">
            <GenreAndMood formState={formState} updateForm={updateForm} />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Lyrics</h3>
          <LyricsSection formState={formState} updateForm={updateForm} />
          <div className="mt-4">
            <AiSuggestionsButton />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
