export interface RoyaltyRecord {
  trackId: string;
  amount: number;
  platform: string;
  date: string;
  usage: number;
}

export interface ReconciliationResult {
  trackId: string;
  matched: boolean;
  discrepancy?: string;
  expectedAmount?: number;
  actualAmount?: number;
}

export interface AuditReport {
  generatedAt: string;
  totalRecords: number;
  discrepancies: ReconciliationResult[];
  summary: {
    matched: number;
    flagged: number;
    totalAmount: number;
  };
} 