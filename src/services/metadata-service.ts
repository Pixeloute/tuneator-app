
// Metadata service for Tuneator
// Handles comprehensive metadata operations across platforms

import spotifyApi from './spotify-api';
import youtubeApi from './youtube-api';
import musicbrainzApi from './musicbrainz-api';
import discogsApi from './discogs-api';
import { EnrichedMetadata } from './types/shared-types';

// Get comprehensive metadata for a track
export const getComprehensiveMetadata = async (
  trackName: string,
  artistName: string,
  isrc?: string
): Promise<EnrichedMetadata> => {
  const query = `${trackName} ${artistName}`;
  const metadata: EnrichedMetadata = {};
  
  try {
    // Start with Spotify for audio features
    const spotifyTracks = await spotifyApi.searchSpotifyTracks(query);
    
    if (spotifyTracks.length > 0) {
      const track = spotifyTracks[0];
      metadata.title = track.name;
      metadata.artists = track.artists.map(artist => ({
        name: artist.name,
        id: artist.id,
        source: 'spotify' as const
      }));
      metadata.album = {
        title: track.album.name,
        releaseDate: track.album.release_date,
        artwork: track.album.images[0]?.url
      };
      metadata.duration = track.duration_ms;
      metadata.externalLinks = {
        spotify: track.external_urls.spotify
      };
      
      // Get audio features
      const audioFeatures = await spotifyApi.getAudioFeatures(track.id);
      if (audioFeatures) {
        metadata.bpm = audioFeatures.tempo;
        metadata.key = audioFeatures.key_name;
        metadata.audioFeatures = {
          danceability: audioFeatures.danceability,
          energy: audioFeatures.energy,
          valence: audioFeatures.valence,
          acousticness: audioFeatures.acousticness,
          instrumentalness: audioFeatures.instrumentalness
        };
      }
      
      // Get related artists
      if (track.artists[0]) {
        const relatedArtists = await spotifyApi.getRelatedArtists(track.artists[0].id);
        metadata.relatedArtists = relatedArtists.slice(0, 5).map(artist => ({
          name: artist.name,
          id: artist.id,
          source: 'spotify' as const
        }));
      }
    }
    
    // Get YouTube videos
    const videos = await youtubeApi.findMusicVideos(artistName, trackName);
    if (videos.length > 0) {
      metadata.videos = videos.map(video => ({
        id: video.id,
        title: video.title,
        thumbnail: video.thumbnails.high?.url || video.thumbnails.medium?.url || '',
        url: `https://www.youtube.com/watch?v=${video.id}`
      }));
      
      if (videos[0]) {
        metadata.externalLinks = {
          ...metadata.externalLinks,
          youtube: `https://www.youtube.com/watch?v=${videos[0].id}`
        };
      }
    }
    
    // Get MusicBrainz data - start with ISRC if available
    let mbRecordings = [];
    if (isrc) {
      mbRecordings = await musicbrainzApi.lookupByISRC(isrc);
    }
    
    // If no results from ISRC, search by name
    if (mbRecordings.length === 0) {
      mbRecordings = await musicbrainzApi.searchRecordings(query);
    }
    
    if (mbRecordings.length > 0) {
      const recording = mbRecordings[0];
      
      // Update with MusicBrainz data
      if (!metadata.title) metadata.title = recording.title;
      
      // Add MusicBrainz artists if not already present
      const mbArtists = recording.artist_credit?.map(credit => ({
        name: credit.name,
        id: credit.artist.id,
        source: 'musicbrainz' as const
      })) || [];
      
      if (!metadata.artists) {
        metadata.artists = mbArtists;
      }
      
      // Add MusicBrainz link
      metadata.externalLinks = {
        ...metadata.externalLinks,
        musicbrainz: `https://musicbrainz.org/recording/${recording.id}`
      };
      
      // Get ISRC if not already provided
      if (!isrc && recording.isrcs && recording.isrcs.length > 0) {
        metadata.isrc = recording.isrcs[0];
      }
      
      // Add tags/genres from MusicBrainz
      if (recording.tags && recording.tags.length > 0) {
        metadata.genres = recording.tags.map(tag => tag.name);
      }
    }
    
    // Get Discogs data
    const discogsReleases = await discogsApi.searchReleases(query);
    
    if (discogsReleases.length > 0) {
      const release = discogsReleases[0];
      
      // Add Discogs link
      metadata.externalLinks = {
        ...metadata.externalLinks,
        discogs: `https://www.discogs.com/release/${release.id}`
      };
      
      // Add genres and styles from Discogs
      if (release.genres) {
        metadata.genres = [...new Set([...(metadata.genres || []), ...release.genres])];
      }
      
      if (release.styles) {
        metadata.styles = release.styles;
      }
      
      // Try to get the full release details for credits
      try {
        const fullRelease = await discogsApi.getReleaseDetails(release.id);
        
        if (fullRelease && fullRelease.artists) {
          metadata.credits = fullRelease.artists.map(artist => ({
            name: artist.name,
            role: artist.role || 'Artist',
            source: 'discogs' as const
          }));
          
          // Add label info
          if (fullRelease.labels && fullRelease.labels.length > 0) {
            metadata.album = {
              ...metadata.album,
              label: fullRelease.labels[0].name
            };
          }
        }
      } catch (error) {
        console.error('Error getting detailed Discogs release:', error);
      }
    }
    
    return metadata;
  } catch (error) {
    console.error('Error getting comprehensive metadata:', error);
    return {};
  }
};
