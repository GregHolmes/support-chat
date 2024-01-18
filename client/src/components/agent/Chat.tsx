import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { chatStyles as styles } from '../../styles';
import { useAbly } from '../../services/Ably';

interface ChatInitProps {
  id: string;
  name: string;
  data: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatInitProps[]>([]);
  const ablyService = useAbly({
    apiKey: '<ABLY_ACCESS_TOKEN>',
    channelName: '<CHANNEL_NAME>',
  });

  useEffect(() => {
    const handleReceivedMessage = (id: string, name: string, message: string, timestamp: number) => {
      console.log('Received message:', message);
      setMessages((prevMessages: ChatInitProps[]) => [
        ...prevMessages,
        { id: id, name: name, data: message } as ChatInitProps
      ]);
    };

    // Subscribe to messages when the component mounts
    const unsubscribe = ablyService.subscribeToMessages(handleReceivedMessage);

    return () => {
      unsubscribe();
    };
  }, [ablyService]);

  // Initial chat messages just for testing
  const loadChat = () => {
    return [
      { id: '1', name: 'Test1', data: 'Hello there!' },
      { id: '2', name: 'Test2', data: 'Hi Test1! How are you?' },
    ];
  };

  const sendMessage = (newMessage: string) => {
    if (ablyService) {
      console.log('sendMessage');
      ablyService.sendMessage(newMessage);
    }
  };

  useEffect(() => {
    console.log('run');
    setMessages(loadChat());
  }, []);

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageListContainer}>
        <MessageList messages={messages} />
      </div>
      <div style={styles.messageInputContainer}>
        <MessageInput sendMessage={sendMessage} />
      </div>
    </div>
  );
};
