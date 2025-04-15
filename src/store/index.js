import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import chatReducer from './slices/chatSlice';
import moodReducer from './slices/moodSlice';
import journalReducer from './slices/journalSlice';
import resourceReducer from './slices/resourceSlice';
import { persistMiddleware } from './middleware/persistMiddleware';

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
    mood: moodReducer,
    journal: journalReducer,
    resources: resourceReducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['user/setUser', 'journal/addJournalEntry'],
        // Ignore these paths in the state
        ignoredPaths: ['user.profile.registrationDate'],
      },
    }).concat(persistMiddleware),
});

export default store;
