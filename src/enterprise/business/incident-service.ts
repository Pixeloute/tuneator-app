type IncidentStatus = 'open' | 'resolved';
export type Incident = { id: string; description: string; status: IncidentStatus; created: number; resolved?: number };

export class IncidentService {
  private incidents: Incident[] = [];

  createIncident(description: string): Incident {
    const incident: Incident = {
      id: Math.random().toString(36).slice(2),
      description,
      status: 'open',
      created: Date.now(),
    };
    this.incidents.push(incident);
    return incident;
  }

  resolveIncident(id: string) {
    const i = this.incidents.find(x => x.id === id);
    if (i && i.status === 'open') {
      i.status = 'resolved';
      i.resolved = Date.now();
    }
  }

  getIncidents(status?: IncidentStatus): Incident[] {
    return status ? this.incidents.filter(i => i.status === status) : this.incidents;
  }
} 