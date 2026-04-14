// Shared TypeScript interfaces shared by dashboard components
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
  token?: string
}
