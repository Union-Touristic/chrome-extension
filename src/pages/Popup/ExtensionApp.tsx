import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DataTable } from '@/ui/compilation-table/data-table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import {
  fetchTours,
  sortTours,
  updateToursOrder,
} from '@/redux/slices/tableSlice';
import { columns } from '@/ui/compilation-table/columns';
import { ReorderStartEndIndexes } from '@/lib/definitions';
import { SortingState, Updater, functionalUpdate } from '@tanstack/react-table';

export function ExtensionApp() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { data, sorting } = useAppSelector((state) => state.table);

  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchCookies()), dispatch(fetchTours())]);
  }, [dispatch]);

  function handleDragEnd({ startIndex, endIndex }: ReorderStartEndIndexes) {
    dispatch(updateToursOrder({ startIndex, endIndex }));
  }

  function onSortingChange(updater: Updater<SortingState>) {
    const updatedSorting = functionalUpdate(updater, sorting);
    dispatch(sortTours(updatedSorting));
  }

  const tableOrEmptyMessage = data.length ? (
    <DataTable
      data={data}
      columns={columns}
      onDragEnd={handleDragEnd}
      sorting={sorting}
      onSortingChange={onSortingChange}
    />
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
