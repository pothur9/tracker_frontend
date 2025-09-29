import { getFirebaseMessaging } from '@/lib/firebase'
import { getToken } from 'firebase/messaging'

export async function getFcmToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null
  if (!('serviceWorker' in navigator)) return null

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
  if (!vapidKey) {
    console.warn('Missing NEXT_PUBLIC_FIREBASE_VAPID_KEY')
    return null
  }

  try {
    const reg = await navigator.serviceWorker.register('/firebase-messaging-sw.js')
    const messaging = await getFirebaseMessaging()
    if (!messaging) return null
    const token = await getToken(messaging, { vapidKey, serviceWorkerRegistration: reg })
    return token || null
  } catch (e) {
    console.warn('Failed to get FCM token', e)
    return null
  }
}
