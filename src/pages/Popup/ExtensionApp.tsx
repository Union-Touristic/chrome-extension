import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { Table } from '@/ui/compilation-table/table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { fetchCookies } from '@/redux/slices/authSlice';
import { fetchTours } from '@/redux/slices/toursSlice';

export function ExtensionApp() {
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const tours = useAppSelector((state) => state.tours.data);
  const dispatch = useAppDispatch();

  useEffect(() => {
    Promise.all([dispatch(fetchCookies()), dispatch(fetchTours())]);
  }, [dispatch]);

  const tableOrEmptyMessage = tours.length ? <Table /> : <EmptyListMessage />;

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
