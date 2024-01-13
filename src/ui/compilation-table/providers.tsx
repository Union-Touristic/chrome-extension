import { Tour } from '@/lib/db/schema';
import { store } from '@/redux/store';
import { TableProvider } from '@/ui/compilation-table/use-table';
import { ToursProvider } from '@/ui/compilation-table/use-tours';
import { NotificationProvider } from '@/ui/use-notification';
import { Provider as ReduxProvider } from 'react-redux';

type Props = {
  compilationTours?: Tour[];
  children: React.ReactNode;
};

export function Providers({ compilationTours, children }: Props) {
  return (
    <ReduxProvider store={store}>
      <NotificationProvider>
        <ToursProvider>
          <TableProvider>{children}</TableProvider>
        </ToursProvider>
      </NotificationProvider>
    </ReduxProvider>
  );
}
