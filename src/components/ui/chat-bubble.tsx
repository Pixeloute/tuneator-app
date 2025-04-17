
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// ChatBubble component
interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
}

export function ChatBubble({
  className,
  variant = "received",
  children,
  ...props
}: ChatBubbleProps) {
  return (
    <div
      className={cn(
        "flex items-start space-x-2.5",
        variant === "sent" && "flex-row-reverse space-x-reverse",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ChatBubbleAvatar component
interface ChatBubbleAvatarProps extends React.ComponentProps<typeof Avatar> {
  src?: string;
  fallback?: string;
}

export function ChatBubbleAvatar({
  className,
  src,
  fallback,
  ...props
}: ChatBubbleAvatarProps) {
  return (
    <Avatar className={cn("mt-0.5", className)} {...props}>
      {src && <AvatarImage src={src} alt={fallback || "Avatar"} />}
      <AvatarFallback>{fallback?.substring(0, 2) || "??"}</AvatarFallback>
    </Avatar>
  );
}

// ChatBubbleMessage component
const messageBubbleVariants = cva(
  "max-w-md break-words rounded-2xl px-4 py-2.5 text-sm",
  {
    variants: {
      variant: {
        sent: "bg-electric text-primary-foreground",
        received: "bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "received",
    },
  }
);

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageBubbleVariants> {
  isLoading?: boolean;
}

export function ChatBubbleMessage({
  className,
  variant,
  isLoading = false,
  children,
  ...props
}: ChatBubbleMessageProps) {
  return (
    <div
      className={cn(messageBubbleVariants({ variant }), className)}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "0ms" }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "150ms" }}></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-current" style={{ animationDelay: "300ms" }}></div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
