import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DataTable } from '@/ui/compilation-table/data-table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import { fetchTours, updateToursOrder } from '@/redux/slices/tableSlice';
import { columns } from '@/ui/compilation-table/columns';
import { ReorderStartEndIndexes } from '@/lib/definitions';

export function ExtensionApp() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const tours = useAppSelector((state) => state.table.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchCookies()), dispatch(fetchTours())]);
  }, [dispatch]);

  function handleDragEnd({ startIndex, endIndex }: ReorderStartEndIndexes) {
    dispatch(updateToursOrder({ startIndex, endIndex }));
  }

  const tableOrEmptyMessage = tours.length ? (
    <DataTable data={tours} columns={columns} onDragEnd={handleDragEnd} />
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
