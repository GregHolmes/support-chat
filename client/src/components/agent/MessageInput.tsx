import React, { useState, ChangeEvent, FormEvent } from 'react';
import { messageInputStyles as styles } from '../../styles';

interface MessageInputProps {
  sendMessage: (newMessage: string) => void;
}

export const MessageInput = ({ sendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState<string>('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <form style={styles.messageForm} onSubmit={handleSubmit}>
      <input
        placeholder="Type your message here..."
        autoComplete="off"
        id="messageContent"
        type="text"
        value={message}
        onChange={handleInputChange}
        style={styles.input}
      />
      <button style={styles.button} type="submit">Send</button>
    </form>
  );
};