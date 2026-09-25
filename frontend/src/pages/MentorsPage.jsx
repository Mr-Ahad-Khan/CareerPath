import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, Send, X, MessageSquare, Check, Clock, Bell, UserRound, Sparkles, ShieldCheck } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useToast } from '@/lib/toast.jsx';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { EmptyState } from '@/components/EmptyState.jsx';
import { Avatar } from '@/components/Avatar.jsx';
import { useAuth } from '@/lib/auth.jsx';
import { MentorChatModal } from '@/components/MentorChatModal.jsx';

export function MentorsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [mentors, setMentors] = useState(null);
  const [filters, setFilters] = useState({ q: '', industry: 'all', specialty: 'all' });
  const [meta, setMeta] = useState({ industries: [], specialties: [] });
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const [sendingRequest, setSendingRequest] = useState(false);
  const [updatingRequest, setUpdatingRequest] = useState(null);
  const [activeChatConnection, setActiveChatConnection] = useState(null);

  const reloadConnections = useCallback(() => {
    api.get('/connections').then((d) => setRequests(d.requests || [])).catch(() => {});
  }, []);

  const handleStartChat = async (mentor) => {
    try {
      const res = await api.post('/connections/chat', { mentorId: mentor.id });
      if (res?.connection) {
        setActiveChatConnection(res.connection);
        reloadConnections();
        return;
      }
    } catch (err) {
      console.warn('Could not start direct chat via API, falling back to local connection:', err);
    }
    const conn = requests.find((r) => (r.mentorId === mentor.id || r.mentor?.id === mentor.id)) || {
      id: mentor.id,
      _id: mentor.id,
      mentor,
      mentorId: mentor.id,
      studentId: user?.id,
      status: 'accepted',
      messages: [],
    };
    setActiveChatConnection(conn);
  };

  const loadMentors = async () => {
    const params = new URLSearchParams();
    if (filters.q) params.set('q', filters.q);
    if (filters.industry !== 'all') params.set('industry', filters.industry);
    if (filters.specialty !== 'all') params.set('specialty', filters.specialty);
    try {
      const data = await api.get(`/mentors?${params}`);
      setMentors(data.mentors);
    } catch {
      setMentors([]);
    }
  };

  useEffect(() => {
    api.get('/mentors/industries').then(setMeta).catch(() => {});
    api.get('/connections').then((d) => {
      const list = d.requests || [];
      setRequests(list);
      const params = new URLSearchParams(window.location.search);
      if (params.get('openChat') === 'true' && list.length > 0) {
        const active = list.find((r) => r.status === 'accepted') || list[0];
        if (active) setActiveChatConnection(active);
      }
    }).catch(() => {});
  }, []);

  const updateRequest = async (requestId, action) => {
    setUpdatingRequest(requestId);
    try {
      await api.patch(`/connections/${requestId}/${action}`);
      const d = await api.get('/connections');
      setRequests(d.requests || []);
      toast.success(action === 'accept' ? 'Connection accepted. You can now chat.' : 'Request declined.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdatingRequest(null);
    }
  };

  useEffect(() => { loadMentors(); }, [filters]);

  const sendRequest = async () => {
    if (!message.trim()) {
      toast.error('Write a short message to the mentor first.');
      return;
    }
    if (sendingRequest) return;

    setSendingRequest(true);
    try {
      const result = await api.post('/connections', { mentorId: selected.id, message });
      toast.success(result.alreadyExists
        ? `You are connected with ${selected.name}.`
        : `Connection request sent to ${selected.name}.`);
      setSelected(null);
      setMessage('');
      const d = await api.get('/connections');
      setRequests(d.requests || []);
      if (result?.request) {
        setActiveChatConnection(result.request);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSendingRequest(false);
    }
  };

  if (!mentors) return <LoadingOverlay />;

  const isMentor = user?.role === 'mentor';
  const incomingPending = requests.filter((r) => r.status === 'pending');
  const connectedMentors = requests.filter((r) => r.status === 'accepted');

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <span className="section-eyebrow">Direct 1-on-1 Guidance</span>
          <h1 className="mt-2 font-display text-2xl sm:text-3xl font-semibold text-foreground">
            Find someone who has walked the path
          </h1>
          <p className="mt-1 text-sm text-muted">
            Connect with verified engineering leaders, staff architects, and directors. Discuss roadmap milestones and system design.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Verified Advisors Live
          </span>
        </div>
      </div>

      {/* Active Mentorship Chat Notification Banner */}
      {connectedMentors.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 p-4 shadow-lift animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative shrink-0">
              <Avatar
                name={isMentor ? (connectedMentors[0].student?.name || 'Student') : (connectedMentors[0].mentor?.name || 'Mentor')}
                color={isMentor ? connectedMentors[0].student?.avatarColor : connectedMentors[0].mentor?.avatarColor}
                size={40}
              />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-accent" />
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">
                  Active Mentorship Chat with {isMentor ? (connectedMentors[0].student?.name || 'Student') : (connectedMentors[0].mentor?.name || 'Mentor')}
                </h3>
                <span className="chip border-accent/40 bg-accent/20 text-accent text-[10px] font-semibold py-0 px-2">
                  Session Active
                </span>
              </div>
              <p className="text-xs text-muted truncate">
                {connectedMentors[0].messages?.[connectedMentors[0].messages.length - 1]?.content || '1-on-1 mentorship session is active. Click to discuss trajectory.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveChatConnection(connectedMentors[0])}
            className="btn-primary text-xs sm:text-sm px-4 py-2 flex items-center gap-2 shrink-0 shadow-sm"
          >
            <MessageSquare className="h-4 w-4" /> Open Chat Window
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              id="mentor-search-input"
              name="mentorSearch"
              aria-label="Search mentors by name, company, or specialty"
              className="field-input pl-9 text-sm"
              placeholder="Search mentors, companies, specialties..."
              value={filters.q}
              onChange={(e) => setFilters({ ...filters, q: e.target.value })}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select
              id="mentor-industry-select"
              name="industryFilter"
              aria-label="Filter by industry"
              className="field-select flex-1 sm:w-auto text-sm"
              value={filters.industry}
              onChange={(e) => setFilters({ ...filters, industry: e.target.value })}
            >
              <option value="all">All industries</option>
              {meta.industries.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
            <select
              id="mentor-specialty-select"
              name="specialtyFilter"
              aria-label="Filter by specialty"
              className="field-select flex-1 sm:w-auto text-sm"
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
            >
              <option value="all">All specialties</option>
              {meta.specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Quick Industry Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-semibold uppercase text-muted tracking-wider mr-1 shrink-0">Quick Filter:</span>
          {['all', 'Engineering', 'Fintech', 'Product & Design', 'Infrastructure & SRE'].map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setFilters({ ...filters, industry: tag })}
              className={`chip shrink-0 capitalize text-xs transition-colors ${
                filters.industry === tag ? 'border-accent bg-accent/15 text-accent font-semibold' : 'hover:border-accent/40'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {isMentor && incomingPending.length > 0 && (
        <div className="mb-6 surface-card border-accent/30 p-3.5 sm:p-5 w-full min-w-0 overflow-hidden">
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">New connection requests</h3>
          </div>
          <div className="space-y-2.5 sm:space-y-3 w-full min-w-0">
            {incomingPending.map((request) => (
              <div key={request.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-border bg-surface-2 p-3 w-full min-w-0">
                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                  <Avatar name={request.student?.name || 'Student'} color={request.student?.avatarColor} size={36} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground truncate">{request.student?.name || 'Student'}</p>
                    <p className="truncate text-xs text-muted">{request.message}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0 self-end sm:self-auto">
                  <button onClick={() => updateRequest(request.id, 'decline')} disabled={updatingRequest === request.id} className="btn-secondary px-3 py-1.5 text-xs">Decline</button>
                  <button onClick={() => updateRequest(request.id, 'accept')} disabled={updatingRequest === request.id} className="btn-primary px-3 py-1.5 text-xs flex items-center gap-1"><Check className="h-3.5 w-3.5" /> Accept & Chat</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isMentor && connectedMentors.length > 0 && (
        <div className="mb-6 surface-card p-3.5 sm:p-5 w-full min-w-0 overflow-hidden">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <UserRound className="h-4 w-4 text-success" /> Active mentees ({connectedMentors.length})
          </h3>
          <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
            {connectedMentors.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-2.5 rounded-xl border border-border bg-surface-2 p-2.5 sm:p-3 w-full min-w-0 overflow-hidden shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Avatar name={request.student?.name || 'Student'} color={request.student?.avatarColor} size={36} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-semibold text-foreground">{request.student?.name || 'Student'}</p>
                    <p className="truncate text-[11px] sm:text-xs text-muted">{request.student?.headline || 'Mentorship connection'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveChatConnection(request)}
                  className="btn-primary shrink-0 text-xs px-2.5 sm:px-3 py-1.5 flex items-center gap-1 shadow-sm whitespace-nowrap"
                  aria-label={`Chat with ${request.student?.name || 'Student'}`}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-accent-contrast" />
                  <span>Chat</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isMentor && requests.length > 0 && (
        <div className="mb-6 surface-card p-3.5 sm:p-5 w-full min-w-0 overflow-hidden">
          <div className="mb-3 flex items-center gap-2">
            <Bell className="h-4 w-4 text-accent" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Connection updates</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {requests.map((r) => (
              <span key={r.id} className={`chip ${r.status === 'pending' ? 'border-warning/40 bg-warning/10 text-warning' : r.status === 'accepted' ? 'border-success/40 bg-success/10 text-success' : 'text-muted'}`}>
                {r.mentor?.name} — {r.status}
              </span>
            ))}
          </div>
        </div>
      )}

      {!isMentor && connectedMentors.length > 0 && (
        <div className="mb-6 surface-card p-3.5 sm:p-5 w-full min-w-0 overflow-hidden">
          <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <UserRound className="h-4 w-4 text-success" /> Your connected mentors ({connectedMentors.length})
          </h3>
          <div className="grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full min-w-0">
            {connectedMentors.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-2.5 rounded-xl border border-success/30 bg-success/5 p-2.5 sm:p-3 w-full min-w-0 overflow-hidden shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <Avatar name={request.mentor?.name || 'Mentor'} color={request.mentor?.avatarColor} size={36} className="shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs sm:text-sm font-semibold text-foreground">{request.mentor?.name || 'Mentor'}</p>
                    <p className="truncate text-[11px] sm:text-xs text-muted">{request.mentor?.title || 'Connected mentor'}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveChatConnection(request)}
                  className="btn-primary shrink-0 text-xs px-2.5 sm:px-3 py-1.5 flex items-center gap-1 shadow-sm whitespace-nowrap"
                  aria-label={`Chat with ${request.mentor?.name || 'Mentor'}`}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-accent-contrast" />
                  <span>Chat</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mentors.length === 0 ? (
        <EmptyState icon={Search} title="No mentors match those filters" description="Try clearing your search or selecting a different industry." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m) => (
            <div key={m.id} className="group surface-card p-5 transition-all duration-300 hover:border-accent/30 flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3">
                  <Avatar name={m.name} color={m.avatarColor} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-display text-base font-semibold text-foreground truncate">{m.name}</h3>
                      <span className="chip text-[10px] py-0 px-1.5 shrink-0 border-accent/20 bg-accent/5 text-accent">
                        {m.specialty}
                      </span>
                    </div>
                    <p className="text-sm text-muted truncate">{m.title}</p>
                    <p className="text-xs text-muted">{m.company} · {m.experienceYears} yrs</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-3 text-sm text-muted text-pretty">{m.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {m.expertise.slice(0, 4).map((e) => <span key={e} className="chip text-[10px]">{e}</span>)}
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-accent" fill="currentColor" /> {m.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {m.location}</span>
                  <span>{m.menteeCount} mentees</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3.5 border-t border-border/70 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleStartChat(m)}
                  className="btn-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 shadow-sm"
                  aria-label={`Chat with ${m.name}`}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Chat with {m.name.split(' ')[0]}
                </button>
                <button
                  type="button"
                  onClick={() => { setSelected(m); setMessage(''); }}
                  className="btn-secondary py-2 px-3 text-xs flex items-center justify-center gap-1 shrink-0"
                  aria-label={`View details or connect with ${m.name}`}
                  title="Send introductory connection request"
                >
                  <Send className="h-3 w-3" />
                  Intro
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in-flat" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md surface-card p-5 sm:p-6 max-h-[90dvh] overflow-y-auto touch-scroll shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} color={selected.avatarColor} size={44} />
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{selected.name}</h3>
                  <p className="text-sm text-muted">{selected.title} · {selected.company}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <p className="mb-4 text-sm text-muted text-pretty">{selected.bio}</p>
            <div>
              <label className="field-label" htmlFor="mentor-connect-message"><MessageSquare className="mr-1 inline h-3.5 w-3.5" /> Your message</label>
              <textarea
                id="mentor-connect-message"
                name="mentorMessage"
                aria-label="Message to mentor"
                className="field-input min-h-[100px] resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Hi ${selected.name.split(' ')[0]}, I am exploring the ${selected.specialty.toLowerCase()} path and would value your perspective on...`}
              />
            </div>
            <button onClick={sendRequest} disabled={sendingRequest} className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-60">
              {sendingRequest ? 'Sending…' : 'Send request'} <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Interactive Mentor-Connection Chat */}
      <MentorChatModal
        isOpen={Boolean(activeChatConnection)}
        connection={activeChatConnection}
        onClose={() => setActiveChatConnection(null)}
        onMessageSent={reloadConnections}
      />
    </div>
  );
}

export default MentorsPage;
