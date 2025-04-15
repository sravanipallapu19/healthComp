// src/hooks/useTheme.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTheme } from '../store/slices/preferencesSlice';
import { themes } from '../theme/palette';
import { typography } from '../theme/typography';

/**
 * Custom hook for theme management
 * @returns {Object} Theme state and functions
 */
export const useTheme = () => {
  const dispatch = useDispatch();
  const { theme: selectedTheme } = useSelector((state) => state.preferences);
  const [systemTheme, setSystemTheme] = useState('light');

  // Detect system theme preference on mount
  useEffect(() => {
    const detectSystemTheme = () => {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDarkMode ? 'dark' : 'light');
    };
    
    detectSystemTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Apply theme to document when theme changes
  useEffect(() => {
    const currentTheme = selectedTheme === 'system' ? systemTheme : selectedTheme;
    
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    
    // Set CSS variables based on current theme
    const themeColors = themes[currentTheme] || themes.light;
    Object.entries(themeColors).forEach(([property, value]) => {
      if (typeof value === 'string') {
        document.documentElement.style.setProperty(`--${property}`, value);
      } else if (typeof value === 'object') {
        // Handle nested objects like primary.main, primary.light, etc.
        Object.entries(value).forEach(([nestedProperty, nestedValue]) => {
          document.documentElement.style.setProperty(
            `--${property}-${nestedProperty}`, 
            nestedValue
          );
        });
      }
    });
    
    // Set typography variables
    Object.entries(typography).forEach(([property, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        document.documentElement.style.setProperty(`--typography-${property}`, value);
      }
    });
    
  }, [selectedTheme, systemTheme]);

  // Change theme
  const changeTheme = (newTheme) => {
    if (Object.keys(themes).includes(newTheme) || newTheme === 'system') {
      dispatch(setTheme(newTheme));
      return true;
    }
    return false;
  };

  // Get available themes
  const getAvailableThemes = () => {
    return Object.keys(themes).concat('system');
  };

  // Check if current theme is dark
  const isDarkMode = selectedTheme === 'dark' || (selectedTheme === 'system' && systemTheme === 'dark');

  // Get the current theme object
  const getCurrentTheme = () => {
    const currentTheme = selectedTheme === 'system' ? systemTheme : selectedTheme;
    return themes[currentTheme] || themes.light;
  };

  // Get typography settings
  const getTypography = () => {
    return typography;
  };

  return {
    theme: selectedTheme,
    systemTheme,
    isDarkMode,
    changeTheme,
    availableThemes: getAvailableThemes(),
    currentTheme: getCurrentTheme(),
    typography: getTypography()
  };
};

export default useTheme;