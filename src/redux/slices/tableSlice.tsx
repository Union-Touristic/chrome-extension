import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type {
  TourWithIdAndPrice,
  ReorderStartEndIndexes,
  TableState,
  SortingState,
  RowSelectionState,
  ColumnVisibilityState,
  TableMessage,
  SetSortingMessage,
  SetRowSelectionMessage,
  SetColumnVisibilityMessage,
  DeleteTourMessage,
  UpdateTourMessage,
  UpdateDataOrderMessage,
  ResetTableMessage,
} from '@/lib/definitions';
import { Tour } from '@/lib/db/schema';
import { initialTableState } from '@/lib/consts';
import { setNotification } from './notificationSlice';
import { SuccessNotificationMessage } from '@/ui/compilation-table/elements';

export const initialState = initialTableState;

export const fetchInitialState = createAsyncThunk(
  'table/fetchInitialState',
  async (_, thunkApi) => {
    try {
      const getTableStateMessage: TableMessage = {
        type: 'table',
        action: 'getState',
      };

      const { data, sorting, rowSelection, columnVisibility } =
        (await chrome.runtime.sendMessage(getTableStateMessage)) as TableState;

      return { data, sorting, rowSelection, columnVisibility };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const resetTable = createAsyncThunk(
  'table/resetTable',
  async (_, thunkApi) => {
    try {
      const message: ResetTableMessage = {
        type: 'table',
        action: 'reset',
      };
      const { data, sorting, rowSelection } =
        await chrome.runtime.sendMessage(message);
      thunkApi.dispatch(
        setNotification({
          title: 'Подборка успешно сохранена',
          message: <SuccessNotificationMessage />,
        })
      );
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
      const updateTourMessage: UpdateTourMessage = {
        type: 'tours',
        action: 'update',
        payload: value,
      };

      const { data, sorting } =
        await chrome.runtime.sendMessage(updateTourMessage);
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
      const setSortingMessage: SetSortingMessage = {
        type: 'table',
        action: 'setSorting',
        payload: sortingConfig,
      };

      const { data, sorting } =
        await chrome.runtime.sendMessage(setSortingMessage);

      return { data, sorting };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setRowSelection = createAsyncThunk(
  'table/setRowSelection',
  async (incomingRowSelection: RowSelectionState, thunkApi) => {
    try {
      const setRowSelectionMessage: SetRowSelectionMessage = {
        type: 'table',
        action: 'setRowSelection',
        payload: incomingRowSelection,
      };

      const { rowSelection } = await chrome.runtime.sendMessage(
        setRowSelectionMessage
      );

      return { rowSelection };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setDataOrder = createAsyncThunk(
  'table/setDataOrder',
  async (value: ReorderStartEndIndexes, thunkApi) => {
    try {
      const message: UpdateDataOrderMessage = {
        type: 'table',
        action: 'updateDataOrder',
        payload: value,
      };

      const { data, sorting } = await chrome.runtime.sendMessage(message);

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
      const message: DeleteTourMessage = {
        type: 'tours',
        action: 'delete',
        payload: idForRemove,
      };
      const { data, rowSelection } = await chrome.runtime.sendMessage(message);
      return { data, rowSelection };
    } catch (error) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const setColumnVisibility = createAsyncThunk(
  'table/setColumnVisibility',
  async (incomingColumnVisibilityState: ColumnVisibilityState, thunkApi) => {
    try {
      const message: SetColumnVisibilityMessage = {
        type: 'table',
        action: 'setColumnVisibility',
        payload: incomingColumnVisibilityState,
      };

      const { columnVisibility } = (await chrome.runtime.sendMessage(
        message
      )) as { columnVisibility: ColumnVisibilityState };

      return { columnVisibility };
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
      setColumnVisibility,
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
