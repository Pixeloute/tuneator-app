
import { Input } from "@/components/ui/input";
import { MetadataFormState } from "@/contexts/metadata-context";
import { FormFieldWithInfo } from "./form-field-with-info";
import { validateBPM, validateFilename } from "@/lib/metadata-validator";
import { useState, ChangeEvent } from "react";

interface TrackDetailsProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export function TrackDetails({ formState, updateForm }: TrackDetailsProps) {
  // Local validation states
  const [bpmError, setBpmError] = useState("");
  const [fileNameError, setFileNameError] = useState("");
  
  // Handle BPM validation
  const handleBpmChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('bpm', value);
    
    if (!validateBPM(value)) {
      setBpmError("BPM must be a positive number");
    } else {
      setBpmError("");
    }
  };
  
  // Handle file name validation
  const handleFileNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('audioFileName', value);
    
    if (!validateFilename(value)) {
      setFileNameError("Invalid filename format");
    } else {
      setFileNameError("");
    }
  };

  return (
    <div className="space-y-4">
      <FormFieldWithInfo
        id="title"
        label="Song Title"
        tooltip="The main title of the track as it should appear on platforms. Required for distribution."
        required
      >
        <Input
          id="title"
          value={formState.title}
          onChange={(e) => updateForm('title', e.target.value)}
          className={!formState.title ? "border-destructive" : ""}
          placeholder="Enter song title"
        />
        {!formState.title && (
          <p className="text-xs text-destructive">Required field</p>
        )}
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="altTitle"
        label="Alternative Title"
        tooltip="Optional alternative title for the track, such as translated titles or alternate spellings."
      >
        <Input
          id="altTitle"
          value={formState.altTitle}
          onChange={(e) => updateForm('altTitle', e.target.value)}
          placeholder="Optional alternative title"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="trackPosition"
        label="Track Position"
        tooltip="The position of this track within an album or EP."
      >
        <Input
          id="trackPosition"
          value={formState.trackPosition}
          onChange={(e) => updateForm('trackPosition', e.target.value)}
          placeholder="e.g., 1"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="duration"
        label="Duration"
        tooltip="The track's duration in minutes and seconds (MM:SS)."
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
        tooltip="Beats Per Minute - the tempo of the track. Must be a positive number."
      >
        <Input
          id="bpm"
          value={formState.bpm}
          onChange={handleBpmChange}
          className={bpmError ? "border-destructive" : ""}
          placeholder="e.g., 120"
        />
        {bpmError && (
          <p className="text-xs text-destructive">{bpmError}</p>
        )}
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="key"
        label="Musical Key"
        tooltip="The musical key of the track (e.g., C Major, A Minor)."
      >
        <Input
          id="key"
          value={formState.key}
          onChange={(e) => updateForm('key', e.target.value)}
          placeholder="e.g., C Major"
        />
      </FormFieldWithInfo>
      
      <FormFieldWithInfo
        id="audioFileName"
        label="Audio File Name"
        tooltip="Name of the audio file including extension (e.g. .wav, .mp3)."
      >
        <Input
          id="audioFileName"
          value={formState.audioFileName}
          onChange={handleFileNameChange}
          className={fileNameError ? "border-destructive" : ""}
          placeholder="e.g., track_name.wav"
        />
        {fileNameError && (
          <p className="text-xs text-destructive">{fileNameError}</p>
        )}
      </FormFieldWithInfo>
    </div>
  );
}
