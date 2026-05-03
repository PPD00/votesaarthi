import { analytics } from './firebase';
import { logEvent } from "firebase/analytics";

/**
 * FIREBASE ANALYTICS SERVICE
 * Helper for event-driven tracking
 */

export const trackEvent = async (eventName, eventParams = {}) => {
  try {
    const fbAnalytics = await analytics();
    if (fbAnalytics) {
      logEvent(fbAnalytics, eventName, {
        ...eventParams,
        platform: 'web',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error(`Analytics error for ${eventName}:`, error);
  }
};

/**
 * STANDARD EVENT HELPERS
 */

export const trackLogin = (method) => trackEvent('login_success', { method });

export const trackBoothSearch = (query, resultFound) => 
  trackEvent('booth_search', { query, result_found: resultFound });

export const trackAIQuery = (query) => trackEvent('ai_query_sent', { query_length: query.length });

export const trackAIResponse = (responseId) => trackEvent('ai_response_received', { response_id: responseId });

export const trackMapOpen = (boothName) => trackEvent('map_opened', { booth_name: boothName });

export const trackNotificationOpen = (type) => trackEvent('notification_opened', { notification_type: type });
