/* eslint-disable no-undef */
// Firebase messaging service worker (uses compat for SW)
try {
  // Try to match the installed SDK version in frontend (package.json uses ^10.14.0)
  importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js')
  importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js')
} catch (e1) {
  try {
    // Fallback to previously used version
    importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js')
    importScripts('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js')
  } catch (e2) {
    // If both fail, stop initialization and log a helpful error
    console.error('[FCM SW] Failed to load Firebase compat scripts from gstatic', e1, e2)
  }
}

// Hardcode your client config here (public info; not secret)
firebase.initializeApp({
  apiKey: "AIzaSyAdXMi37-Rv-0hV6teopW2FMwoud9mjGaU",
  authDomain: "svdd-c3198.firebaseapp.com",
  projectId: "svdd-c3198",
  storageBucket: "svdd-c3198.firebasestorage.app",
  messagingSenderId: "849894574211",
  appId: "1:849894574211:web:2e8465d84311bdceb3b3b6",
  // measurementId optional
});

const messaging = firebase.messaging();

// Background notification handling: show a browser notification popup
try {
  messaging.onBackgroundMessage(function(payload) {
    const n = payload && payload.notification ? payload.notification : {}
    const title = n.title || (payload.data && payload.data.title) || 'Notification'
    const body = n.body || (payload.data && payload.data.body) || ''
    self.registration.showNotification(title, { body })
  })
} catch (e) {
  // ignore
}
