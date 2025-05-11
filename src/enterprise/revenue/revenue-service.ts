import { RoyaltyRecord, ReconciliationResult, AuditReport } from './types';

export class RevenueService {
  reconcile(royalties: RoyaltyRecord[], metadata: { id: string; expectedAmount: number }[]): ReconciliationResult[] {
    return royalties.map(r => {
      const meta = metadata.find(m => m.id === r.trackId);
      if (!meta) return { trackId: r.trackId, matched: false, discrepancy: 'No metadata found' };
      if (Math.abs(meta.expectedAmount - r.amount) > 1e-2) {
        return {
          trackId: r.trackId,
          matched: false,
          discrepancy: 'Amount mismatch',
          expectedAmount: meta.expectedAmount,
          actualAmount: r.amount,
        };
      }
      return { trackId: r.trackId, matched: true };
    });
  }

  generateAuditReport(results: ReconciliationResult[]): AuditReport {
    const matched = results.filter(r => r.matched).length;
    const flagged = results.length - matched;
    const totalAmount = results.reduce((sum, r) => sum + (r.actualAmount || 0), 0);
    return {
      generatedAt: new Date().toISOString(),
      totalRecords: results.length,
      discrepancies: results.filter(r => !r.matched),
      summary: { matched, flagged, totalAmount },
    };
  }

  exportReport(report: AuditReport, format: 'json' | 'xls' | 'pdf') {
    // Minimal stub: implement real export logic as needed
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      this.downloadBlob(blob, `audit-report-${Date.now()}.json`);
    } else if (format === 'xls') {
      // TODO: Implement XLS export
      alert('XLS export not implemented');
    } else if (format === 'pdf') {
      // TODO: Implement PDF export
      alert('PDF export not implemented');
    }
  }

  private downloadBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 