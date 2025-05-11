export class NotificationService {
  private notifications: { userId: string; message: string; timestamp: number }[] = [];

  notify(userId: string, message: string) {
    this.notifications.push({ userId, message, timestamp: Date.now() });
  }

  getNotifications(userId: string) {
    return this.notifications.filter(n => n.userId === userId);
  }
} 