// src/services/moodTrackingService.js
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';
import { getAuthHeader } from '../utils/storageUtils';
import { formatDate } from '../utils/dateUtils';

/**
 * Service for tracking user mood data
 */
const moodTrackingService = {
  /**
   * Log a new mood entry
   * @param {Object} moodData - Mood data
   * @param {number} moodData.rating - Mood rating (1-10)
   * @param {Array} moodData.emotions - Selected emotions
   * @param {string} moodData.note - Optional note about mood
   * @param {string} moodData.userId - User's ID
   * @returns {Promise} Promise with created mood entry
   */
  logMood: async (moodData) => {
    try {
      const headers = getAuthHeader();
      
      const moodEntry = {
        ...moodData,
        timestamp: new Date().toISOString()
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/mood/log`,
        moodEntry,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error logging mood:', error);
      throw new Error(error.response?.data?.message || 'Failed to log mood');
    }
  },
  
  /**
   * Get mood history for a user
   * @param {string} userId - User's ID
   * @param {Object} timeRange - Time range for data
   * @param {string} timeRange.startDate - Start date
   * @param {string} timeRange.endDate - End date
   * @returns {Promise} Promise with mood history
   */
  getMoodHistory: async (userId, timeRange = {}) => {
    try {
      const headers = getAuthHeader();
      
      const today = new Date();
      const defaultStartDate = new Date(today);
      defaultStartDate.setDate(today.getDate() - 30); // Default to last 30 days
      
      const startDate = timeRange.startDate || formatDate(defaultStartDate);
      const endDate = timeRange.endDate || formatDate(today);
      
      const response = await axios.get(
        `${API_BASE_URL}/mood/history/${userId}?startDate=${startDate}&endDate=${endDate}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting mood history:', error);
      throw new Error(error.response?.data?.message || 'Failed to get mood history');
    }
  },
  
  /**
   * Get mood analytics and insights
   * @param {string} userId - User's ID
   * @param {number} timespan - Timespan in days for analysis
   * @returns {Promise} Promise with mood analytics
   */
  getMoodAnalytics: async (userId, timespan = 30) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.get(
        `${API_BASE_URL}/mood/analytics/${userId}?timespan=${timespan}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting mood analytics:', error);
      throw new Error(error.response?.data?.message || 'Failed to get mood analytics');
    }
  },
  
  /**
   * Get personalized recommendations based on mood patterns
   * @param {string} userId - User's ID
   * @returns {Promise} Promise with recommendations
   */
  getRecommendations: async (userId) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.get(
        `${API_BASE_URL}/mood/recommendations/${userId}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting mood recommendations:', error);
      throw new Error(error.response?.data?.message || 'Failed to get mood recommendations');
    }
  },
  
  /**
   * Set mood tracking reminders
   * @param {Object} reminderData - Reminder data
   * @param {string} reminderData.userId - User's ID
   * @param {Array} reminderData.times - Array of reminder times
   * @param {boolean} reminderData.enabled - Whether reminders are enabled
   * @returns {Promise} Promise with updated reminder settings
   */
  setReminders: async (reminderData) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.post(
        `${API_BASE_URL}/mood/reminders`,
        reminderData,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error setting mood reminders:', error);
      throw new Error(error.response?.data?.message || 'Failed to set mood reminders');
    }
  },
  
  /**
   * Get current streak for mood tracking
   * @param {string} userId - User's ID
   * @returns {Promise} Promise with streak information
   */
  getMoodStreak: async (userId) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.get(
        `${API_BASE_URL}/mood/streak/${userId}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting mood streak:', error);
      throw new Error(error.response?.data?.message || 'Failed to get mood streak');
    }
  }
};

export default moodTrackingService;