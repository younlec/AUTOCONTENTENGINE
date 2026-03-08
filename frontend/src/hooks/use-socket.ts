"use client";

import { useEffect, useRef, useCallback } from 'react';
import { socketClient } from '@/lib/socket';

export function useSocket() {
  useEffect(() => {
    socketClient.connect();
    return () => {
      // Don't disconnect on unmount - keep connection alive across page navigation
    };
  }, []);

  return {
    connected: socketClient.connected,
    subscribe: (channel: string) => socketClient.subscribe(channel),
    unsubscribe: (channel: string) => socketClient.unsubscribe(channel),
  };
}

export function useSocketEvent<T = any>(
  event: string,
  callback: (data: T) => void,
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    socketClient.connect();

    const handler = (data: T) => {
      callbackRef.current(data);
    };

    socketClient.on(event, handler);
    return () => {
      socketClient.off(event, handler);
    };
  }, [event]);
}
