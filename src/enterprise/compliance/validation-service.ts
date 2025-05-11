export type MetadataRecord = Record<string, any>;

function isValidISRC(code: string): boolean {
  // ISRC: 12 chars, [A-Z]{2}[A-Z0-9]{3}\d{7}
  return /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(code);
}

function isValidISWC(code: string): boolean {
  // ISWC: T-123.456.789-C
  return /^T-\d{3}\.\d{3}\.\d{3}-[A-Z]$/.test(code);
}

export class MetadataValidationService {
  validateBulk(records: MetadataRecord[]): { valid: boolean; errors: string[] }[] {
    return records.map(r => {
      const errors = Object.entries(r)
        .filter(([_, v]) => v == null || v === '')
        .map(([k]) => `${k} is empty`);
      if (r.isrc && !isValidISRC(r.isrc)) errors.push('Invalid ISRC');
      if (r.iswc && !isValidISWC(r.iswc)) errors.push('Invalid ISWC');
      return { valid: errors.length === 0, errors };
    });
  }
} 