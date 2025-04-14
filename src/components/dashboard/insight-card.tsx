
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, FileCheck, FileWarning, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface InsightCardProps {
  priority: "low" | "medium" | "high";
  title: string;
  description: string;
  actionText: string;
  icon?: "warning" | "success" | "info";
  className?: string;
}

export const InsightCard = ({
  priority,
  title,
  description,
  actionText,
  icon = "info",
  className,
}: InsightCardProps) => {
  const { toast } = useToast();
  
  const handleAction = () => {
    toast({
      title: "Insight action triggered",
      description: `Action for "${title}" will be available in the full version.`,
    });
  };

  const priorityClasses = {
    low: "border-l-mint",
    medium: "border-l-yellow-500",
    high: "border-l-red-500",
  };

  const iconMap = {
    warning: <FileWarning className="h-5 w-5 text-yellow-500" />,
    success: <FileCheck className="h-5 w-5 text-mint" />,
    info: <Bell className="h-5 w-5 text-electric" />,
  };

  return (
    <Card className={cn("border-l-4", priorityClasses[priority], className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">{title}</CardTitle>
          {iconMap[icon]}
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleAction}
        >
          <Link className="h-4 w-4 mr-2" />
          {actionText}
        </Button>
      </CardContent>
    </Card>
  );
};
