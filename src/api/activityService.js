// src/api/activityService.js
import { client } from './client';

// Έξυπνος extractor που προσπαθεί να βρει όποιο array υπάρχει
const extractData = (payload) => {
  if (!payload) return [];

  // Ήδη array
  if (Array.isArray(payload)) return payload;

  // successResponse wrapper: { success, data, message }
  if (payload.data && Array.isArray(payload.data)) return payload.data;

  // Spring-like Page: { content: [...] }
  if (payload.content && Array.isArray(payload.content)) return payload.content;

  // Generic: πάρε όποιο field είναι array
  for (const key of Object.keys(payload)) {
    if (Array.isArray(payload[key])) {
      console.warn(`extractData: using array field '${key}' from payload`, payload);
      return payload[key];
    }
  }

  console.warn('extractData: no array found in payload:', payload);
  return [];
};

/**
 * 🎯 ΤΕΛΙΚΗ ΔΙΟΡΘΩΣΗ: Χαρτογραφεί τα φίλτρα σε συγκεκριμένα ονόματα (keys)
 * και αφαιρεί τα null/undefined/ALL/κενούς χώρους, διασφαλίζοντας 
 * ότι το backend λαμβάνει ακριβώς αυτό που περιμένει.
 */
const mapAndCleanFilters = (filters) => {
    const cleanedFilters = {};
    
    // Λίστα όλων των αναμενόμενων κλειδιών φίλτρων
    const expectedKeys = ['type', 'location', 'difficultyLevel', 'dateFrom', 'dateTo', 'maxParticipants', 'completed'];

    for (const key of expectedKeys) {
        let value = filters[key];
        
        // Αν η τιμή είναι null, undefined, ή δεν υπάρχει, την αγνοούμε
        if (value === null || value === undefined) {
            continue;
        }

        // Μετατροπή σε String και καθαρισμός κενών
        const stringValue = String(value).trim();
        
        // Αν το string είναι κενό, το αγνοούμε
        if (stringValue === '') {
            continue;
        }

        // Αν η τιμή είναι 'ALL' (ανεξαρτήτως πεζών/κεφαλαίων), την αγνοούμε
        if (stringValue.toUpperCase() === 'ALL') {
            continue;
        }
        
        // Προσθέτουμε το φίλτρο με το σωστό κλειδί
        cleanedFilters[key] = stringValue;
    }
    
    return cleanedFilters;
}


export const activityService = {
  // HOMEPAGE activities
  getUpcomingActivities: async (userId, filters = {}) => {
    try {
        // 1. Καθαρισμός και χαρτογράφηση των φίλτρων (ΕΔΩ Η ΒΕΛΤΙΩΣΗ)
        const mappedAndNormalizedFilters = mapAndCleanFilters(filters);

        // 2. Συνδυασμός με το default φίλτρο completed: false
        const params = { completed: false, ...mappedAndNormalizedFilters };
        
        const res = await client.get(`/users/${userId}/activities`, { params });
        console.log('getUpcomingActivities response:', res.data);
        return extractData(res.data);
    } catch (e) {
      console.error('API Error in getUpcomingActivities:', e);
      return [];
    }
  },

  // PINNED ACTIVITIES
  getPinnedActivities: async (userId) => {
    try {
      const res = await client.get(`/users/${userId}/activities/pinned`);
      console.log('getPinnedActivities response:', res.data);
      return extractData(res.data);   // successResponse → { success, data, ... }
    } catch (e) {
      console.error('API Error in getPinnedActivities:', e);
      return [];
    }
  },

  // Λεπτομέρειες Activity (View Details)
  getActivityDetails: async (userId, activityId) => {
    try {
      const res = await client.get(
        `/users/${userId}/activities/${activityId}/details`
      );
      console.log('getActivityDetails response:', res.data);

      // successResponse: { success, data, message }
      if (res.data && res.data.data) return res.data.data;

      return res.data;
    } catch (e) {
      console.error('API Error in getActivityDetails:', e);
      return null;
    }
  },

  // JOIN activity – χωρίς catch, αφήνουμε το axios να κάνει reject μόνο σε 4xx/5xx
  joinActivity: async (userId, activityId) => {
    const res = await client.post(
      `/users/${userId}/activities/${activityId}/joinRequests`
    );

    // Αν ο server χρησιμοποιεί successResponse
    if (res.data && res.data.success === true) {
      return res.data.data; // joinRequest object
    }

    // Αν για κάποιο λόγο γύρισε 2xx αλλά success:false
    throw new Error(res.data?.message || 'Join failed');
  },

  // MY UPCOMING (MyActivities)
  getMyUpcoming: async (userId) => {
    try {
      const res = await client.get(`/users/${userId}/participatingActivities`);
      console.log('getMyUpcoming response:', res.data);
      return extractData(res.data);
    } catch (e) {
      console.error('API Error in getMyUpcoming:', e);
      return [];
    }
  },

  // MY COMPLETED (MyActivities)
  getMyCompleted: async (userId) => {
    try {
      const res = await client.get(`/users/${userId}/participatedActivities`);
      console.log('getMyCompleted response:', res.data);
      return extractData(res.data);
    } catch (e) {
      console.error('API Error in getMyCompleted:', e);
      return [];
    }
  },

  // Review
  submitReview: async (userId, activityId, payload) => {
    return client.post(
      `/users/${userId}/activities/${activityId}/reviews`,
      payload
    );
  },

  pinActivity: async (userId, activityId) => {
  return client.post(`/users/${userId}/activities/${activityId}/pins`);
  },

  unpinActivity: async (userId, activityId) => {
  return client.delete(`/users/${userId}/activities/${activityId}/pins`);
  },

};