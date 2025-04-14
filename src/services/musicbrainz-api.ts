
// MusicBrainz API Integration for Tuneator
// Documentation: https://musicbrainz.org/doc/MusicBrainz_API

// Note: MusicBrainz requires a custom user agent with contact information
// This is a simplified implementation for demonstration purposes
const USER_AGENT = 'Tuneator/1.0.0 (https://tuneator.com)';

// Types for MusicBrainz API responses
export interface MusicBrainzArtist {
  id: string;
  name: string;
  type?: string;
  country?: string;
  disambiguation?: string;
  aliases?: Array<{ name: string; sort_name: string }>;
  tags?: Array<{ name: string; count: number }>;
}

export interface MusicBrainzRelease {
  id: string;
  title: string;
  status?: string;
  date?: string;
  country?: string;
  artist_credit?: Array<{ name: string; artist: { id: string; name: string } }>;
  release_group?: {
    id: string;
    primary_type?: string;
    secondary_types?: string[];
  };
  media?: Array<{
    format?: string;
    track_count: number;
    tracks?: MusicBrainzTrack[];
  }>;
}

export interface MusicBrainzTrack {
  id: string;
  title: string;
  position: number;
  length?: number;
  artist_credit?: Array<{ name: string; artist: { id: string; name: string } }>;
}

export interface MusicBrainzRecording {
  id: string;
  title: string;
  length?: number;
  artist_credit?: Array<{ name: string; artist: { id: string; name: string } }>;
  releases?: Array<{ id: string; title: string }>;
  tags?: Array<{ name: string; count: number }>;
  isrcs?: string[];
}

// Search for artists on MusicBrainz
export const searchArtists = async (query: string): Promise<MusicBrainzArtist[]> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/artist/?query=${encodeURIComponent(query)}&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    const data = await response.json();
    return data.artists || [];
  } catch (error) {
    console.error('Error searching MusicBrainz artists:', error);
    return [];
  }
};

// Get artist details from MusicBrainz
export const getArtistDetails = async (mbid: string): Promise<MusicBrainzArtist | null> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/artist/${mbid}?inc=aliases+tags&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting MusicBrainz artist details:', error);
    return null;
  }
};

// Search for releases on MusicBrainz
export const searchReleases = async (query: string): Promise<MusicBrainzRelease[]> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    const data = await response.json();
    return data.releases || [];
  } catch (error) {
    console.error('Error searching MusicBrainz releases:', error);
    return [];
  }
};

// Get release details from MusicBrainz
export const getReleaseDetails = async (mbid: string): Promise<MusicBrainzRelease | null> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release/${mbid}?inc=artist-credits+media+recordings&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting MusicBrainz release details:', error);
    return null;
  }
};

// Search for recordings on MusicBrainz
export const searchRecordings = async (query: string): Promise<MusicBrainzRecording[]> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    const data = await response.json();
    return data.recordings || [];
  } catch (error) {
    console.error('Error searching MusicBrainz recordings:', error);
    return [];
  }
};

// Get recording details from MusicBrainz (including ISRCs)
export const getRecordingDetails = async (mbid: string): Promise<MusicBrainzRecording | null> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/recording/${mbid}?inc=artist-credits+releases+tags+isrcs&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting MusicBrainz recording details:', error);
    return null;
  }
};

// Lookup by ISRC on MusicBrainz
export const lookupByISRC = async (isrc: string): Promise<MusicBrainzRecording[]> => {
  try {
    const response = await fetch(
      `https://musicbrainz.org/ws/2/isrc/${isrc}?inc=recordings+artist-credits&fmt=json`, {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    );
    
    const data = await response.json();
    return data.recordings || [];
  } catch (error) {
    console.error('Error looking up MusicBrainz ISRC:', error);
    return [];
  }
};

export default {
  searchArtists,
  getArtistDetails,
  searchReleases,
  getReleaseDetails,
  searchRecordings,
  getRecordingDetails,
  lookupByISRC
};
