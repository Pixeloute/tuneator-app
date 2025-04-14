
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, Clock, FileWarning, Info, Music2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { MetadataFeedback } from "@/components/metadata/metadata-feedback";
import { RelatedRights } from "@/components/metadata/related-rights";

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
  const [validationIssues, setValidationIssues] = useState([
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
    const newValidationIssues = [
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
    const newIssues = [];
    
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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Track Information</CardTitle>
                <CardDescription>Edit your track's basic information</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1" onClick={handleAiSuggestions}>
                <Wand2 className="h-4 w-4" />
                <span>AI Enhance</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="artist">Primary Artist</Label>
                <Input
                  id="artist"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="album">Album</Label>
                <Input
                  id="album"
                  value={album}
                  onChange={(e) => setAlbum(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Instrumental">Instrumental</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="genre">Primary Genre</Label>
                <Select value={genre} onValueChange={setGenre}>
                  <SelectTrigger id="genre">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronic">Electronic</SelectItem>
                    <SelectItem value="Rock">Rock</SelectItem>
                    <SelectItem value="Hip Hop">Hip Hop</SelectItem>
                    <SelectItem value="Pop">Pop</SelectItem>
                    <SelectItem value="Jazz">Jazz</SelectItem>
                    <SelectItem value="Classical">Classical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="release">Release Date</Label>
                <Input
                  id="release"
                  type="date"
                  value={release}
                  onChange={(e) => setRelease(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2 mt-4">
              <Switch 
                id="explicit" 
                checked={explicit} 
                onCheckedChange={setExplicit}
              />
              <Label htmlFor="explicit">Explicit Content</Label>
            </div>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Technical Metadata</CardTitle>
            <CardDescription>Audio characteristics and technical specifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bpm">Tempo (BPM)</Label>
                <Input
                  id="bpm"
                  type="number"
                  value={bpm}
                  onChange={(e) => setBpm(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key">Musical Key</Label>
                <Select value={key} onValueChange={setKey}>
                  <SelectTrigger id="key">
                    <SelectValue placeholder="Select key" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C Major">C Major</SelectItem>
                    <SelectItem value="A Minor">A Minor</SelectItem>
                    <SelectItem value="G Major">G Major</SelectItem>
                    <SelectItem value="E Minor">E Minor</SelectItem>
                    <SelectItem value="D Major">D Major</SelectItem>
                    <SelectItem value="B Minor">B Minor</SelectItem>
                    <SelectItem value="F Major">F Major</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Music2 className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">Audio Format</h3>
                  <p className="text-sm text-muted-foreground">WAV 44.1kHz/24-bit</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Clock className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">Duration</h3>
                  <p className="text-sm text-muted-foreground">3:45</p>
                </div>
                <div className="flex flex-col items-center p-4 border rounded-md">
                  <Calendar className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-sm font-medium">Created</h3>
                  <p className="text-sm text-muted-foreground">Aug 12, 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
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
