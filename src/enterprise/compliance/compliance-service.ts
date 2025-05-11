import { DataResidency, EncryptionConfig, ComplianceAction } from './types';

export class ComplianceService {
  private residency: DataResidency[] = [];
  private encryption: EncryptionConfig = { atRest: true, inTransit: true, algorithm: 'AES-256' };
  private actions: ComplianceAction[] = [];

  setResidency(region: DataResidency) {
    this.residency = this.residency.filter(r => r.region !== region.region);
    this.residency.push(region);
  }

  getResidency(region: string): DataResidency | undefined {
    return this.residency.find(r => r.region === region);
  }

  getEncryption(): EncryptionConfig {
    return this.encryption;
  }

  addAction(action: ComplianceAction) {
    this.actions.push(action);
  }

  getActions(entityId: string): ComplianceAction[] {
    return this.actions.filter(a => a.entityId === entityId);
  }
} 