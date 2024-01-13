import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Tour } from '@/lib/db/schema';
import type { ToursMessenger } from '@/lib/definitions';

export interface ToursState {
  data: Tour[];
}

const initialState: ToursState = {
  data: [],
};

export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (_, thunkApi) => {
    try {
      const tours = await chrome.runtime.sendMessage<ToursMessenger, Tour[]>({
        type: 'init',
      });
      return tours;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const toursSlice = createSlice({
  name: 'tours',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => {
        return state;
      })
      .addCase(fetchTours.fulfilled, (state, action) => {
        return { ...state, data: action.payload };
      })
      .addCase(fetchTours.rejected, (state) => {
        return state;
      });
  },
});

export const toursReducer = toursSlice.reducer;
export const selectToursData = (state: RootState) => state.tours.data;
