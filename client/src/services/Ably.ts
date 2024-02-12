import { useEffect, useState } from 'react';
import Ably, { Realtime } from 'ably/promises';

interface AblyServiceProps {
  channelName: string;
}

export const useAbly = ({ channelName }: AblyServiceProps) => {
  const [ably, setAbly] = useState<Realtime | null>(null);
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelBase | null>(null);
  const [token, setToken] = useState(() => {
    const token = localStorage.getItem('token');

    return token || '';
  });

  useEffect(() => {
    const ablyInstance = new Ably.Realtime.Promise({ 
      authUrl: 'https://15c61275d3d3.ngrok.app/request-token',
      authHeaders: {
        'Authorization': 'Bearer ' + token
      }
    });
    setAbly(ablyInstance);

    ablyInstance.connection.once('connected', () => {
      console.log('Ably connected.');
    });
  
    ablyInstance.connection.on('failed', () => {
      console.error('Ably connection failed.');
    });
  
    const ablyChannel = ablyInstance.channels.get(channelName);
    setChannel(ablyChannel);
  
    return () => {
      if (ablyChannel) {
        ablyChannel.detach();
      }
  
      if (ablyInstance) {
        ablyInstance.close();
      }
  
      setAbly(null);
      setChannel(null);
  
      console.log('Ably connection closed.');
    };
  });

  const sendMessage = async (message: string): Promise<void> => {
    if (ably && channel) {
      await channel.publish('message', message);
    } else {
      console.error('Ably is not initialized.');
    }
  };

  const subscribeToMessages = async (handleReceivedMessage: (id: string, clientId: string, name: string, message: string, timestamp: number) => void): (() => void) => {
    if (channel) {
      const listener = (message: Ably.Types.Message) => {
        handleReceivedMessage(
          message.id as string,
          message.clientId as string,
          message.name as string,
          message.data as string,
          message.timestamp as number
        );
      };
  
      await channel.subscribe('message', listener);
  
      const unsubscribe = () => {
        if (channel) {
          channel.unsubscribe('message', listener);
        }
      };
      return unsubscribe;
    } else {
      console.error('Ably channel is not initialized.');
      return () => {};
    }
  };

  return { sendMessage, subscribeToMessages };
};
