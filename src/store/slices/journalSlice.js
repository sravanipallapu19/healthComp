// src/store/slices/journalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJournalEntries = createAsyncThunk(
  'journal/fetchEntries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/journal/entries');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createJournalEntry = createAsyncThunk(
  'journal/createEntry',
  async (entryData, { rejectWithValue }) => {
    try {
      const response = await api.post('/journal/entries', entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateJournalEntry = createAsyncThunk(
  'journal/updateEntry',
  async ({ id, ...entryData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/journal/entries/${id}`, entryData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteJournalEntry = createAsyncThunk(
  'journal/deleteEntry',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/journal/entries/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleFavoriteEntry = createAsyncThunk(
  'journal/toggleFavorite',
  async (id, { getState, rejectWithValue }) => {
    try {
      const { journal } = getState();
      const entry = journal.entries.find(e => e.id === id);
      
      const response = await api.patch(`/journal/entries/${id}`, {
        isFavorite: !entry.isFavorite
      });
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  entries: [],
  loading: false,
  error: null,
  stats: {
    total: 0,
    byMood: {},
    streak: 0
  }
};

const journalSlice = createSlice({
  name: 'journal',
  initialState,
  reducers: {
    resetJournalError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Entries
      .addCase(fetchJournalEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJournalEntries.fulfilled, (state, action) => {
        state.entries = action.payload;
        state.loading = false;
        state.stats.total = action.payload.length;
        
        // Calculate mood statistics
        state.stats.byMood = action.payload.reduce((acc, entry) => {
          if (entry.mood) {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
          }
          return acc;
        }, {});
        
        // Calculate journal streak (consecutive days)
        // This is a simplified version - would need more complex logic in a real app
        state.stats.streak = calculateStreak(action.payload);
      })
      .addCase(fetchJournalEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch journal entries';
      })
      
      // Create Entry
      .addCase(createJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJournalEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
        state.loading = false;
        state.stats.total += 1;
        
        // Update mood stats
        if (action.payload.mood) {
          state.stats.byMood[action.payload.mood] = (state.stats.byMood[action.payload.mood] || 0) + 1;
        }
        
        // Recalculate streak
        state.stats.streak = calculateStreak([...state.entries]);
      })
      .addCase(createJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create journal entry';
      })
      
      // Update Entry
      .addCase(updateJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJournalEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          // Update mood stats if mood changed
          if (state.entries[index].mood !== action.payload.mood) {
            if (state.entries[index].mood) {
              state.stats.byMood[state.entries[index].mood] -= 1;
            }
            if (action.payload.mood) {
              state.stats.byMood[action.payload.mood] = (state.stats.byMood[action.payload.mood] || 0) + 1;
            }
          }
          
          state.entries[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to update journal entry';
      })
      
      // Delete Entry
      .addCase(deleteJournalEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJournalEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload);
        if (index !== -1) {
          // Update mood stats
          if (state.entries[index].mood) {
            state.stats.byMood[state.entries[index].mood] -= 1;
          }
          
          state.entries.splice(index, 1);
          state.stats.total -= 1;
        }
        state.loading = false;
        
        // Recalculate streak
        state.stats.streak = calculateStreak([...state.entries]);
      })
      .addCase(deleteJournalEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to delete journal entry';
      })
      
      // Toggle Favorite
      .addCase(toggleFavoriteEntry.fulfilled, (state, action) => {
        const index = state.entries.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
      });
  }
});

// Helper function to calculate streak
const calculateStreak = (entries) => {
  if (!entries.length) return 0;
  
  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let streak = 0;
  let currentDate = today;
  const processedDates = new Set();
  
  // Check if there's an entry for today
  const hasEntryToday = sortedEntries.some(entry => {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });
  
  if (!hasEntryToday) return 0;
  
  streak = 1;
  processedDates.add(today.getTime());
  
  // Check consecutive previous days
  for (let i = 1; i <= 100; i++) { // Limit to 100 days to prevent infinite loops
    const prevDate = new Date(today);
    prevDate.setDate(today.getDate() - i);
    prevDate.setHours(0, 0, 0, 0);
    
    const hasEntryOnDate = sortedEntries.some(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === prevDate.getTime();
    });
    
    if (hasEntryOnDate && !processedDates.has(prevDate.getTime())) {
      streak++;
      processedDates.add(prevDate.getTime());
    } else {
      break;
    }
  }
  
  return streak;
};

export const { resetJournalError } = journalSlice.actions;

export default journalSlice.reducer;