import { useState, useEffect } from 'react'
import { getMockLogs, getNewMockLog, mockDevices } from '../data/mock'
import type { TelemetryEntry, Device } from '../data/mock'

export function useTelemetry(deviceId: string) {
  const [logs, setLogs] = useState<TelemetryEntry[]>(getMockLogs())

  useEffect(() => {
    // Simulate live stream by appending a new log every 3-6 seconds
    const interval = setInterval(() => {
      setLogs(prev => [getNewMockLog(), ...prev].slice(0, 200))
    }, 3000 + Math.random() * 3000)
    return () => clearInterval(interval)
  }, [deviceId])

  return logs
}

export function useDevices() {
  const [devices] = useState<Device[]>(mockDevices)
  return { devices }
}
