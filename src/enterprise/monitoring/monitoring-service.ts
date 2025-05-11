import { Sla, Incident, StatusEvent } from './types';

export class MonitoringService {
  private slas: Sla[] = [];
  private incidents: Incident[] = [];
  private statusEvents: StatusEvent[] = [];

  addSla(sla: Sla) {
    this.slas.push(sla);
  }

  getSla(tier: string): Sla | undefined {
    return this.slas.find(s => s.tier === tier);
  }

  logIncident(incident: Incident) {
    this.incidents.push(incident);
  }

  getIncidents(status?: string): Incident[] {
    return status ? this.incidents.filter(i => i.status === status) : this.incidents;
  }

  addStatusEvent(event: StatusEvent) {
    this.statusEvents.push(event);
  }

  getStatusEvents(type?: string): StatusEvent[] {
    return type ? this.statusEvents.filter(e => e.type === type) : this.statusEvents;
  }
} 