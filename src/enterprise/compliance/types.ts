export type Region = 'us' | 'eu' | 'apac' | 'custom';

export interface DataResidency {
  region: Region;
  storageLocation: string;
  compliant: boolean;
}

export interface EncryptionConfig {
  atRest: boolean;
  inTransit: boolean;
  algorithm: 'AES-256' | 'RSA-4096' | 'none';
}

export interface ComplianceAction {
  id: string;
  type: 'export' | 'erase' | 'audit';
  entityId: string;
  requestedBy: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
} 