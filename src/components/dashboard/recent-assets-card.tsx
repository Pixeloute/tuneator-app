
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileMusic, FileText, Image as ImageIcon, Video } from "lucide-react";

interface Asset {
  id: string;
  name: string;
  type: "audio" | "image" | "video" | "document";
  date: string;
  status: "complete" | "incomplete" | "warning";
}

interface RecentAssetsCardProps {
  assets: Asset[];
}

export const RecentAssetsCard = ({ assets }: RecentAssetsCardProps) => {
  const getIcon = (type: Asset["type"]) => {
    switch (type) {
      case "audio":
        return <FileMusic className="h-4 w-4 text-electric" />;
      case "image":
        return <ImageIcon className="h-4 w-4 text-mint" />;
      case "video":
        return <Video className="h-4 w-4 text-yellow-500" />;
      case "document":
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Asset["status"]) => {
    switch (status) {
      case "complete":
        return <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20">Complete</Badge>;
      case "incomplete":
        return <Badge variant="outline" className="bg-muted/10 text-muted-foreground border-muted/20">Incomplete</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Assets</CardTitle>
        <CardDescription>Latest additions to your catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assets.map((asset) => (
            <div key={asset.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="flex items-center gap-3">
                {getIcon(asset.type)}
                <div>
                  <h4 className="text-sm font-medium">{asset.name}</h4>
                  <p className="text-xs text-muted-foreground">{asset.date}</p>
                </div>
              </div>
              <div>
                {getStatusBadge(asset.status)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
