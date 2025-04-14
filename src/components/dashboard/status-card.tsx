
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  value: string;
  description?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  colorScheme?: "default" | "electric" | "mint";
  className?: string;
}

export const StatusCard = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendValue,
  colorScheme = "default",
  className,
}: StatusCardProps) => {
  const iconColorClass = {
    default: "text-muted-foreground",
    electric: "text-electric",
    mint: "text-mint",
  }[colorScheme];

  const trendColor = {
    up: "text-mint",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }[trend || "neutral"];

  const trendIcon = {
    up: "↑",
    down: "↓",
    neutral: "→",
  }[trend || "neutral"];

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-5 w-5", iconColorClass)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center mt-1 text-xs">
          {trend && (
            <span className={cn("flex items-center", trendColor)}>
              {trendIcon} {trendValue}
            </span>
          )}
          {description && (
            <span className="text-muted-foreground ml-2">{description}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
