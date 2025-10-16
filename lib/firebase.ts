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

// Log Firebase config for debugging
console.log("🔥 Firebase Config:", {
  apiKey: firebaseConfig.apiKey
    ? `${firebaseConfig.apiKey.substring(0, 10)}...`
    : "NOT SET",
  authDomain: firebaseConfig.authDomain || "NOT SET",
  projectId: firebaseConfig.projectId || "NOT SET",
  messagingSenderId: firebaseConfig.messagingSenderId || "NOT SET",
  appId: firebaseConfig.appId
    ? `${firebaseConfig.appId.substring(0, 20)}...`
    : "NOT SET",
});

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

  if (!messaging) {
    const app = getFirebaseApp();
    messaging = getMessaging(app);
  }

  return messaging;
};
