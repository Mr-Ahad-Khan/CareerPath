import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatMoney } from '@/lib/format.js';
import { useCurrency } from '@/lib/currency.jsx';

// Refined, low-contrast harmonious palette designed to prevent glare and harsh contrast
const PATH_COLORS = [
  '#6366f1', // Soft Slate Indigo
  '#0d9488', // Mellow Deep Teal
  '#d97706', // Warm Muted Amber
  '#8b5cf6', // Soft Lavender Purple
  '#0284c7', // Calm Slate Blue
  '#db2777', // Muted Dusty Berry
];

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-surface/95 backdrop-blur-md px-3.5 py-2.5 shadow-lift">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {label === 0 ? 'Now' : `Year ${label}`}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground/90 font-medium">{entry.name}</span>
            <span className="ml-auto tabular text-foreground font-semibold">
              {formatMoney(entry.value, currency)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SalaryTrajectoryChart({ paths, currency }) {
  const { currency: ctxCurrency } = useCurrency();
  const cur = currency || ctxCurrency;
  const safePaths = Array.isArray(paths) ? paths.filter(Boolean) : [];

  const data = [];
  for (let y = 0; y <= 5; y++) {
    const row = { year: y };
    safePaths.forEach((p) => {
      const node = p.trajectory?.find((t) => t.year === y);
      row[p.title] = node ? node.salary : null;
    });
    data.push(row);
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -10, bottom: 0 }}>
        <defs>
          {PATH_COLORS.map((c, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c} stopOpacity={0.14} />
              <stop offset="95%" stopColor={c} stopOpacity={0.01} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.25} />
        <XAxis
          dataKey="year"
          tickFormatter={(v) => (v === 0 ? 'Now' : `Y${v}`)}
          stroke="rgb(var(--text-muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatMoney(v, cur)}
          stroke="rgb(var(--text-muted))"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={62}
        />
        <Tooltip content={<CustomTooltip currency={cur} />} />
        <Legend
          wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
          iconType="circle"
        />
        {safePaths.map((p, i) => (
          <Area
            key={p.code || p.title || i}
            type="monotone"
            dataKey={p.title}
            stroke={PATH_COLORS[i % PATH_COLORS.length]}
            strokeWidth={2}
            fill={`url(#grad-${i % PATH_COLORS.length})`}
            dot={{ r: 2.5, fill: 'rgb(var(--surface))', stroke: PATH_COLORS[i % PATH_COLORS.length], strokeWidth: 1.5 }}
            activeDot={{ r: 4.5, strokeWidth: 2 }}
            connectNulls
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
