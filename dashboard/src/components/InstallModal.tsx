import { useState } from 'react'
import { X, Copy, Check, Download, Smartphone, Apple, QrCode, ExternalLink, AlertCircle } from 'lucide-react'

// Firebase Storage hosted APK/IPA paths — upload your builds here:
const ANDROID_APK_URL = `https://firebasestorage.googleapis.com/v0/b/think-big-f8c31.firebasestorage.app/o/releases%2Fzondra-watcher-latest.apk?alt=media`
const IOS_IPA_URL     = `https://firebasestorage.googleapis.com/v0/b/think-big-f8c31.firebasestorage.app/o/releases%2Fzondra-watcher-latest.ipa?alt=media`

// QR code via free API (no library needed)
const qrUrl = (text: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=180x180&format=png&color=60a5fa&bgcolor=0f1420&data=${encodeURIComponent(text)}`

interface InstallModalProps {
  platform: 'android' | 'ios'
  onClose: () => void
}

export function InstallModal({ platform, onClose }: InstallModalProps) {
  const [copied, setCopied] = useState(false)
  const isAndroid = platform === 'android'
  const installUrl = isAndroid ? ANDROID_APK_URL : IOS_IPA_URL
  const accent  = isAndroid ? '#22c55e' : '#60a5fa'
  const accentBg = isAndroid ? 'rgba(34,197,94,0.12)' : 'rgba(59,130,246,0.12)'

  const copyLink = () => {
    navigator.clipboard.writeText(installUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 420, background: '#0f1420', borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)', padding: 32, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#475569', cursor: 'pointer' }}>
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {isAndroid ? <Smartphone size={24} color={accent} /> : <Apple size={24} color={accent} />}
          </div>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0' }}>
              {isAndroid ? 'Install Android Agent' : 'Install iOS Agent'}
            </h2>
            <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
              {isAndroid ? 'APK · Direct install via sideload' : 'IPA · Enterprise or TestFlight'}
            </p>
          </div>
        </div>

        {/* QR Code */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: 14, padding: '18px 18px 12px', marginBottom: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ marginBottom: 8 }}>
            <QrCode size={13} color="#475569" style={{ display: 'inline', marginRight: 5 }} />
            <span style={{ fontSize: 11, color: '#475569', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600 }}>Scan to Install</span>
          </div>
          <img
            src={qrUrl(installUrl)}
            alt="Install QR Code"
            width={180} height={180}
            style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}
          />
          <p style={{ fontSize: 11, color: '#334155', marginTop: 8, textAlign: 'center' }}>
            Scan with the target device camera to install
          </p>
        </div>

        {/* URL Copy Field */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div style={{ flex: 1, padding: '9px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <p style={{ fontSize: 11, color: '#475569', fontFamily: 'monospace', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {installUrl}
            </p>
          </div>
          <button
            onClick={copyLink}
            title="Copy link"
            style={{ padding: '9px 14px', borderRadius: 8, background: copied ? 'rgba(34,197,94,0.12)' : accentBg, border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : accent + '44'}`, color: copied ? '#4ade80' : accent, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600, flexShrink: 0 }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href={installUrl}
            target="_blank"
            rel="noreferrer"
            download
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, background: accentBg, border: `1px solid ${accent}44`, color: accent, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            <Download size={15} />
            Download {isAndroid ? 'APK' : 'IPA'}
          </a>
          <a
            href={installUrl}
            target="_blank"
            rel="noreferrer"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '11px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}
          >
            <ExternalLink size={15} />
            Open Link
          </a>
        </div>

        {/* Upload reminder */}
        <div style={{ marginTop: 14, padding: '10px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <AlertCircle size={13} color="#fbbf24" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ fontSize: 11, color: '#78716c', lineHeight: 1.6 }}>
            Upload your built {isAndroid ? 'APK' : 'IPA'} to Firebase Storage at&nbsp;
            <code style={{ color: '#fbbf24', fontSize: 10 }}>releases/{isAndroid ? 'zondra-watcher-latest.apk' : 'zondra-watcher-latest.ipa'}</code> to activate this link.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── The two sidebar buttons ──────────────────────────────────────────────────
interface InstallButtonsProps {
  onInstall: (platform: 'android' | 'ios') => void
}

export function InstallButtons({ onInstall }: InstallButtonsProps) {
  return (
    <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 8 }}>
      <button
        onClick={() => onInstall('android')}
        title="Install Android Agent"
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '10px 8px', borderRadius: 10,
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <Smartphone size={16} color="#4ade80" />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#4ade80', letterSpacing: '0.04em' }}>Android</span>
      </button>
      <button
        onClick={() => onInstall('ios')}
        title="Install iOS Agent"
        style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
          padding: '10px 8px', borderRadius: 10,
          background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)',
          cursor: 'pointer', transition: 'all 0.15s',
        }}
      >
        <Apple size={16} color="#60a5fa" />
        <span style={{ fontSize: 10, fontWeight: 700, color: '#60a5fa', letterSpacing: '0.04em' }}>iOS</span>
      </button>
    </div>
  )
}
