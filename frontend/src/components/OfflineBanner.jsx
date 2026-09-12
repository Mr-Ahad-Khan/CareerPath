import { Wifi, WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/lib/useOnlineStatus.js';

export function OfflineBanner() {
  const { isOnline, reconnected } = useOnlineStatus();

  if (reconnected) {
    return (
      <div className="bg-emerald-500/15 border-b border-emerald-500/25 px-3 py-1.5 text-center text-xs font-medium text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <Wifi className="h-3.5 w-3.5 text-emerald-400" />
        <span>Back online — Connected</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <div className="bg-amber-500/15 border-b border-amber-500/25 px-3 py-1.5 text-center text-xs font-medium text-amber-300 flex items-center justify-center gap-2 animate-fade-in">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
        </span>
        <WifiOff className="h-3.5 w-3.5 text-amber-400" />
        <span>Offline Mode — All simulations, roadmap & journal save locally on this device</span>
      </div>
    );
  }

  return null;
}
