import { Tour } from '@/lib/db/schema';
import { TableProvider } from '@/ui/compilation-table/use-table';
import { ToursProvider } from '@/ui/compilation-table/use-tours';
import { NotificationProvider } from '@/ui/use-notification';

type Props = {
  compilationTours?: Tour[];
  children: React.ReactNode;
};

export function Providers({ compilationTours, children }: Props) {
  return (
    <NotificationProvider>
      <ToursProvider>
        <TableProvider>{children}</TableProvider>
      </ToursProvider>
    </NotificationProvider>
  );
}
