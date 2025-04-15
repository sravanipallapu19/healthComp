// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { refreshToken, logout } from '../store/slices/userSlice';

/**
 * Custom hook for handling authentication state and related functionality
 * @returns {Object} Authentication state and helper functions
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, error, token, tokenExpiry } = useSelector((state) => state.user);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check authentication status on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If there's a token but we don't have user info, or the token is close to expiry
        if (token && (!user || isTokenExpiringSoon(tokenExpiry))) {
          await dispatch(refreshToken()).unwrap();
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
      } finally {
        setIsInitialized(true);
      }
    };

    checkAuth();
  }, [dispatch, token, user, tokenExpiry]);

  // Helper function to check if token is expiring soon (within 5 minutes)
  const isTokenExpiringSoon = (expiryTime) => {
    if (!expiryTime) return true;
    
    const expiryDate = new Date(expiryTime);
    const now = new Date();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    return expiryDate.getTime() - now.getTime() < fiveMinutes;
  };

  // Handle logout and redirect to login page
  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Redirect to login if not authenticated
  const requireAuth = (callback) => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    if (callback && typeof callback === 'function') {
      callback();
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    isInitialized,
    requireAuth,
    logout: handleLogout
  };
};

