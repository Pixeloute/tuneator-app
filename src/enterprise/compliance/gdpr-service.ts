export class ComplianceToolkitService {
  private data: { userId: string; data: any; created: number }[] = [];
  private audit: { userId: string; action: 'export' | 'erase'; timestamp: number }[] = [];
  private retentionPeriodMs = 30 * 24 * 60 * 60 * 1000; // 30 days

  exportData(userId: string): any {
    this.audit.push({ userId, action: 'export', timestamp: Date.now() });
    return this.data.find(d => d.userId === userId)?.data;
  }

  eraseData(userId: string): boolean {
    const idx = this.data.findIndex(d => d.userId === userId);
    if (idx === -1) return false;
    this.data.splice(idx, 1);
    this.audit.push({ userId, action: 'erase', timestamp: Date.now() });
    return true;
  }

  addData(userId: string, data: any) {
    this.data.push({ userId, data, created: Date.now() });
  }

  getAuditLog(userId: string) {
    return this.audit.filter(a => a.userId === userId);
  }

  enforceRetention() {
    const now = Date.now();
    this.data = this.data.filter(d => now - d.created < this.retentionPeriodMs);
  }
} 