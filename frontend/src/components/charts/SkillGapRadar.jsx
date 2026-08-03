import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip,
} from 'recharts';

function RadarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { skill, current, target } = payload[0].payload;
  return (
    <div className="rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-lift">
      <p className="text-sm font-medium text-foreground">{skill}</p>
      <div className="mt-1 flex gap-3 text-xs text-muted">
        <span>You: <span className="text-foreground tabular">{current}/5</span></span>
        <span>Target: <span className="text-accent tabular">{target}/5</span></span>
      </div>
    </div>
  );
}

export function SkillGapRadar({ currentSkills, targetSkills }) {
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
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data} outerRadius="72%">
        <PolarGrid stroke="rgb(var(--border))" />
        <PolarAngleAxis
          dataKey="skill"
          tick={{ fill: 'rgb(var(--text-muted))', fontSize: 11 }}
        />
        <PolarRadiusAxis
          domain={[0, 5]}
          tick={{ fill: 'rgb(var(--text-muted))', fontSize: 10 }}
          axisLine={false}
          tickCount={6}
        />
        <Radar
          name="Target"
          dataKey="target"
          stroke="rgb(var(--accent))"
          fill="rgb(var(--accent))"
          fillOpacity={0.15}
          strokeWidth={2}
        />
        <Radar
          name="You"
          dataKey="current"
          stroke="rgb(var(--info))"
          fill="rgb(var(--info))"
          fillOpacity={0.1}
          strokeWidth={2}
        />
        <Tooltip content={<RadarTooltip />} />
      </RadarChart>
    </ResponsiveContainer>
  );
}
