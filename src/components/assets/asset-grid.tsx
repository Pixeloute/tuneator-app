
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, FileMusic, Image as ImageIcon, MoreVertical, Video } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export interface Asset {
  id: string;
  name: string;
  type: "audio" | "image" | "video";
  thumbnail?: string;
  date: string;
  metadataScore: number;
  fileSize: string;
}

interface AssetGridProps {
  assets: Asset[];
}

export const AssetGrid = ({ assets }: AssetGridProps) => {
  const { toast } = useToast();
  
  const handleAssetAction = (action: string, assetName: string) => {
    toast({
      title: `${action} action triggered`,
      description: `Action "${action}" for "${assetName}" will be available in the full version.`,
    });
  };
  
  const getIcon = (type: Asset["type"]) => {
    switch (type) {
      case "audio":
        return <FileMusic className="h-8 w-8 text-electric" />;
      case "image":
        return <ImageIcon className="h-8 w-8 text-mint" />;
      case "video":
        return <Video className="h-8 w-8 text-yellow-500" />;
    }
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-mint";
    if (score >= 60) return "text-yellow-500";
    return "text-destructive";
  };

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
                onClick={() => handleAssetAction("Download", asset.name)}
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
                  <DropdownMenuItem onClick={() => handleAssetAction("Edit metadata", asset.name)}>
                    Edit metadata
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAssetAction("Download", asset.name)}>
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleAssetAction("Share", asset.name)}>
                    Share
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleAssetAction("Delete", asset.name)} className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription className="text-xs">{asset.date}</CardDescription>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground">{asset.fileSize}</span>
              <span className={`font-medium ${getScoreColor(asset.metadataScore)}`}>
                {asset.metadataScore}% Complete
              </span>
            </div>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => handleAssetAction("View details", asset.name)}
            >
              View Details
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
