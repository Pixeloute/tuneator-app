
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StreamingPlatforms } from "./streaming-platforms";
import { SocialMedia } from "./social-media";
import { ActionButtons } from "./action-buttons";
import { PlatformsTabProps } from "./types";

export const PlatformsTab = ({ formState, updateForm }: PlatformsTabProps) => {
  const [isSearching, setIsSearching] = useState(false);
  
  // Update social links
  const updateSocialLink = (platform: string, value: string) => {
    const updatedLinks = {
      ...formState.socialLinks,
      [platform]: value
    };
    updateForm('socialLinks', updatedLinks);
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StreamingPlatforms 
            formState={formState} 
            updateSocialLink={updateSocialLink} 
          />
          
          <SocialMedia 
            formState={formState} 
            updateSocialLink={updateSocialLink} 
          />
        </div>
        
        <ActionButtons 
          formState={formState} 
          updateForm={updateForm} 
          isSearching={isSearching} 
          setIsSearching={setIsSearching} 
        />
      </CardContent>
    </Card>
  );
};
