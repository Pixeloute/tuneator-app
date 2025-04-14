
import { MetadataFormState, IssueType } from "./types";

export function validateMetadata(formState: MetadataFormState): IssueType[] {
  const issues: IssueType[] = [];
  
  // Validate ISRC format
  if (formState.isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(formState.isrc)) {
    issues.push({ type: "error", message: "ISRC format is invalid" });
  }
  
  // Check required fields
  if (!formState.title.trim()) issues.push({ type: "error", message: "Title is required" });
  if (!formState.artistName.trim()) issues.push({ type: "error", message: "Artist name is required" });
  if (!formState.genre.trim()) issues.push({ type: "error", message: "Primary genre is required" });
  
  // Check optional but recommended fields
  if (!formState.iswc) issues.push({ type: "warning", message: "ISWC code missing" });
  if (!formState.upc) issues.push({ type: "warning", message: "UPC is required for distribution" });
  
  // Validate composers share total
  const totalShare = formState.composers.reduce((sum, c) => sum + (c.share || 0), 0);
  if (totalShare !== 100 && formState.composers.length > 0) {
    issues.push({ type: "warning", message: `Composer shares total ${totalShare}%, should be 100%` });
  }
  
  return issues;
}
