type TicketStatus = 'open' | 'closed';
export type SupportTicket = { id: string; userId: string; subject: string; message: string; status: TicketStatus; created: number };

export class SupportService {
  private tickets: SupportTicket[] = [];

  createTicket(userId: string, subject: string, message: string): SupportTicket {
    const ticket: SupportTicket = {
      id: Math.random().toString(36).slice(2),
      userId,
      subject,
      message,
      status: 'open',
      created: Date.now(),
    };
    this.tickets.push(ticket);
    return ticket;
  }

  getTickets(userId?: string): SupportTicket[] {
    return userId ? this.tickets.filter(t => t.userId === userId) : this.tickets;
  }

  closeTicket(id: string) {
    const t = this.tickets.find(x => x.id === id);
    if (t) t.status = 'closed';
  }
} 