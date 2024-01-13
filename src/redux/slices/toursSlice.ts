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

export const updateTours = createAsyncThunk(
  'tours/updateTours',
  async (data: Tour[], thunkApi) => {
    try {
      const tours = await chrome.runtime.sendMessage<ToursMessenger, Tour[]>({
        type: 'update',
        data: data,
      });
      return tours;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeTour = createAsyncThunk(
  'tours/removeTour',
  async (data: Tour['id'] | Tour['id'][], thunkApi) => {
    try {
      const updatedTours = await chrome.runtime.sendMessage<
        ToursMessenger,
        Tour[]
      >({
        type: 'remove',
        data: data,
      });
      return updatedTours;
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

    builder
      .addCase(updateTours.pending, (state) => state)
      .addCase(updateTours.fulfilled, (state, action) => {
        return { ...state, data: action.payload };
      })
      .addCase(updateTours.rejected, (state) => state);

    builder
      .addCase(removeTour.pending, (state) => state)
      .addCase(removeTour.fulfilled, (state, action) => {
        return { ...state, data: action.payload };
      })
      .addCase(removeTour.rejected, (state) => state);
  },
});

export const toursReducer = toursSlice.reducer;
export const selectToursData = (state: RootState) => state.tours.data;
