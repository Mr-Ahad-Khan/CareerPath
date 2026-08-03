import { useState, useEffect } from 'react';
import { FileCheck, Upload, ClipboardPaste, Check, X, AlertTriangle, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api.js';
import { useToast } from '@/lib/toast.jsx';
import { LoadingOverlay } from '@/components/Spinner.jsx';
import { EmptyState } from '@/components/EmptyState.jsx';
import { pct } from '@/lib/format.js';

export function ResumeCheckPage() {
  const toast = useToast();
  const [sims, setSims] = useState(null);
  const [selectedSim, setSelectedSim] = useState(null);
  const [selectedPath, setSelectedPath] = useState(0);
  const [resumeText, setResumeText] = useState('');
  const [result, setResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    api.get('/simulations').then((data) => {
      setSims(data.simulations);
      if (data.simulations.length > 0) setSelectedSim(data.simulations[0].id);
    }).catch(() => setSims([]));
  }, []);

  const [simDetail, setSimDetail] = useState(null);

  useEffect(() => {
    if (selectedSim) {
      api.get(`/simulations/${selectedSim}`).then((d) => setSimDetail(d.simulation)).catch(() => {});
    }
  }, [selectedSim]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500000) {
      toast.error('File is too large. Keep it under 500KB.');
      return;
    }
    const text = await file.text();
    setResumeText(text);
    toast.info(`Loaded ${file.name}.`);
  };

  const analyze = async () => {
    if (!resumeText || resumeText.length < 20) {
      toast.error('Paste your resume text or upload a file first.');
      return;
    }
    if (!simDetail) {
      toast.error('Select a simulation to compare against.');
      return;
    }
    const path = simDetail.paths[selectedPath];
    setAnalyzing(true);
    try {
      const data = await api.post('/resume/analyze', {
        resumeText,
        skillGaps: path.skillGaps,
      });
      setResult(data);
      toast.success('Resume analysed.');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  if (!sims) return <LoadingOverlay />;

  const path = simDetail?.paths[selectedPath];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <span className="section-eyebrow">Resume Reality-Check</span>
        <h1 className="mt-2 font-display text-3xl font-semibold text-foreground">Does your resume match your target path?</h1>
        <p className="mt-1 text-muted">Paste your resume or upload a text file. We parse the skills you mention and cross-reference them against the gaps your simulation identified.</p>
      </div>

      {sims.length === 0 ? (
        <EmptyState icon={FileCheck} title="Run a simulation first" description="The reality-check compares your resume against a saved simulation's skill gaps." />
      ) : (
        <>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div>
              <label className="field-label">Compare against simulation</label>
              <select className="field-select" value={selectedSim || ''} onChange={(e) => { setSelectedSim(+e.target.value); setResult(null); }}>
                {sims.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Path</label>
              <select className="field-select" value={selectedPath} onChange={(e) => { setSelectedPath(+e.target.value); setResult(null); }}>
                {simDetail?.paths.map((p, i) => <option key={p.code} value={i}>{p.title}</option>) || []}
              </select>
            </div>
          </div>

          <div className="mb-4 surface-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <label className="field-label mb-0">Your resume</label>
              <div className="flex gap-2">
                <label className="btn-ghost cursor-pointer text-xs">
                  <Upload className="h-3.5 w-3.5" /> Upload .txt
                  <input type="file" accept=".txt,.text,.md" onChange={handleFile} className="hidden" />
                </label>
                <button onClick={() => { setResumeText(''); setResult(null); }} className="btn-ghost text-xs"><X className="h-3.5 w-3.5" /> Clear</button>
              </div>
            </div>
            <textarea
              className="field-input min-h-[160px] resize-y font-mono text-xs"
              placeholder="Paste your resume text here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">{resumeText.length} characters</span>
              <button onClick={analyze} disabled={analyzing} className="btn-primary">
                {analyzing ? 'Analysing...' : <>Run reality-check <ClipboardPaste className="h-4 w-4" /></>}
              </button>
            </div>
          </div>

          {analyzing && <LoadingOverlay label="Parsing skills and cross-referencing gaps..." />}

          {result && (
            <div className="animate-fade-in space-y-4">
              <div className="surface-card border-accent/30 p-5">
                <div className="flex items-center gap-4">
                  <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--border))" strokeWidth="8" />
                      <circle cx="50" cy="50" r="42" fill="none" stroke="rgb(var(--accent))" strokeWidth="8"
                        strokeDasharray={`${result.realityCheck.coverageScore * 2.64} 264`} strokeLinecap="round" />
                    </svg>
                    <span className="absolute font-display text-xl font-semibold text-foreground">{pct(result.realityCheck.coverageScore)}</span>
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground">Coverage score</h3>
                    <p className="text-sm text-muted">
                      Your resume covers {result.realityCheck.matched.length} of {result.realityCheck.matched.length + result.realityCheck.missing.length} skills your target path needs.
                      {result.realityCheck.coverageScore >= 75 ? ' Strong alignment.' : result.realityCheck.coverageScore >= 50 ? ' Decent, with clear gaps.' : ' Significant gaps to address.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="surface-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-success">
                    <Check className="h-5 w-5" /> Covered ({result.realityCheck.matched.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.realityCheck.matched.length === 0 && <p className="text-sm text-muted">None yet.</p>}
                    {result.realityCheck.matched.map((s) => <span key={s.skill} className="chip border-success/40 bg-success/10 text-success text-xs">{s.skill}</span>)}
                  </div>
                </div>
                <div className="surface-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-error">
                    <AlertTriangle className="h-5 w-5" /> Missing ({result.realityCheck.missing.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.realityCheck.missing.length === 0 && <p className="text-sm text-muted">No gaps — well done.</p>}
                    {result.realityCheck.missing.map((s) => <span key={s.skill} className="chip border-error/40 bg-error/10 text-error text-xs">{s.skill}</span>)}
                  </div>
                </div>
              </div>

              {result.realityCheck.surplus.length > 0 && (
                <div className="surface-card p-5">
                  <h3 className="mb-3 flex items-center gap-2 font-display text-base font-semibold text-info">
                    <TrendingUp className="h-5 w-5" /> On your resume but not needed for this path ({result.realityCheck.surplus.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {result.realityCheck.surplus.map((s) => <span key={s.skill} className="chip text-xs">{s.skill}</span>)}
                  </div>
                  <p className="mt-3 text-xs text-muted">These are not wasted — they may matter for a different branch or make you a stronger cross-functional candidate.</p>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ResumeCheckPage;
