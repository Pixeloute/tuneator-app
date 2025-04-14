
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music2, Clock, Calendar } from "lucide-react";

interface TechnicalMetadataProps {
  bpm: string;
  setBpm: (value: string) => void;
  key: string;
  setKey: (value: string) => void;
}

export const TechnicalMetadata = ({
  bpm,
  setBpm,
  key,
  setKey
}: TechnicalMetadataProps) => {
  return (
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
  );
};
