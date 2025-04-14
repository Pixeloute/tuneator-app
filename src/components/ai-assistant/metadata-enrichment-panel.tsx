
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Wand2, Sparkles, Check, ArrowRight } from "lucide-react";

interface MetadataEnrichmentPanelProps {
  onEnrichmentComplete: () => void;
}

export const MetadataEnrichmentPanel = ({ onEnrichmentComplete }: MetadataEnrichmentPanelProps) => {
  const [selectedTrack, setSelectedTrack] = useState<string>("");
  const [enrichmentType, setEnrichmentType] = useState<string>("keywords");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [result, setResult] = useState<string>("");
  
  const mockTracks = [
    { id: "track1", name: "Midnight Dreams" },
    { id: "track2", name: "Electric Sunrise" },
    { id: "track3", name: "Cosmic Wanderer" },
  ];
  
  const handleEnrich = () => {
    setIsProcessing(true);
    setProgress(0);
    setResult("");
    
    // Simulate AI processing with a progress indicator
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          
          // Provide mock results based on enrichment type
          if (enrichmentType === "keywords") {
            setResult("✓ Generated Keywords: electronic, ambient, atmospheric, cinematic, downtempo, dreamy, immersive, night, pulsing, synthwave");
          } else if (enrichmentType === "description") {
            setResult("✓ Enhanced Description: \"Midnight Dreams is an immersive electronic track with pulsing synths and atmospheric vocals. The composition creates a dreamlike sonic landscape with layers of ambient textures and subtle rhythmic elements, perfect for late-night playlists.\"");
          } else if (enrichmentType === "genre") {
            setResult("✓ Primary Genre: Electronic\n✓ Sub-genres: Ambient, Downtempo, Synthwave\n✓ Style Tags: Atmospheric, Nocturnal, Cinematic");
          } else {
            setResult("✓ Enhanced metadata with AI suggestions for better discoverability across platforms.");
          }
          
          onEnrichmentComplete();
        }
        return newProgress;
      });
    }, 300);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-electric" />
          <span>Metadata Enrichment</span>
        </CardTitle>
        <CardDescription>
          Use AI to enhance your track's metadata for better discoverability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="track-select">Select Track</Label>
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger id="track-select">
              <SelectValue placeholder="Choose a track to enhance" />
            </SelectTrigger>
            <SelectContent>
              {mockTracks.map((track) => (
                <SelectItem key={track.id} value={track.id}>
                  {track.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="enrichment-type">Enrichment Type</Label>
          <Select value={enrichmentType} onValueChange={setEnrichmentType}>
            <SelectTrigger id="enrichment-type">
              <SelectValue placeholder="Select enrichment type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="keywords">Keywords Generation</SelectItem>
              <SelectItem value="description">Description Enhancement</SelectItem>
              <SelectItem value="genre">Genre Classification</SelectItem>
              <SelectItem value="complete">Complete Metadata Enhancement</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {isProcessing ? (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>AI Analyzing Track...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        ) : result ? (
          <div className="p-4 bg-muted/50 rounded-md">
            <h4 className="font-medium mb-2 flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-electric" />
              AI Enhancement Results
            </h4>
            <div className="whitespace-pre-line text-sm">{result}</div>
          </div>
        ) : null}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {result ? (
          <Button 
            variant="outline" 
            onClick={() => {
              setResult("");
              setSelectedTrack("");
            }}
          >
            New Enrichment
          </Button>
        ) : (
          <Button
            disabled={!selectedTrack || isProcessing}
            className="bg-electric hover:bg-electric/90 text-white"
            onClick={handleEnrich}
          >
            {isProcessing ? "Processing..." : "Enrich Metadata"}
            {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
