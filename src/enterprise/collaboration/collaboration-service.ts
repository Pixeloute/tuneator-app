import { CreditEditHistory, Dispute, Notification } from './types';

export class CollaborationService {
  private histories: CreditEditHistory[] = [];
  private disputes: Dispute[] = [];
  private notifications: Notification[] = [];

  logCreditEdit(history: CreditEditHistory) {
    this.histories.push(history);
  }

  getHistory(trackId: string): CreditEditHistory[] {
    return this.histories.filter(h => h.trackId === trackId);
  }

  raiseDispute(dispute: Dispute) {
    this.disputes.push(dispute);
  }

  resolveDispute(id: string, status: 'approved' | 'rejected' | 'resolved') {
    const d = this.disputes.find(d => d.id === id);
    if (d) {
      d.status = status;
      d.updatedAt = new Date().toISOString();
    }
  }

  notify(notification: Notification) {
    this.notifications.push(notification);
  }

  getNotifications(userId: string): Notification[] {
    return this.notifications.filter(n => n.userId === userId);
  }
} 