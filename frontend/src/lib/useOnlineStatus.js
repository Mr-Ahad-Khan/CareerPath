import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [reconnected, setReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let reconnectTimer = null;

    const handleOnline = () => {
      setIsOnline(true);
      setReconnected(true);
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(() => {
        setReconnected(false);
      }, 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(reconnectTimer);
    };
  }, []);

  return { isOnline, reconnected };
}
