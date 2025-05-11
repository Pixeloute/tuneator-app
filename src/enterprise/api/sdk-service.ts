import SpotifyWebApi from 'spotify-web-api-node';

export type Platform = 'spotify' | 'apple' | 'ddex' | 'pros';

export class SDKService {
  private spotify: SpotifyWebApi | null = null;

  async connect(platform: Platform, credentials: any): Promise<boolean> {
    if (platform === 'spotify') {
      this.spotify = new SpotifyWebApi({
        clientId: credentials.clientId,
        clientSecret: credentials.clientSecret,
        accessToken: credentials.accessToken,
        refreshToken: credentials.refreshToken,
      });
      return true;
    }
    return false;
  }

  async fetchData(platform: Platform, resource: string): Promise<any> {
    if (platform === 'spotify' && this.spotify) {
      if (resource.startsWith('track:')) {
        const id = resource.split(':')[1];
        return this.spotify.getTrack(id);
      }
      if (resource.startsWith('artist:')) {
        const id = resource.split(':')[1];
        return this.spotify.getArtist(id);
      }
    }
    return null;
  }
} 