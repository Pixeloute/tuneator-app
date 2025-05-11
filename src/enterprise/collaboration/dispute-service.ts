export type Dispute = { id: string; entityId: string; raisedBy: string; status: 'open' | 'approved' | 'rejected'; reason: string; timestamp: number };

export class DisputeService {
  private disputes: Dispute[] = [];

  raiseDispute(entityId: string, raisedBy: string, reason: string): Dispute {
    const d: Dispute = { id: Math.random().toString(36).slice(2), entityId, raisedBy, status: 'open', reason, timestamp: Date.now() };
    this.disputes.push(d);
    return d;
  }

  resolveDispute(id: string, status: 'approved' | 'rejected') {
    const d = this.disputes.find(x => x.id === id);
    if (d) d.status = status;
  }

  getDisputes(entityId: string): Dispute[] {
    return this.disputes.filter(d => d.entityId === entityId);
  }
} 