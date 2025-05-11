export interface CreditEditHistory {
  id: string;
  trackId: string;
  userId: string;
  before: any;
  after: any;
  timestamp: string;
}

export interface Dispute {
  id: string;
  trackId: string;
  raisedBy: string;
  reason: string;
  status: 'open' | 'approved' | 'rejected' | 'resolved';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  createdAt: string;
  read: boolean;
} 