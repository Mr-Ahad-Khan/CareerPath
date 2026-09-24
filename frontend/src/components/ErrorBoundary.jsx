import React from 'react';
import { RotateCcw, Home, WifiOff, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CareerPath ErrorBoundary caught]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetOffline = () => {
    try {
      localStorage.removeItem('cp-offline-initialized-v3');
    } catch {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen min-h-[100dvh] w-full flex items-center justify-center p-4 bg-[#0e1014] text-[#f2f4f8]">
          <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#16191f] p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-7 w-7" />
            </div>
            <h1 className="font-display text-xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[#969eaa] mb-6 leading-relaxed">
              CareerPath encountered a display issue. Your offline data and progress are securely preserved.
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-black transition-all hover:bg-amber-400 active:scale-95"
              >
                <RotateCcw className="h-4 w-4" /> Reload application
              </button>
              <button
                onClick={this.handleResetOffline}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10"
              >
                <Home className="h-4 w-4" /> Go to home page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
