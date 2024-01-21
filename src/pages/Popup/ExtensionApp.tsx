import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DataTable } from '@/ui/compilation-table/data-table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import {
  fetchTours,
  selectTours,
  sortTours,
  updateToursOrder,
} from '@/redux/slices/tableSlice';
import { columns } from '@/ui/compilation-table/columns';

export function ExtensionApp() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { data, sorting, rowSelection } = useAppSelector(
    (state) => state.table
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchCookies()), dispatch(fetchTours())]);
  }, [dispatch]);

  const tableOrEmptyMessage = data.length ? (
    <DataTable
      data={data}
      columns={columns}
      onDragEnd={(value) => dispatch(updateToursOrder(value))}
      sorting={sorting}
      onSortingChange={(newVal) => dispatch(sortTours(newVal))}
      rowSelection={rowSelection}
      onRowSelectionChange={(newVal) => dispatch(selectTours(newVal))}
      getRowId={(originalRow) => originalRow.id}
    />
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
