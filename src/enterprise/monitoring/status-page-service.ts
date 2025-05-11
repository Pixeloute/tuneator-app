import { ServiceStatus } from './uptime-service';

export class StatusPageService {
  private status: ServiceStatus = 'up';
  private incidents: { message: string; timestamp: number }[] = [];

  updateStatus(status: ServiceStatus, message?: string) {
    this.status = status;
    if (status !== 'up' && message) this.incidents.push({ message, timestamp: Date.now() });
  }

  getStatusPage() {
    return {
      status: this.status,
      incidents: this.incidents.slice(-10),
    };
  }
} 