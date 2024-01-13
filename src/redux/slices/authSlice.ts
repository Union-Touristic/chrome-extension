import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface AuthState {
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
};

export const fetchCookies = createAsyncThunk(
  'auth/fetchCookies',
  async (_, thunkApi) => {
    try {
      const cookies = await chrome.cookies.getAll({
        domain: 'uniontouristic.vercel.app',
      });

      if (!cookies.length) return null;

      let hasSessionToken = false;
      let hasCsrfToken = false;

      cookies.forEach((cookie) => {
        if (cookie.name.includes('session-token')) {
          hasSessionToken = true;
        }

        if (cookie.name.includes('csrf-token')) {
          hasCsrfToken = true;
        }
      });

      if (hasSessionToken && hasCsrfToken) {
        return true;
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setIsLoggedIn: (state) => {
      state.isLoggedIn = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCookies.pending, (state) => {
        return { ...state, isLoggedIn: false };
      })
      .addCase(fetchCookies.fulfilled, (state, action) => {
        if (action.payload === true) {
          return { ...state, isLoggedIn: true };
        }
      })
      .addCase(fetchCookies.rejected, (state) => {
        return { ...state, isLoggedIn: false };
      });
  },
});

export const authReducer = authSlice.reducer;
