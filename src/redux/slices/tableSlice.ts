import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  TourWithIdAndPrice,
  ReorderStartEndIndexes,
} from '@/lib/definitions';
import { Tour } from '@/lib/db/schema';
import { SortingState, RowSelectionState } from '@tanstack/react-table';
import {
  getDataFromStorage,
  getRowSelectionFromStorage,
  getSortingFromStorage,
  updateDataStorage,
  updateRowSelectionStorage,
  updateSortingStorage,
} from '@/api/chrome';
import { reorder, sort } from '@/lib/utils';

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
      const [data, sorting, rowSelection] = await Promise.all([
        getDataFromStorage(),
        getSortingFromStorage(),
        getRowSelectionFromStorage(),
      ]);
      return { data, sorting, rowSelection };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const resetTable = createAsyncThunk(
  'table/resetTable',
  async (_, thunkApi) => {
    try {
      const [data, sorting, rowSelection] = await Promise.all([
        updateDataStorage(Array(0)),
        updateSortingStorage(Array(0)),
        updateRowSelectionStorage({}),
      ]);
      return { data, sorting, rowSelection };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setTourPrice = createAsyncThunk(
  'table/setTourPrice',
  async (value: TourWithIdAndPrice, thunkApi) => {
    try {
      const fetchedData = await getDataFromStorage();
      const nextData = fetchedData.map((item) => {
        if (item.id === value.id) return { ...item, price: value.price };
        return item;
      });
      const [data, sorting] = await Promise.all([
        updateDataStorage(nextData),
        updateSortingStorage(Array(0)),
      ]);
      return { data, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setSorting = createAsyncThunk(
  'table/setSorting',
  async (sortingConfig: SortingState, thunkApi) => {
    try {
      const fetchedData = await getDataFromStorage();
      const nextData = sort(fetchedData, sortingConfig);

      const [data, sorting] = await Promise.all([
        updateDataStorage(nextData),
        updateSortingStorage(sortingConfig),
      ]);

      return { data, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setRowSelection = createAsyncThunk(
  'table/setRowSelection',
  async (rowSelection: RowSelectionState, thunkApi) => {
    try {
      return { rowSelection: await updateRowSelectionStorage(rowSelection) };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setDataOrder = createAsyncThunk(
  'table/setDataOrder',
  async ({ startIndex, endIndex }: ReorderStartEndIndexes, thunkApi) => {
    try {
      const fetchedData = await getDataFromStorage();
      const nextData = reorder(fetchedData, startIndex, endIndex);
      const [data, sorting] = await Promise.all([
        updateDataStorage(nextData),
        updateSortingStorage(Array(0)),
      ]);
      return { data, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const removeTour = createAsyncThunk(
  'table/removeTour',
  async (idForRemove: Tour['id'] | Tour['id'][], thunkApi) => {
    try {
      const [fetchedData, fetchedRowSelection] = await Promise.all([
        getDataFromStorage(),
        getRowSelectionFromStorage(),
      ]);

      const filteredData = fetchedData.filter(
        (item) => !idForRemove.includes(item.id)
      );

      const filteredRowSelection = Object.fromEntries(
        Object.entries(fetchedRowSelection).filter(
          (row) => !idForRemove.includes(row[0])
        )
      );
      const [data, rowSelection] = await Promise.all([
        updateDataStorage(filteredData),
        updateRowSelectionStorage(filteredRowSelection),
      ]);
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
    [
      fetchInitialState,
      resetTable,
      setTourPrice,
      setSorting,
      setRowSelection,
      setDataOrder,
      removeTour,
    ].forEach((item) => {
      builder
        .addCase(item.pending, (state) => state)
        .addCase(item.fulfilled, (state, action) => ({
          ...state,
          ...action.payload,
        }))
        .addCase(item.rejected, (state) => state);
    });
  },
});

export const tableReducer = tableSlice.reducer;
