
export interface MetadataFormState {
  // Track Info
  title: string;
  altTitle: string;
  trackPosition: string;
  duration: string;
  bpm: string;
  key: string;
  mood: string;
  tags: string[];
  lyrics: string;
  fileType: string;
  audioFileName: string;
  coverArtFileName: string;
  language: string;
  vocalType: string;
  genre: string;
  secondaryGenre: string;
  subGenre: string;
  explicit: boolean;
  version: string;
  
  // Artist Details
  artistName: string;
  companyName: string;
  legalNames: string;
  phoneticPronunciation: string;
  stylizedName: string;
  akaNames: string;
  artistType: string;
  featuring: string;
  backgroundVocals: string;
  
  // Release Info
  productTitle: string;
  label: string;
  catalogNumber: string;
  format: string;
  productType: string;
  barcode: string;
  upc: string;
  previouslyReleased: boolean;
  previousRecordingYear: string;
  previousReleaseDate: string;
  recordingCountry: string;
  preReleaseDate: string;
  preReleaseUrl: string;
  releaseDate: string;
  releaseUrl: string;
  releaseLabel: string;
  distributionCompany: string;
  
  // Publishing & Rights
  copyrightYear: string;
  copyrightOwner: string;
  pLine: string;
  cLine: string;
  tunecode: string;
  iceWorkKey: string;
  iswc: string;
  isrc: string;
  bowi: string;
  
  // Credits
  composers: Array<{id: string, name: string, role: string, share: number}>;
  producers: Array<{id: string, name: string, role: string}>;
  engineers: Array<{id: string, name: string, role: string}>;
  performers: Array<{id: string, name: string, instrument: string}>;
  
  // Platform
  socialLinks: Record<string, string>;
}

export interface MetadataContextProps {
  formState: MetadataFormState;
  metadataQualityScore: number;
  validationIssues: IssueType[];
  updateForm: (field: keyof MetadataFormState, value: any) => void;
  validateMetadata: () => void;
  handleAiAudit: () => void;
  handleSaveMetadata: () => void;
}

export type IssueType = {
  type: "error" | "warning" | "info" | "success";
  message: string;
};
