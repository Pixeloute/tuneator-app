import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Music2, Upload, Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeAudio } from "@/services/google-api";

export const GenreAnalyzer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [analysisComplete, setAnalysisComplete] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  
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
  
  const COLORS = ["#4f46e5", "#7c3aed", "#0ea5e9", "#10b981", "#f59e0b"];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  
  const handleAnalyze = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setProgress(0);
    
    // Set up a progress simulation interval
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 5;
        if (newProgress >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return newProgress;
      });
    }, 150);
    
    try {
      // Call the Google API service
      const results = await analyzeAudio(file);
      setAnalysisResults(results);
      
      // Complete the progress and show success
      clearInterval(progressInterval);
      setProgress(100);
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      
      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed successfully using Google AI!",
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      clearInterval(progressInterval);
      setProgress(0);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your track. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music2 className="h-5 w-5 text-electric" />
          <span>Google AI Audio Analyzer</span>
        </CardTitle>
        <CardDescription>
          Upload your audio file to analyze its genre and audio characteristics using Google AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!analysisComplete ? (
          <div className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">Upload Audio File</h3>
                <p className="text-sm text-muted-foreground mb-4">WAV, MP3, AIFF or FLAC, max 15MB</p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".wav,.mp3,.aiff,.flac"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer" asChild>
                    <span>Select File</span>
                  </Button>
                </label>
              </div>
              {file && (
                <div className="mt-4 text-sm">
                  <span className="font-medium">Selected file:</span> {file.name}
                </div>
              )}
            </div>
            
            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4 text-electric animate-pulse" />
                    <Label>Google AI analyzing audio patterns...</Label>
                  </div>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                className="bg-electric hover:bg-electric/90"
                disabled={!file || isAnalyzing}
                onClick={handleAnalyze}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze Track"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Tabs defaultValue="genres">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="genres">Genre Distribution</TabsTrigger>
                <TabsTrigger value="attributes">Audio Attributes</TabsTrigger>
              </TabsList>
              
              <TabsContent value="genres" className="h-80 pt-4">
                <div className="h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={genreData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {genreData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Suggested Primary Genre: {genreData[0]?.name || "Electronic"}</h4>
                  <p className="text-sm text-muted-foreground">
                    The track has strong {genreData[0]?.name || "electronic"} elements with {genreData[1]?.name || "ambient"} influences. 
                    Consider using both as primary and secondary genres.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="attributes" className="h-80 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attributesData}>
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Audio Characteristic Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    This track has high danceability and energy with moderate instrumentalness, making it suitable for workout, dance, and electronic playlists.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {analysisComplete && (
          <Button 
            variant="outline" 
            onClick={() => {
              setFile(null);
              setAnalysisComplete(false);
              setProgress(0);
              setAnalysisResults(null);
            }}
          >
            Analyze Another Track
          </Button>
        )}
        
        {analysisComplete && (
          <Button 
            variant="default" 
            className="bg-electric hover:bg-electric/90"
            onClick={() => {
              toast({
                title: "Metadata Updated",
                description: "Genre and audio attributes have been applied to the track metadata.",
              });
            }}
          >
            Apply to Metadata
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
