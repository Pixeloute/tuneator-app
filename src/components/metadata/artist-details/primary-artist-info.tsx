
import { ArtistField } from "./artist-field";
import { MetadataFormState } from "@/contexts/metadata";

interface PrimaryArtistInfoProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const PrimaryArtistInfo = ({ formState, updateForm }: PrimaryArtistInfoProps) => {
  return (
    <div className="space-y-4">
      <ArtistField
        id="artistName"
        label="Artist Name"
        value={formState.artistName}
        onChange={(e) => updateForm('artistName', e.target.value)}
        placeholder="Official artist name"
        tooltipText="The official name of the artist as it should appear on platforms. Required for distribution."
        required={true}
        error={!formState.artistName}
      />
      
      <ArtistField
        id="stylizedName"
        label="Stylized Name"
        value={formState.stylizedName}
        onChange={(e) => updateForm('stylizedName', e.target.value)}
        placeholder="e.g., ALL CAPS, lowercase, symbols"
        tooltipText="The artist name with specific stylization (e.g., ALL CAPS, lowercase, symbols)."
      />
      
      <ArtistField
        id="phoneticPronunciation"
        label="Phonetic Pronunciation"
        value={formState.phoneticPronunciation}
        onChange={(e) => updateForm('phoneticPronunciation', e.target.value)}
        placeholder="e.g., ah-TIS nay-m"
        tooltipText="How to pronounce the artist name phonetically. Useful for voice platforms."
      />
      
      <ArtistField
        id="akaNames"
        label="AKA/FKA Names"
        value={formState.akaNames}
        onChange={(e) => updateForm('akaNames', e.target.value)}
        placeholder="e.g., DJ Name, Previous Name"
        tooltipText="Other names the artist is known as or formerly known as."
      />
      
      <ArtistField
        id="artistType"
        label="Artist Type"
        value={formState.artistType}
        onChange={(e) => updateForm('artistType', e.target.value)}
        placeholder="e.g., Solo, Band, Duo"
        tooltipText="The classification of the artist (Solo, Band, Duo, etc.)."
      />
    </div>
  );
};
