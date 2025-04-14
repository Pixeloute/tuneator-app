
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IssueType } from "@/components/metadata/metadata-feedback";
import { RelatedRights } from "@/components/metadata/related-rights";
import { BasicTrackInfo } from "@/components/metadata/basic-track-info";
import { TechnicalMetadata } from "@/components/metadata/technical-metadata";
import { MetadataFeedback } from "@/components/metadata/metadata-feedback";

interface ContributorType {
  id: string;
  name: string;
  role: string;
  share?: number;
}

export const MetadataForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("Midnight Dreams");
  const [artist, setArtist] = useState("The Electric Sound");
  const [album, setAlbum] = useState("Neon Horizons");
  const [genre, setGenre] = useState("Electronic");
  const [isrc, setIsrc] = useState("USRC17607839");
  const [iswc, setIswc] = useState("");
  const [release, setRelease] = useState("2023-09-15");
  const [description, setDescription] = useState("A vibrant electronic track with pulsing synths and atmospheric vocals.");
  const [bpm, setBpm] = useState("128");
  const [key, setKey] = useState("A Minor");
  const [explicit, setExplicit] = useState(false);
  const [language, setLanguage] = useState("English");
  const [p_line, setPLine] = useState("2023 Neon Records");
  const [c_line, setCLine] = useState("2023 Neon Publishing");
  const [contributors, setContributors] = useState<ContributorType[]>([
    { id: "1", name: "Jane Doe", role: "Producer", share: 50 },
    { id: "2", name: "John Smith", role: "Songwriter", share: 50 },
  ]);
  const [metadataQualityScore, setMetadataQualityScore] = useState(78);
  const [validationIssues, setValidationIssues] = useState<IssueType[]>([
    { type: "warning", message: "ISWC code missing" },
    { type: "info", message: "Consider adding more detailed contributor roles" }
  ]);

  const handleSaveMetadata = () => {
    // Calculate metadata quality based on fields filled
    const totalFields = 12; // count of important fields
    const filledFields = [title, artist, album, genre, isrc, iswc, release, description, bpm, key, p_line, c_line]
      .filter(field => field && field.trim() !== "").length;
    
    // Update quality score
    const newScore = Math.floor((filledFields / totalFields) * 100);
    setMetadataQualityScore(newScore);
    
    // Show feedback based on score improvement
    if (newScore > metadataQualityScore) {
      toast({
        title: "Metadata Quality Improved",
        description: `Your metadata quality score is now ${newScore}%`,
        variant: "default",
      });
    } else {
      toast({
        title: "Metadata Saved",
        description: "Your metadata changes have been saved successfully.",
      });
    }
  };

  const handleAiSuggestions = () => {
    // Simulate AI suggesting improvements
    const newValidationIssues: IssueType[] = [
      ...validationIssues.filter(issue => issue.type !== "success"),
      { type: "success", message: "AI suggested genre tags added" }
    ];
    
    setValidationIssues(newValidationIssues);
    
    toast({
      title: "AI Enhancement Applied",
      description: "Metadata has been enhanced with AI suggestions.",
    });
  };

  const addContributor = () => {
    setContributors([
      ...contributors,
      { id: Date.now().toString(), name: "", role: "Performer", share: 0 },
    ]);
  };

  const removeContributor = (id: string) => {
    setContributors(contributors.filter((c) => c.id !== id));
  };

  const updateContributor = (id: string, field: keyof ContributorType, value: any) => {
    setContributors(
      contributors.map((c) =>
        c.id === id ? { ...c, [field]: field === 'share' ? Number(value) : value } : c
      )
    );
  };

  const validateMetadata = () => {
    const newIssues: IssueType[] = [];
    
    // Validate ISRC format
    if (isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(isrc)) {
      newIssues.push({ type: "error", message: "ISRC format is invalid" });
    }
    
    // Check for required fields
    if (!title.trim()) newIssues.push({ type: "error", message: "Title is required" });
    if (!artist.trim()) newIssues.push({ type: "error", message: "Artist is required" });
    
    // Check for recommended fields
    if (!iswc) newIssues.push({ type: "warning", message: "ISWC code missing" });
    if (!p_line) newIssues.push({ type: "warning", message: "P-Line info missing" });
    if (!c_line) newIssues.push({ type: "warning", message: "C-Line info missing" });
    
    // Contributor share validation
    const totalShare = contributors.reduce((sum, c) => sum + (c.share || 0), 0);
    if (totalShare !== 100 && contributors.length > 0) {
      newIssues.push({ type: "warning", message: `Contributor shares total ${totalShare}%, should be 100%` });
    }
    
    setValidationIssues(newIssues);
    
    toast({
      title: "Metadata Validated",
      description: `Found ${newIssues.length} issues to address`,
    });
  };

  return (
    <Tabs defaultValue="basic" className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="basic">Basic Info</TabsTrigger>
        <TabsTrigger value="rights">Rights & Ownership</TabsTrigger>
        <TabsTrigger value="technical">Technical Data</TabsTrigger>
        <TabsTrigger value="validation">Validation</TabsTrigger>
      </TabsList>
      
      <TabsContent value="basic">
        <BasicTrackInfo 
          title={title}
          setTitle={setTitle}
          artist={artist}
          setArtist={setArtist}
          album={album}
          setAlbum={setAlbum}
          language={language}
          setLanguage={setLanguage}
          genre={genre}
          setGenre={setGenre}
          release={release}
          setRelease={setRelease}
          description={description}
          setDescription={setDescription}
          explicit={explicit}
          setExplicit={setExplicit}
          onAiSuggestions={handleAiSuggestions}
        />
      </TabsContent>
      
      <TabsContent value="rights">
        <RelatedRights 
          isrc={isrc}
          setIsrc={setIsrc}
          iswc={iswc} 
          setIswc={setIswc}
          pLine={p_line}
          setPLine={setPLine}
          cLine={c_line}
          setCLine={setCLine}
          contributors={contributors}
          addContributor={addContributor}
          removeContributor={removeContributor}
          updateContributor={updateContributor}
        />
      </TabsContent>
      
      <TabsContent value="technical">
        <TechnicalMetadata 
          bpm={bpm}
          setBpm={setBpm}
          key={key}
          setKey={setKey}
        />
      </TabsContent>
      
      <TabsContent value="validation">
        <MetadataFeedback 
          score={metadataQualityScore} 
          issues={validationIssues} 
          onValidate={validateMetadata}
        />
      </TabsContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-secondary">ISRC: {isrc}</Badge>
          {iswc && <Badge variant="outline" className="bg-secondary/50">ISWC: {iswc}</Badge>}
        </div>
        <Button 
          className="bg-electric hover:bg-electric/90 text-primary-foreground"
          onClick={handleSaveMetadata}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Tabs>
  );
};
