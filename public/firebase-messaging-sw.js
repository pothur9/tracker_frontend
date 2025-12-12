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
  apiKey: "AIzaSyC7GjyNia5HcVs3YCd1nl2Acs8hHuuFNOQ",
  authDomain: "ambari-ab822.firebaseapp.com",
  projectId: "ambari-ab822",
  storageBucket: "ambari-ab822.firebasestorage.app",
  messagingSenderId: "615446413788",
  appId: "1:615446413788:web:01ff0378a1d29f19770f19",
  measurementId: "G-Y7R7CK8BQN"
});

const messaging = firebase.messaging();

// Background notification handling: show a browser notification popup
try {
  messaging.onBackgroundMessage(function(payload) {
    const n = payload && payload.notification ? payload.notification : {}
    const title = n.title || (payload.data && payload.data.title) || 'Ambari'
    const body = n.body || (payload.data && payload.data.body) || ''
    
    const notificationOptions = {
      body: body,
      icon: '/logo.jpg',
      badge: '/logo.jpg',
      tag: 'ambari-notification',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: payload.data || {}
    }
    
    // Save notification to localStorage via client message
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'SAVE_NOTIFICATION',
          notification: {
            title: title,
            body: body,
            type: 'info',
            data: payload.data || {}
          }
        })
      })
    })
    
    self.registration.showNotification(title, notificationOptions)
  })
} catch (e) {
  // ignore
}
