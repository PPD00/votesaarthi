import { auth, db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

/**
 * AI SERVICE (Phase 2) - Debug Edition
 */

const getAIEndpoint = () => {
  const host = window.location.hostname;
  const isLocal = host === 'localhost' || host === '127.0.0.1';
  
  if (isLocal) {
    // Try 127.0.0.1 explicitly to avoid IPv6 issues
    return "http://127.0.0.1:5001/votesaarthi/us-central1/askGemini";
  }
  return "https://askgemini-uc.a.run.app"; 
};

export const sendMessageToAI = async (message) => {
  const endpoint = getAIEndpoint();
  console.log("🚀 Calling AI Endpoint:", endpoint);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      mode: 'cors', // Explicitly set cors mode
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    console.log("✅ Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.reply;

    // Log to Firestore
    const user = auth.currentUser;
    if (user) {
      addDoc(collection(db, "ai_logs"), {
        userId: user.uid,
        message: message,
        response: reply,
        createdAt: serverTimestamp(),
      }).catch(e => console.error("Logging failed:", e));
    }

    return reply;
  } catch (error) {
    console.error("❌ AI Service Detailed Error:", error);
    
    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      throw new Error("Connection failed. Ensure 'firebase emulators:start' is running and you have internet access.");
    }
    
    throw error;
  }
};
