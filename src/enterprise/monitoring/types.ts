export type SlaTier = 'standard' | 'premium' | 'enterprise';

export interface Sla {
  tier: SlaTier;
  uptimeGuarantee: number; // e.g. 99.9
  responseTimeHours: number;
  supportContact: string;
}

export interface Incident {
  id: string;
  status: 'open' | 'resolved' | 'in_progress';
  description: string;
  startedAt: string;
  resolvedAt?: string;
}

export interface StatusEvent {
  id: string;
  type: 'maintenance' | 'outage' | 'info';
  message: string;
  timestamp: string;
} 