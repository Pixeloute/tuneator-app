
import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // Submit on Enter (without shift)
      if (
        e.key === "Enter" &&
        !e.shiftKey &&
        !e.nativeEvent.isComposing &&
        props.onKeyDown
      ) {
        e.preventDefault();
        props.onKeyDown(e);
      }
    };

    React.useEffect(() => {
      if (ref && "current" in ref && ref.current) {
        const textArea = ref.current;
        textArea.style.height = "auto";
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    }, [props.value, ref]);

    return (
      <Textarea
        ref={ref}
        className={cn(
          "w-full resize-none overflow-hidden text-base focus-visible:ring-0",
          className
        )}
        rows={1}
        onKeyDown={handleKeyDown}
        {...props}
      />
    );
  }
);

ChatInput.displayName = "ChatInput";

export { ChatInput };
