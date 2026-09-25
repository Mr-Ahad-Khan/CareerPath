import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageSquare, Sparkles, X } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useAuth } from '@/lib/auth.jsx';
import { Avatar } from './Avatar.jsx';
import { MentorChatModal } from './MentorChatModal.jsx';

export function FloatingChatWidget() {
  const { user } = useAuth();
  const location = useLocation();
  const [connections, setConnections] = useState([]);
  const [activeModalConnection, setActiveModalConnection] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(true);

  const loadConnections = () => {
    if (!user) return;
    api.get('/connections')
      .then((d) => {
        const reqs = Array.isArray(d?.requests) ? d.requests : [];
        setConnections(reqs);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadConnections();
    const interval = setInterval(loadConnections, 12000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user || location.pathname === '/mentors') return null;

  const isMentor = user?.role === 'mentor';
  const acceptedConns = connections.filter((r) => r.status === 'accepted');

  if (acceptedConns.length === 0) return null;

  const primaryConn = acceptedConns[0];
  const partner = isMentor ? primaryConn?.student : primaryConn?.mentor;
  const partnerName = partner?.name || (isMentor ? 'Student' : 'Mentor');
  const lastMsg = primaryConn?.messages?.[primaryConn?.messages?.length - 1];

  return (
    <>
      <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 animate-fade-in">
        {!minimized ? (
          <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-surface/95 px-3.5 py-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-accent">
            <button
              onClick={() => {
                setActiveModalConnection(primaryConn);
                setHasNewMessage(false);
              }}
              className="flex items-center gap-2.5 text-left"
            >
              <div className="relative">
                <Avatar name={partnerName} color={partner?.avatarColor} size={30} />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                </span>
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-foreground">Chat with {partnerName.split(' ')[0]}</span>
                  <span className="chip border-accent/30 bg-accent/10 text-accent text-[9px] py-0 px-1.5 font-medium">
                    Online
                  </span>
                </div>
                <p className="max-w-[170px] truncate text-[11px] text-muted">
                  {lastMsg?.content || 'Open mentorship conversation'}
                </p>
              </div>
              <div className="sm:hidden flex items-center gap-1 text-xs font-medium text-foreground">
                <MessageSquare className="h-4 w-4 text-accent" />
                <span>Chat</span>
              </div>
            </button>

            <button
              onClick={() => setMinimized(true)}
              className="ml-1 rounded-full p-1 text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
              title="Minimize chat widget"
              aria-label="Minimize chat widget"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setMinimized(false)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/40 bg-accent text-accent-contrast shadow-lift hover:scale-105 transition-transform relative"
            title="Open Mentorship Chat"
            aria-label="Open Mentorship Chat"
          >
            <MessageSquare className="h-5 w-5" />
            {hasNewMessage && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-surface bg-emerald-500" />
            )}
          </button>
        )}
      </div>

      <MentorChatModal
        isOpen={Boolean(activeModalConnection)}
        connection={activeModalConnection}
        onClose={() => setActiveModalConnection(null)}
        onMessageSent={loadConnections}
      />
    </>
  );
}
