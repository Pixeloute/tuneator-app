import { Badge } from "@/components/ui/badge";

export type StatBadgeProps = {
  label: string;
  value: string | number;
  color?: string;
};

export const StatBadge = ({ label, value, color }: StatBadgeProps) => (
  <Badge variant="secondary" className={color ? color : "bg-muted/20 text-muted-foreground"}>
    <span className="font-medium mr-1">{label}:</span> {value}
  </Badge>
); 