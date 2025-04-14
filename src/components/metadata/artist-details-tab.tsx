
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info, Wand2 } from "lucide-react";
import { MetadataFormState } from "./metadata-form";

interface ArtistDetailsTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const ArtistDetailsTab = ({ formState, updateForm }: ArtistDetailsTabProps) => {
  // AI suggestions for artist info
  const getAiSuggestions = () => {
    // Simulate AI suggestions
    if (!formState.phoneticPronunciation && formState.artistName) {
      // Generate a basic phonetic pronunciation based on artist name
      let phonetic = "";
      if (formState.artistName === "The Electric Sound") {
        phonetic = "thuh ih-LEK-trik sound";
      }
      
      if (phonetic) {
        updateForm('phoneticPronunciation', phonetic);
      }
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="artistName" className="text-sm font-medium">
                  Artist Name <span className="text-destructive">*</span>
                </Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Artist Name</h4>
                      <p className="text-xs text-muted-foreground">
                        The official name of the artist as it should appear on platforms.
                        Required for distribution.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="artistName"
                value={formState.artistName}
                onChange={(e) => updateForm('artistName', e.target.value)}
                className={!formState.artistName ? "border-destructive" : ""}
                placeholder="Official artist name"
              />
              {!formState.artistName && (
                <p className="text-xs text-destructive">Required field</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="stylizedName" className="text-sm font-medium">Stylized Name</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The artist name with specific stylization (e.g., ALL CAPS, lowercase, symbols).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="stylizedName"
                value={formState.stylizedName}
                onChange={(e) => updateForm('stylizedName', e.target.value)}
                placeholder="e.g., ARTIST NAME, artist.name"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="phoneticPronunciation" className="text-sm font-medium">Phonetic Pronunciation</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      How to pronounce the artist name phonetically. Useful for voice platforms.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="phoneticPronunciation"
                value={formState.phoneticPronunciation}
                onChange={(e) => updateForm('phoneticPronunciation', e.target.value)}
                placeholder="e.g., ah-TIS nay-m"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="akaNames" className="text-sm font-medium">AKA/FKA Names</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Other names the artist is known as or formerly known as.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="akaNames"
                value={formState.akaNames}
                onChange={(e) => updateForm('akaNames', e.target.value)}
                placeholder="e.g., DJ Name, Previous Name"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="artistType" className="text-sm font-medium">Artist Type</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The classification of the artist (Solo, Band, Duo, etc.).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="artistType"
                value={formState.artistType}
                onChange={(e) => updateForm('artistType', e.target.value)}
                placeholder="e.g., Solo, Band, Duo"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="companyName" className="text-sm font-medium">Company Name</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The legal business entity associated with the artist.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="companyName"
                value={formState.companyName}
                onChange={(e) => updateForm('companyName', e.target.value)}
                placeholder="e.g., Artist LLC, Artist Inc."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="legalNames" className="text-sm font-medium">Legal Name(s)</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Legal names of the individuals comprising the artist/group.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="legalNames"
                value={formState.legalNames}
                onChange={(e) => updateForm('legalNames', e.target.value)}
                placeholder="e.g., John Smith, Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="featuring" className="text-sm font-medium">Featuring Artists</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Any featured artists on this track. Will appear as "feat. X" on platforms.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="featuring"
                value={formState.featuring}
                onChange={(e) => updateForm('featuring', e.target.value)}
                placeholder="e.g., Featured Artist Name"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="backgroundVocals" className="text-sm font-medium">Background Vocals</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Artists who contributed background vocals to the track.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="backgroundVocals"
                value={formState.backgroundVocals}
                onChange={(e) => updateForm('backgroundVocals', e.target.value)}
                placeholder="e.g., Jane Doe, John Smith"
              />
            </div>
          </div>
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
