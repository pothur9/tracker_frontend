import { useEffect, useState } from 'react'
import { getFirebaseMessaging } from '@/lib/firebase'
import { getToken, onMessage, type MessagePayload } from 'firebase/messaging'
import { toast } from '@/components/ui/use-toast'

export function useFcm(jwt?: string) {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        if (!('serviceWorker' in navigator)) return
        const messaging = await getFirebaseMessaging()
        if (!messaging) return

        const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
        if (!vapidKey) throw new Error('NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing')

        const t = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
        if (mounted) setToken(t || null)

        const authToken = jwt || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
        if (authToken && t) {
          await fetch(`${process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000'}/api/auth/user/fcm`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ fcmToken: t }),
          })
        }

        onMessage(messaging, async (payload: MessagePayload) => {
          try {
            const title = payload.notification?.title || (payload.data as any)?.title || 'Notification'
            const body = payload.notification?.body || (payload.data as any)?.body || ''

            // Try showing a browser notification via SW if permission is granted
            const canNotify = typeof window !== 'undefined' && 'Notification' in window
            if (canNotify) {
              let permission = Notification.permission
              if (permission === 'default') {
                try { permission = await Notification.requestPermission() } catch {}
              }
              if (permission === 'granted') {
                try {
                  const reg = await navigator.serviceWorker.getRegistration('/firebase-messaging-sw.js')
                  if (reg) {
                    await reg.showNotification(title, { body })
                  } else if (navigator.serviceWorker.ready) {
                    const ready = await navigator.serviceWorker.ready
                    await ready.showNotification(title, { body })
                  } else {
                    // Fallback to Notification API
                    new Notification(title, { body })
                  }
                } catch {
                  // Ignore and fall back to toast
                }
              }
            }

            // Always show an in-app toast as well
            toast({ title, description: body })
          } catch (e) {
            console.log('FCM message (foreground) handling error:', e)
          }
        })
      } catch (e: any) {
        console.error('FCM init error', e)
        if (mounted) setError(e?.message || 'FCM init error')
      }
    }
    init()
    return () => {
      mounted = false
    }
  }, [jwt])

  return { token, error }
}
