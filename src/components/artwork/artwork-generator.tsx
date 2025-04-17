
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtGeneratorForm } from "./art-generator-form";
import { ImageGallery } from "./image-gallery";
import { PromptEditorModal } from "./prompt-editor-modal";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export interface GeneratedImage {
  url: string;
  prompt: string;
}

export function ArtworkGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const handleGenerate = async (formData: {
    trackName: string;
    description: string;
    mood: string;
    genre: string;
  }) => {
    // Reset states
    setError(null);
    setIsGenerating(true);
    
    try {
      // Make sure user is authenticated
      if (!user) {
        throw new Error("You must be logged in to generate artwork");
      }
      
      console.log("Sending request to artwork-generator with data:", {
        user_id: user.id,
        track_name: formData.trackName,
        description: formData.description,
        mood: formData.mood,
        genre: formData.genre
      });
      
      // Call the Supabase Edge Function
      const { data, error: functionError } = await supabase.functions.invoke('artwork-generator', {
        body: {
          user_id: user.id,
          track_name: formData.trackName,
          description: formData.description,
          mood: formData.mood,
          genre: formData.genre
        }
      });
      
      if (functionError) {
        console.error("Function error:", functionError);
        throw new Error(functionError.message || "Failed to generate artwork");
      }
      
      if (!data) {
        throw new Error("No data returned from the function");
      }
      
      console.log("Response from artwork-generator:", data);
      
      // Update states with generated images
      setGeneratedImages(data.images || []);
      setEnhancedPrompt(data.enhancedPrompt || "");
      
      toast({
        title: "Artwork Generated",
        description: "Your artwork concepts have been created",
      });
    } catch (err) {
      console.error("Error generating artwork:", err);
      setError(err instanceof Error ? err.message : "An error occurred while generating your artwork. Please try again.");
      
      toast({
        title: "Generation Failed",
        description: "Failed to generate artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveArtwork = (imageUrl: string) => {
    // Here would be code to save the artwork to the user's assets
    toast({
      title: "Artwork Saved",
      description: "The artwork has been added to your assets",
    });
  };
  
  const handleRemoveImage = (index: number) => {
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: "Image Removed",
      description: "The image has been removed from the gallery",
    });
  };
  
  const handleRegenerateWithPrompt = () => {
    setIsPromptEditorOpen(true);
  };
  
  const handleEditedPromptSubmit = async (editedPrompt: string) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error("You must be logged in to generate artwork");
      }
      
      console.log("Regenerating with custom prompt:", editedPrompt);
      
      // Call the edge function with the edited prompt
      const { data, error: functionError } = await supabase.functions.invoke('artwork-generator', {
        body: {
          user_id: user.id,
          custom_prompt: editedPrompt
        }
      });
      
      if (functionError) {
        throw new Error(functionError.message || "Failed to regenerate artwork");
      }
      
      setGeneratedImages(data.images || []);
      setEnhancedPrompt(editedPrompt);
      
      toast({
        title: "Artwork Regenerated",
        description: "New concepts have been created based on your prompt",
      });
    } catch (err) {
      console.error("Error regenerating artwork:", err);
      setError(err instanceof Error ? err.message : "An error occurred while regenerating your artwork. Please try again.");
      
      toast({
        title: "Regeneration Failed",
        description: "Failed to regenerate artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Artwork Generator</CardTitle>
          <CardDescription>
            Create custom artwork for your music with AI assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="generate" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="generate">Generate Artwork</TabsTrigger>
              <TabsTrigger value="results" disabled={generatedImages.length === 0}>
                Results {generatedImages.length > 0 && `(${generatedImages.length})`}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="generate" className="space-y-4 mt-4">
              {!user && (
                <Alert variant="default" className="mb-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertTitle>Authentication Required</AlertTitle>
                  <AlertDescription>
                    Please sign in to use the artwork generator.
                  </AlertDescription>
                </Alert>
              )}
              
              <ArtGeneratorForm onSubmit={handleGenerate} isLoading={isGenerating} />
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {isGenerating && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Generating artwork concepts...</p>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <Skeleton key={item} className="aspect-square rounded-md" />
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="results" className="space-y-4 mt-4">
              {generatedImages.length > 0 ? (
                <ImageGallery 
                  images={generatedImages} 
                  prompt={enhancedPrompt} 
                  onSave={handleSaveArtwork}
                  onRemove={handleRemoveImage}
                  onRegenerateWithPrompt={handleRegenerateWithPrompt}
                />
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Generate some artwork to see results here.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <PromptEditorModal 
        isOpen={isPromptEditorOpen}
        onClose={() => setIsPromptEditorOpen(false)}
        initialPrompt={enhancedPrompt}
        onRegenerateWithPrompt={handleEditedPromptSubmit}
      />
    </div>
  );
}
