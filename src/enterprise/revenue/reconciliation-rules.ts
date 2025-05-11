export class ReconciliationRulesService {
  matchRoyaltyToMetadata(royalty: any, metadata: any): boolean {
    // Minimal: match by trackId and amount
    return royalty.trackId === metadata.id && royalty.amount === metadata.expectedAmount;
  }

  flagDiscrepancy(royalty: any, metadata: any): boolean {
    return royalty.amount !== metadata.expectedAmount;
  }
} 