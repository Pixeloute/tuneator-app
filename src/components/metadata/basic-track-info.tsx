
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Wand2 } from "lucide-react";

interface BasicTrackInfoProps {
  title: string;
  setTitle: (value: string) => void;
  artist: string;
  setArtist: (value: string) => void;
  album: string;
  setAlbum: (value: string) => void;
  language: string;
  setLanguage: (value: string) => void;
  genre: string;
  setGenre: (value: string) => void;
  release: string;
  setRelease: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  explicit: boolean;
  setExplicit: (value: boolean) => void;
  onAiSuggestions: () => void;
}

export const BasicTrackInfo = ({
  title,
  setTitle,
  artist,
  setArtist,
  album,
  setAlbum,
  language,
  setLanguage,
  genre,
  setGenre,
  release,
  setRelease,
  description,
  setDescription,
  explicit,
  setExplicit,
  onAiSuggestions
}: BasicTrackInfoProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Track Information</CardTitle>
            <CardDescription>Edit your track's basic information</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-1" onClick={onAiSuggestions}>
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
  );
};
