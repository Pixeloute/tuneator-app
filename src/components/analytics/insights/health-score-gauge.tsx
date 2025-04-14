
import { Progress } from "@/components/ui/progress";

interface HealthScoreGaugeProps {
  score: number;
}

export function HealthScoreGauge({ score }: HealthScoreGaugeProps) {
  // Determine color based on score
  const getColor = () => {
    if (score >= 75) return "bg-gradient-to-r from-green-400 to-green-500";
    if (score >= 50) return "bg-gradient-to-r from-amber-400 to-amber-500";
    return "bg-gradient-to-r from-red-400 to-red-500";
  };
  
  return (
    <div className="relative w-full max-w-[200px]">
      <div className="relative h-[100px] overflow-hidden">
        {/* Background track */}
        <div className="absolute bottom-0 left-0 right-0 h-[100px] w-[200px] rounded-t-full bg-muted-foreground/10"></div>
        
        {/* Colored fill */}
        <div 
          className={`absolute bottom-0 left-0 right-0 w-[200px] rounded-t-full ${getColor()}`} 
          style={{ height: `${score}px` }}
        ></div>
        
        {/* Score display */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-center">
          <span className="text-3xl font-bold">{score}</span>
          <span className="text-sm">/100</span>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>Needs Work</span>
        <span>Good</span>
        <span>Excellent</span>
      </div>
    </div>
  );
}
