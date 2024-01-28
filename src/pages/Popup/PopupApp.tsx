import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { DataTable } from '@/ui/compilation-table/data-table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import { columns } from '@/ui/compilation-table/columns';
import {
  useGetTableQuery,
  useUpdateColumnVisibilityMutation,
  useUpdateDataOrderMutation,
  useUpdateRowSelectionMutation,
  useUpdateSortingMutation,
} from '@/redux/services/table';

export function PopupApp() {
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [updateDataOrder] = useUpdateDataOrderMutation();
  const [updateSorting] = useUpdateSortingMutation();
  const [updateRowSelection] = useUpdateRowSelectionMutation();
  const [updateColumnVisibility] = useUpdateColumnVisibilityMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(fetchCookies());
    })();
  }, [dispatch]);

  const { data: table } = useGetTableQuery();
  if (!table) return null;

  const { data, sorting, rowSelection, columnVisibility } = table;

  const tableOrEmptyMessage = data.length ? (
    <DataTable
      data={data}
      columns={columns}
      onDragEnd={(value) => {
        updateDataOrder(value);
      }}
      sorting={sorting}
      onSortingChange={(newVal) => {
        updateSorting(newVal);
      }}
      rowSelection={rowSelection}
      onRowSelectionChange={(newVal) => {
        updateRowSelection(newVal);
      }}
      getRowId={(originalRow) => originalRow.id}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={(newVal) => {
        updateColumnVisibility(newVal);
      }}
    />
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
