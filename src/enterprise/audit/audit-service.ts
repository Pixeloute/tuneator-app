import { AuditLog, VersionHistory } from './types';

export type AuditLog = { userId: string; action: string; details?: any; timestamp: number };

export class AuditService {
  private logs: AuditLog[] = [];
  private versions: Map<string, VersionHistory> = new Map();

  log(userId: string, action: string, details?: any) {
    this.logs.push({ userId, action, details, timestamp: Date.now() });
  }

  getLogs(userId?: string): AuditLog[] {
    return userId ? this.logs.filter(l => l.userId === userId) : this.logs;
  }

  async logChange(log: Omit<AuditLog, 'id' | 'timestamp'>): Promise<void> {
    const auditLog: AuditLog = {
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date().getTime(),
    };
    const entityLogs = this.logs.filter(l => l.userId === log.userId);
    entityLogs.push(auditLog);
    this.logs = entityLogs;
    const versionHistory = this.versions.get(log.userId) || {
      id: crypto.randomUUID(),
      userId: log.userId,
      versions: [],
      currentVersion: 0,
    };
    versionHistory.versions.push(auditLog);
    versionHistory.currentVersion++;
    this.versions.set(log.userId, versionHistory);
  }

  async getVersionHistory(userId: string): Promise<VersionHistory | null> {
    return this.versions.get(userId) || null;
  }

  async rollbackToVersion(userId: string, version: number): Promise<boolean> {
    const history = this.versions.get(userId);
    if (!history || version >= history.currentVersion) return false;
    // Implement rollback logic as needed
    return true;
  }
} 