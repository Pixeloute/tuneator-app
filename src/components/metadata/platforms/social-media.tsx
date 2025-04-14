
import { PlatformLink } from "./platform-link";
import { PlatformSectionProps } from "./types";

export const SocialMedia = ({ formState, updateSocialLink }: PlatformSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Social Media</h3>
      
      <PlatformLink
        id="instagram"
        label="Instagram"
        value={formState.socialLinks.instagram || ""}
        onChange={(value) => updateSocialLink('instagram', value)}
        placeholder="https://instagram.com/..."
        infoText="Link to the artist's Instagram profile."
      />
      
      <PlatformLink
        id="tiktok"
        label="TikTok"
        value={formState.socialLinks.tiktok || ""}
        onChange={(value) => updateSocialLink('tiktok', value)}
        placeholder="https://tiktok.com/@..."
        infoText="Link to the artist's TikTok profile."
      />
      
      <PlatformLink
        id="twitter"
        label="Twitter"
        value={formState.socialLinks.twitter || ""}
        onChange={(value) => updateSocialLink('twitter', value)}
        placeholder="https://twitter.com/..."
        infoText="Link to the artist's Twitter profile."
      />
      
      <PlatformLink
        id="website"
        label="Official Website"
        value={formState.socialLinks.website || ""}
        onChange={(value) => updateSocialLink('website', value)}
        placeholder="https://..."
        infoText="Link to the artist's official website."
      />
    </div>
  );
};
