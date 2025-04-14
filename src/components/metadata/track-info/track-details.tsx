
import { Input } from "@/components/ui/input";
import { FormFieldWithInfo } from "./form-field-with-info";
import { MetadataFormState } from "@/contexts/metadata";

interface TrackDetailsProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const TrackDetails = ({ formState, updateForm }: TrackDetailsProps) => {
  return (
    <div className="space-y-4">
      <FormFieldWithInfo
        id="title"
        label="Track Title"
        required={true}
        tooltip="The primary title of the track as it should appear on platforms."
      >
        <Input
          id="title"
          value={formState.title}
          onChange={(e) => updateForm('title', e.target.value)}
          placeholder="e.g., Song Title"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="altTitle"
        label="Alternative Title"
        tooltip="Alternative or international title variations."
      >
        <Input
          id="altTitle"
          value={formState.altTitle}
          onChange={(e) => updateForm('altTitle', e.target.value)}
          placeholder="e.g., Title in another language"
        />
      </FormFieldWithInfo>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldWithInfo
          id="version"
          label="Version"
          tooltip="Version type for this track (Original, Remix, Edit, etc.)"
        >
          <Input
            id="version"
            value={formState.version}
            onChange={(e) => updateForm('version', e.target.value)}
            placeholder="e.g., Original Mix, Radio Edit"
          />
        </FormFieldWithInfo>
        
        <FormFieldWithInfo
          id="trackPosition"
          label="Track Number"
          tooltip="The position of this track in the album/EP."
        >
          <Input
            id="trackPosition"
            value={formState.trackPosition}
            onChange={(e) => updateForm('trackPosition', e.target.value)}
            placeholder="e.g., 1, 2, 3"
          />
        </FormFieldWithInfo>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldWithInfo
          id="duration"
          label="Duration"
          tooltip="Length of the track in minutes:seconds format."
        >
          <Input
            id="duration"
            value={formState.duration}
            onChange={(e) => updateForm('duration', e.target.value)}
            placeholder="e.g., 3:45"
          />
        </FormFieldWithInfo>
        
        <FormFieldWithInfo
          id="bpm"
          label="BPM"
          tooltip="Beats per minute - the tempo of the track."
        >
          <Input
            id="bpm"
            value={formState.bpm}
            onChange={(e) => updateForm('bpm', e.target.value)}
            placeholder="e.g., 120"
          />
        </FormFieldWithInfo>
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldWithInfo
          id="key"
          label="Key"
          tooltip="Musical key of the track."
        >
          <Input
            id="key"
            value={formState.key}
            onChange={(e) => updateForm('key', e.target.value)}
            placeholder="e.g., C Major, A Minor"
          />
        </FormFieldWithInfo>
        
        <FormFieldWithInfo
          id="language"
          label="Language"
          tooltip="Primary language of the lyrics."
        >
          <Input
            id="language"
            value={formState.language}
            onChange={(e) => updateForm('language', e.target.value)}
            placeholder="e.g., English, Spanish"
          />
        </FormFieldWithInfo>
      </div>
    </div>
  );
};
