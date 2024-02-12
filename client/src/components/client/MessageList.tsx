import React from 'react';
import { Message } from './Message';

interface ChatInitProps {
  id: string;
  clientId: string;
  name: string;
  data: string;
}

interface MessageListProps {
  messages: ChatInitProps[];
  clientId: string
}

export const MessageList = ({ messages, clientId }: MessageListProps) => {
  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} clientId={clientId} />
      ))}
    </div>
  );
};