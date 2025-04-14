
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueType } from "@/components/metadata/metadata-feedback";
import { TrackInfoTab } from "@/components/metadata/track-info-tab";
import { ArtistDetailsTab } from "@/components/metadata/artist-details-tab";
import { ReleaseInfoTab } from "@/components/metadata/release-info-tab";
import { PublishingRightsTab } from "@/components/metadata/publishing-rights-tab";
import { CreditsTab } from "@/components/metadata/credits-tab";
import { PlatformsTab } from "@/components/metadata/platforms-tab";
import { MetadataFeedback } from "@/components/metadata/metadata-feedback";
import { Wand2 } from "lucide-react";
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

export const MetadataForm = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("track-info");
  const [metadataQualityScore, setMetadataQualityScore] = useState(45);
  const [validationIssues, setValidationIssues] = useState<IssueType[]>([
    { type: "warning", message: "ISWC code missing" },
    { type: "warning", message: "Several credits fields are empty" },
    { type: "info", message: "Consider adding more detailed artist information" }
  ]);
  
  const [formState, setFormState] = useState<MetadataFormState>({
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
  });

  // Update score whenever form state changes
  useEffect(() => {
    const newScore = calculateMetadataScore(formState);
    setMetadataQualityScore(newScore);
  }, [formState]);

  const handleFormUpdate = (section: keyof MetadataFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: value
    }));
  };

  const handleSaveMetadata = () => {
    // Validate metadata before saving
    validateMetadata();
    
    toast({
      title: "Metadata Saved",
      description: `Your metadata quality score is now ${metadataQualityScore}%`,
      variant: "default",
    });
  };

  const handleAiAudit = async () => {
    toast({
      title: "AI Audit Started",
      description: "Analyzing and suggesting improvements...",
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
      const newValidationIssues = [
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
      
      toast({
        title: "AI Audit Complete",
        description: `${newScore - metadataQualityScore}% quality improvement achieved`,
      });
    }, 2000);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">Track Metadata</h2>
          <Badge variant="outline" className={`${metadataQualityScore > 80 ? 'bg-mint/20 text-mint' : metadataQualityScore > 60 ? 'bg-electric/20 text-electric' : 'bg-yellow-500/20 text-yellow-500'}`}>
            {metadataQualityScore}% Complete
          </Badge>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2"
            onClick={handleAiAudit}
          >
            <Wand2 className="h-4 w-4" />
            <span>Audit & Autofix</span>
          </Button>
          
          <Button 
            className="bg-electric hover:bg-electric/90 text-primary-foreground"
            onClick={handleSaveMetadata}
          >
            Save Changes
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 lg:grid-cols-6 w-full">
              <TabsTrigger value="track-info">Track Info</TabsTrigger>
              <TabsTrigger value="artist-details">Artist Details</TabsTrigger>
              <TabsTrigger value="release-info">Release Info</TabsTrigger>
              <TabsTrigger value="publishing-rights">Publishing & Rights</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track-info">
              <TrackInfoTab
                formState={formState}
                updateForm={handleFormUpdate}
              />
            </TabsContent>
            
            <TabsContent value="artist-details">
              <ArtistDetailsTab
                formState={formState}
                updateForm={handleFormUpdate}
              />
            </TabsContent>
            
            <TabsContent value="release-info">
              <ReleaseInfoTab
                formState={formState}
                updateForm={handleFormUpdate}
              />
            </TabsContent>
            
            <TabsContent value="publishing-rights">
              <PublishingRightsTab
                formState={formState}
                updateForm={handleFormUpdate}
              />
            </TabsContent>
            
            <TabsContent value="credits">
              <CreditsTab
                formState={formState}
                updateForm={handleFormUpdate}
              />
            </TabsContent>
            
            <TabsContent value="platforms">
              <PlatformsTab
                formState={formState}
                updateForm={handleFormUpdate}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <MetadataFeedback 
            score={metadataQualityScore} 
            issues={validationIssues} 
            onValidate={validateMetadata}
          />
        </div>
      </div>
    </div>
  );
};
