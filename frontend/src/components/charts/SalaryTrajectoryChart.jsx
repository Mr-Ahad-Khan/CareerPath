import { useState, useEffect } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { formatMoney } from '@/lib/format.js';
import { useCurrency } from '@/lib/currency.jsx';

// 12 distinct, vibrant modern colors ensuring no duplicate colors across 10+ paths
const PATH_COLORS = [
  '#0ea5e9', // Sky Blue (Full-Stack Developer)
  '#6366f1', // Indigo (Deep Specialist)
  '#10b981', // Emerald (Founder)
  '#f59e0b', // Amber (AI & Data)
  '#8b5cf6', // Lavender (Mobile)
  '#06b6d4', // Cyan (Management Track)
  '#ec4899', // Berry Pink (SDET)
  '#3b82f6', // Cobalt Blue (Platform & Cloud)
  '#14b8a6', // Teal (Cybersecurity)
  '#f97316', // Orange (Product Track)
  '#a855f7', // Violet (Solopreneur)
  '#f43f5e', // Rose Red
];

function formatCompactAxisMoney(v, currency) {
  if (typeof v !== 'number' || isNaN(v)) return '';
  const isUSD = currency === 'USD';
  if (isUSD) {
    if (v >= 1e6) return `$${(v / 1e6).toFixed(1)}M`;
    if (v >= 1e3) return `$${Math.round(v / 1e3)}k`;
    return `$${v}`;
  }
  // INR
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(1)}Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(1)}L`;
  if (v >= 1e3) return `₹${Math.round(v / 1e3)}k`;
  return `₹${v}`;
}

function CustomTooltip({ active, payload, label, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border/70 bg-surface/95 backdrop-blur-md px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-lift max-w-[280px] sm:max-w-sm">
      <p className="mb-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted">
        {label === 0 ? 'Current Baseline' : `Year ${label} Projection`}
      </p>
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {payload.map((entry) => (
          <div key={entry.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-foreground/90 font-medium truncate">{entry.name}</span>
            <span className="ml-auto tabular text-foreground font-semibold shrink-0">
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
  const [hoveredPath, setHoveredPath] = useState(null);
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    <div className="relative w-full min-w-0 overflow-hidden">
      <ResponsiveContainer width="100%" height={isMobile ? 260 : 340}>
        <AreaChart
          data={data}
          margin={{
            top: 8,
            right: isMobile ? 8 : 16,
            left: isMobile ? -14 : -6,
            bottom: isMobile ? 4 : 0,
          }}
          onMouseLeave={() => setHoveredPath(null)}
        >
          <defs>
            {PATH_COLORS.map((c, i) => (
              <linearGradient key={i} id={`grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={c} stopOpacity={0.12} />
                <stop offset="95%" stopColor={c} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgb(var(--border))" opacity={0.25} />
          <XAxis
            dataKey="year"
            tickFormatter={(v) => (v === 0 ? 'Now' : `Y${v}`)}
            stroke="rgb(var(--text-muted))"
            fontSize={isMobile ? 10 : 11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v) => formatCompactAxisMoney(v, cur)}
            stroke="rgb(var(--text-muted))"
            fontSize={isMobile ? 9 : 11}
            tickLine={false}
            axisLine={false}
            width={isMobile ? 46 : 62}
          />
          <Tooltip content={<CustomTooltip currency={cur} />} />
          <Legend
            wrapperStyle={{
              fontSize: isMobile ? '10px' : '12px',
              paddingTop: isMobile ? '4px' : '10px',
              lineHeight: isMobile ? '16px' : '20px',
            }}
            iconType="circle"
            onMouseEnter={(e) => setHoveredPath(e.dataKey)}
            onMouseLeave={() => setHoveredPath(null)}
          />
          {safePaths.map((p, i) => {
            const color = PATH_COLORS[i % PATH_COLORS.length];
            const isHovered = hoveredPath === p.title;
            const isDimmed = hoveredPath && hoveredPath !== p.title;

            return (
              <Area
                key={p.code || p.title || i}
                type="monotone"
                dataKey={p.title}
                stroke={color}
                strokeWidth={isHovered ? 3.5 : isMobile ? 1.8 : 2.2}
                strokeOpacity={isDimmed ? 0.3 : 1}
                fill={`url(#grad-${i % PATH_COLORS.length})`}
                fillOpacity={isDimmed ? 0.02 : 1}
                dot={{
                  r: isHovered ? 4.5 : isMobile ? 2.5 : 3,
                  fill: 'rgb(var(--surface))',
                  stroke: color,
                  strokeWidth: isMobile ? 1.5 : 2,
                  opacity: isDimmed ? 0.3 : 1,
                }}
                activeDot={{ r: isMobile ? 4.5 : 5.5, strokeWidth: 2 }}
                connectNulls
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
