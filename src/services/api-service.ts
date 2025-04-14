
import spotifyApi from './spotify-api';
import youtubeApi from './youtube-api';
import musicbrainzApi from './musicbrainz-api';
import discogsApi from './discogs-api';
import googleApi from './google-api';
import { searchAcrossAll, getISRCData, findArtistInfo } from './search-service';
import { getComprehensiveMetadata } from './metadata-service';
import { EnrichedMetadata } from './types/shared-types';

// Centralized error handling for API calls
const handleApiError = (error: unknown, serviceName: string) => {
  console.error(`Error in ${serviceName} API:`, error);
  return {
    error: true,
    message: `Failed to fetch data from ${serviceName}`,
    details: error instanceof Error ? error.message : String(error)
  };
};

// Wrap each API method with error handling
const safeApiCall = async <T>(
  apiMethod: () => Promise<T>, 
  serviceName: string
): Promise<T | { error: boolean; message: string; details?: string }> => {
  try {
    return await apiMethod();
  } catch (error) {
    return handleApiError(error, serviceName);
  }
};

export default {
  spotifyApi: {
    ...spotifyApi,
    searchSpotifyTracks: (query: string) => 
      safeApiCall(() => spotifyApi.searchSpotifyTracks(query), 'Spotify'),
    getSpotifyTrackDetails: (trackId: string) => 
      safeApiCall(() => spotifyApi.getSpotifyTrackDetails(trackId), 'Spotify')
  },
  youtubeApi,
  musicbrainzApi: {
    ...musicbrainzApi,
    searchRecordings: (query: string) => 
      safeApiCall(() => musicbrainzApi.searchRecordings(query), 'MusicBrainz'),
    lookupByISRC: (isrc: string) => 
      safeApiCall(() => musicbrainzApi.lookupByISRC(isrc), 'MusicBrainz')
  },
  discogsApi: {
    ...discogsApi,
    searchReleases: (query: string) => 
      safeApiCall(() => discogsApi.searchReleases(query), 'Discogs')
  },
  googleApi,
  searchAcrossAll,
  getISRCData,
  findArtistInfo,
  getComprehensiveMetadata
};

export type { EnrichedMetadata };
