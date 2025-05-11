export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'rollback' | 'export';
  entityType: 'metadata' | 'royalty' | 'catalog';
  entityId: string;
  changes: {
    before: any;
    after: any;
  };
  metadata: {
    ip: string;
    userAgent: string;
    sessionId: string;
  };
}

export interface VersionHistory {
  id: string;
  entityId: string;
  versions: AuditLog[];
  currentVersion: number;
} 