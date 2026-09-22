import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Sparkles, Check, CheckCheck, Clock, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/Avatar.jsx';
import { api } from '@/lib/api.js';
import { useToast } from '@/lib/toast.jsx';
import { useAuth } from '@/lib/auth.jsx';

const SUGGESTED_PROMPTS = [
  'Could we review my 5-year trajectory and Year 2 milestones?',
  'What technical certifications carry the most credibility in your field?',
  'What are the key trade-offs between specialization vs management?',
  'How do I best prepare for system design and architecture rounds?',
];

export function MentorChatModal({ isOpen, connection, onClose, onMessageSent }) {
  const { user } = useAuth();
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const isMentor = user?.role === 'mentor';
  const partner = isMentor
    ? connection?.student || { name: 'Student', headline: 'Connected Student', avatarColor: '#3ddc97' }
    : connection?.mentor || { name: 'Mentor', title: 'Senior Advisor', company: 'Tech', avatarColor: '#ffb340' };

  const partnerName = partner.name || (isMentor ? 'Student' : 'Mentor');
  const partnerSubtitle = isMentor
    ? partner.headline || 'CareerPath Connection'
    : `${partner.title || 'Mentor'} · ${partner.company || 'Tech'}`;

  const connectionId = connection?._id || connection?.id;

  // Load message history
  useEffect(() => {
    if (!isOpen || !connectionId) return;

    // Use initial messages if already attached on connection
    if (Array.isArray(connection?.messages) && connection.messages.length > 0) {
      setMessages(connection.messages);
    }

    setLoading(true);
    api.get(`/connections/${connectionId}/messages`)
      .then((data) => {
        if (Array.isArray(data?.messages)) {
          setMessages(data.messages);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch message history:', err);
      })
      .finally(() => setLoading(false));
  }, [isOpen, connectionId, connection]);

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen || !connection) return null;

  const handleSend = async (textToSend) => {
    const content = (typeof textToSend === 'string' ? textToSend : input).trim();
    if (!content || sending) return;

    const userRole = isMentor ? 'mentor' : 'student';
    const userName = user?.name || (isMentor ? 'Mentor' : 'You');

    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      senderId: user?.id || 'current-user',
      senderRole: userRole,
      senderName: userName,
      content,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput('');
    setSending(true);

    try {
      const res = await api.post(`/connections/${connectionId}/messages`, {
        content,
        senderRole: userRole,
        senderName: userName,
      });

      if (res?.messages) {
        setMessages(res.messages);
      } else if (res?.message) {
        setMessages((prev) => prev.map((m) => (m.id === optimisticMsg.id ? res.message : m)));
      }

      if (onMessageSent) onMessageSent();
    } catch (err) {
      toast.error(err.message || 'Failed to deliver message.');
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 p-3 sm:p-4 backdrop-blur-md animate-fade-in-flat"
      onClick={onClose}
    >
      <div
        className="flex h-[88vh] max-h-[680px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-surface-2/60 px-5 py-3.5 backdrop-blur-sm">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <Avatar name={partnerName} color={partner.avatarColor} size={42} />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-surface bg-emerald-500" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="truncate font-display text-base font-semibold text-foreground">
                  {partnerName}
                </h3>
                <span className="chip border-success/30 bg-success/10 text-success text-[10px] py-0 px-2 font-medium">
                  Connected
                </span>
              </div>
              <p className="truncate text-xs text-muted">{partnerSubtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1 text-[11px] text-muted mr-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <span>Career Guidance Session</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-muted hover:bg-surface-2 hover:text-foreground transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 touch-scroll">
          {loading && messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-sm text-muted">
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <MessageSquare className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-display text-base font-semibold text-foreground">
                  Start your conversation with {partnerName}
                </h4>
                <p className="mt-1 max-w-sm text-xs text-muted">
                  Ask targeted questions regarding milestones, skill gaps, or career direction.
                </p>
              </div>

              {/* Starter chips */}
              <div className="mt-4 flex flex-col gap-2 w-full max-w-md text-left">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-muted flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-accent" /> Recommended starters:
                </span>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-xl border border-border/80 bg-surface-2/70 px-3.5 py-2 text-xs text-foreground/90 hover:border-accent/40 hover:bg-surface-2 transition-all text-left"
                  >
                    "{prompt}"
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-center my-2">
                <span className="rounded-full bg-surface-2 px-3 py-0.5 text-[10px] uppercase font-semibold tracking-wider text-muted border border-border/50">
                  Career Mentorship Thread
                </span>
              </div>

              {messages.map((msg, idx) => {
                const isMyMessage =
                  (isMentor && msg.senderRole === 'mentor') ||
                  (!isMentor && (msg.senderRole === 'student' || !msg.senderRole)) ||
                  msg.senderId === user?.id;

                return (
                  <div
                    key={msg.id || msg._id || idx}
                    className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-end gap-2 max-w-[85%] sm:max-w-[75%]">
                      {!isMyMessage && (
                        <Avatar
                          name={partnerName}
                          color={partner.avatarColor}
                          size={28}
                          className="shrink-0 mb-1"
                        />
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                          isMyMessage
                            ? 'bg-accent text-accent-contrast rounded-br-xs font-medium'
                            : 'bg-surface-2 text-foreground border border-border rounded-bl-xs'
                        }`}
                      >
                        <p className="whitespace-pre-wrap leading-relaxed break-words">{msg.content}</p>
                        <div
                          className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${
                            isMyMessage ? 'text-accent-contrast/75' : 'text-muted'
                          }`}
                        >
                          <span>
                            {msg.createdAt
                              ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              : 'Just now'}
                          </span>
                          {isMyMessage && (
                            msg.pending ? <Clock className="h-3 w-3 animate-pulse" /> : <CheckCheck className="h-3 w-3" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggested Quick Prompts bar if messages exist */}
        {messages.length > 0 && (
          <div className="border-t border-border/60 bg-surface-2/30 px-4 py-2 overflow-x-auto flex gap-2 no-scrollbar">
            {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="chip shrink-0 text-[11px] py-1 px-2.5 hover:border-accent/50 hover:text-accent transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div className="border-t border-border bg-surface p-3 sm:p-4">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              className="field-input flex-1 pr-12 text-sm"
              placeholder={`Message ${partnerName}... (Press Enter to send)`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              autoFocus
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || sending}
              className="btn-primary shrink-0 px-3.5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
