
import { MetadataFormState } from "@/components/metadata/metadata-form";

// Metadata field importance weights for score calculation
const FIELD_WEIGHTS = {
  critical: 3, // Required for distribution (title, artist name, isrc)
  important: 2, // Strongly recommended (genre, release date, etc.)
  standard: 1, // Basic metadata (duration, language, etc.)
  optional: 0.5 // Nice to have (alt titles, social links, etc.)
};

// Calculate the metadata completeness score
export const calculateMetadataScore = (formState: MetadataFormState): number => {
  let totalPoints = 0;
  let maxPossiblePoints = 0;
  
  // Track Info section
  addFieldScore('title', formState.title, FIELD_WEIGHTS.critical);
  addFieldScore('trackPosition', formState.trackPosition, FIELD_WEIGHTS.important);
  addFieldScore('duration', formState.duration, FIELD_WEIGHTS.standard);
  addFieldScore('bpm', formState.bpm, FIELD_WEIGHTS.standard);
  addFieldScore('key', formState.key, FIELD_WEIGHTS.standard);
  addFieldScore('mood', formState.mood, FIELD_WEIGHTS.optional);
  addFieldScore('tags', formState.tags.length > 0, FIELD_WEIGHTS.optional);
  addFieldScore('lyrics', formState.lyrics, FIELD_WEIGHTS.important);
  addFieldScore('audioFileName', formState.audioFileName, FIELD_WEIGHTS.important);
  addFieldScore('coverArtFileName', formState.coverArtFileName, FIELD_WEIGHTS.important);
  addFieldScore('language', formState.language, FIELD_WEIGHTS.important);
  addFieldScore('genre', formState.genre, FIELD_WEIGHTS.important);
  addFieldScore('subGenre', formState.subGenre, FIELD_WEIGHTS.standard);
  
  // Artist Details section
  addFieldScore('artistName', formState.artistName, FIELD_WEIGHTS.critical);
  addFieldScore('legalNames', formState.legalNames, FIELD_WEIGHTS.important);
  addFieldScore('artistType', formState.artistType, FIELD_WEIGHTS.standard);
  
  // Release Info section
  addFieldScore('productTitle', formState.productTitle, FIELD_WEIGHTS.important);
  addFieldScore('label', formState.label, FIELD_WEIGHTS.important);
  addFieldScore('upc', formState.upc, FIELD_WEIGHTS.important);
  addFieldScore('releaseDate', formState.releaseDate, FIELD_WEIGHTS.important);
  
  // Publishing & Rights section
  addFieldScore('copyrightYear', formState.copyrightYear, FIELD_WEIGHTS.important);
  addFieldScore('copyrightOwner', formState.copyrightOwner, FIELD_WEIGHTS.important);
  addFieldScore('pLine', formState.pLine, FIELD_WEIGHTS.important);
  addFieldScore('cLine', formState.cLine, FIELD_WEIGHTS.important);
  addFieldScore('iswc', formState.iswc, FIELD_WEIGHTS.important);
  addFieldScore('isrc', formState.isrc, FIELD_WEIGHTS.critical);
  
  // Credits section
  addFieldScore('composers', formState.composers.length > 0, FIELD_WEIGHTS.critical);
  addFieldScore('producers', formState.producers.length > 0, FIELD_WEIGHTS.important);
  addFieldScore('engineers', formState.engineers.length > 0, FIELD_WEIGHTS.standard);
  addFieldScore('performers', formState.performers.length > 0, FIELD_WEIGHTS.standard);
  
  // Calculate percentage score
  function addFieldScore(fieldName: string, value: any, weight: number) {
    maxPossiblePoints += weight;
    
    // Check if the field has a valid value
    if (value && 
        (typeof value === 'boolean' || 
         typeof value === 'number' || 
         (typeof value === 'string' && value.trim() !== '') ||
         (Array.isArray(value) && value.length > 0))) {
      totalPoints += weight;
    }
  }
  
  return Math.round((totalPoints / maxPossiblePoints) * 100);
};

// Validate ISRC code format
export const validateISRC = (isrc: string): boolean => {
  const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;
  return isrcRegex.test(isrc);
};

// Validate UPC/EAN code format
export const validateUPC = (upc: string): boolean => {
  // UPC is 12 digits, EAN is 13 digits
  const upcRegex = /^(\d{12}|\d{13})$/;
  return upcRegex.test(upc);
};

// Validate ISWC code format
export const validateISWC = (iswc: string): boolean => {
  // T-123.456.789-C format
  const iswcRegex = /^T-\d{3}\.\d{3}\.\d{3}-\d$/;
  return iswcRegex.test(iswc);
};

// Validate IPI number format
export const validateIPI = (ipi: string): boolean => {
  // IPI is typically 9-11 characters
  const ipiRegex = /^[I]\d{9,10}$/;
  return ipiRegex.test(ipi);
};

// Validate email address format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate BPM (should be a number)
export const validateBPM = (bpm: string): boolean => {
  return !isNaN(Number(bpm)) && Number(bpm) > 0;
};

// Validate filename format
export const validateFilename = (filename: string): boolean => {
  // Only allow letters, numbers, underscores, hyphens, and dots
  const filenameRegex = /^[a-zA-Z0-9_\-\.]+\.[a-zA-Z0-9]+$/;
  return filenameRegex.test(filename);
};

// Validate date format (YYYY-MM-DD)
export const validateDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
  
  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};
