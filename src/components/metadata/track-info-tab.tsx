import { Card, CardContent } from "@/components/ui/card";
import { MetadataFormState } from "@/contexts/metadata";
import { TrackDetails } from "./track-info/track-details";
import { GenreAndMood } from "./track-info/genre-and-mood";
import { LyricsSection } from "./track-info/lyrics-section";
import { AiSuggestionsButton } from "./track-info/ai-suggestions-button";
import { MusicBrainzSearchButton } from "./musicbrainz/search-button";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface TrackInfoTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const TrackInfoTab = ({ formState, updateForm }: TrackInfoTabProps) => {
  const handleMusicBrainzSelect = (data: { 
    title?: string; 
    artist?: string; 
    isrc?: string; 
    duration?: number; 
  }) => {
    if (data.title) updateForm("title", data.title);
    if (data.artist) updateForm("artistName", data.artist);
    if (data.isrc) updateForm("isrc", data.isrc);
    if (data.duration) updateForm("duration", Math.round(data.duration / 1000));

    toast({
      title: "Metadata Updated",
      description: "Track information has been updated from MusicBrainz",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Track Information</h2>
        <MusicBrainzSearchButton onSelect={handleMusicBrainzSelect} />
      </div>

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
