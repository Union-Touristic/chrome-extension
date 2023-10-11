import React, { useEffect } from 'react';

import { useAuthentication } from './context/AuthenticationContext';
import { TableProvider } from './context/TableContext';
import { useTours, useToursDispatch } from './context/ToursContext';
import EmptyListMessage from './components/EmptyListMessage';
import Login from './components/Login';
import Table from './components/Table';
import { ToursMessenger } from '../../types/chrome-extesion';
import { Tour } from '../../types';

export default function ExtensionApp() {
  const { isLoggedIn } = useAuthentication();

  const tours = useTours();
  const toursDispatch = useToursDispatch();

  useEffect(
    function initTours() {
      chrome.runtime
        .sendMessage<ToursMessenger, Tour[]>({ type: 'init' })
        .then((tours) => {
          toursDispatch({
            type: 'update tours',
            tours: tours,
          });
        });
    },
    [toursDispatch]
  );

  const toursOrEmptyMessage = tours.length ? (
    <TableProvider>
      <Table />
    </TableProvider>
  ) : (
    <EmptyListMessage />
  );

  return isLoggedIn ? toursOrEmptyMessage : <Login />;
}
