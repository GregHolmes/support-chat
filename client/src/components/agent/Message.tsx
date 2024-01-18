import React from 'react';
import { messageStyles as styles } from '../../styles'; // Import message-specific styles
interface ChatInitProps {
  id: string;
  name: string;
  data: string;
}
interface MessageProps {
  message: ChatInitProps;
}

export function Message({ message }: MessageProps) {
  return (
    <div
      style={{
        ...styles.message,
        ...(message.name === 'Test1' ? styles.messageFromUser : styles.messageFromOthers),
      }}
    >
      <p style={styles.messageText}>{message.name}: {message.data}</p>
    </div>
  );
}

export default Message;