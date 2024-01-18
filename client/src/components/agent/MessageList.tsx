import React from 'react';
import { Message } from './Message';

interface ChatInitProps {
  id: string;
  name: string;
  data: string;
}

interface MessageListProps {
  messages: ChatInitProps[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  return (
    <div>
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
};