
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSend = async () => {
    if (message.trim()) {
      setIsSubmitting(true);
      try {
        await onSendMessage(message);
        setMessage('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2 p-4 border-t bg-background">
      <Input
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
        className="flex-1"
        disabled={isSubmitting}
      />
      <Button 
        variant="default" 
        size="icon" 
        onClick={handleSend}
        className="bg-electric hover:bg-electric/90"
        disabled={isSubmitting || !message.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};
