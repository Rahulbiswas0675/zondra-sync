import { useState } from 'react'
import { Camera, RefreshCw, Cpu } from 'lucide-react'

interface ScreenViewerProps { deviceId: string }

export default function ScreenViewer({ deviceId }: ScreenViewerProps) {
  const [snapUrl, setSnapUrl] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<Date | null>(null)
  const [requesting, setRequesting] = useState(false)

  const requestSnapshot = async () => {
    setRequesting(true)
    // Simulate 2-3 second capture time
    await new Promise(r => setTimeout(r, 2500))

    // Use a placeholder demo screen (in production: Firebase Storage URL)
    setSnapUrl(`https://picsum.photos/seed/${deviceId + Date.now()}/360/640`)
    setTimestamp(new Date())
    setRequesting(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexShrink: 0 }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', marginBottom: 2 }}>Live Screen View</h2>
          <p style={{ fontSize: 12, color: '#475569' }}>Snapshot via MediaProjection API · 2s interval</p>
        </div>
        <button
          onClick={requestSnapshot}
          disabled={requesting}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 8,
            background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)',
            color: '#60a5fa', cursor: requesting ? 'wait' : 'pointer', fontSize: 13, fontWeight: 600,
          }}
        >
          {requesting ? <RefreshCw size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Camera size={14} />}
          {requesting ? 'Capturing...' : 'Request Snapshot'}
        </button>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden', position: 'relative' }}>
        {requesting && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, zIndex: 10 }}>
            <RefreshCw size={28} color="#3b82f6" style={{ animation: 'spin 0.8s linear infinite' }} />
            <span style={{ color: '#60a5fa', fontSize: 13, fontWeight: 600 }}>Capturing screen frame...</span>
          </div>
        )}
        {snapUrl ? (
          <div style={{ position: 'relative', height: '100%' }}>
            <img src={snapUrl} alt="Remote Screen" style={{ height: '100%', objectFit: 'contain', borderRadius: 12 }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="badge badge-green">AES-256 DECRYPTED</span>
              <span style={{ fontSize: 10, color: '#64748b' }}>Captured {timestamp?.toLocaleTimeString()}</span>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#334155' }}>
            <Cpu size={40} style={{ marginBottom: 12 }} />
            <p style={{ fontSize: 14, fontWeight: 500 }}>No snapshot available</p>
            <p style={{ fontSize: 12, marginTop: 4 }}>Click "Request Snapshot" to begin</p>
          </div>
        )}
      </div>
    </div>
  )
}
