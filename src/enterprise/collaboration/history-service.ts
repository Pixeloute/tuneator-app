export type EditRecord = { id: string; entityId: string; userId: string; change: string; timestamp: number };

export class EditHistoryService {
  private history: EditRecord[] = [];

  logEdit(entityId: string, userId: string, change: string): EditRecord {
    const rec = { id: Math.random().toString(36).slice(2), entityId, userId, change, timestamp: Date.now() };
    this.history.push(rec);
    return rec;
  }

  getHistory(entityId: string): EditRecord[] {
    return this.history.filter(r => r.entityId === entityId);
  }
} 