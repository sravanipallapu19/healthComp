// src/services/authService.js
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiEndpoints';
import { setTokens, clearTokens, getRefreshToken } from '../utils/storageUtils';

/**
 * Service for handling authentication-related API calls
 */
const authService = {
  /**
   * User login
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Promise with login response
   */
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });
      
      const { accessToken, refreshToken, user } = response.data;
      setTokens(accessToken, refreshToken);
      
      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed. Please try again.'
      };
    }
  },

  /**
   * User registration
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise with registration response
   */
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      return { 
        success: true, 
        message: 'Registration successful! Please log in.',
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed. Please try again.'
      };
    }
  },

  /**
   * User logout
   */
  logout: () => {
    clearTokens();
    // Optional: Call backend to invalidate token
    try {
      axios.post(`${API_BASE_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Refresh authentication token
   * @returns {Promise} Promise with refresh token response
   */
  refreshToken: async () => {
    try {
      const refreshToken = getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken
      });
      
      const { accessToken, newRefreshToken } = response.data;
      setTokens(accessToken, newRefreshToken);
      
      return { success: true };
    } catch (error) {
      clearTokens(); // Clear invalid tokens
      return {
        success: false,
        error: error.response?.data?.message || 'Session expired. Please log in again.'
      };
    }
  },

  /**
   * Password reset request
   * @param {string} email - User email for password reset
   * @returns {Promise} Promise with password reset response
   */
  requestPasswordReset: async (email) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/request-reset`, { email });
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email.' 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset request failed.'
      };
    }
  },

  /**
   * Confirm password reset
   * @param {string} token - Password reset token
   * @param {string} newPassword - New password
   * @returns {Promise} Promise with password reset confirmation response
   */
  confirmPasswordReset: async (token, newPassword) => {
    try {
      await axios.post(`${API_BASE_URL}/auth/reset-password`, {
        token,
        newPassword
      });
      return { 
        success: true, 
        message: 'Password successfully reset. Please log in with your new password.' 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Password reset failed.'
      };
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    // Implement token validation logic here
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken; // Simple check if token exists
  }
};

export default authService;