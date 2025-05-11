export type Region = 'us' | 'eu' | 'apac' | 'custom';

export class DataResidencyService {
  private residency: { region: Region; storageLocation: string }[] = [];

  setResidency(region: Region, storageLocation: string) {
    const idx = this.residency.findIndex(r => r.region === region);
    if (idx === -1) this.residency.push({ region, storageLocation });
    else this.residency[idx].storageLocation = storageLocation;
  }

  getResidency(region: Region): string | undefined {
    return this.residency.find(r => r.region === region)?.storageLocation;
  }

  enforce(region: Region, data: any): boolean {
    // Minimal: only allow data if region matches residency config
    return !!this.residency.find(r => r.region === region);
  }
} 