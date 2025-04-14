
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileMusic, Image as ImageIcon, MoreVertical, Video, FileText, Trash2, Edit, Share2, ExternalLink } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export interface Asset {
  id: string;
  name: string;
  type: "audio" | "image" | "video" | "document";
  thumbnail_path?: string;
  thumbnail?: string;
  file_path: string;
  created_at: string;
  updated_at: string;
  metadata_score: number;
  file_size: number;
}

interface AssetGridProps {
  assets: Asset[];
  isLoading: boolean;
  onAssetDeleted: () => void;
}

export const AssetGrid = ({ assets, isLoading, onAssetDeleted }: AssetGridProps) => {
  const { toast } = useToast();
  const [loadingThumbnails, setLoadingThumbnails] = useState<Record<string, boolean>>({});
  
  const handleAssetAction = async (action: string, asset: Asset) => {
    switch (action) {
      case "Download":
        downloadAsset(asset);
        break;
      case "Delete":
        deleteAsset(asset);
        break;
      default:
        toast({
          title: `${action} action triggered`,
          description: `Action "${action}" for "${asset.name}" will be available in the full version.`,
        });
    }
  };
  
  const downloadAsset = async (asset: Asset) => {
    try {
      const { data, error } = await supabase
        .storage
        .from('assets')
        .download(asset.file_path);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = asset.name;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Download Started",
        description: `Downloading "${asset.name}"`,
      });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Failed to download the file",
        variant: "destructive",
      });
    }
  };
  
  const deleteAsset = async (asset: Asset) => {
    if (!confirm(`Are you sure you want to delete "${asset.name}"?`)) return;
    
    try {
      // Delete the file from storage
      const { error: storageError } = await supabase
        .storage
        .from('assets')
        .remove([asset.file_path]);
      
      if (storageError) throw storageError;
      
      // Delete the asset record from the database
      const { error: dbError } = await supabase
        .from('assets')
        .delete()
        .eq('id', asset.id);
      
      if (dbError) throw dbError;
      
      // Call the onAssetDeleted callback to refresh the asset list
      onAssetDeleted();
      
      toast({
        title: "Asset Deleted",
        description: `"${asset.name}" has been deleted successfully.`,
      });
    } catch (error: any) {
      console.error("Delete error:", error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete the asset",
        variant: "destructive",
      });
    }
  };
  
  const getIcon = (type: Asset["type"]) => {
    switch (type) {
      case "audio":
        return <FileMusic className="h-8 w-8 text-electric" />;
      case "image":
        return <ImageIcon className="h-8 w-8 text-mint" />;
      case "video":
        return <Video className="h-8 w-8 text-yellow-500" />;
      case "document":
        return <FileText className="h-8 w-8 text-muted-foreground" />;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-mint";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getThumbnailUrl = async (asset: Asset) => {
    if (loadingThumbnails[asset.id]) return;
    
    setLoadingThumbnails(prev => ({ ...prev, [asset.id]: true }));
    
    if (asset.type === "image") {
      try {
        const { data, error } = await supabase
          .storage
          .from('assets')
          .createSignedUrl(asset.file_path, 3600);
        
        if (error) throw error;
        
        return data.signedUrl;
      } catch (error) {
        console.error("Error getting thumbnail URL:", error);
        return null;
      } finally {
        setLoadingThumbnails(prev => ({ ...prev, [asset.id]: false }));
      }
    }
    
    setLoadingThumbnails(prev => ({ ...prev, [asset.id]: false }));
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <div className="relative aspect-video bg-secondary">
              <Skeleton className="h-full w-full" />
            </div>
            <CardHeader className="p-3 pb-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Skeleton className="h-4 w-full" />
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Skeleton className="h-9 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (assets.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <FileMusic className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No assets found</h3>
        <p className="text-muted-foreground mb-4">Upload some assets to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <Card key={asset.id} className="overflow-hidden group">
          <div className="relative aspect-video bg-secondary flex items-center justify-center">
            {asset.thumbnail ? (
              <img
                src={asset.thumbnail}
                alt={asset.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-muted/30">
                {getIcon(asset.type)}
              </div>
            )}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary">
                {asset.type.charAt(0).toUpperCase() + asset.type.slice(1)}
              </Badge>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => handleAssetAction("Download", asset)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardHeader className="p-3 pb-1">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base truncate">{asset.name}</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleAssetAction("Edit metadata", asset)}>
                    <Edit className="h-4 w-4 mr-2" /> Edit metadata
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAssetAction("Download", asset)}>
                    <Download className="h-4 w-4 mr-2" /> Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAssetAction("Share", asset)}>
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAssetAction("View", asset)}>
                    <ExternalLink className="h-4 w-4 mr-2" /> View
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAssetAction("Delete", asset)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="text-xs">{formatDate(asset.created_at)}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{formatFileSize(asset.file_size)}</span>
              <span className={`font-medium ${getScoreColor(asset.metadata_score)}`}>
                {asset.metadata_score}% Complete
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => handleAssetAction("View details", asset)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
