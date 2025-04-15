
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '../../services/authService';
import { setAuthToken, removeAuthToken, getAuthToken } from '../../utils/storageUtils';

// Async thunks
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      setAuthToken(response.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      setAuthToken(response.token);
      return response.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(profileData);
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      removeAuthToken();
      return;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    preferences: {
      darkMode: localStorage.getItem('darkMode') === 'true' || false,
      notifications: true,
      language: 'en',
      accessibility: {
        largeText: false,
        highContrast: false,
      },
    },
    isAuthenticated: false,
    loading: true,
    error: null,
  },
  reducers: {
    initAuth: (state) => {
      const token = getAuthToken();
      state.isAuthenticated = !!token;
      state.loading = false;
    },
    setUser: (state, action) => {
      state.profile = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
    toggleDarkMode: (state) => {
      state.preferences.darkMode = !state.preferences.darkMode;
      localStorage.setItem('darkMode', state.preferences.darkMode);
    },
    toggleNotifications: (state) => {
      state.preferences.notifications = !state.preferences.notifications;
    },
    updatePreferences: (state, action) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      };
      if (action.payload.darkMode !== undefined) {
        localStorage.setItem('darkMode', action.payload.darkMode);
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.profile = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { initAuth, setUser, toggleDarkMode, toggleNotifications, updatePreferences, clearError } = userSlice.actions;

export default userSlice.reducer;