import { useEffect, useState } from 'react';
import Ably from 'ably';

interface AblyServiceProps {
  apiKey: string;
  channelName: string;
}

export const useAbly = ({ apiKey, channelName }: AblyServiceProps) => {
  const [ably, setAbly] = useState<Ably.Realtime | null>(null);
  const [channel, setChannel] = useState<Ably.Types.RealtimeChannelBase | null>(null);

  useEffect(() => {
    // Initialize Ably connection
    const ablyInstance = new Ably.Realtime({ key: apiKey });
    setAbly(ablyInstance);

    // Subscribe to the connection state changes
    ablyInstance.connection.once('connected', () => {
      console.log('Ably connected.');
    });

    ablyInstance.connection.on('failed', () => {
      console.error('Ably connection failed.');
    });

    // Connect to the specified Ably channel
    const ablyChannel = ablyInstance.channels.get(channelName);
    setChannel(ablyChannel);

    return () => {
      if (ablyChannel) {
        ablyChannel.unsubscribe();
        ablyChannel.detach();
      }
      if (ablyInstance) {
        ablyInstance.close();
      }
      setAbly(null);
      setChannel(null);
      console.log('Ably connection closed.');
    };
  }, [apiKey, channelName]);

  // Function to send a message to the Ably channel
  const sendMessage = (message: string): void => {
    if (ably && channel) {
      channel.publish('message', message, (err) => {
        if (err) {
          console.error('Error publishing message:', err);
        } else {
          console.log('Message published successfully.');
        }
      });
    } else {
      console.error('Ably is not initialized.');
    }
  };

  const subscribeToMessages = (callback: (id: string, name: string, message: string, timestamp: number) => void): (() => void) => {
    if (channel) {
      const listener = (message: Ably.Types.Message) => {
        console.log('message received for event ' + message.name);
        console.log('message data:' + message.data);

        console.log(message);
        // Pass the received message to the callback
        callback(
          message.id as string, 
          message.name as string, 
          message.data as string, 
          message.timestamp as number
        );
      };

      channel.subscribe('message', listener);

      // Return a cleanup function
      return () => {
        if (channel) {
          channel.unsubscribe('message', listener);
        }
      };
    } else {
      console.error('Ably channel is not initialized.');
      return () => {};
    }
  };

  return { sendMessage, subscribeToMessages };
};
