import { type FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, type Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let messaging: Messaging | null = null;

// Initialize Firebase
export const getFirebaseApp = () => {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  return app;
};

// Initialize Firebase Cloud Messaging
export const getFirebaseMessaging = () => {
  if (typeof window === "undefined") {
    return null;
  }

  // Check if browser supports required APIs
  if (!("Notification" in window) || !("serviceWorker" in navigator)) {
    console.warn("Browser does not support Firebase Messaging");
    return null;
  }

  if (!messaging) {
    try {
      const app = getFirebaseApp();
      messaging = getMessaging(app);
    } catch (error) {
      console.error("Failed to initialize Firebase Messaging:", error);
      return null;
    }
  }

  return messaging;
};
