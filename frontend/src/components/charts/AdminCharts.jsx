import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

function formatLabel(label, maxLen = 14) {
  if (!label || label.length <= maxLen) return label;
  return `${label.slice(0, maxLen - 1)}…`;
}

export function RoleDistributionChart({ data }) {
  const chartData = (data || []).map((d) => ({ role: d.role, count: d.count }));
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: isMobile ? -10 : 0, right: 10, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.4} horizontal={false} />
          <XAxis type="number" stroke="rgb(var(--text-muted))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="role"
            stroke="rgb(var(--text-muted))"
            fontSize={isMobile ? 10 : 11}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 90 : 125}
            tickFormatter={(v) => formatLabel(v, isMobile ? 12 : 18)}
          />
          <Tooltip
            cursor={{ fill: 'rgb(var(--accent) / 0.06)' }}
            contentStyle={{
              background: 'rgb(var(--surface))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent) / 0.5)'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SkillDemandChart({ data }) {
  const chartData = (data || []).map((d) => ({ skill: d.skill, count: d.count }));
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;

  return (
    <div className="w-full min-w-0">
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={chartData} layout="vertical" margin={{ left: isMobile ? -10 : 0, right: 10, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.4} horizontal={false} />
          <XAxis type="number" stroke="rgb(var(--text-muted))" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="skill"
            stroke="rgb(var(--text-muted))"
            fontSize={isMobile ? 10 : 11}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 85 : 110}
            tickFormatter={(v) => formatLabel(v, isMobile ? 12 : 16)}
          />
          <Tooltip
            cursor={{ fill: 'rgb(var(--info) / 0.06)' }}
            contentStyle={{
              background: 'rgb(var(--surface))',
              border: '1px solid rgb(var(--border))',
              borderRadius: '12px',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16} fill="rgb(var(--info))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
