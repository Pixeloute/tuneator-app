export type MetadataVersion = { id: string; data: any; timestamp: number };

export class MetadataVersioningService {
  private versions: MetadataVersion[] = [];

  saveVersion(data: any): MetadataVersion {
    const v = { id: Math.random().toString(36).slice(2), data, timestamp: Date.now() };
    this.versions.push(v);
    return v;
  }

  getVersions(): MetadataVersion[] {
    return this.versions;
  }

  rollback(id: string): any | null {
    const v = this.versions.find(x => x.id === id);
    return v ? v.data : null;
  }
} 