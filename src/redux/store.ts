import { configureStore } from '@reduxjs/toolkit';
import { authReducer } from './slices/authSlice';
import { tableReducer } from './slices/tableSlice';
import { notificationReducer } from './slices/notificationSlice';
import { tableApi } from './services/table';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    table: tableReducer,
    notification: notificationReducer,
    [tableApi.reducerPath]: tableApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tableApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
