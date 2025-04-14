
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Music, Info, Download, Youtube, Apple } from "lucide-react";

interface RecommendationsListProps {
  recommendations: {
    platforms: Record<string, string[]>;
    genre: string[];
    general: string[];
  };
}

export function RecommendationsList({ recommendations }: RecommendationsListProps) {
  const platformIcons: Record<string, React.ReactNode> = {
    spotify: (
      <svg className="h-4 w-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
      </svg>
    ),
    apple: <Apple className="h-4 w-4 text-[#FC3C44]" />,
    youtube: <Youtube className="h-4 w-4 text-[#FF0000]" />,
    others: <Download className="h-4 w-4 text-muted-foreground" />
  };
  
  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="platforms">Platforms</TabsTrigger>
        <TabsTrigger value="genre">Genre</TabsTrigger>
      </TabsList>
      
      <TabsContent value="general" className="mt-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Info className="h-5 w-5 mr-2 text-electric" />
              General Recommendations
            </h3>
            <ul className="space-y-2">
              {recommendations.general.map((recommendation, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-mint font-medium mr-2">•</span>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="platforms" className="mt-4 space-y-4">
        {Object.entries(recommendations.platforms).map(([platform, platformRecs]) => (
          <Card key={platform}>
            <CardContent className="p-4">
              <h3 className="text-lg font-medium mb-3 flex items-center">
                {platformIcons[platform] || <Download className="h-5 w-5 mr-2" />}
                <span className="ml-2 capitalize">{platform}</span>
              </h3>
              <ul className="space-y-2">
                {platformRecs.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-mint font-medium mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
      
      <TabsContent value="genre" className="mt-4">
        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3 flex items-center">
              <Music className="h-5 w-5 mr-2 text-electric" />
              Genre-Specific Recommendations
            </h3>
            {recommendations.genre.length > 0 ? (
              <ul className="space-y-2">
                {recommendations.genre.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-mint font-medium mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground italic">No genre-specific recommendations available</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
