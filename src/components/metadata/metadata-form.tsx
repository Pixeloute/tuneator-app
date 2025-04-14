
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContributorType {
  id: string;
  name: string;
  role: string;
}

export const MetadataForm = () => {
  const { toast } = useToast();
  const [title, setTitle] = useState("Midnight Dreams");
  const [artist, setArtist] = useState("The Electric Sound");
  const [album, setAlbum] = useState("Neon Horizons");
  const [genre, setGenre] = useState("Electronic");
  const [isrc, setIsrc] = useState("USRC17607839");
  const [release, setRelease] = useState("2023-09-15");
  const [description, setDescription] = useState("A vibrant electronic track with pulsing synths and atmospheric vocals.");
  const [contributors, setContributors] = useState<ContributorType[]>([
    { id: "1", name: "Jane Doe", role: "Producer" },
    { id: "2", name: "John Smith", role: "Songwriter" },
  ]);

  const handleSaveMetadata = () => {
    toast({
      title: "Metadata Saved",
      description: "Your metadata changes have been saved successfully.",
    });
  };

  const handleAiSuggestions = () => {
    toast({
      title: "AI Suggestions",
      description: "AI metadata enhancement will be available after OpenAI integration.",
    });
  };

  const addContributor = () => {
    setContributors([
      ...contributors,
      { id: Date.now().toString(), name: "", role: "Performer" },
    ]);
  };

  const removeContributor = (id: string) => {
    setContributors(contributors.filter((c) => c.id !== id));
  };

  const updateContributor = (id: string, field: keyof ContributorType, value: string) => {
    setContributors(
      contributors.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Track Metadata</CardTitle>
            <CardDescription>Edit your track's information</CardDescription>
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
            <Label htmlFor="genre">Genre</Label>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="isrc">ISRC Code</Label>
            <Input
              id="isrc"
              value={isrc}
              onChange={(e) => setIsrc(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">International Standard Recording Code</p>
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

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <Label>Contributors</Label>
            <Button variant="outline" size="sm" onClick={addContributor}>
              Add Contributor
            </Button>
          </div>
          
          <div className="space-y-3">
            {contributors.map((contributor) => (
              <div key={contributor.id} className="flex items-center gap-2 p-2 rounded-md border border-border">
                <div className="flex-1">
                  <Input
                    value={contributor.name}
                    onChange={(e) =>
                      updateContributor(contributor.id, "name", e.target.value)
                    }
                    placeholder="Name"
                    className="mb-1"
                  />
                  <Select
                    value={contributor.role}
                    onValueChange={(value) =>
                      updateContributor(contributor.id, "role", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Producer">Producer</SelectItem>
                      <SelectItem value="Songwriter">Songwriter</SelectItem>
                      <SelectItem value="Performer">Performer</SelectItem>
                      <SelectItem value="Engineer">Engineer</SelectItem>
                      <SelectItem value="Arranger">Arranger</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContributor(contributor.id)}
                  className="h-8 text-muted-foreground hover:text-destructive"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Badge variant="outline" className="bg-secondary">ISRC Verified</Badge>
          <Badge variant="outline" className="bg-secondary/50">PRO Registered</Badge>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="bg-electric hover:bg-electric/90 text-primary-foreground ml-auto"
          onClick={handleSaveMetadata}
        >
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
};
