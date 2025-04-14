
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music2, Clock, Calendar, Waveform, HelpCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        <CardTitle className="flex items-center gap-2">
          <Waveform className="h-5 w-5 text-muted-foreground" />
          Technical Metadata
        </CardTitle>
        <CardDescription>Audio characteristics and technical specifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="bpm">Tempo (BPM)</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">Beats per minute - the speed or pace of a given piece of music</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Input
              id="bpm"
              type="number"
              value={bpm}
              onChange={(e) => setBpm(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label htmlFor="key">Musical Key</Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/70 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-[200px] text-xs">The tonal center of your music, important for DJ mixing and playlist compatibility</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                <SelectItem value="D Minor">D Minor</SelectItem>
                <SelectItem value="Bb Major">Bb Major</SelectItem>
                <SelectItem value="G Minor">G Minor</SelectItem>
                <SelectItem value="Eb Major">Eb Major</SelectItem>
                <SelectItem value="C Minor">C Minor</SelectItem>
                <SelectItem value="Unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="p-2 border rounded-md bg-muted/20">
            <div className="flex items-center gap-2 mb-1">
              <Waveform className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">Audio Waveform</h3>
            </div>
            <div className="h-16 rounded-md bg-black/5 flex items-center justify-center p-2 overflow-hidden">
              <svg width="100%" height="100%" viewBox="0 0 600 60" preserveAspectRatio="none">
                <g>
                  {Array.from({ length: 100 }).map((_, i) => {
                    const height = Math.abs(Math.sin(i * 0.2) * 25 + Math.random() * 15);
                    return (
                      <rect 
                        key={i} 
                        x={i * 6} 
                        y={30 - height/2} 
                        width="3" 
                        height={height} 
                        fill="#4f46e5" 
                        opacity={0.7 + Math.random() * 0.3}
                      />
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center p-4 border rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
              <Music2 className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-sm font-medium">Audio Format</h3>
              <p className="text-sm text-muted-foreground">WAV 44.1kHz/24-bit</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
              <Clock className="h-8 w-8 text-muted-foreground mb-2" />
              <h3 className="text-sm font-medium">Duration</h3>
              <p className="text-sm text-muted-foreground">3:45</p>
            </div>
            <div className="flex flex-col items-center p-4 border rounded-md bg-muted/10 hover:bg-muted/20 transition-colors">
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
