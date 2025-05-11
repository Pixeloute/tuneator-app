import { supabase } from "@/integrations/supabase/client";

const callApi = async (endpoint: string, params: Record<string, string> = {}) => {
  const { data, error } = await supabase.functions.invoke('api-proxy', {
    body: { service: 'spotify', endpoint, params }
  });
  
  if (error) throw error;
  return data;
};

// Spotify API Integration for Tuneator
// Documentation: https://developer.spotify.com/documentation/web-api

const SPOTIFY_CLIENT_ID = '6fa2e866365b420dacad44b0102b1645';
const SPOTIFY_CLIENT_SECRET = 'aaf95d753adf41e9aa0f8b00eaf1a334';

// Types for Spotify API responses
export interface SpotifyArtist {
  id: string;
  name: string;
  popularity: number;
  genres: string[];
  images: { url: string; height: number; width: number }[];
  external_urls: { spotify: string };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number }[];
    release_date: string;
  };
  duration_ms: number;
  popularity: number;
  preview_url: string | null;
  external_urls: { spotify: string };
}

// Add this type for playlist response
export interface SpotifyPlaylist {
  id: string;
  name: string;
  images: { url: string; height: number; width: number }[];
  tracks: {
    items: {
      track: SpotifyTrack;
    }[];
    total: number;
  };
  external_urls: { spotify: string };
  owner: { display_name: string };
}

// Utility to get Spotify access token
const getSpotifyToken = async (): Promise<string> => {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)
      },
      body: 'grant_type=client_credentials'
    });
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    return '';
  }
};

// Search for tracks on Spotify
export const searchSpotifyTracks = async (query: string): Promise<SpotifyTrack[]> => {
  try {
    const data = await callApi('search', { 
      q: query,
      type: 'track',
      limit: '5'
    });
    
    return data.tracks?.items || [];
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    return [];
  }
};

// Get track details from Spotify
export const getSpotifyTrackDetails = async (trackId: string): Promise<SpotifyTrack | null> => {
  try {
    const token = await getSpotifyToken();
    if (!token) return null;
    
    const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Spotify track details:', error);
    return null;
  }
};

// Get artist details from Spotify
export const getSpotifyArtistDetails = async (artistId: string): Promise<SpotifyArtist | null> => {
  try {
    const token = await getSpotifyToken();
    if (!token) return null;
    
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Spotify artist details:', error);
    return null;
  }
};

// Get related artists from Spotify
export const getRelatedArtists = async (artistId: string): Promise<SpotifyArtist[]> => {
  try {
    const token = await getSpotifyToken();
    if (!token) return [];
    
    const response = await fetch(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const data = await response.json();
    return data.artists || [];
  } catch (error) {
    console.error('Error getting related artists:', error);
    return [];
  }
};

// Get audio features (tempo, key, etc) for a track
export const getAudioFeatures = async (trackId: string): Promise<any> => {
  try {
    const token = await getSpotifyToken();
    if (!token) return null;
    
    const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return await response.json();
  } catch (error) {
    console.error('Error getting audio features:', error);
    return null;
  }
};

// Fetch playlist by ID
export const getSpotifyPlaylist = async (playlistId: string): Promise<SpotifyPlaylist | null> => {
  try {
    const token = await getSpotifyToken();
    if (!token) return null;
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch playlist');
    return await response.json();
  } catch (error) {
    console.error('Error getting Spotify playlist:', error);
    return null;
  }
};

export default {
  searchSpotifyTracks,
  getSpotifyTrackDetails,
  getSpotifyArtistDetails,
  getRelatedArtists,
  getAudioFeatures,
  getSpotifyPlaylist,
};
