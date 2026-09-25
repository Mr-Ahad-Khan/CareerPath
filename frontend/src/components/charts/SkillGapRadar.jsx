import { useState, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { skill, current, target } = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-surface px-3 py-2 shadow-lift">
      <p className="text-xs font-medium text-foreground">{skill}</p>
      <div className="mt-1 flex gap-3 text-[11px] text-muted">
        <span>You: <span className="text-foreground tabular">{current}/5</span></span>
        <span>Target: <span className="text-accent tabular">{target}/5</span></span>
      </div>
    </div>
  );
}

export function SkillGapRadar({ currentSkills, targetSkills }) {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const skillNames = targetSkills.map((s) => s.name);
  const data = skillNames.map((name) => {
    const owned = currentSkills.find(
      (s) => s.name.toLowerCase() === name.toLowerCase()
    );
    return {
      skill: name,
      current: owned ? owned.proficiency : 0,
      target: 4,
    };
  });

  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted">
        No target skills to compare against.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 300}>
        <RadarChart
          data={data}
          outerRadius={isMobile ? '46%' : '64%'}
          margin={{
            top: 6,
            right: isMobile ? 6 : 15,
            bottom: 6,
            left: isMobile ? 6 : 15,
          }}
        >
          <PolarGrid stroke="rgb(var(--border))" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="skill"
            tick={{
              fill: 'rgb(var(--text-muted))',
              fontSize: isMobile ? 9 : 11,
            }}
          />
          <PolarRadiusAxis
            domain={[0, 5]}
            tick={{ fill: 'rgb(var(--text-muted))', fontSize: 9 }}
            axisLine={false}
            tickCount={6}
          />
          <Radar
            name="Target"
            dataKey="target"
            stroke="rgb(var(--accent))"
            fill="rgb(var(--accent))"
            fillOpacity={0.1}
            strokeWidth={1.75}
          />
          <Radar
            name="You"
            dataKey="current"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.08}
            strokeWidth={1.75}
          />
          <Tooltip content={<RadarTooltip />} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
