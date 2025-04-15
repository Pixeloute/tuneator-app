
import React from 'react';
import { Message } from '@/hooks/use-messages';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  return (
    <div className="space-y-4 p-4 overflow-y-auto max-h-[500px] flex flex-col-reverse">
      {messages.map((message) => {
        const isCurrentUser = message.user_id === currentUserId;
        const formattedTime = message.created_at ? format(new Date(message.created_at), 'h:mm a') : '';
        
        return (
          <div 
            key={message.id} 
            className={`flex items-start space-x-3 ${
              isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <Avatar>
              <AvatarFallback className={isCurrentUser ? 'bg-electric' : 'bg-secondary'}>
                {message.user_id.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col max-w-[70%]">
              <div 
                className={`p-3 rounded-lg ${
                  isCurrentUser 
                    ? 'bg-electric text-white' 
                    : 'bg-secondary text-foreground'
                }`}
              >
                {message.content}
              </div>
              <span 
                className={`text-xs text-muted-foreground mt-1 ${
                  isCurrentUser ? 'text-right' : 'text-left'
                }`}
              >
                {formattedTime}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
