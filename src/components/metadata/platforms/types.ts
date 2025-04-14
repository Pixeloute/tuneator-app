
import { MetadataFormState } from "../metadata-form";

export interface PlatformLinkProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  infoText: string;
}

export interface PlatformsTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export interface PlatformSectionProps {
  formState: MetadataFormState;
  updateSocialLink: (platform: string, value: string) => void;
}

export interface ActionButtonsProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
  isSearching: boolean;
  setIsSearching: (value: boolean) => void;
}
