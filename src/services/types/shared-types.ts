
// Shared types for API services

export interface EnrichedMetadata {
  title?: string;
  artists?: Array<{
    name: string;
    id?: string;
    role?: string;
    source: 'spotify' | 'musicbrainz' | 'discogs' | 'youtube';
  }>;
  album?: {
    title?: string;
    releaseDate?: string;
    artwork?: string;
    label?: string;
  };
  genres?: string[];
  styles?: string[];
  isrc?: string;
  duration?: number;
  bpm?: number;
  key?: string;
  audioFeatures?: any;
  externalLinks?: {
    spotify?: string;
    youtube?: string;
    musicbrainz?: string;
    discogs?: string;
  };
  relatedArtists?: Array<{
    name: string;
    id?: string;
    source: 'spotify' | 'musicbrainz' | 'discogs';
  }>;
  videos?: Array<{
    id: string;
    title: string;
    thumbnail: string;
    url: string;
  }>;
  credits?: Array<{
    name: string;
    role: string;
    source: 'musicbrainz' | 'discogs';
  }>;
}

export interface SearchResults {
  spotify: any[];
  youtube: any[];
  musicbrainz: any[];
  discogs: any[];
}

export interface ArtistSearchResults {
  spotify: any[];
  musicbrainz: any[];
  discogs: any[];
}
