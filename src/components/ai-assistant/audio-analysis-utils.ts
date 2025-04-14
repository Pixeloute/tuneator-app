
import { GoogleAnalysisResponse } from "@/services/google-api";

export interface GenreData {
  name: string;
  value: number;
}

export interface AttributeData {
  name: string;
  value: number;
}

export const processAnalysisResults = (analysisResults: GoogleAnalysisResponse | null): {
  genreData: GenreData[];
  attributesData: AttributeData[];
} => {
  const genreData = analysisResults?.genres 
    ? analysisResults.genres.map((genre: string, index: number) => ({
        name: genre,
        value: 100 - (index * 25)  // Simulating percentage values
      })).slice(0, 4)
    : [
        { name: "Electronic", value: 68 },
        { name: "Ambient", value: 15 },
        { name: "Pop", value: 10 },
        { name: "Other", value: 7 },
      ];
  
  const attributesData = analysisResults 
    ? [
        { name: "Danceability", value: analysisResults.danceability || 0 },
        { name: "Energy", value: analysisResults.energy || 0 },
        { name: "Instrumentalness", value: analysisResults.instrumentalness || 0 },
        { name: "Acousticness", value: analysisResults.acousticness || 0 },
        { name: "Valence", value: analysisResults.valence || 0 },
      ]
    : [
        { name: "Danceability", value: 72 },
        { name: "Energy", value: 65 },
        { name: "Instrumentalness", value: 45 },
        { name: "Acousticness", value: 20 },
        { name: "Valence", value: 55 },
      ];
      
  return { genreData, attributesData };
};
