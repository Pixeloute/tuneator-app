
import { Card, CardContent } from "@/components/ui/card";
import { MetadataFormState } from "@/contexts/metadata";
import { PrimaryArtistInfo } from "./artist-details/primary-artist-info";
import { SecondaryArtistInfo } from "./artist-details/secondary-artist-info";
import { AiSuggestionsButton } from "./artist-details/ai-suggestions-button";

interface ArtistDetailsTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const ArtistDetailsTab = ({ formState, updateForm }: ArtistDetailsTabProps) => {
  // AI suggestions for artist info
  const getAiSuggestions = () => {
    // Simulate AI suggestions
    if (!formState.phoneticPronunciation && formState.artistName) {
      // Generate a basic phonetic pronunciation based on artist name
      let phonetic = "";
      if (formState.artistName === "The Electric Sound") {
        phonetic = "thuh ih-LEK-trik sound";
      }
      
      if (phonetic) {
        updateForm('phoneticPronunciation', phonetic);
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PrimaryArtistInfo formState={formState} updateForm={updateForm} />
          <SecondaryArtistInfo formState={formState} updateForm={updateForm} />
        </div>
        
        <div className="mt-4 flex justify-end">
          <AiSuggestionsButton onGetSuggestions={getAiSuggestions} />
        </div>
      </CardContent>
    </Card>
  );
};
