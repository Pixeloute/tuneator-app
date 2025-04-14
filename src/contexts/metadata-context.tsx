
import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { IssueType } from "@/components/metadata/metadata-feedback";
import { calculateMetadataScore } from "@/lib/metadata-validator";

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

interface MetadataContextProps {
  formState: MetadataFormState;
  metadataQualityScore: number;
  validationIssues: IssueType[];
  updateForm: (field: keyof MetadataFormState, value: any) => void;
  validateMetadata: () => void;
  handleAiAudit: () => void;
  handleSaveMetadata: () => void;
}

const initialFormState: MetadataFormState = {
  // Track Info defaults
  title: "Midnight Dreams",
  altTitle: "",
  trackPosition: "1",
  duration: "3:42",
  bpm: "128",
  key: "A Minor",
  mood: "Energetic, Uplifting",
  tags: ["Electronic", "Dance", "Synth"],
  lyrics: "",
  fileType: "WAV",
  audioFileName: "midnight_dreams_master.wav",
  coverArtFileName: "album_cover.jpg",
  language: "English",
  vocalType: "Lead Vocals",
  genre: "Electronic",
  subGenre: "House",
  explicit: false,
  version: "Original Mix",
  
  // Artist Details defaults
  artistName: "The Electric Sound",
  companyName: "Electric Sound LLC",
  legalNames: "John A. Smith",
  phoneticPronunciation: "",
  stylizedName: "ELECTRIC SOUND",
  akaNames: "",
  artistType: "Solo",
  featuring: "",
  backgroundVocals: "",
  
  // Release Info defaults
  productTitle: "Neon Horizons",
  label: "Neon Records",
  catalogNumber: "NR2023-01",
  format: "Digital",
  productType: "Single",
  barcode: "",
  upc: "",
  previouslyReleased: false,
  previousRecordingYear: "",
  previousReleaseDate: "",
  recordingCountry: "United States",
  preReleaseDate: "",
  preReleaseUrl: "",
  releaseDate: "2023-09-15",
  releaseUrl: "",
  releaseLabel: "Neon Records",
  distributionCompany: "Digital Distribution Co.",
  
  // Publishing & Rights defaults
  copyrightYear: "2023",
  copyrightOwner: "John Smith",
  pLine: "2023 Neon Records",
  cLine: "2023 Neon Publishing",
  tunecode: "",
  iceWorkKey: "",
  iswc: "",
  isrc: "USRC17607839",
  bowi: "",
  
  // Credits defaults
  composers: [
    { id: "1", name: "John Smith", role: "Songwriter", share: 50 },
    { id: "2", name: "Jane Doe", role: "Composer", share: 50 }
  ],
  producers: [
    { id: "1", name: "Jane Doe", role: "Producer" }
  ],
  engineers: [
    { id: "1", name: "Alex Wilson", role: "Mixing Engineer" }
  ],
  performers: [
    { id: "1", name: "John Smith", instrument: "Vocals" },
    { id: "2", name: "Jane Doe", instrument: "Synthesizer" }
  ],
  
  // Platform defaults
  socialLinks: {
    spotify: "",
    appleMusic: "",
    youtube: "",
    instagram: "https://instagram.com/electricsound",
    tiktok: "",
    twitter: ""
  }
};

const MetadataContext = createContext<MetadataContextProps | undefined>(undefined);

export const MetadataProvider = ({ children }: { children: ReactNode }) => {
  const [formState, setFormState] = useState<MetadataFormState>(initialFormState);
  const [metadataQualityScore, setMetadataQualityScore] = useState(45);
  const [validationIssues, setValidationIssues] = useState<IssueType[]>([
    { type: "warning", message: "ISWC code missing" },
    { type: "warning", message: "Several credits fields are empty" },
    { type: "info", message: "Consider adding more detailed artist information" }
  ]);

  useEffect(() => {
    const newScore = calculateMetadataScore(formState);
    setMetadataQualityScore(newScore);
  }, [formState]);

  const updateForm = (field: keyof MetadataFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateMetadata = () => {
    const newIssues: IssueType[] = [];
    
    // Validate ISRC format
    if (formState.isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(formState.isrc)) {
      newIssues.push({ type: "error", message: "ISRC format is invalid" });
    }
    
    // Check required fields
    if (!formState.title.trim()) newIssues.push({ type: "error", message: "Title is required" });
    if (!formState.artistName.trim()) newIssues.push({ type: "error", message: "Artist name is required" });
    
    // Check optional but recommended fields
    if (!formState.iswc) newIssues.push({ type: "warning", message: "ISWC code missing" });
    if (!formState.upc) newIssues.push({ type: "warning", message: "UPC is required for distribution" });
    
    // Validate composers share total
    const totalShare = formState.composers.reduce((sum, c) => sum + (c.share || 0), 0);
    if (totalShare !== 100 && formState.composers.length > 0) {
      newIssues.push({ type: "warning", message: `Composer shares total ${totalShare}%, should be 100%` });
    }
    
    setValidationIssues(newIssues);
  };

  const handleSaveMetadata = () => {
    // Validate metadata before saving
    validateMetadata();
    
    // This would usually involve API calls to save the data
    // For now, we just display a toast message
    import("@/hooks/use-toast").then(({ toast }) => {
      toast({
        title: "Metadata Saved",
        description: `Your metadata quality score is now ${metadataQualityScore}%`,
        variant: "default",
      });
    });
  };

  const handleAiAudit = async () => {
    import("@/hooks/use-toast").then(({ toast }) => {
      toast({
        title: "AI Audit Started",
        description: "Analyzing and suggesting improvements...",
      });
    });
    
    // Simulate AI processing
    setTimeout(() => {
      // Update form with AI suggestions
      const updatedForm = { ...formState };
      
      // Add ISWC if missing
      if (!formState.iswc) {
        updatedForm.iswc = "T-034.524.680-1";
      }
      
      // Add UPC if missing
      if (!formState.upc) {
        updatedForm.upc = "884385672382";
      }
      
      // Update form state
      setFormState(updatedForm);
      
      // Update validation issues
      const newValidationIssues: IssueType[] = [
        ...validationIssues.filter(issue => 
          issue.message !== "ISWC code missing" && 
          issue.message !== "UPC is required for distribution"
        ),
        { type: "success", message: "AI added missing ISWC code" },
        { type: "success", message: "AI added missing UPC" }
      ];
      
      setValidationIssues(newValidationIssues);
      
      // Calculate new score
      const newScore = calculateMetadataScore(updatedForm);
      setMetadataQualityScore(newScore);
      
      import("@/hooks/use-toast").then(({ toast }) => {
        toast({
          title: "AI Audit Complete",
          description: `${newScore - metadataQualityScore}% quality improvement achieved`,
        });
      });
    }, 2000);
  };

  return (
    <MetadataContext.Provider 
      value={{ 
        formState, 
        metadataQualityScore, 
        validationIssues, 
        updateForm, 
        validateMetadata, 
        handleAiAudit, 
        handleSaveMetadata 
      }}
    >
      {children}
    </MetadataContext.Provider>
  );
};

export const useMetadata = () => {
  const context = useContext(MetadataContext);
  if (context === undefined) {
    throw new Error("useMetadata must be used within a MetadataProvider");
  }
  return context;
};
