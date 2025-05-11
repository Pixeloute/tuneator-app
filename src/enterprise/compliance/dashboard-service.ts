import { MetadataRecord } from './validation-service';

export class ComplianceDashboardService {
  getComplianceStatus(records: MetadataRecord[]): { compliant: number; nonCompliant: number } {
    const valid = records.filter(r => Object.values(r).every(v => v != null && v !== ''));
    return { compliant: valid.length, nonCompliant: records.length - valid.length };
  }
} 