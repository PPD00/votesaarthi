import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

// ✅ Firebase config (env-safe)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// ⚠️ IMPORTANT DEBUG CHECK (prevents silent crashes)
if (!firebaseConfig.apiKey || firebaseConfig.apiKey === "your_real_api_key") {
  console.error("❌ Firebase API Key is missing or not set correctly in .env");
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 🔐 Auth
export const auth = getAuth(app);

// 🗄 Firestore
export const db = getFirestore(app);

// 📩 Messaging (FCM) - safe init
export const getFirebaseMessaging = async () => {
  const supported = await isMessagingSupported();
  return supported ? getMessaging(app) : null;
};

// 📊 Analytics - safe init (important for Vite SSR/dev issues)
export const getFirebaseAnalytics = async () => {
  const supported = await isAnalyticsSupported();
  return supported ? getAnalytics(app) : null;
};

export default app;