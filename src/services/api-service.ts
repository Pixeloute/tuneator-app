
// Consolidated API Service for Tuneator
// This service brings together all the music industry APIs

import spotifyApi from './spotify-api';
import youtubeApi from './youtube-api';
import musicbrainzApi from './musicbrainz-api';
import discogsApi from './discogs-api';
import googleApi from './google-api';
import { searchAcrossAll, getISRCData, findArtistInfo } from './search-service';
import { getComprehensiveMetadata } from './metadata-service';
import { EnrichedMetadata } from './types/shared-types';

// Re-export the EnrichedMetadata type
export type { EnrichedMetadata };

// Export all services and functions
export default {
  spotifyApi,
  youtubeApi,
  musicbrainzApi,
  discogsApi,
  googleApi,
  searchAcrossAll,
  getISRCData,
  findArtistInfo,
  getComprehensiveMetadata
};
