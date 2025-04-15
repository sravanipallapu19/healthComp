// src/services/chatService.js
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';
import { getAuthHeader } from '../utils/storageUtils';
import { analyzeSentiment } from '../utils/sentimentAnalysis';

/**
 * Service for handling chat functionality and AI responses
 */
const chatService = {
  /**
   * Send a message to the AI assistant
   * @param {string} message - User's message
   * @param {string} userId - User's ID
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise} Promise with AI response
   */
  sendMessage: async (message, userId, conversationHistory = []) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.post(
        `${API_BASE_URL}/chat/message`, 
        { 
          message, 
          userId,
          conversationHistory 
        },
        { headers }
      );
      
      // Analyze sentiment of user's message for mood tracking integration
      const sentiment = analyzeSentiment(message);
      
      return {
        data: response.data,
        sentiment
      };
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },
  
  /**
   * Get suggested responses based on conversation context
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @returns {Promise} Promise with suggested responses
   */
  getSuggestions: async (conversationHistory) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.post(
        `${API_BASE_URL}/chat/suggestions`,
        { conversationHistory },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw new Error(error.response?.data?.message || 'Failed to get suggestions');
    }
  },
  
  /**
   * Get relevant mental health resources based on conversation context
   * @param {Array} conversationHistory - Previous messages in the conversation
   * @param {Object} userPreferences - User's preferences
   * @returns {Promise} Promise with relevant resources
   */
  getRelevantResources: async (conversationHistory, userPreferences) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.post(
        `${API_BASE_URL}/chat/resources`,
        { 
          conversationHistory,
          preferences: userPreferences 
        },
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting resources:', error);
      throw new Error(error.response?.data?.message || 'Failed to get resources');
    }
  },
  
  /**
   * Get conversation history for a user
   * @param {string} userId - User's ID
   * @param {number} limit - Number of conversations to retrieve
   * @returns {Promise} Promise with conversation history
   */
  getConversationHistory: async (userId, limit = 10) => {
    try {
      const headers = getAuthHeader();
      
      const response = await axios.get(
        `${API_BASE_URL}/chat/history/${userId}?limit=${limit}`,
        { headers }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      throw new Error(error.response?.data?.message || 'Failed to get conversation history');
    }
  }
};

export default chatService;