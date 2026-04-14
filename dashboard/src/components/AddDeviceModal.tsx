import { useState } from 'react'
import { X, Copy, Check, Smartphone, ShieldCheck } from 'lucide-react'

interface AddDeviceModalProps {
  onClose: () => void
  onAdd: (device: { id: string; name: string; token: string }) => void
}

function generateToken(): string {
  return Array.from({ length: 4 }, () =>
    Math.random().toString(36).substring(2, 7).toUpperCase()
  ).join('-')
}

export default function AddDeviceModal({ onClose, onAdd }: AddDeviceModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [name, setName] = useState('')
  const [token] = useState(() => generateToken())
  const [copied, setCopied] = useState(false)

  const copyToken = () => {
    navigator.clipboard.writeText(token)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePair = () => {
    onAdd({ id: `dev-${Date.now()}`, name: name || 'Unknown Device', token })
    onClose()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        width: 480, background: '#0f1420', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 40px 80px rgba(0,0,0,0.6)', padding: 32, position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 28 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: 3, borderRadius: 99,
              background: s <= step ? '#3b82f6' : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s',
            }} />
          ))}
        </div>

        {step === 1 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Smartphone size={22} color="#60a5fa" />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>Add a Device</h2>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Step 1: Name this device</p>
              </div>
            </div>

            <label style={{ fontSize: 12, color: '#64748b', display: 'block', marginBottom: 6 }}>Device Label</label>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Target-Galaxy-S23"
              style={{
                width: '100%', padding: '12px 14px', borderRadius: 10,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#e2e8f0', fontSize: 14, outline: 'none', marginBottom: 24,
              }}
            />
            <button
              onClick={() => setStep(2)}
              disabled={!name.trim()}
              style={{
                width: '100%', padding: '12px', borderRadius: 10,
                background: name.trim() ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${name.trim() ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)'}`,
                color: name.trim() ? '#60a5fa' : '#334155', cursor: name.trim() ? 'pointer' : 'not-allowed',
                fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
              }}
            >
              Next →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(245,158,11,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={22} color="#fbbf24" />
              </div>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>Pairing Token</h2>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Step 2: Copy token to Android app</p>
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: '16px 18px', marginBottom: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 11, color: '#475569', marginBottom: 8, letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Your Pairing Code</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <code style={{ fontSize: 22, fontWeight: 800, color: '#60a5fa', letterSpacing: '0.15em' }}>{token}</code>
                <button
                  onClick={copyToken}
                  style={{ padding: '8px 14px', borderRadius: 8, background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.1)', border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.2)'}`, color: copied ? '#4ade80' : '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600 }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            <div style={{ background: 'rgba(59,130,246,0.05)', borderRadius: 10, padding: 14, marginBottom: 20, border: '1px solid rgba(59,130,246,0.1)' }}>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.7 }}>
                On the Android target device, open <strong style={{ color: '#94a3b8' }}>Zondra Watcher</strong> (System Optimization app), go to <strong style={{ color: '#94a3b8' }}>Settings → Pair with Console</strong>, and enter this code. The device will appear in your sidebar once connected.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>← Back</button>
              <button onClick={() => setStep(3)} style={{ flex: 2, padding: '11px', borderRadius: 10, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#60a5fa', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Waiting for device…</button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>📱</div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', marginBottom: 8 }}>Device Ready to Pair</h2>
              <p style={{ fontSize: 13, color: '#475569', marginBottom: 24 }}>
                <span style={{ color: '#60a5fa', fontWeight: 600 }}>{name}</span> will appear in your sidebar as online once the APK is running and the code is entered.
              </p>

              <div className="badge badge-green" style={{ marginBottom: 24, fontSize: 12, padding: '6px 14px' }}>
                ● Token Issued · Awaiting Handshake
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={onClose} style={{ flex: 1, padding: '11px', borderRadius: 10, background: 'transparent', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', cursor: 'pointer', fontSize: 13 }}>Later</button>
                <button
                  onClick={handlePair}
                  style={{ flex: 2, padding: '11px', borderRadius: 10, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                >
                  ✓ Add to Dashboard
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
