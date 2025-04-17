
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface RainbowButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

export const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-transparent bg-background px-6 font-medium text-foreground shadow-md transition-all duration-300",
          "before:absolute before:inset-0 before:-z-10 before:h-full before:w-full before:animate-gradient before:bg-[linear-gradient(90deg,#00D1FF,#00F5C3,#7D88FB,#00D1FF)] before:bg-[length:200%_auto] before:content-['']",
          "hover:text-white hover:shadow-xl",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

RainbowButton.displayName = "RainbowButton";
