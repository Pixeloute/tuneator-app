
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Music } from "lucide-react";

interface StreamsKpiCardProps {
  totalStreams: string;
}

export function StreamsKpiCard({ totalStreams }: StreamsKpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
            <h3 className="text-2xl font-bold mt-1">{totalStreams}</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-mint/10 flex items-center justify-center">
            <Music className="h-6 w-6 text-mint" />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <Badge variant="outline" className="bg-mint/10 text-mint">
            Across all platforms
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
