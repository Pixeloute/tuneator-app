
"use client";

import DisplayCards, { createInsightCards } from "@/components/ui/display-cards";
import { Sparkles, Music, TrendingUp } from "lucide-react";

const defaultCards = [
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "Featured",
    description: "Discover amazing content",
    date: "Just now",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "Popular",
    description: "Trending this week",
    date: "2 days ago",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-blue-300" />,
    title: "New",
    description: "Latest updates and features",
    date: "Today",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

const electricThemeCards = [
  {
    icon: <Music className="size-4 text-electric" />,
    title: "Latest Releases",
    description: "New music in your catalog",
    date: "This week",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <TrendingUp className="size-4 text-electric" />,
    title: "Analytics",
    description: "Your performance metrics",
    date: "Updated today",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Sparkles className="size-4 text-electric" />,
    title: "Recommendations",
    description: "Suggestions for your catalog",
    date: "Today",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
];

// Create examples for each theme variant
const insightCards = createInsightCards("gradient");

function DisplayCardsDemo() {
  return (
    <div className="flex flex-col gap-10 w-full py-10">
      <div>
        <h3 className="text-lg font-medium mb-4">Default Theme</h3>
        <div className="flex min-h-[400px] w-full items-center justify-center">
          <div className="w-full max-w-3xl">
            <DisplayCards cards={defaultCards} />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Electric Theme</h3>
        <div className="flex min-h-[400px] w-full items-center justify-center">
          <div className="w-full max-w-3xl">
            <DisplayCards cards={electricThemeCards} variant="electric" />
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Gradient Theme</h3>
        <div className="flex min-h-[400px] w-full items-center justify-center">
          <div className="w-full max-w-3xl">
            <DisplayCards cards={insightCards} />
          </div>
        </div>
      </div>
    </div>
  );
}

export { DisplayCardsDemo };
