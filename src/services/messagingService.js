import { messaging, db } from './firebase';
import { getToken, onMessage } from "firebase/messaging";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

/**
 * FIREBASE CLOUD MESSAGING (FCM) SERVICE
 * Handles device token registration and notification listening
 */

const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;

// Request Permission and Get Token
export const requestNotificationPermission = async (userId) => {
  try {
    const fcmMessaging = await messaging();
    if (!fcmMessaging) return null;

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(fcmMessaging, { vapidKey: VAPID_KEY });
      if (token) {
        await saveTokenToFirestore(userId, token);
        return token;
      }
    }
  } catch (error) {
    console.error("FCM Permission Error:", error);
  }
  return null;
};

// Store Device Token in User Document
const saveTokenToFirestore = async (userId, token) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      fcmTokens: arrayUnion(token), // Support multi-device login
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error saving FCM token:", error);
  }
};

// Listen for Foreground Messages
export const onMessageListener = async () => {
  const fcmMessaging = await messaging();
  if (!fcmMessaging) return null;

  return new Promise((resolve) => {
    onMessage(fcmMessaging, (payload) => {
      console.log("Foreground Message received: ", payload);
      resolve(payload);
    });
  });
};
