
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PlatformConfig {
  name: string;
  color: string;
  icon: () => JSX.Element;
}

interface PlatformKpiCardProps {
  config: PlatformConfig;
  revenue: string;
  streams: string;
}

export function PlatformKpiCard({ config, revenue, streams }: PlatformKpiCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{config.name}</p>
            <h3 className="text-2xl font-bold mt-1">${revenue}</h3>
          </div>
          <div className={`h-12 w-12 rounded-full bg-[${config.color}]/10 flex items-center justify-center`}>
            <config.icon />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <Badge variant="outline" className={`bg-[${config.color}]/10 text-[${config.color}]`}>
            {streams} streams
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
