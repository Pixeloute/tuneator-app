
export interface TrackData {
  id: string;
  title: string;
  artist: string;
  album: string;
  isrc: string;
  metadataScore: number;
  status: "complete" | "incomplete" | "warning";
  release: string;
  // New fields for expanded view
  description?: string;
  genre?: string;
  duration?: string;
  writers?: string[];
  producers?: string[];
}
