import { configureStore } from '@reduxjs/toolkit';
import { toursReducer } from './slices/toursSlice';
import { authReducer } from './slices/authSlice';
import { tableReducer } from './slices/tableSlice';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    auth: authReducer,
    table: tableReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
