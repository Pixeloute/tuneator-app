export class RevenueMonitoringService {
  private listeners: ((data: any) => void)[] = [];

  subscribe(listener: (data: any) => void) {
    this.listeners.push(listener);
  }

  notify(data: any) {
    for (const l of this.listeners) l(data);
  }
} 