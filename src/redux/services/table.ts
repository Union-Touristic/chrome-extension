import {
  clearTable,
  getTableStateFromStorage,
  removeItemDataInTable,
  updateColumnVisibility,
  updateDataOrderInTable,
  updateItemInTable,
  updateRowSelectionInTable,
  updateSortingInTable,
} from '@/api/chrome';
import {
  ColumnVisibilityState,
  ReorderStartEndIndexes,
  RowSelectionState,
  SortingState,
  TableState,
  TourWithIdAndPrice,
} from '@/lib/definitions';
import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';

export const tableApi = createApi({
  reducerPath: 'tableApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Table'],
  endpoints: (builder) => ({
    getTable: builder.query<TableState, void>({
      queryFn: async () => {
        console.log('I was called');
        const table = await getTableStateFromStorage();

        return { data: table };
      },
      providesTags: () => [{ type: 'Table', id: 'STATE' }],
    }),
    updateDataOrder: builder.mutation<TableState, ReorderStartEndIndexes>({
      queryFn: async (incomingReorderStartEndIndexes) => {
        const tableState = await updateDataOrderInTable(
          incomingReorderStartEndIndexes
        );
        return { data: tableState };
      },
      invalidatesTags: [{ type: 'Table', id: 'STATE' }],
    }),
    updateSorting: builder.mutation<TableState, SortingState>({
      queryFn: async (incomingSortingState) => {
        const tableState = await updateSortingInTable(incomingSortingState);
        return { data: tableState };
      },
      invalidatesTags: [{ type: 'Table', id: 'STATE' }],
    }),
    updateRowSelection: builder.mutation<TableState, RowSelectionState>({
      queryFn: async (incomingRowSelectionState) => ({
        data: await updateRowSelectionInTable(incomingRowSelectionState),
      }),
      invalidatesTags: [{ type: 'Table', id: 'STATE' }],
    }),
    updateColumnVisibility: builder.mutation<TableState, ColumnVisibilityState>(
      {
        queryFn: async (incomingColumnVisibility) => ({
          data: await updateColumnVisibility(incomingColumnVisibility),
        }),
        invalidatesTags: [{ type: 'Table', id: 'STATE' }],
      }
    ),
    removeItemData: builder.mutation<TableState, string | string[]>({
      queryFn: async (incomingData) => ({
        data: await removeItemDataInTable(incomingData),
      }),
      invalidatesTags: [{ type: 'Table', id: 'STATE' }],
    }),
    //TODO: make it more generic
    updateItem: builder.mutation<TableState, TourWithIdAndPrice>({
      queryFn: async (incomingData) => ({
        data: await updateItemInTable(incomingData),
      }),
      invalidatesTags: [{ type: 'Table', id: 'STATE' }],
    }),
    clearTable: builder.mutation<TableState, void>({
      queryFn: async () => ({ data: await clearTable() }),
      invalidatesTags: [{ type: 'Table', id: 'STATE' }],
    }),
  }),
});

export const {
  useGetTableQuery,
  useUpdateDataOrderMutation,
  useUpdateSortingMutation,
  useUpdateRowSelectionMutation,
  useUpdateColumnVisibilityMutation,
  useRemoveItemDataMutation,
  useUpdateItemMutation,
  useClearTableMutation,
} = tableApi;
