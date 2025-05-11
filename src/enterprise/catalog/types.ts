export interface Catalog {
  id: string;
  name: string;
  region: string;
  shardKey: string;
  tracks: string[];
}

export interface Shard {
  id: string;
  region: string;
  catalogIds: string[];
}

export interface DeduplicationResult {
  duplicates: string[];
  unique: string[];
} 