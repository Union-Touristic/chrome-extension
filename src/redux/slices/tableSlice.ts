import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  TourPrice,
  TableMessenger,
  ReorderStartEndIndexes,
} from '@/lib/definitions';
import { Tour } from '@/lib/db/schema';
import { SortingState, RowSelectionState } from '@tanstack/react-table';

export function chromeToursMessenger(t: TableMessenger) {
  return chrome.runtime.sendMessage<TableMessenger, Tour[]>(t);
}

export interface TableState {
  data: Tour[];
  sorting: SortingState;
  rowSelection: RowSelectionState;
}

const initialState: TableState = {
  data: [],
  sorting: [],
  rowSelection: {},
};

export const fetchInitialState = createAsyncThunk(
  'table/fetchInitialState',
  async (_, thunkApi) => {
    try {
      const { data, sorting, rowSelection } = await chrome.runtime.sendMessage<
        TableMessenger,
        TableState
      >({ type: 'init' });

      return { data, sorting, rowSelection };
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
  async (newTourPrice: TourPrice, thunkApi) => {
    try {
      const { data, sorting } = await chrome.runtime.sendMessage<
        TableMessenger,
        { data: Tour[]; sorting: SortingState }
      >({
        type: 'update tour price',
        data: newTourPrice,
      });
      return { data, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const sortTours = createAsyncThunk(
  'tours/sortTours',
  async (sorting: SortingState, thunkApi) => {
    try {
      const updatedTours = await chromeToursMessenger({
        type: 'sort tours',
        sorting,
      });
      return { updatedTours, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setRowSelection = createAsyncThunk(
  'table/setRowSelection',
  async (rowSelection: RowSelectionState, thunkApi) => {
    try {
      const tableState = await chrome.runtime.sendMessage<
        TableMessenger,
        TableState
      >({
        type: 'setRowSelection',
        rowSelection,
      });
      return tableState.rowSelection;
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateToursOrder = createAsyncThunk(
  'tours/updateToursOrder',
  async (indexes: ReorderStartEndIndexes, thunkApi) => {
    try {
      const { data, sorting } = await chrome.runtime.sendMessage<
        TableMessenger,
        { data: Tour[]; sorting: SortingState }
      >({
        type: 'update tours order',
        data: indexes,
      });
      return { data, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeTour = createAsyncThunk(
  'tours/removeTour',
  async (idForRemove: Tour['id'] | Tour['id'][], thunkApi) => {
    try {
      const { data, rowSelection } = await chrome.runtime.sendMessage<
        TableMessenger,
        { data: Tour[]; rowSelection: RowSelectionState }
      >({
        type: 'remove',
        data: idForRemove,
      });
      return { data, rowSelection };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

const tableSlice = createSlice({
  name: 'table',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialState.pending, (state) => state)
      .addCase(fetchInitialState.fulfilled, (state, action) => ({
        ...state,
        data: action.payload.data,
        sorting: action.payload.sorting,
        rowSelection: action.payload.rowSelection,
      }))
      .addCase(fetchInitialState.rejected, (state) => state);

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
        data: action.payload.data,
        rowSelection: action.payload.rowSelection,
      }))
      .addCase(removeTour.rejected, (state) => state);

    builder
      .addCase(updateTourPrice.pending, (state) => state)
      .addCase(updateTourPrice.fulfilled, (state, action) => ({
        ...state,
        data: action.payload.data,
        sorting: action.payload.sorting,
      }))
      .addCase(updateTourPrice.rejected, (state) => state);

    builder
      .addCase(updateToursOrder.pending, (state) => state)
      .addCase(updateToursOrder.fulfilled, (state, action) => ({
        ...state,
        data: action.payload.data,
        sorting: action.payload.sorting,
      }))
      .addCase(updateToursOrder.rejected, (state) => state);

    builder
      .addCase(sortTours.pending, (state) => state)
      .addCase(sortTours.fulfilled, (state, action) => {
        const { sorting, updatedTours } = action.payload;
        return { ...state, sorting, data: updatedTours };
      })
      .addCase(sortTours.rejected, (state) => state);

    builder
      .addCase(setRowSelection.pending, (state) => state)
      .addCase(setRowSelection.fulfilled, (state, action) => ({
        ...state,
        rowSelection: action.payload,
      }))
      .addCase(setRowSelection.rejected, (state) => state);
  },
});

export const tableReducer = tableSlice.reducer;
