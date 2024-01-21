import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DataTable } from '@/ui/compilation-table/data-table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import {
  fetchInitialState,
  setRowSelection,
  setSorting,
  setDataOrder,
} from '@/redux/slices/tableSlice';
import { columns } from '@/ui/compilation-table/columns';

export function ExtensionApp() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { data, sorting, rowSelection } = useAppSelector(
    (state) => state.table
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchCookies()), dispatch(fetchInitialState())]);
  }, [dispatch]);

  const tableOrEmptyMessage = data.length ? (
    <DataTable
      data={data}
      columns={columns}
      onDragEnd={(value) => dispatch(setDataOrder(value))}
      sorting={sorting}
      onSortingChange={(newVal) => dispatch(setSorting(newVal))}
      rowSelection={rowSelection}
      onRowSelectionChange={(newVal) => dispatch(setRowSelection(newVal))}
      getRowId={(originalRow) => originalRow.id}
    />
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
