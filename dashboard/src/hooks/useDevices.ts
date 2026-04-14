import { useState, useEffect } from 'react'
import {
  collection, onSnapshot,
  doc, setDoc, deleteDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Device } from './types'

export function useDeviceList() {
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'devices'),
      snap => {
        const devs: Device[] = snap.docs.map(d => {
          const data = d.data()
          return {
            id: d.id,
            name: data.name ?? d.id,
            model: data.model ?? 'Unknown',
            os: data.os ?? 'Unknown',
            status: data.status ?? 'offline',
            battery: data.battery ?? 0,
            location: data.location ?? 'Unknown',
            lastSeen: data.lastSeen?.toDate?.() ?? new Date(),
            ip: data.ip ?? '—',
            token: data.token,
          }
        })
        setDevices(devs)
        setLoading(false)
      },
      () => setLoading(false)
    )
    return () => unsub()
  }, [])

  const addDevice = async (id: string, name: string, token: string) => {
    await setDoc(doc(db, 'devices', id), {
      name,
      model: 'Pending pairing',
      os: 'Unknown',
      status: 'offline',
      battery: 0,
      location: 'Unknown',
      ip: '—',
      token,
      createdAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
    })
  }

  const removeDevice = async (id: string) => {
    await deleteDoc(doc(db, 'devices', id))
  }

  return { devices, loading, addDevice, removeDevice }
}
