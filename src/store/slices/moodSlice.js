
// src/store/slices/moodSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import moodTrackingService from '../../services/moodTrackingService';

export const fetchMoodEntries = createAsyncThunk(
  'mood/fetchEntries',
  async (timeRange = 'week', { rejectWithValue }) => {
    try {
      return await moodTrackingService.getMoodEntries(timeRange);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mood entries');
    }
  }
);

export const addMoodEntry = createAsyncThunk(
  'mood/addEntry',
  async (moodData, { rejectWithValue }) => {
    try {
      return await moodTrackingService.addMoodEntry(moodData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add mood entry');
    }
  }
);

export const fetchMoodStats = createAsyncThunk(
  'mood/fetchStats',
  async (timeRange = 'month', { rejectWithValue }) => {
    try {
      return await moodTrackingService.getMoodStats(timeRange);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch mood statistics');
    }
  }
);

const moodSlice = createSlice({
  name: 'mood',
  initialState: {
    entries: [],
    stats: {
      weeklyAverage: 0,
      monthlyAverage: 0,
      topEmotions: [],
      improvement: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearMoodError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Mood Entries
      .addCase(fetchMoodEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodEntries.fulfilled, (state, action) => {
        state.entries = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoodEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Mood Entry
      .addCase(addMoodEntry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoodEntry.fulfilled, (state, action) => {
        state.entries.push(action.payload);
        // Sort entries by date
        state.entries.sort((a, b) => new Date(b.date) - new Date(a.date));
        state.loading = false;
      })
      .addCase(addMoodEntry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Mood Stats
      .addCase(fetchMoodStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMoodStats.fulfilled, (state, action) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchMoodStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMoodError } = moodSlice.actions;

export default moodSlice.reducer;