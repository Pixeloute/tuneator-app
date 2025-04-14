
import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface ProgressCircleProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  showPercentage?: boolean;
  color?: string;
  label?: string;
}

export const ProgressCircle = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  showPercentage = true,
  color = "electric",
  label,
  className,
  ...props
}: ProgressCircleProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / max) * circumference;

  let colorClass = "stroke-electric";
  if (color === "mint") colorClass = "stroke-mint";

  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }} {...props}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={colorClass}
        />
      </svg>
      {showPercentage && (
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-lg font-bold">{Math.round(value)}%</span>
          {label && <span className="text-xs text-muted-foreground mt-1">{label}</span>}
        </div>
      )}
    </div>
  );
};
