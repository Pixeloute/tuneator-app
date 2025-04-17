
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
  // Using inline style instead of class to set dynamic background color
  const iconBgStyle = {
    backgroundColor: `${config.color}20`, // Adding 20 for opacity
  };
  
  const badgeStyle = {
    backgroundColor: `${config.color}20`,
    color: config.color,
    borderColor: `${config.color}30`
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{config.name}</p>
            <h3 className="text-2xl font-bold mt-1">${revenue}</h3>
          </div>
          <div className="h-12 w-12 rounded-full flex items-center justify-center" style={iconBgStyle}>
            <config.icon />
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs">
          <Badge variant="outline" style={badgeStyle}>
            {streams} streams
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
