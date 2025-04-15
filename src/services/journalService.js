// src/services/journalService.js
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';
import { getAuthHeader } from '../utils/storageUtils';
import { analyzeSentiment } from '../utils/sentimentAnalysis';
import { formatDate } from '../utils/dateUtils';

/**
 * Service for managing journal entries
 */
const journalService = {
  /**
   * Create a new journal entry
   * @param {Object} entryData - Journal entry data
   * @param {string} entryData.title - Entry title
   * @param {string} entryData.content - Entry content
   * @param {Array} entryData.emotions - Selected emotions
   * @param {number} entryData.moodRating - Mood rating (1-10)
   * @returns {Promise} Promise with created entry
   */
  createEntry: async (entryData) => {
    try {
      const headers = getAuthHeader();
      
      // Automatically analyze sentiment of journal content
      const sentimentScore = analyzeSentiment(entryData.content);
      
      const entryWithSentiment = {
        ...entryData,
        sentimentScore,
        date: new Date().toISOString()
      };
      
      const response = await axios.post(
        `${API_BASE_URL}/journal/entries`,
        entryWithSentiment,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating journal entry:', error);
      throw new Error(error.response?.data?.message || 'Failed to create journal entry');
    }
  },
  
  /**
   * Get all journal entries for a user
   * @param {string} userId - User's ID
   * @param {Object} filters - Optional filters
   * @param {string} filters.startDate - Start date for filtering entries
   * @param {string} filters.endDate - End date for filtering entries
   * @param {Array} filters.emotions - Filter by specific emotions
   * @returns {Promise} Promise with journal entries
   */
  getEntries: async (userId, filters = {}) => {
    try {
      const headers = getAuthHeader();
      
      const queryParams = new URLSearchParams();
      
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate);
      }
      
      if (filters.emotions && filters.emotions.length > 0) {
        queryParams.append('emotions', filters.emotions.join(','));
      }
      
      const url = `${API_BASE_URL}/journal/entries/${userId}?${queryParams.toString()}`;
      
      const response = await axios.get(url, { headers });
      
      return response.data;
    } catch (error) {
      console.error('Error getting journal entries:', error);
      throw new Error(error.response?.data?.message || 'Failed to get journal entries');
    }
  },
  
  /**
   * Update an existing journal entry
   * @param {string} entryId - ID of the entry to update
   * @param {Object} updatedData - Updated entry data
   * @returns {Promise} Promise with updated entry
   */
  updateEntry: async (entryId, updatedData) => {
    try {
      const headers = getAuthHeader();
      
      // Recalculate sentiment if content was updated
      if (updatedData.content) {
        updatedData.sentimentScore = analyzeSentiment(updatedData.content);
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/journal/entries/${entryId}`,
        updatedData,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error updating journal entry:', error);
      throw new Error(error.response?.data?.message || 'Failed to update journal entry');
    }
  },
  
  /**
   * Delete a journal entry
   * @param {string} entryId - ID of the entry to delete
   * @returns {Promise} Promise with deletion confirmation
   */
  deleteEntry: async (entryId) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.delete(
        `${API_BASE_URL}/journal/entries/${entryId}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete journal entry');
    }
  },
  
  /**
   * Get insights and patterns from journal entries
   * @param {string} userId - User's ID
   * @param {number} timespan - Timespan in days for analysis
   * @returns {Promise} Promise with journal insights
   */
  getInsights: async (userId, timespan = 30) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.get(
        `${API_BASE_URL}/journal/insights/${userId}?timespan=${timespan}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting journal insights:', error);
      throw new Error(error.response?.data?.message || 'Failed to get journal insights');
    }
  }
};

export default journalService;