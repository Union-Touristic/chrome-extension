import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  ToursSortConfig,
  TourPrice,
  ToursMessenger,
} from '@/lib/definitions';
import { Tour } from '@/lib/db/schema';

export function chromeToursMessenger(t: ToursMessenger) {
  return chrome.runtime.sendMessage<ToursMessenger, Tour[]>(t);
}

export interface TableState {
  sortConfig: ToursSortConfig | null;
  checked: boolean;
  indeterminate: boolean;
  selectedRows: Array<Tour['id']>;
  data: Tour[];
}

const initialState: TableState = {
  sortConfig: null,
  checked: false,
  indeterminate: false,
  selectedRows: [],
  data: [],
};

export const fetchTours = createAsyncThunk(
  'tours/fetchTours',
  async (_, thunkApi) => {
    try {
      const tours = await chromeToursMessenger({
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
      const updatedTours = await chromeToursMessenger({
        type: 'update',
        data: data,
      });
      return updatedTours;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateTourPrice = createAsyncThunk(
  'tours/updateTourPrice',
  async (data: TourPrice, thunkApi) => {
    try {
      const updatedTours = await chromeToursMessenger({
        type: 'update tour price',
        data,
      });
      return updatedTours;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeTour = createAsyncThunk(
  'tours/removeTour',
  async (data: Tour['id'] | Tour['id'][], thunkApi) => {
    try {
      const updatedTours = await chromeToursMessenger({
        type: 'remove',
        data: data,
      });
      return updatedTours;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState: initialState,
  reducers: {
    setSortConfig: (state, action: PayloadAction<ToursSortConfig | null>) => {
      return { ...state, sortConfig: action.payload };
    },
    selectedRowsChanged: (
      state,
      action: PayloadAction<Pick<TableState, 'checked' | 'indeterminate'>>
    ) => {
      const { checked, indeterminate } = action.payload;
      return { ...state, checked, indeterminate };
    },
    toggleAll: (
      state,
      action: PayloadAction<
        Pick<TableState, 'selectedRows' | 'checked' | 'indeterminate'>
      >
    ) => {
      const { checked, indeterminate, selectedRows } = action.payload;
      return {
        ...state,
        selectedRows,
        checked,
        indeterminate,
      };
    },
    updateSelectedRows: (
      state,
      action: PayloadAction<Pick<TableState, 'selectedRows'>>
    ) => {
      return { ...state, selectedRows: action.payload.selectedRows };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTours.pending, (state) => state)
      .addCase(fetchTours.fulfilled, (state, action) => ({
        ...state,
        data: action.payload,
      }))
      .addCase(fetchTours.rejected, (state) => state);

    builder
      .addCase(updateTours.pending, (state) => state)
      .addCase(updateTours.fulfilled, (state, action) => ({
        ...state,
        data: action.payload,
      }))
      .addCase(updateTours.rejected, (state) => state);

    builder
      .addCase(removeTour.pending, (state) => state)
      .addCase(removeTour.fulfilled, (state, action) => ({
        ...state,
        data: action.payload,
      }))
      .addCase(removeTour.rejected, (state) => state);

    builder
      .addCase(updateTourPrice.pending, (state) => state)
      .addCase(updateTourPrice.fulfilled, (state, action) => ({
        ...state,
        data: action.payload,
      }))
      .addCase(updateTourPrice.rejected, (state) => state);
  },
});

export const {
  setSortConfig,
  selectedRowsChanged,
  toggleAll,
  updateSelectedRows,
} = tableSlice.actions;

export const tableReducer = tableSlice.reducer;
