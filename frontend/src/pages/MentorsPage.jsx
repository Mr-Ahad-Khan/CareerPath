import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Send, X, MessageSquare, Check, Clock } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useToast } from '@/lib/toast.jsx';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { EmptyState } from '@/components/EmptyState.jsx';
import { Avatar } from '@/components/Avatar.jsx';

export function MentorsPage() {
  const toast = useToast();
  const [mentors, setMentors] = useState(null);
  const [filters, setFilters] = useState({ q: '', industry: 'all', specialty: 'all' });
  const [meta, setMeta] = useState({ industries: [], specialties: [] });
  const [selected, setSelected] = useState(null);
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

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
    api.get('/connections').then((d) => setRequests(d.requests)).catch(() => {});
  }, []);

  useEffect(() => { loadMentors(); }, [filters]);

  const sendRequest = async () => {
    if (!message.trim()) {
      toast.error('Write a short message to the mentor first.');
      return;
    }
    try {
      await api.post('/connections', { mentorId: selected.id, message });
      toast.success(`Connection request sent to ${selected.name}.`);
      setSelected(null);
      setMessage('');
      const d = await api.get('/connections');
      setRequests(d.requests);
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!mentors) return <LoadingOverlay />;

  const pendingMentorIds = new Set(requests.filter((r) => r.status === 'pending').map((r) => r.mentorId));
  const acceptedMentorIds = new Set(requests.filter((r) => r.status === 'accepted').map((r) => r.mentorId));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <span className="section-eyebrow">Mentor Matching</span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Find someone who has walked the path</h1>
        <p className="mt-1 text-muted">Filter by industry, specialty, or search by name. Send a connection request to start a conversation.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input className="field-input pl-9" placeholder="Search mentors, companies, specialties..." value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        </div>
        <select className="field-select w-auto" value={filters.industry} onChange={(e) => setFilters({ ...filters, industry: e.target.value })}>
          <option value="all">All industries</option>
          {meta.industries.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select className="field-select w-auto" value={filters.specialty} onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}>
          <option value="all">All specialties</option>
          {meta.specialties.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {requests.length > 0 && (
        <div className="mb-6 surface-card p-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Your connection requests</h3>
          <div className="flex flex-wrap gap-2">
            {requests.map((r) => (
              <span key={r.id} className={`chip ${r.status === 'pending' ? 'border-warning/40 bg-warning/10 text-warning' : r.status === 'accepted' ? 'border-success/40 bg-success/10 text-success' : 'text-muted'}`}>
                {r.mentor?.name} — {r.status}
              </span>
            ))}
          </div>
        </div>
      )}

      {mentors.length === 0 ? (
        <EmptyState icon={Search} title="No mentors match those filters" description="Try clearing your search or selecting a different industry." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m) => (
            <div key={m.id} className="group surface-card p-5 transition-all duration-300 hover:border-accent/30">
              <div className="flex items-start gap-3">
                <Avatar name={m.name} color={m.avatarColor} size={48} />
                <div className="min-w-0 flex-1">
                  <h3 className="font-display text-base font-semibold text-foreground">{m.name}</h3>
                  <p className="text-sm text-muted">{m.title}</p>
                  <p className="text-xs text-muted">{m.company} · {m.experienceYears} yrs</p>
                </div>
              </div>
              <p className="mt-3 line-clamp-3 text-sm text-muted text-pretty">{m.bio}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {m.expertise.slice(0, 4).map((e) => <span key={e} className="chip text-[10px]">{e}</span>)}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 text-accent" fill="currentColor" /> {m.rating}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {m.location}</span>
                  <span>{m.menteeCount} mentees</span>
                </div>
              </div>
              <button
                onClick={() => { setSelected(m); setMessage(''); }}
                disabled={pendingMentorIds.has(m.id) || acceptedMentorIds.has(m.id)}
                className={`mt-4 w-full ${pendingMentorIds.has(m.id) ? 'btn-secondary cursor-default' : acceptedMentorIds.has(m.id) ? 'btn-secondary cursor-default' : 'btn-primary'}`}
              >
                {pendingMentorIds.has(m.id) ? <><Clock className="h-4 w-4" /> Request pending</> :
                 acceptedMentorIds.has(m.id) ? <><Check className="h-4 w-4 text-success" /> Connected</> :
                 <><Send className="h-4 w-4" /> Connect</>}
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-fade-in-flat" onClick={() => setSelected(null)}>
          <div className="w-full max-w-md surface-card p-6" onClick={(e) => e.stopPropagation()}>
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
              <label className="field-label"><MessageSquare className="mr-1 inline h-3.5 w-3.5" /> Your message</label>
              <textarea className="field-input min-h-[100px] resize-none" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={`Hi ${selected.name.split(' ')[0]}, I am exploring the ${selected.specialty.toLowerCase()} path and would value your perspective on...`} />
            </div>
            <button onClick={sendRequest} className="btn-primary mt-4 w-full">Send request <Send className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MentorsPage;
