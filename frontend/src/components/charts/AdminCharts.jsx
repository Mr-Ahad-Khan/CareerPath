import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

export function RoleDistributionChart({ data }) {
  const chartData = data.map((d) => ({ role: d.role, count: d.count }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.4} horizontal={false} />
        <XAxis type="number" stroke="rgb(var(--text-muted))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="role"
          stroke="rgb(var(--text-muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={130}
        />
        <Tooltip
          cursor={{ fill: 'rgb(var(--accent) / 0.06)' }}
          contentStyle={{
            background: 'rgb(var(--surface))',
            border: '1px solid rgb(var(--border))',
            borderRadius: '12px',
            fontSize: '13px',
          }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={18}>
          {chartData.map((_, i) => (
            <Cell key={i} fill={i === 0 ? 'rgb(var(--accent))' : 'rgb(var(--accent) / 0.5)'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SkillDemandChart({ data }) {
  const chartData = data.map((d) => ({ skill: d.skill, count: d.count }));
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.4} horizontal={false} />
        <XAxis type="number" stroke="rgb(var(--text-muted))" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          type="category"
          dataKey="skill"
          stroke="rgb(var(--text-muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={110}
        />
        <Tooltip
          cursor={{ fill: 'rgb(var(--info) / 0.06)' }}
          contentStyle={{
            background: 'rgb(var(--surface))',
            border: '1px solid rgb(var(--border))',
            borderRadius: '12px',
            fontSize: '13px',
          }}
        />
        <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16} fill="rgb(var(--info))" />
      </BarChart>
    </ResponsiveContainer>
  );
}
