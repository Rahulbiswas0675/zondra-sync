import { Shield, Smartphone, Battery, MapPin, Plus, X } from 'lucide-react'
import { InstallButtons } from './InstallModal'
import type { Device } from '../hooks/types'

interface SidebarProps {
  devices: Device[]
  activeDeviceId: string
  onSelectDevice: (id: string) => void
  activePage: string
  onNavigate: (page: string) => void
  onAddDevice: () => void
  onRemoveDevice: (id: string) => void
  onInstall: (platform: 'android' | 'ios') => void
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊡' },
  { id: 'telemetry', label: 'Live Telemetry', icon: '◈' },
  { id: 'commands', label: 'Commands', icon: '⌁' },
  { id: 'screen',   label: 'Screen Viewer', icon: '▣' },
  { id: 'map',      label: 'Location', icon: '◎' },
  { id: 'settings', label: 'Settings', icon: '⚙' },
]

function getBatteryColor(b: number) {
  if (b > 50) return '#22c55e'
  if (b > 20) return '#f59e0b'
  return '#ef4444'
}

export default function Sidebar({ devices, activeDeviceId, onSelectDevice, activePage, onNavigate, onAddDevice, onRemoveDevice, onInstall }: SidebarProps) {
  return (
    <aside style={{
      width: 260, minWidth: 260, height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'rgba(10,13,22,0.95)', borderRight: '1px solid rgba(255,255,255,0.05)',
    }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#3b82f6,#6366f1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Shield size={18} color="white" />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#e2e8f0' }}>Zondra</div>
          <div style={{ fontSize: 10, color: '#475569', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>Control Node</div>
        </div>
      </div>

      <div style={{ width: '80%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '4px auto 16px' }} />

      {/* Navigation */}
      <nav style={{ padding: '0 12px', marginBottom: 16 }}>
        <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#334155', textTransform: 'uppercase', padding: '0 8px', marginBottom: 6 }}>Navigation</div>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8,
              border: 'none', cursor: 'pointer', marginBottom: 2, fontSize: 13, fontWeight: 500,
              background: activePage === item.id ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: activePage === item.id ? '#60a5fa' : '#64748b',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: 16, opacity: 0.9, width: 20, textAlign: 'center' }}>{item.icon}</span>
            {item.label}
            {item.id === 'telemetry' && (
              <span style={{ marginLeft: 'auto', background: '#3b82f6', color: 'white', fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>LIVE</span>
            )}
          </button>
        ))}
      </nav>

      <div style={{ width: '80%', height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 auto 16px' }} />

      {/* Devices header with + button */}
      <div style={{ padding: '0 12px', flex: 1, overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 8px', marginBottom: 8 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.15em', color: '#334155', textTransform: 'uppercase', flex: 1 }}>Monitored Devices</div>
          <button
            onClick={onAddDevice}
            title="Add device"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#60a5fa' }}
          >
            <Plus size={12} />
          </button>
        </div>
        {devices.map(dev => (
          <div
            key={dev.id}
            onClick={() => onSelectDevice(dev.id)}
            style={{
              padding: '10px 12px', borderRadius: 10, marginBottom: 6, cursor: 'pointer',
              background: activeDeviceId === dev.id ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${activeDeviceId === dev.id ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.04)'}`,
              transition: 'all 0.15s', position: 'relative',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Smartphone size={14} color={dev.status === 'online' ? '#22c55e' : '#64748b'} />
              <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1', flex: 1 }}>{dev.name}</span>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 7, height: 7, borderRadius: 99, background: dev.status === 'online' ? '#22c55e' : dev.status === 'idle' ? '#f59e0b' : '#ef4444', animation: dev.status === 'online' ? 'pulse-dot 1.5s infinite' : 'none' }} />
                <button
                  onClick={e => { e.stopPropagation(); onRemoveDevice(dev.id) }}
                  title="Remove device"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 2, display: 'flex', alignItems: 'center', opacity: 0.6 }}
                >
                  <X size={11} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Battery size={10} color={getBatteryColor(dev.battery)} />
                <span style={{ fontSize: 10, color: '#64748b' }}>{dev.battery}%</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <MapPin size={10} color="#64748b" />
                <span style={{ fontSize: 10, color: '#64748b' }}>{dev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Install Buttons */}
      <InstallButtons onInstall={onInstall} />

      {/* Status Bar */}
      <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div className="live-dot" />
          <span style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>System Operational</span>
        </div>
        <div style={{ fontSize: 10, color: '#334155', marginTop: 4 }}>v1.4.0-prod · AES-256 Active</div>
      </div>
    </aside>
  )
}
