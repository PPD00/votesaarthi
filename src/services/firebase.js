import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported as isMessagingSupported } from "firebase/messaging";
import { getAnalytics, isSupported as isAnalyticsSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAAOHiUfKEuLWHQ-9z62YngqWCAivTgrzs",
  authDomain: "votesaarthi.firebaseapp.com",
  projectId: "votesaarthi",
  storageBucket: "votesaarthi.firebasestorage.app",
  messagingSenderId: "48482515560",
  appId: "1:48482515560:web:e3108b0f7a44a98c8219dd",
  measurementId: "G-G75NX5EW5C",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getFirebaseMessaging = async () => {
  const supported = await isMessagingSupported();
  return supported ? getMessaging(app) : null;
};

export const getFirebaseAnalytics = async () => {
  const supported = await isAnalyticsSupported();
  return supported ? getAnalytics(app) : null;
};

export default app;