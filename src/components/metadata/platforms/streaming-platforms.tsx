
import { PlatformLink } from "./platform-link";
import { PlatformSectionProps } from "./types";

export const StreamingPlatforms = ({ formState, updateSocialLink }: PlatformSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Streaming Platforms</h3>
      
      <PlatformLink
        id="spotify"
        label="Spotify"
        value={formState.socialLinks.spotify || ""}
        onChange={(value) => updateSocialLink('spotify', value)}
        placeholder="https://open.spotify.com/artist/..."
        infoText="Link to the artist or track on Spotify."
      />
      
      <PlatformLink
        id="appleMusic"
        label="Apple Music"
        value={formState.socialLinks.appleMusic || ""}
        onChange={(value) => updateSocialLink('appleMusic', value)}
        placeholder="https://music.apple.com/artist/..."
        infoText="Link to the artist or track on Apple Music."
      />
      
      <PlatformLink
        id="youtube"
        label="YouTube"
        value={formState.socialLinks.youtube || ""}
        onChange={(value) => updateSocialLink('youtube', value)}
        placeholder="https://youtube.com/..."
        infoText="Link to the artist's YouTube channel or the official music video."
      />
      
      <PlatformLink
        id="soundcloud"
        label="SoundCloud"
        value={formState.socialLinks.soundcloud || ""}
        onChange={(value) => updateSocialLink('soundcloud', value)}
        placeholder="https://soundcloud.com/..."
        infoText="Link to the artist's SoundCloud profile."
      />
    </div>
  );
};
