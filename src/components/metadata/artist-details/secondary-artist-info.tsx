
import { ArtistField } from "./artist-field";
import { MetadataFormState } from "@/contexts/metadata";

interface SecondaryArtistInfoProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const SecondaryArtistInfo = ({ formState, updateForm }: SecondaryArtistInfoProps) => {
  return (
    <div className="space-y-4">
      <ArtistField
        id="companyName"
        label="Company Name"
        value={formState.companyName}
        onChange={(e) => updateForm('companyName', e.target.value)}
        placeholder="e.g., Artist LLC, Artist Inc."
        tooltipText="The legal business entity associated with the artist."
      />
      
      <ArtistField
        id="legalNames"
        label="Legal Name(s)"
        value={formState.legalNames}
        onChange={(e) => updateForm('legalNames', e.target.value)}
        placeholder="e.g., John Smith, Jane Doe"
        tooltipText="Legal names of the individuals comprising the artist/group."
      />
      
      <ArtistField
        id="featuring"
        label="Featuring Artists"
        value={formState.featuring}
        onChange={(e) => updateForm('featuring', e.target.value)}
        placeholder="e.g., Featured Artist Name"
        tooltipText="Any featured artists on this track. Will appear as 'feat. X' on platforms."
      />
      
      <ArtistField
        id="backgroundVocals"
        label="Background Vocals"
        value={formState.backgroundVocals}
        onChange={(e) => updateForm('backgroundVocals', e.target.value)}
        placeholder="e.g., Jane Doe, John Smith"
        tooltipText="Artists who contributed background vocals to the track."
      />
    </div>
  );
};
