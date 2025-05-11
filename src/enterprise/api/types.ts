export type IntegrationProvider = 'spotify' | 'apple' | 'ddex' | 'pro' | 'custom';

export interface ApiIntegration {
  id: string;
  provider: IntegrationProvider;
  config: any;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AccessScope = 'read' | 'write' | 'audit';

export interface Webhook {
  id: string;
  event: string;
  url: string;
  enabled: boolean;
  createdAt: string;
} 