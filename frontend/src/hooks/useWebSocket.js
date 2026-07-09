import { useEffect, useRef } from 'react';

export default function useWebSocket(url, onMessage) {
  const ws = useRef(null);
  useEffect(() => {
    console.log(`Menghubungkan WebSocket ke ${url}...`);
    return () => {
      console.log('Menutup koneksi WebSocket...');
    };
  }, [url, onMessage]);

  const sendMessage = (data) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(data));
    }
  };

  return { sendMessage };
}