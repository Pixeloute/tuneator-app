
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Star, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ImageGalleryProps {
  images: string[];
  prompt: string;
  onSave: (imageUrl: string) => void;
  onRemove: (index: number) => void;
  onRegenerateWithPrompt: () => void;
}

export function ImageGallery({ 
  images, 
  prompt, 
  onSave, 
  onRemove,
  onRegenerateWithPrompt
}: ImageGalleryProps) {
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<boolean[]>(images.map(() => false));
  
  const handleFavorite = (index: number) => {
    setFavorites(prev => {
      const newFavorites = [...prev];
      newFavorites[index] = !newFavorites[index];
      return newFavorites;
    });
    
    toast({
      title: favorites[index] ? "Removed from favorites" : "Added to favorites",
      description: favorites[index] 
        ? "Image removed from your favorites" 
        : "Image added to your favorites",
    });
  };
  
  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `artwork-concept-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your artwork is being downloaded",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "Failed to download the image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleUseAsAlbumArt = (imageUrl: string) => {
    onSave(imageUrl);
    toast({
      title: "Artwork Selected",
      description: "This image has been saved to your assets",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-muted/40 p-4 rounded-md">
        <h3 className="font-medium mb-2">Generated Prompt:</h3>
        <p className="text-sm text-muted-foreground">{prompt}</p>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2"
          onClick={onRegenerateWithPrompt}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit & Regenerate
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image, index) => (
          <Card key={index} className="overflow-hidden group">
            <div className="relative aspect-square">
              <img 
                src={image} 
                alt={`Generated artwork concept ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="grid grid-cols-2 gap-2 p-4">
                  <Button 
                    variant="secondary"
                    onClick={() => handleDownload(image, index)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button 
                    variant="secondary"
                    onClick={() => handleFavorite(index)}
                    className={favorites[index] ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    <Star className={`h-4 w-4 mr-2 ${favorites[index] ? "fill-current" : ""}`} />
                    {favorites[index] ? "Favorited" : "Favorite"}
                  </Button>
                </div>
              </div>
            </div>
            <CardFooter className="p-3 flex justify-between">
              <Button 
                variant="default" 
                size="sm"
                onClick={() => handleUseAsAlbumArt(image)}
              >
                Use as Cover Art
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onRemove(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
