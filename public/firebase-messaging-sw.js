// Firebase Cloud Messaging Service Worker
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js",
);

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyBg1r7Boa_TsNZTKcnN7L6pG1skJPeX6eg",
  authDomain: "case-file-management.firebaseapp.com",
  projectId: "case-file-management",
  storageBucket: "case-file-management.firebasestorage.app",
  messagingSenderId: "803160656783",
  appId: "1:803160656783:web:239c85e3f2119c506bd9fa",
});

const messaging = firebase.messaging();

// Install event - activate immediately
self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker installing...");
  self.skipWaiting(); // Force activate immediately
});

// Activate event - take control immediately
self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service Worker activated");
  event.waitUntil(self.clients.claim()); // Take control of all pages immediately
});

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload,
  );

  const notificationTitle = payload.notification?.title || "Thông báo mới";
  const notificationOptions = {
    body: payload.notification?.body || "Bạn có thông báo mới",
    icon: payload.notification?.icon || "/favicon.ico",
    badge: "/favicon.ico",
    tag: payload.data?.caseId || "notification",
    data: payload.data,
    requireInteraction: false,
    vibrate: [200, 100, 200],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification clicked", event);

  event.notification.close();

  // Navigate to the relevant page
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        // If not, open a new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});
