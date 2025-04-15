// src/hooks/useMoodTracking.js
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMoodEntry, fetchMoodHistory, analyzeMoodTrends } from '../store/slices/moodSlice';

/**
 * Custom hook for tracking and analyzing user mood data
 * @returns {Object} Mood tracking state and functions
 */
export const useMoodTracking = () => {
  const dispatch = useDispatch();
  const { entries, trends, isLoading, error } = useSelector((state) => state.mood);
  const [currentMood, setCurrentMood] = useState(5);
  const [moodFactors, setMoodFactors] = useState([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    // Load mood history when component mounts
    dispatch(fetchMoodHistory());
  }, [dispatch]);

  // Record a new mood entry
  const recordMood = async () => {
    const timestamp = new Date().toISOString();
    
    try {
      await dispatch(addMoodEntry({
        mood: currentMood,
        factors: moodFactors,
        notes,
        timestamp
      })).unwrap();
      
      // Reset form after successful submission
      setNotes('');
      setMoodFactors([]);
      
      // Re-analyze trends after adding new entry
      dispatch(analyzeMoodTrends());
      
      return true;
    } catch (err) {
      console.error("Failed to record mood:", err);
      return false;
    }
  };

  // Toggle a mood factor on/off
  const toggleMoodFactor = (factor) => {
    setMoodFactors(prev => {
      if (prev.includes(factor)) {
        return prev.filter(f => f !== factor);
      } else {
        return [...prev, factor];
      }
    });
  };

  // Get recent mood trends
  const getRecentTrends = (days = 7) => {
    if (!entries || entries.length === 0) return [];
    
    const now = new Date();
    const startDate = new Date(now.setDate(now.getDate() - days));
    
    // Filter entries within the specified date range
    const recentEntries = entries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= startDate;
    });
    
    // Group by day and calculate average mood
    const dailyMoods = recentEntries.reduce((acc, entry) => {
      const day = new Date(entry.timestamp).toLocaleDateString();
      
      if (!acc[day]) {
        acc[day] = { sum: 0, count: 0 };
      }
      
      acc[day].sum += entry.mood;
      acc[day].count += 1;
      
      return acc;
    }, {});
    
    // Convert to array and calculate averages
    return Object.entries(dailyMoods).map(([day, data]) => ({
      day,
      averageMood: data.sum / data.count
    }));
  };

  return {
    currentMood,
    setCurrentMood,
    moodFactors,
    toggleMoodFactor,
    notes,
    setNotes,
    recordMood,
    entries,
    trends,
    getRecentTrends,
    isLoading,
    error
  };
};

