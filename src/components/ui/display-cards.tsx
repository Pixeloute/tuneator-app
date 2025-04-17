
"use client";

import { cn } from "@/lib/utils";
import { 
  Sparkles, 
  BarChart3, 
  Music, 
  TrendingUp, 
  FileCheck, 
  Users, 
  Album
} from "lucide-react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  variant?: "default" | "electric" | "mint" | "purple" | "gradient";
}

export function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  variant = "default",
}: DisplayCardProps) {
  const variantStyles = {
    default: {
      card: "border-2 bg-muted/70 hover:border-white/20 hover:bg-muted",
      icon: "bg-blue-800",
      title: titleClassName,
    },
    electric: {
      card: "border-2 border-electric/20 bg-muted/70 hover:border-electric/30 hover:bg-muted",
      icon: "bg-electric/20",
      title: "text-electric",
    },
    mint: {
      card: "border-2 border-mint/20 bg-muted/70 hover:border-mint/30 hover:bg-muted",
      icon: "bg-mint/20",
      title: "text-mint",
    },
    purple: {
      card: "border-2 border-bright-purple/20 bg-muted/70 hover:border-bright-purple/30 hover:bg-muted",
      icon: "bg-bright-purple/20",
      title: "text-bright-purple",
    },
    gradient: {
      card: "border-2 border-electric/10 bg-gradient-to-br from-muted/90 to-muted/40 hover:border-white/20",
      icon: "bg-gradient-to-br from-electric to-mint",
      title: "gradient-text",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        styles.card,
        className
      )}
    >
      <div>
        <span className={cn("relative inline-block rounded-full p-1", styles.icon, iconClassName)}>
          {icon}
        </span>
        <p className={cn("text-lg font-medium", styles.title)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg">{description}</p>
      <p className="text-muted-foreground">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  variant?: DisplayCardProps["variant"];
}

export default function DisplayCards({ cards, variant = "default" }: DisplayCardsProps) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} variant={variant} {...cardProps} />
      ))}
    </div>
  );
}

// Helper function to create themed insight cards
export function createInsightCards(variant: DisplayCardProps["variant"] = "default") {
  return [
    {
      icon: <BarChart3 className="size-4 text-electric" />,
      title: "Revenue Insights",
      description: "Your royalty trends and statistics",
      date: "Updated recently",
      variant,
    },
    {
      icon: <Music className="size-4 text-mint" />,
      title: "Streaming Growth",
      description: "Track your audience growth",
      date: "Last 30 days",
      variant,
    },
    {
      icon: <TrendingUp className="size-4 text-bright-purple" />,
      title: "Trending Tracks",
      description: "Your most popular music",
      date: "This week",
      variant,
    }
  ];
}
