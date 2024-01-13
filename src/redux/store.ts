import { configureStore } from '@reduxjs/toolkit';
import { toursReducer } from './slices/toursSlice';
import { authReducer } from './slices/authSlice';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
