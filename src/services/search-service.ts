
// Search service for Tuneator
// Handles searching across multiple platforms

import spotifyApi from './spotify-api';
import youtubeApi from './youtube-api';
import musicbrainzApi from './musicbrainz-api';
import discogsApi from './discogs-api';
import { SearchResults, ArtistSearchResults } from './types/shared-types';

// Search across all platforms
export const searchAcrossAll = async (query: string): Promise<SearchResults> => {
  try {
    // Run searches in parallel
    const [spotifyResults, youtubeResults, mbResults, discogsResults] = await Promise.all([
      spotifyApi.searchSpotifyTracks(query),
      youtubeApi.searchYouTubeVideos(query),
      musicbrainzApi.searchRecordings(query),
      discogsApi.searchReleases(query)
    ]);
    
    return {
      spotify: spotifyResults,
      youtube: youtubeResults,
      musicbrainz: mbResults,
      discogs: discogsResults
    };
  } catch (error) {
    console.error('Error searching across platforms:', error);
    return {
      spotify: [],
      youtube: [],
      musicbrainz: [],
      discogs: []
    };
  }
};

// Get ISRC data from MusicBrainz
export const getISRCData = async (isrc: string) => {
  try {
    return await musicbrainzApi.lookupByISRC(isrc);
  } catch (error) {
    console.error('Error getting ISRC data:', error);
    return [];
  }
};

// Find artist information across all platforms
export const findArtistInfo = async (artistName: string): Promise<ArtistSearchResults> => {
  try {
    // Run searches in parallel
    const [spotifyArtists, mbArtists, discogsArtists] = await Promise.all([
      spotifyApi.searchSpotifyTracks(`artist:${artistName}`).then(tracks => {
        // Extract unique artists from tracks
        const artistsMap = new Map();
        tracks.forEach(track => {
          track.artists.forEach(artist => {
            artistsMap.set(artist.id, artist);
          });
        });
        return Array.from(artistsMap.values());
      }),
      musicbrainzApi.searchArtists(artistName),
      discogsApi.searchDiscogsArtists(artistName)
    ]);
    
    return {
      spotify: spotifyArtists,
      musicbrainz: mbArtists,
      discogs: discogsArtists
    };
  } catch (error) {
    console.error('Error finding artist info:', error);
    return {
      spotify: [],
      musicbrainz: [],
      discogs: []
    };
  }
};
