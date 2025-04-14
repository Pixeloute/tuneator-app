
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Wand2, Search, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api-service";
import { ActionButtonsProps } from "./types";

export const ActionButtons = ({ formState, updateForm, isSearching, setIsSearching }: ActionButtonsProps) => {
  const { toast } = useToast();
  
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
    
    toast({
      title: "Links Generated",
      description: "Platform link suggestions have been generated based on artist name.",
    });
  };
  
  // Search for real links using APIs
  const searchForRealLinks = async () => {
    if (!formState.artistName) {
      toast({
        title: "Missing Information",
        description: "Please enter an artist name before searching for platform links.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Use our API service to search for the artist
      const artistInfo = await apiService.findArtistInfo(formState.artistName);
      
      // Create a new object for updated links
      const updatedLinks = { ...formState.socialLinks };
      
      // Update Spotify link if found
      if (artistInfo.spotify && artistInfo.spotify.length > 0) {
        const spotifyArtist = artistInfo.spotify[0];
        updatedLinks.spotify = spotifyArtist.external_urls?.spotify || updatedLinks.spotify;
      }
      
      // Update YouTube link by searching for the artist's channel
      const youtubeResults = await apiService.youtubeApi.searchYouTubeVideos(
        `${formState.artistName} official artist channel`
      );
      
      if (youtubeResults && youtubeResults.length > 0) {
        const channelTitle = youtubeResults[0].channelTitle;
        // If we found a channel, use it to create a YouTube link
        updatedLinks.youtube = `https://youtube.com/channel/${channelTitle}`;
      }
      
      // Update links in form state
      updateForm('socialLinks', updatedLinks);
      
      toast({
        title: "Links Updated",
        description: "Platform links have been updated with real data where available.",
      });
      
    } catch (error) {
      console.error("Error searching for platform links:", error);
      toast({
        title: "Search Failed",
        description: "Failed to retrieve platform links. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Format links to ensure they have http/https
  const formatLinks = () => {
    // Verify all links have http/https
    const updatedLinks = { ...formState.socialLinks };
    let updated = false;
    
    Object.keys(updatedLinks).forEach(key => {
      const link = updatedLinks[key as keyof typeof updatedLinks];
      if (link && !link.startsWith('http')) {
        updatedLinks[key as keyof typeof updatedLinks] = `https://${link}`;
        updated = true;
      }
    });
    
    if (updated) {
      updateForm('socialLinks', updatedLinks);
      toast({
        title: "Links Formatted",
        description: "Links without http/https have been updated to use https.",
      });
    } else {
      toast({
        description: "All links are already properly formatted.",
      });
    }
  };
  
  return (
    <div className="mt-4 flex flex-wrap justify-end gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center space-x-2"
        onClick={searchForRealLinks}
        disabled={isSearching || !formState.artistName}
      >
        {isSearching ? <Spinner className="h-4 w-4 mr-2" /> : <Search className="h-4 w-4 mr-2" />}
        <span>Find Real Links</span>
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center space-x-2"
        onClick={getAiSuggestions}
      >
        <Wand2 className="h-4 w-4 mr-2" />
        <span>Generate Platform Links</span>
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="flex items-center space-x-2"
        onClick={formatLinks}
      >
        <LinkIcon className="h-4 w-4 mr-2" />
        <span>Format Links</span>
      </Button>
    </div>
  );
};
