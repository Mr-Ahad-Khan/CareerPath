import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatMoney } from '@/lib/format.js';
import { useCurrency } from '@/lib/currency.jsx';

const PATH_COLORS = ['#ffb340', '#3ddc97', '#5dade2'];

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-surface px-3.5 py-2.5 shadow-lift">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">
        {label === 0 ? 'Now' : `Year ${label}`}
      </p>
      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground">{entry.name}</span>
            <span className="ml-auto tabular text-foreground">
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

  const data = [];
  for (let y = 0; y <= 5; y++) {
    const row = { year: y };
    paths.forEach((p) => {
      const node = p.trajectory?.find((t) => t.year === y);
      row[p.title] = node ? node.salary : null;
    });
    data.push(row);
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {PATH_COLORS.map((c, i) => (
            <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c} stopOpacity={0.3} />
              <stop offset="95%" stopColor={c} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.4} />
        <XAxis
          dataKey="year"
          tickFormatter={(v) => (v === 0 ? 'Now' : `Y${v}`)}
          stroke="rgb(var(--text-muted))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tickFormatter={(v) => formatMoney(v, cur)}
          stroke="rgb(var(--text-muted))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={70}
        />
        <Tooltip content={<CustomTooltip currency={cur} />} />
        <Legend
          wrapperStyle={{ fontSize: '13px', paddingTop: '8px' }}
          iconType="circle"
        />
        {paths.map((p, i) => (
          <Area
            key={p.code}
            type="monotone"
            dataKey={p.title}
            stroke={PATH_COLORS[i % PATH_COLORS.length]}
            strokeWidth={2.5}
            fill={`url(#grad-${i})`}
            dot={{ r: 3, fill: PATH_COLORS[i % PATH_COLORS.length] }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
