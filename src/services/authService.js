import { 
  auth, 
  db 
} from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

/**
 * AUTHENTICATION SERVICE
 * Handles Login, Registration (Email & Phone OTP), and Session Management
 */

// Initialize Recaptcha for Phone Auth
export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      'size': 'invisible',
      'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      }
    });
  }
};

// Phone OTP Sign In
export const signInPhone = async (phoneNumber) => {
  const appVerifier = window.recaptchaVerifier;
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
  } catch (error) {
    console.error("Phone Auth Error:", error);
    throw error;
  }
};

// Create User Profile in Firestore
export const createUserProfile = async (user, additionalData = {}) => {
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    const { email, displayName } = user;
    try {
      await setDoc(userRef, {
        name: displayName || additionalData.name || '',
        email: email || '',
        state: additionalData.state || '',
        district: additionalData.district || '',
        language: additionalData.language || 'en',
        voiceEnabled: additionalData.voiceEnabled || false,
        createdAt: serverTimestamp(),
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating user profile", error);
    }
  }
  return userRef;
};

export const logout = () => signOut(auth);

export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
};
