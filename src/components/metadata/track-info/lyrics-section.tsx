
import { Textarea } from "@/components/ui/textarea";
import { MetadataFormState } from "@/contexts/metadata-context";
import { FormFieldWithInfo } from "./form-field-with-info";

interface LyricsSectionProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export function LyricsSection({ formState, updateForm }: LyricsSectionProps) {
  return (
    <FormFieldWithInfo
      id="lyrics"
      label="Lyrics"
      tooltip="Full lyrics of the track. For songs with vocals, this helps with SEO and accessibility."
    >
      <Textarea
        id="lyrics"
        value={formState.lyrics}
        onChange={(e) => updateForm('lyrics', e.target.value)}
        placeholder="Enter track lyrics here"
        className="min-h-[100px]"
      />
    </FormFieldWithInfo>
  );
}
