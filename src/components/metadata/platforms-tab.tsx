
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info, Wand2 } from "lucide-react";
import { validateEmail } from "@/lib/metadata-validator";
import { MetadataFormState } from "./metadata-form";

interface PlatformsTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const PlatformsTab = ({ formState, updateForm }: PlatformsTabProps) => {
  // Update social links
  const updateSocialLink = (platform: string, value: string) => {
    const updatedLinks = {
      ...formState.socialLinks,
      [platform]: value
    };
    updateForm('socialLinks', updatedLinks);
  };
  
  // AI suggestions for platform links
  const getAiSuggestions = () => {
    // Convert artist name to a slug for URLs
    const slug = formState.artistName.toLowerCase().replace(/\s+/g, '');
    
    // Generate placeholder links if missing
    const updatedLinks = { ...formState.socialLinks };
    
    if (!updatedLinks.spotify) {
      updatedLinks.spotify = `https://open.spotify.com/artist/${slug}`;
    }
    
    if (!updatedLinks.appleMusic) {
      updatedLinks.appleMusic = `https://music.apple.com/artist/${slug}`;
    }
    
    if (!updatedLinks.youtube) {
      updatedLinks.youtube = `https://youtube.com/c/${slug}`;
    }
    
    if (!updatedLinks.instagram && !formState.socialLinks.instagram) {
      updatedLinks.instagram = `https://instagram.com/${slug}`;
    }
    
    if (!updatedLinks.tiktok) {
      updatedLinks.tiktok = `https://tiktok.com/@${slug}`;
    }
    
    if (!updatedLinks.twitter) {
      updatedLinks.twitter = `https://twitter.com/${slug}`;
    }
    
    updateForm('socialLinks', updatedLinks);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium">Streaming Platforms</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="spotify" className="text-sm font-medium">Spotify</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the artist or track on Spotify.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="spotify"
                value={formState.socialLinks.spotify || ""}
                onChange={(e) => updateSocialLink('spotify', e.target.value)}
                placeholder="https://open.spotify.com/artist/..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="appleMusic" className="text-sm font-medium">Apple Music</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the artist or track on Apple Music.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="appleMusic"
                value={formState.socialLinks.appleMusic || ""}
                onChange={(e) => updateSocialLink('appleMusic', e.target.value)}
                placeholder="https://music.apple.com/artist/..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="youtube" className="text-sm font-medium">YouTube</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the artist's YouTube channel or the official music video.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="youtube"
                value={formState.socialLinks.youtube || ""}
                onChange={(e) => updateSocialLink('youtube', e.target.value)}
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Social Media</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="instagram" className="text-sm font-medium">Instagram</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the artist's Instagram profile.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="instagram"
                value={formState.socialLinks.instagram || ""}
                onChange={(e) => updateSocialLink('instagram', e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="tiktok" className="text-sm font-medium">TikTok</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the artist's TikTok profile.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="tiktok"
                value={formState.socialLinks.tiktok || ""}
                onChange={(e) => updateSocialLink('tiktok', e.target.value)}
                placeholder="https://tiktok.com/@..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="twitter" className="text-sm font-medium">Twitter</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the artist's Twitter profile.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="twitter"
                value={formState.socialLinks.twitter || ""}
                onChange={(e) => updateSocialLink('twitter', e.target.value)}
                placeholder="https://twitter.com/..."
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
            <span>Generate Platform Links</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
