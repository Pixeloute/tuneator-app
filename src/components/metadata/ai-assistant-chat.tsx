
import { useState, FormEvent, useEffect, useRef } from "react";
import { Paperclip, Mic, CornerDownLeft, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIAssistantChatProps {
  artistId?: string;
  trackId?: string;
  contextData?: any;
}

export function AIAssistantChat({ artistId, trackId, contextData }: AIAssistantChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! I'm your metadata assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = {
      id: Date.now(),
      content: input.trim(),
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      const res = await fetch("/functions/v1/ai-metadata-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          artistId,
          trackId,
          contextData,
        }),
      });
      const data = await res.json();
      let aiContent = data?.response || "Sorry, I couldn't find an answer.";
      if (typeof data?.revenueImpact === 'number' && data.revenueImpact > 0) {
        aiContent += `\n\nEstimated revenue recovery: $${Math.round(data.revenueImpact).toLocaleString()}/month`;
      }
      if (Array.isArray(data?.validationIssues) && data.validationIssues.length > 0) {
        aiContent += `\n\nMetadata issues detected:`;
        data.validationIssues.forEach((issue: any) => {
          aiContent += `\n- ${issue.field}: ${issue.issue}`;
        });
      }
      if (data?.fixResult && data.fixResult.message) {
        aiContent += `\n\n${data.fixResult.message}`;
      }
      const aiMessage: Message = {
        id: Date.now(),
        content: aiContent,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: "Sorry, there was an error connecting to the AI service.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAttachFile = () => {
    toast({
      title: "File Upload",
      description: "File attachment functionality will be available soon.",
    });
  };

  const handleMicrophoneClick = () => {
    toast({
      title: "Voice Input",
      description: "Voice input functionality will be available soon.",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as FormEvent);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="h-[400px] border bg-background rounded-lg flex flex-col">
      <div className="p-3 border-b flex items-center justify-between bg-secondary/20">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-electric" />
          <h3 className="font-medium">Metadata AI Assistant</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          Powered by OpenAI
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <ChatMessageList smooth>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                fallback={message.sender === "user" ? "You" : "AI"}
              />
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleAvatar
                className="h-8 w-8 shrink-0"
                fallback="AI"
              />
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </div>

      <div className="p-3 border-t">
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about your metadata..."
            className="min-h-10 resize-none rounded-lg bg-background border-0 p-2 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-2 pt-0 justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleAttachFile}
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleMicrophoneClick}
              >
                <Mic className="size-4" />
              </Button>
            </div>
            <Button 
              type="submit" 
              size="sm" 
              className="ml-auto gap-1.5 bg-electric hover:bg-electric/90"
              disabled={!input.trim() || isLoading}
            >
              Send
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
