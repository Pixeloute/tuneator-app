
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ArtGeneratorFormProps {
  onImagesGenerated: (images: string[], prompt: string) => void;
}

interface FormData {
  trackName: string;
  description: string;
  mood: string;
  genre: string;
}

const MOOD_OPTIONS = [
  "Nostalgic", "Dark", "Upbeat", "Dreamy", "Energetic", 
  "Calm", "Melancholic", "Playful", "Ethereal", "Intense",
  "Peaceful", "Mysterious", "Triumphant", "Romantic", "Futuristic"
];

const GENRE_OPTIONS = [
  "Pop", "Rock", "Hip Hop", "Electronic", "R&B", "Synthwave", 
  "Ambient", "Jazz", "Classical", "Metal", "Folk", "Country",
  "Indie", "Dance", "Lo-Fi", "Trap", "Soul", "Funk", "Blues"
];

export function ArtGeneratorForm({ onImagesGenerated }: ArtGeneratorFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    reset,
    setValue,
    formState: { errors } 
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate artwork.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const { data: response, error } = await supabase.functions.invoke('artwork-generator', {
        body: {
          user_id: user.id,
          track_name: data.trackName,
          description: data.description,
          mood: data.mood,
          genre: data.genre
        }
      });
      
      if (error) throw error;
      
      onImagesGenerated(response.images, response.enhancedPrompt);
      
      toast({
        title: "Artwork Generated",
        description: "Your concept art has been created successfully.",
      });
    } catch (error: any) {
      console.error("Error generating artwork:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Artwork Generator</CardTitle>
        <CardDescription>
          Describe your music to create custom artwork concepts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trackName">Track/Album Name (Optional)</Label>
            <Input
              id="trackName"
              placeholder="Enter track or album name"
              {...register("trackName")}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="required">Description / Theme / Lyrics</Label>
            <Textarea
              id="description"
              placeholder="Describe your track's theme, meaning, or paste some key lyrics..."
              className="min-h-[100px]"
              {...register("description", { required: "Description is required" })}
            />
            {errors.description && (
              <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mood">Mood</Label>
              <Select 
                onValueChange={(value) => setValue("mood", value)}
                defaultValue="Nostalgic"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {mood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="genre">Genre</Label>
              <Select 
                onValueChange={(value) => setValue("genre", value)}
                defaultValue="Pop"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {GENRE_OPTIONS.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button type="submit" className="w-full" disabled={isGenerating}>
            {isGenerating ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating Artwork...
              </>
            ) : (
              <>Generate Artwork</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
