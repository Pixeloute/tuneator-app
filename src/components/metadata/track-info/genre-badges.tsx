
import { Badge } from "@/components/ui/badge";

interface GenreBadgesProps {
  primaryGenre: string;
  secondaryGenre?: string;
}

export function GenreBadges({ primaryGenre, secondaryGenre }: GenreBadgesProps) {
  if (!primaryGenre) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      <Badge variant="secondary" className="bg-electric/20">
        {primaryGenre || ''}
      </Badge>
      {secondaryGenre && (
        <Badge variant="outline">
          {secondaryGenre}
        </Badge>
      )}
    </div>
  );
}
