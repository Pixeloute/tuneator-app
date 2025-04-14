
export interface InsightAlert {
  id: string;
  track_id: string;
  type: 'metadata' | 'streaming' | 'royalties';
  severity: 'info' | 'moderate' | 'critical';
  message: string;
  details: Record<string, any>;
  created_at: string;
  is_read: boolean;
}

export interface StreamStats {
  id: string;
  track_id: string;
  platform: string;
  listener_count: number;
  playlist_count: number;
  date: string;
}
