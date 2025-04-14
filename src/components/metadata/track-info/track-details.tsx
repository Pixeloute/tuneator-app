
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
        tooltipText="The primary title of the track as it should appear on platforms."
        value={formState.title}
        onChange={(e) => updateForm('title', e.target.value)}
        placeholder="e.g., Song Title"
      />
      
      <FormFieldWithInfo
        id="altTitle"
        label="Alternative Title"
        tooltipText="Alternative or international title variations."
        value={formState.altTitle}
        onChange={(e) => updateForm('altTitle', e.target.value)}
        placeholder="e.g., Title in another language"
      />
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldWithInfo
          id="version"
          label="Version"
          tooltipText="Version type for this track (Original, Remix, Edit, etc.)"
          value={formState.version}
          onChange={(e) => updateForm('version', e.target.value)}
          placeholder="e.g., Original Mix, Radio Edit"
        />
        
        <FormFieldWithInfo
          id="trackPosition"
          label="Track Number"
          tooltipText="The position of this track in the album/EP."
          value={formState.trackPosition}
          onChange={(e) => updateForm('trackPosition', e.target.value)}
          placeholder="e.g., 1, 2, 3"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldWithInfo
          id="duration"
          label="Duration"
          tooltipText="Length of the track in minutes:seconds format."
          value={formState.duration}
          onChange={(e) => updateForm('duration', e.target.value)}
          placeholder="e.g., 3:45"
        />
        
        <FormFieldWithInfo
          id="bpm"
          label="BPM"
          tooltipText="Beats per minute - the tempo of the track."
          value={formState.bpm}
          onChange={(e) => updateForm('bpm', e.target.value)}
          placeholder="e.g., 120"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormFieldWithInfo
          id="key"
          label="Key"
          tooltipText="Musical key of the track."
          value={formState.key}
          onChange={(e) => updateForm('key', e.target.value)}
          placeholder="e.g., C Major, A Minor"
        />
        
        <FormFieldWithInfo
          id="language"
          label="Language"
          tooltipText="Primary language of the lyrics."
          value={formState.language}
          onChange={(e) => updateForm('language', e.target.value)}
          placeholder="e.g., English, Spanish"
        />
      </div>
    </div>
  );
};
