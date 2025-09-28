import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging'

let app: FirebaseApp | undefined
let messaging: Messaging | undefined

export function getFirebaseApp() {
  if (!app) {
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    }
    if (!getApps().length) {
      app = initializeApp(config)
    } else {
      app = getApps()[0]
    }
  }
  return app!
}

export async function getFirebaseMessaging() {
  if (!messaging) {
    const supported = await isSupported()
    if (!supported) return undefined
    messaging = getMessaging(getFirebaseApp())
  }
  return messaging
}
