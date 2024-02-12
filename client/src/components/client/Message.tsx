import React from 'react';
import { messageStyles as styles } from '../../styles'; // Import message-specific styles
interface ChatInitProps {
  id: string;
  clientId: string;
  name: string;
  data: string;
}
interface MessageProps {
  message: ChatInitProps;
  clientId: string
}

export function Message({ message, clientId }: MessageProps) {
  return (
    <div
      style={{
        ...styles.message,
        ...(message.clientId === clientId ? styles.messageFromUser : styles.messageFromOthers),
      }}
    >
      <p style={styles.messageText}>{message.clientId}: {message.data}</p>
    </div>
  );
}

export default Message;