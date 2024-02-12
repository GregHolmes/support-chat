import React, { useState, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { chatStyles as styles } from '../../styles';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import Ably from 'ably/promises';
import Status from "./Status";

interface ChatInitProps {
  id: string;
  clientId: string;
  name: string;
  data: string;
  timestamp: number;
}

export const Chat = () => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<ChatInitProps[]>([]);
  const [message, setMessage] = useState<string>('');
  const [clientId, setClientId] = useState('');
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelPromise>();
  const [startedTyping, setStartedTyping] = useState(false);
  const [whoIsCurrentlyTyping, setWhoIsCurrentlyTyping] = useState<string[]>(
    [],
  );
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem('token');

    if (token) {
      setClientId(jwtDecode(token).sub || '');
    }

    return token || '';
  });

  if (token === '') {
    navigate("/login");
  }

  useEffect(() => {
    const client = new Ably.Realtime.Promise({
      authUrl: 'https://15c61275d3d3.ngrok.app/request-token',
      authHeaders: {
        'Authorization': 'Bearer ' + token
      }
    });
  
    client.connection.once('connected', () => {
      console.log('Ably connected.');
    });
    
  
    client.connection.on('failed', () => {
      console.error('Ably connection failed.');
    });

    const channel = client.channels.get('[?rewind=100]channel-test');
    setChannel(channel);

    const onMessage = async (message: ChatInitProps) => {
      const { name, clientId, data, timestamp, id } = message;
      setMessages((prevMessages: ChatInitProps[]) => [
        ...prevMessages,
        { id, clientId, name, data } as ChatInitProps
      ]);
    };
  
    channel.subscribe(onMessage);
    channel.presence.enter('');

    const handlePresenceUpdate = (
      update: Ably.Types.PresenceMessage,
    ) => {
      const { data, clientId } = update;

      if (data?.typing) {
        setWhoIsCurrentlyTyping((currentlyTyping) => [
          ...currentlyTyping,
          clientId,
        ]);
      } else {
        setWhoIsCurrentlyTyping((currentlyTyping) =>
          currentlyTyping.filter((id) => id !== clientId)
        );
      }
    };

    if (channel) {
      void channel.presence.subscribe(
        "update",
        handlePresenceUpdate,
      );
    }

    // Clean up function
    return () => {
      channel.presence.unsubscribe("update");
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [token, navigate]);
  

  const stopTyping = async () => {
    setStartedTyping(false);
    if (channel) {
      await channel.presence.update({ typing: false });
    }
  };

  const onType = async (inputValue: string) => {
    if (!startedTyping) {
      setStartedTyping(true);
      if (channel) {
        await channel.presence.update({ typing: true });
      }
    }

    if (timer) {
      clearTimeout(timer);
    }

    if (inputValue === "") {
      // Allow the typing indicator to be turned off immediately -- an empty
      // string usually indicates either a sent message or a cleared input
      stopTyping();
    } else {
      const newTimer = setTimeout(stopTyping, 2000);
      setTimer(newTimer);
    }
  };

  const sendMessage = async (newMessage: string) => {
    if (channel) {
      await channel.publish("message", newMessage);

      setMessage('');
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messageListContainer}>
        <MessageList messages={messages} clientId={clientId} />
      </div>
      <div style={styles.messageInputContainer}>
        <MessageInput sendMessage={sendMessage} message={message} setMessage={setMessage} onType={onType}/>
      </div>
      <div style={styles.typingIndicatorContainer}>
        <Status whoIsCurrentlyTyping={whoIsCurrentlyTyping} clientId={clientId}/>
      </div>
    </div>
  );
};

