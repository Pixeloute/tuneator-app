type AnalyticsEvent = { type: string; userId: string; timestamp: number; data?: any };

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];

  logEvent(type: string, userId: string, data?: any) {
    this.events.push({ type, userId, timestamp: Date.now(), data });
  }

  getReport(type?: string) {
    const filtered = type ? this.events.filter(e => e.type === type) : this.events;
    return {
      count: filtered.length,
      byUser: filtered.reduce((acc, e) => {
        acc[e.userId] = (acc[e.userId] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
} 