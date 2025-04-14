
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info, Wand2 } from "lucide-react";
import { validateBPM, validateFilename } from "@/lib/metadata-validator";
import { MetadataFormState } from "./metadata-form";

interface TrackInfoTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const TrackInfoTab = ({ formState, updateForm }: TrackInfoTabProps) => {
  // Local validation states
  const [bpmError, setBpmError] = useState("");
  const [fileNameError, setFileNameError] = useState("");
  
  // Handle BPM validation
  const handleBpmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('bpm', value);
    
    if (!validateBPM(value)) {
      setBpmError("BPM must be a positive number");
    } else {
      setBpmError("");
    }
  };
  
  // Handle file name validation
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('audioFileName', value);
    
    if (!validateFilename(value)) {
      setFileNameError("Invalid filename format");
    } else {
      setFileNameError("");
    }
  };
  
  // Handle tags change
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    updateForm('tags', tagsArray);
  };
  
  // Get AI suggestions for track info
  const getAiSuggestions = () => {
    // Simulate AI suggestions
    if (formState.genre === "Electronic" && !formState.tags.includes("EDM")) {
      const newTags = [...formState.tags, "EDM", "Dance"];
      updateForm('tags', newTags);
    }
    
    if (!formState.mood && formState.genre) {
      let suggestedMood = "";
      switch (formState.genre) {
        case "Electronic":
          suggestedMood = "Energetic, Uplifting";
          break;
        case "Hip-Hop/Rap":
          suggestedMood = "Confident, Rhythmic";
          break;
        case "Pop":
          suggestedMood = "Catchy, Upbeat";
          break;
        default:
          suggestedMood = "Expressive";
      }
      updateForm('mood', suggestedMood);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Song Title <span className="text-destructive">*</span>
                </Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Song Title</h4>
                      <p className="text-xs text-muted-foreground">
                        The main title of the track as it should appear on platforms.
                        Required for distribution.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="title"
                value={formState.title}
                onChange={(e) => updateForm('title', e.target.value)}
                className={!formState.title ? "border-destructive" : ""}
                placeholder="Enter song title"
              />
              {!formState.title && (
                <p className="text-xs text-destructive">Required field</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="altTitle" className="text-sm font-medium">Alternative Title</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Optional alternative title for the track, such as translated titles or alternate spellings.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="altTitle"
                value={formState.altTitle}
                onChange={(e) => updateForm('altTitle', e.target.value)}
                placeholder="Optional alternative title"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="trackPosition" className="text-sm font-medium">Track Position</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The position of this track within an album or EP.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="trackPosition"
                value={formState.trackPosition}
                onChange={(e) => updateForm('trackPosition', e.target.value)}
                placeholder="e.g., 1"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="duration" className="text-sm font-medium">Duration</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The track's duration in minutes and seconds (MM:SS).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="duration"
                value={formState.duration}
                onChange={(e) => updateForm('duration', e.target.value)}
                placeholder="e.g., 3:45"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bpm" className="text-sm font-medium">BPM</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Beats Per Minute - the tempo of the track. Must be a positive number.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="bpm"
                value={formState.bpm}
                onChange={handleBpmChange}
                className={bpmError ? "border-destructive" : ""}
                placeholder="e.g., 120"
              />
              {bpmError && (
                <p className="text-xs text-destructive">{bpmError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="key" className="text-sm font-medium">Musical Key</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The musical key of the track (e.g., C Major, A Minor).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="key"
                value={formState.key}
                onChange={(e) => updateForm('key', e.target.value)}
                placeholder="e.g., C Major"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="genre" className="text-sm font-medium">
                  Genre <span className="text-destructive">*</span>
                </Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Primary genre of the track. Required for distribution.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="genre"
                value={formState.genre}
                onChange={(e) => updateForm('genre', e.target.value)}
                className={!formState.genre ? "border-destructive" : ""}
                placeholder="e.g., Electronic, Pop, Hip-Hop"
              />
              {!formState.genre && (
                <p className="text-xs text-destructive">Required field</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="subGenre" className="text-sm font-medium">Sub-Genre</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      More specific genre classification (e.g., Deep House, Trap, Alt-Pop).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="subGenre"
                value={formState.subGenre}
                onChange={(e) => updateForm('subGenre', e.target.value)}
                placeholder="e.g., Deep House, Trap"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The primary language of the lyrics or vocals.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="language"
                value={formState.language}
                onChange={(e) => updateForm('language', e.target.value)}
                placeholder="e.g., English, Spanish"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="mood" className="text-sm font-medium">Mood Description</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Descriptive terms for the emotional quality of the track.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="mood"
                value={formState.mood}
                onChange={(e) => updateForm('mood', e.target.value)}
                placeholder="e.g., Energetic, Relaxed, Melancholic"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Keywords to help with discoverability. Separate with commas.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="tags"
                value={formState.tags.join(', ')}
                onChange={handleTagsChange}
                placeholder="e.g., summer, dance, remix"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="audioFileName" className="text-sm font-medium">Audio File Name</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Name of the audio file including extension (e.g. .wav, .mp3).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="audioFileName"
                value={formState.audioFileName}
                onChange={handleFileNameChange}
                className={fileNameError ? "border-destructive" : ""}
                placeholder="e.g., track_name.wav"
              />
              {fileNameError && (
                <p className="text-xs text-destructive">{fileNameError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="explicit" className="text-sm font-medium">Explicit Content</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Toggle on if the track contains explicit lyrics or content.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="explicit"
                  checked={formState.explicit}
                  onCheckedChange={(checked) => updateForm('explicit', checked)}
                />
                <Label htmlFor="explicit">Contains explicit content</Label>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="lyrics" className="text-sm font-medium">Lyrics</Label>
            <HoverCard>
              <HoverCardTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <p className="text-xs">
                  Full lyrics of the track. For songs with vocals, this helps with SEO and accessibility.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
          <Textarea
            id="lyrics"
            value={formState.lyrics}
            onChange={(e) => updateForm('lyrics', e.target.value)}
            placeholder="Enter track lyrics here"
            className="min-h-[100px]"
          />
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={getAiSuggestions}
          >
            <Wand2 className="h-4 w-4" />
            <span>AI Suggestions</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
