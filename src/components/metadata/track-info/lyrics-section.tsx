
import { Textarea } from "@/components/ui/textarea";
import { FormFieldWithInfo } from "./form-field-with-info";
import { MetadataFormState } from "@/contexts/metadata";

interface LyricsSectionProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const LyricsSection = ({ formState, updateForm }: LyricsSectionProps) => {
  return (
    <div className="space-y-2">
      <FormFieldWithInfo
        id="lyrics"
        label="Lyrics"
        tooltipText="Full lyrics of the track. This helps with searchability on platforms."
        renderInput={() => (
          <Textarea
            id="lyrics"
            value={formState.lyrics}
            onChange={(e) => updateForm('lyrics', e.target.value)}
            placeholder="Enter track lyrics here..."
            className="min-h-[200px] resize-y"
          />
        )}
      />
    </div>
  );
};
