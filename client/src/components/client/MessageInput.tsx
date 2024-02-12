import React, { useState, ChangeEvent, FormEvent } from 'react';
import { messageInputStyles as styles } from '../../styles';

interface MessageInputProps {
  sendMessage: (newMessage: string) => void;
  setMessage: (message: string) => void;
  message: string;
  onType: (message: string) => void;
}

export const MessageInput = ({ sendMessage, message, setMessage, onType}: MessageInputProps) => {

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    onType(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    sendMessage(message);
    setMessage('');
    onType('');
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