
import { MetadataFormState, IssueType } from "./types";

export function validateMetadata(formState: MetadataFormState): IssueType[] {
  const issues: IssueType[] = [];
  
  // Critical fields validation
  if (!formState.title.trim()) {
    issues.push({ type: "error", message: "Title is required" });
  }
  if (!formState.artistName.trim()) {
    issues.push({ type: "error", message: "Artist name is required" });
  }
  if (!formState.genre.trim()) {
    issues.push({ type: "error", message: "Primary genre is required" });
  }
  
  // Important fields validation
  if (!formState.isrc) {
    issues.push({ type: "warning", message: "ISRC code is missing - Search MusicBrainz?" });
  } else if (!/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(formState.isrc)) {
    issues.push({ type: "error", message: "ISRC format is invalid" });
  }
  
  if (!formState.iswc) {
    issues.push({ type: "warning", message: "ISWC code is missing" });
  }
  
  if (!formState.upc) {
    issues.push({ type: "warning", message: "UPC is required for distribution" });
  }
  
  if (!formState.releaseDate) {
    issues.push({ type: "warning", message: "Release date is required" });
  }
  
  // Additional metadata validation
  if (!formState.language) {
    issues.push({ type: "info", message: "Language should be specified" });
  }
  
  if (!formState.lyrics && formState.vocalType !== "instrumental") {
    issues.push({ type: "info", message: "Consider adding lyrics" });
  }
  
  // Composer shares validation
  const totalShare = formState.composers.reduce((sum, c) => sum + (c.share || 0), 0);
  if (totalShare !== 100 && formState.composers.length > 0) {
    issues.push({ 
      type: "warning", 
      message: `Composer shares total ${totalShare}%, should be 100%` 
    });
  }
  
  // Copyright validation
  if (!formState.copyrightYear || !formState.copyrightOwner) {
    issues.push({ type: "warning", message: "Copyright information is incomplete" });
  }
  
  return issues;
}
