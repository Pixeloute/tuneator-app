
import { useEffect, useRef, useState } from "react";

interface UseAutoScrollOptions {
  smooth?: boolean;
  content?: React.ReactNode;
  threshold?: number;
}

export function useAutoScroll({
  smooth = false,
  content,
  threshold = 100,
}: UseAutoScrollOptions = {}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const checkIfAtBottom = () => {
    const container = scrollRef.current;
    if (!container) return true;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const atBottom = distanceFromBottom < threshold;
    setIsAtBottom(atBottom);
    return atBottom;
  };

  const scrollToBottom = () => {
    const container = scrollRef.current;
    if (!container) return;

    setAutoScrollEnabled(true);
    
    const scrollOptions: ScrollToOptions = {
      top: container.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    };
    
    container.scrollTo(scrollOptions);
  };

  const disableAutoScroll = () => {
    if (checkIfAtBottom()) return;
    setAutoScrollEnabled(false);
  };

  useEffect(() => {
    if (autoScrollEnabled) {
      scrollToBottom();
    }
  }, [content, autoScrollEnabled]);

  return {
    scrollRef,
    isAtBottom,
    autoScrollEnabled,
    scrollToBottom,
    disableAutoScroll,
    checkIfAtBottom,
  };
}
