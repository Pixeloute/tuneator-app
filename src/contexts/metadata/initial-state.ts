
import { MetadataFormState } from "./types";

export const initialFormState: MetadataFormState = {
  // Track Info defaults
  title: "Midnight Dreams",
  altTitle: "",
  trackPosition: "1",
  duration: "3:42",
  bpm: "128",
  key: "A Minor",
  mood: "Energetic, Uplifting",
  tags: ["Electronic", "Dance", "Synth"],
  lyrics: "",
  fileType: "WAV",
  audioFileName: "midnight_dreams_master.wav",
  coverArtFileName: "album_cover.jpg",
  language: "English",
  vocalType: "Lead Vocals",
  genre: "Electronic",
  secondaryGenre: "",
  subGenre: "House",
  explicit: false,
  version: "Original Mix",
  
  // Artist Details defaults
  artistName: "The Electric Sound",
  companyName: "Electric Sound LLC",
  legalNames: "John A. Smith",
  phoneticPronunciation: "",
  stylizedName: "ELECTRIC SOUND",
  akaNames: "",
  artistType: "Solo",
  featuring: "",
  backgroundVocals: "",
  
  // Release Info defaults
  productTitle: "Neon Horizons",
  label: "Neon Records",
  catalogNumber: "NR2023-01",
  format: "Digital",
  productType: "Single",
  barcode: "",
  upc: "",
  previouslyReleased: false,
  previousRecordingYear: "",
  previousReleaseDate: "",
  recordingCountry: "United States",
  preReleaseDate: "",
  preReleaseUrl: "",
  releaseDate: "2023-09-15",
  releaseUrl: "",
  releaseLabel: "Neon Records",
  distributionCompany: "Digital Distribution Co.",
  
  // Publishing & Rights defaults
  copyrightYear: "2023",
  copyrightOwner: "John Smith",
  pLine: "2023 Neon Records",
  cLine: "2023 Neon Publishing",
  tunecode: "",
  iceWorkKey: "",
  iswc: "",
  isrc: "USRC17607839",
  bowi: "",
  
  // Credits defaults
  composers: [
    { id: "1", name: "John Smith", role: "Songwriter", share: 50 },
    { id: "2", name: "Jane Doe", role: "Composer", share: 50 }
  ],
  producers: [
    { id: "1", name: "Jane Doe", role: "Producer" }
  ],
  engineers: [
    { id: "1", name: "Alex Wilson", role: "Mixing Engineer" }
  ],
  performers: [
    { id: "1", name: "John Smith", instrument: "Vocals" },
    { id: "2", name: "Jane Doe", instrument: "Synthesizer" }
  ],
  
  // Platform defaults
  socialLinks: {
    spotify: "",
    appleMusic: "",
    youtube: "",
    instagram: "https://instagram.com/electricsound",
    tiktok: "",
    twitter: ""
  }
};
