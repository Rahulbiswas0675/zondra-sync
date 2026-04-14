import type { Device } from '../hooks/types'
import { Battery, MapPin, Clock } from 'lucide-react'

interface DeviceHeaderProps { device: Device }

export default function DeviceHeader({ device }: DeviceHeaderProps) {
  const statusColor = device.status === 'online' ? '#22c55e' : device.status === 'idle' ? '#f59e0b' : '#ef4444'
  const batteryColor = device.battery > 50 ? '#22c55e' : device.battery > 20 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 28px', background: 'rgba(10,13,22,0.9)',
      borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h1 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>{device.name}</h1>
            <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
              ● {device.status.toUpperCase()}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{device.model} · {device.os} · {device.ip}</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <Battery size={14} color={batteryColor} />
          <span style={{ color: batteryColor, fontWeight: 600 }}>{device.battery}%</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <MapPin size={14} />
          {device.location}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
          <Clock size={14} />
          {device.lastSeen.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
