import * as React from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DataTable } from '@/ui/compilation-table/data-table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import { columns } from '@/ui/compilation-table/columns';
import {
  fetchInitialState,
  setColumnVisibility,
  setDataOrder,
  setRowSelection,
  setSorting,
} from '@/redux/slices/tableSlice';

export function PopupApp() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const { data, sorting, rowSelection, columnVisibility } = useAppSelector(
    (state) => state.table
  );
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    Promise.all([dispatch(fetchCookies()), dispatch(fetchInitialState())]);
  }, [dispatch]);

  const tableOrEmptyMessage = data.length ? (
    <DataTable
      data={data}
      columns={columns}
      onDragEnd={(value) => {
        dispatch(setDataOrder(value));
      }}
      sorting={sorting}
      onSortingChange={(newVal) => {
        dispatch(setSorting(newVal));
      }}
      rowSelection={rowSelection}
      onRowSelectionChange={(newVal) => {
        dispatch(setRowSelection(newVal));
      }}
      getRowId={(originalRow) => originalRow.id}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={(newVal) => {
        dispatch(setColumnVisibility(newVal));
      }}
    />
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
