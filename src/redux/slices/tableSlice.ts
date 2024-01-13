import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import type { ToursSortConfig } from '@/lib/definitions';
import { Tour } from '@/lib/db/schema';

export interface TableState {
  sortConfig: ToursSortConfig | null;
  checked: boolean;
  indeterminate: boolean;
  selectedRows: Array<Tour['id']>;
}

const initialState: TableState = {
  sortConfig: null,
  checked: false,
  indeterminate: false,
  selectedRows: [],
};

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
});

export const {
  setSortConfig,
  selectedRowsChanged,
  toggleAll,
  updateSelectedRows,
} = tableSlice.actions;

export const tableReducer = tableSlice.reducer;
