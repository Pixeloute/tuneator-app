import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type ShardConfig = { id: string; url: string; anonKey: string };

export class DatabaseSharding {
  private shards = new Map<string, SupabaseClient>();

  async initialize(configs: ShardConfig[]) {
    for (const c of configs) {
      const client = createClient(c.url, c.anonKey);
      this.shards.set(c.id, client);
    }
  }

  getShard(id: string): SupabaseClient | undefined {
    return this.shards.get(id);
  }

  route(key: string): SupabaseClient | undefined {
    if (!this.shards.size) return undefined;
    const keys = Array.from(this.shards.keys());
    const idx = Math.abs(this.hash(key)) % keys.length;
    return this.shards.get(keys[idx]);
  }

  private hash(str: string): number {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
    return h;
  }
} 