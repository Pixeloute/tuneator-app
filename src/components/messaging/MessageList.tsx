
import React from 'react';
import { Message } from '@/hooks/use-messages';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4 p-4 overflow-y-auto max-h-[500px]">
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex items-start space-x-3 ${
            message.user_id === currentUserId ? 'flex-row-reverse space-x-reverse' : ''
          }`}
        >
          <Avatar>
            <AvatarFallback>
              {message.user_id.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div 
            className={`p-3 rounded-lg max-w-[70%] ${
              message.user_id === currentUserId 
                ? 'bg-electric text-white' 
                : 'bg-secondary text-foreground'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
    </div>
  );
};
