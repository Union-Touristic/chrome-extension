import { useEffect } from 'react';
import type { ToursMessenger } from '@/lib/definitions';
import type { Tour } from '@/lib/db/schema';
import { useTours } from '@/ui/compilation-table/use-tours';
import { Table } from '@/ui/compilation-table/table';
import { Login } from '@/ui/login';
import { EmptyListMessage } from '@/ui/empty-list-message';
import { useAuth } from '@/ui/compilation-table/use-auth';

export default function ExtensionApp() {
  const { tours, toursAction } = useTours();
  const { isLoggedIn } = useAuth();

  useEffect(
    function initTours() {
      (async () => {
        const tours = await chrome.runtime.sendMessage<ToursMessenger, Tour[]>({
          type: 'init',
        });
        toursAction({
          type: 'update tours',
          tours: tours,
        });
      })();
    },
    [toursAction]
  );

  const tableOrEmptyMessage = tours.length ? <Table /> : <EmptyListMessage />;

  return isLoggedIn ? tableOrEmptyMessage : <Login />;
}
