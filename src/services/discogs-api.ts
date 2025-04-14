
// Discogs API Integration for Tuneator
// Documentation: https://www.discogs.com/developers

// Discogs requires a user token for API access
const DISCOGS_USER_TOKEN = '01269d7857f857dbb584b9b7df56b1c8701a20a0';

// Types for Discogs API responses
export interface DiscogsArtist {
  id: number;
  name: string;
  profile?: string;
  urls?: string[];
  images?: Array<{ type: string; uri: string; resource_url: string }>;
  members?: Array<{ id: number; name: string; active: boolean }>;
  aliases?: Array<{ id: number; name: string; resource_url: string }>;
}

export interface DiscogsRelease {
  id: number;
  title: string;
  year?: number;
  country?: string;
  genres?: string[];
  styles?: string[];
  labels?: Array<{ id: number; name: string; catno: string }>;
  artists?: Array<{ id: number; name: string; role: string }>;
  formats?: Array<{ name: string; qty: string; descriptions?: string[] }>;
  images?: Array<{ type: string; uri: string; resource_url: string }>;
  tracklist?: Array<{ position: string; title: string; duration: string }>;
}

export interface DiscogsMaster {
  id: number;
  title: string;
  main_release: number;
  year?: number;
  genres?: string[];
  styles?: string[];
  artists?: Array<{ id: number; name: string }>;
  images?: Array<{ type: string; uri: string; resource_url: string }>;
  tracklist?: Array<{ position: string; title: string; duration: string }>;
}

// Search for artists on Discogs
export const searchDiscogsArtists = async (query: string): Promise<DiscogsArtist[]> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=artist&token=${DISCOGS_USER_TOKEN}`
    );
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching Discogs artists:', error);
    return [];
  }
};

// Get artist details from Discogs
export const getDiscogsArtistDetails = async (artistId: number): Promise<DiscogsArtist | null> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/artists/${artistId}?token=${DISCOGS_USER_TOKEN}`
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Discogs artist details:', error);
    return null;
  }
};

// Get artist releases from Discogs
export const getArtistReleases = async (artistId: number): Promise<DiscogsRelease[]> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/artists/${artistId}/releases?token=${DISCOGS_USER_TOKEN}`
    );
    
    const data = await response.json();
    return data.releases || [];
  } catch (error) {
    console.error('Error getting Discogs artist releases:', error);
    return [];
  }
};

// Search for releases on Discogs
export const searchReleases = async (query: string): Promise<DiscogsRelease[]> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/database/search?q=${encodeURIComponent(query)}&type=release&token=${DISCOGS_USER_TOKEN}`
    );
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error searching Discogs releases:', error);
    return [];
  }
};

// Get release details from Discogs
export const getReleaseDetails = async (releaseId: number): Promise<DiscogsRelease | null> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/releases/${releaseId}?token=${DISCOGS_USER_TOKEN}`
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Discogs release details:', error);
    return null;
  }
};

// Get master release details from Discogs
export const getMasterDetails = async (masterId: number): Promise<DiscogsMaster | null> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/masters/${masterId}?token=${DISCOGS_USER_TOKEN}`
    );
    
    return await response.json();
  } catch (error) {
    console.error('Error getting Discogs master details:', error);
    return null;
  }
};

// Get release versions from Discogs
export const getReleaseVersions = async (masterId: number): Promise<DiscogsRelease[]> => {
  try {
    const response = await fetch(
      `https://api.discogs.com/masters/${masterId}/versions?token=${DISCOGS_USER_TOKEN}`
    );
    
    const data = await response.json();
    return data.versions || [];
  } catch (error) {
    console.error('Error getting Discogs release versions:', error);
    return [];
  }
};

export default {
  searchDiscogsArtists,
  getDiscogsArtistDetails,
  getArtistReleases,
  searchReleases,
  getReleaseDetails,
  getMasterDetails,
  getReleaseVersions
};
