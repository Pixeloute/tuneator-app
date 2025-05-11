export type ServiceStatus = 'up' | 'down' | 'degraded';

export class UptimeService {
  private status: ServiceStatus = 'up';
  private incidents: { message: string; timestamp: number }[] = [];

  setStatus(status: ServiceStatus, message?: string) {
    this.status = status;
    if (status !== 'up' && message) this.incidents.push({ message, timestamp: Date.now() });
  }

  getStatus(): ServiceStatus {
    return this.status;
  }

  getIncidents() {
    return this.incidents;
  }
} 