import { Catalog, Shard, DeduplicationResult } from './types';

export class CatalogService {
  private catalogs: Map<string, Catalog> = new Map();
  private shards: Map<string, Shard> = new Map();

  addCatalog(catalog: Catalog) {
    this.catalogs.set(catalog.id, catalog);
    let shard = this.shards.get(catalog.shardKey);
    if (!shard) {
      shard = { id: catalog.shardKey, region: catalog.region, catalogIds: [] };
      this.shards.set(catalog.shardKey, shard);
    }
    shard.catalogIds.push(catalog.id);
  }

  getCatalog(id: string): Catalog | undefined {
    return this.catalogs.get(id);
  }

  deduplicate(trackIds: string[]): DeduplicationResult {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    const unique: string[] = [];
    for (const id of trackIds) {
      if (seen.has(id)) {
        duplicates.push(id);
      } else {
        seen.add(id);
        unique.push(id);
      }
    }
    return { duplicates, unique };
  }
} 